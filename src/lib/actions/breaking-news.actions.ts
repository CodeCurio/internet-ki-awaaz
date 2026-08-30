'use server';

import { revalidatePath } from 'next/cache';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import type { BreakingPriority } from '@/types/database.types';

export interface PublishBreakingInput {
  headlineHi: string;
  linkedPostId?: string | null;
  priority: BreakingPriority;
  expiresInHours?: number;
  expiresInMinutes?: number;
}

export interface BreakingActionResult<T = any> {
  success: boolean;
  error?: string;
  item?: T;
}

async function getSupabaseInstance() {
  // 1. Try authenticated user client (with cookies) first
  try {
    const userClient = await createClient();
    const { data: { user } } = await userClient.auth.getUser();
    if (user?.id) {
      return userClient;
    }
  } catch {
    // Continue
  }

  // 2. Try admin client if service role key is valid
  try {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (serviceKey && serviceKey !== anonKey && !serviceKey.includes('placeholder')) {
      return await createAdminClient();
    }
  } catch {
    // Continue
  }

  // 3. Default to createClient (reads cookies from request)
  return await createClient();
}

async function resolveAdminProfileId(supabase: any): Promise<string> {
  // 1. Try currently logged-in user
  try {
    const userClient = await createClient();
    const { data: { user } } = await userClient.auth.getUser();
    if (user?.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      if (profile) return profile.id;
    }
  } catch {
    // Continue fallback
  }

  // 2. Query any active super_admin or staff profile from profiles table
  try {
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('id')
      .in('role', ['super_admin', 'editor', 'reporter'])
      .limit(1)
      .maybeSingle();
    if (adminProfile?.id) return adminProfile.id;
  } catch {
    // Continue
  }

  // 3. Fallback to known initial admin UUID
  return '4775d032-8e9e-49aa-8e56-3d28da0f381d';
}

export async function publishBreakingNews(input: PublishBreakingInput): Promise<BreakingActionResult> {
  const headlineHi = input.headlineHi?.trim();
  if (!headlineHi) {
    return { success: false, error: 'हेडलाइन आवश्यक है।' };
  }

  const durationMinutes = (input.expiresInHours ? input.expiresInHours * 60 : 0) + (input.expiresInMinutes || 0) || 360; // default 6 hours
  const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();

  try {
    const supabase: any = await getSupabaseInstance();
    const authorId = await resolveAdminProfileId(supabase);

    const { data: newBreaking, error } = await supabase
      .from('breaking_news')
      .insert({
        headline_hi: headlineHi,
        linked_post_id: input.linkedPostId || null,
        priority: input.priority || 'medium',
        created_by: authorId,
        expires_at: expiresAt,
        is_active: true,
      })
      .select('*')
      .single();

    if (error) {
      console.error('publishBreakingNews error:', error);
      return { success: false, error: error.message };
    }

    // If linked to an article, mark the post is_breaking = true
    if (input.linkedPostId) {
      await supabase
        .from('posts')
        .update({ is_breaking: true })
        .eq('id', input.linkedPostId);
    }

    revalidatePath('/');
    revalidatePath('/admin/breaking-news');
    revalidatePath('/admin/posts');

    return { success: true, item: newBreaking };
  } catch (err: any) {
    console.error('publishBreakingNews error:', err);
    return { success: false, error: err.message || 'ताज़ा ख़बर जारी करने में त्रुटि हुई।' };
  }
}

export async function getAdminBreakingNews() {
  try {
    const supabase: any = await getSupabaseInstance();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('breaking_news')
      .select(`
        id,
        headline_hi,
        priority,
        is_active,
        expires_at,
        created_at,
        linked_post_id,
        linked_post:posts(id, title_hi, slug)
      `)
      .eq('is_active', true)
      .gt('expires_at', now)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getAdminBreakingNews error:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('getAdminBreakingNews exception:', err);
    return [];
  }
}

export async function getActiveBreakingNews() {
  try {
    const supabase: any = await getSupabaseInstance();
    const now = new Date().toISOString();

    // 1. Auto-clean / purge expired records from database
    try {
      await supabase
        .from('breaking_news')
        .delete()
        .lt('expires_at', now);
    } catch {
      // Ignored
    }

    // 2. Fetch active and non-expired breaking news with linked post details
    const { data, error } = await supabase
      .from('breaking_news')
      .select(`
        id,
        headline_hi,
        priority,
        is_active,
        expires_at,
        created_at,
        linked_post_id,
        linked_post:posts(id, title_hi, slug)
      `)
      .eq('is_active', true)
      .gt('expires_at', now)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data;
    }

    // 3. Fallback: If no breaking news exists, fetch the top recent published articles (up to 3)
    const { data: latestPosts } = await supabase
      .from('posts')
      .select('id, title_hi, slug, created_at, published_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(3);

    if (latestPosts && latestPosts.length > 0) {
      return latestPosts.map((post: any) => ({
        id: `latest-${post.id}`,
        headline_hi: post.title_hi,
        priority: 'high',
        is_active: true,
        expires_at: null,
        created_at: post.published_at || post.created_at,
        linked_post_id: post.id,
        linked_post: {
          id: post.id,
          title_hi: post.title_hi,
          slug: post.slug,
        },
        is_fallback_latest: true,
      }));
    }

    return [];
  } catch (err) {
    console.error('getActiveBreakingNews exception:', err);
    return [];
  }
}

export async function deleteBreakingNews(id: string, linkedPostId?: string | null): Promise<BreakingActionResult> {
  try {
    const userClient: any = await createClient();
    const adminClient: any = await createAdminClient();

    // 1. Look up linked_post_id if not explicitly provided
    let targetPostId = linkedPostId;
    if (!targetPostId) {
      try {
        const { data: item } = await userClient
          .from('breaking_news')
          .select('linked_post_id')
          .eq('id', id)
          .maybeSingle();
        if (item?.linked_post_id) {
          targetPostId = item.linked_post_id;
        }
      } catch {
        // Continue
      }
    }

    // 2. Perform delete
    let res = await userClient.from('breaking_news').delete().eq('id', id).select();
    if (!res.data || res.data.length === 0) {
      res = await adminClient.from('breaking_news').delete().eq('id', id).select();
    }

    if (res.error) {
      console.error('deleteBreakingNews error:', res.error);
      return { success: false, error: res.error.message };
    }

    // 3. If linked to a post, reset is_breaking = false
    if (targetPostId) {
      await userClient.from('posts').update({ is_breaking: false }).eq('id', targetPostId);
      await adminClient.from('posts').update({ is_breaking: false }).eq('id', targetPostId);
    }

    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/admin/breaking-news');
    revalidatePath('/admin/posts');
    return { success: true };
  } catch (err: any) {
    console.error('deleteBreakingNews exception:', err);
    return { success: false, error: err.message };
  }
}

export async function deactivateBreakingNews(id: string, linkedPostId?: string | null): Promise<BreakingActionResult> {
  try {
    const userClient: any = await createClient();
    const adminClient: any = await createAdminClient();

    let res = await userClient
      .from('breaking_news')
      .update({ is_active: false })
      .eq('id', id)
      .select();

    if (!res.data || res.data.length === 0) {
      res = await adminClient
        .from('breaking_news')
        .update({ is_active: false })
        .eq('id', id)
        .select();
    }

    if (res.error) return { success: false, error: res.error.message };

    if (linkedPostId) {
      await userClient.from('posts').update({ is_breaking: false }).eq('id', linkedPostId);
      await adminClient.from('posts').update({ is_breaking: false }).eq('id', linkedPostId);
    }

    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/admin/breaking-news');
    revalidatePath('/admin/posts');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function togglePostBreakingStatus(
  postId: string,
  enable: boolean,
  headlineHi?: string,
  priority: BreakingPriority = 'high',
  expiresInHours: number = 6
): Promise<BreakingActionResult> {
  try {
    const userClient: any = await createClient();
    const adminClient: any = await createAdminClient();

    if (enable) {
      // Look up headline if not provided
      let finalHeadline: string = headlineHi?.trim() || '';
      if (!finalHeadline) {
        const { data: post } = await userClient
          .from('posts')
          .select('title_hi')
          .eq('id', postId)
          .single();
        finalHeadline = post?.title_hi || 'ताज़ा समाचार';
      }

      return await publishBreakingNews({
        headlineHi: finalHeadline,
        linkedPostId: postId,
        priority,
        expiresInHours,
      });
    } else {
      // Remove all breaking news linked to this post
      await userClient.from('breaking_news').delete().eq('linked_post_id', postId);
      await adminClient.from('breaking_news').delete().eq('linked_post_id', postId);

      await userClient.from('posts').update({ is_breaking: false }).eq('id', postId);
      await adminClient.from('posts').update({ is_breaking: false }).eq('id', postId);

      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/admin/breaking-news');
      revalidatePath('/admin/posts');
      return { success: true };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
