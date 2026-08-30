'use server';

import { revalidatePath } from 'next/cache';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import type { UserRole } from '@/types/database.types';

export interface CreateStaffUserInput {
  email: string;
  password?: string;
  full_name: string;
  full_name_hi?: string;
  username: string;
  role: UserRole;
  designation?: string;
  designation_hi?: string;
  phone_number?: string;
  whatsapp_number?: string;
  reporter_beat?: string;
  blood_group?: string;
  emergency_contact?: string;
  id_card_number?: string;
  avatar_url?: string;
  aadhaar_card_url?: string;
  pan_card_url?: string;
  date_of_joining?: string;
  valid_until?: string;
  address?: string;
  bio?: string;
  bio_hi?: string;
}

export interface UpdateStaffInput extends Partial<CreateStaffUserInput> {
  is_active?: boolean;
}

/**
 * Creates a new staff user in Supabase Authentication (auth.users)
 * and provisions their role, document metadata, and profile in public.profiles.
 */
export async function createStaffUser(input: CreateStaffUserInput) {
  try {
    const supabaseAdmin = await createAdminClient();

    const normalizedUsername = (input.username || input.email.split('@')[0])
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_]/g, '_');

    const tempPassword = input.password && input.password.length >= 6 
      ? input.password 
      : `IKA@${Math.random().toString(36).slice(-6)}!`;

    const pressCardNumber = input.id_card_number || `IKA-PRESS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const userMetadata = {
      full_name: input.full_name.trim(),
      full_name_hi: input.full_name_hi?.trim() || input.full_name.trim(),
      username: normalizedUsername,
      role: input.role,
      designation: input.designation || 'Staff',
      designation_hi: input.designation_hi || 'संपादकीय स्टाफ',
      phone_number: input.phone_number || '',
      whatsapp_number: input.whatsapp_number || input.phone_number || '',
      reporter_beat: input.reporter_beat || '',
      blood_group: input.blood_group || 'O+',
      emergency_contact: input.emergency_contact || '',
      id_card_number: pressCardNumber,
      avatar_url: input.avatar_url || '',
      aadhaar_card_url: input.aadhaar_card_url || '',
      pan_card_url: input.pan_card_url || '',
      date_of_joining: input.date_of_joining || new Date().toISOString().split('T')[0],
      valid_until: input.valid_until || `${new Date().getFullYear() + 1}-12-31`,
      address: input.address || '',
      bio: input.bio || '',
      bio_hi: input.bio_hi || '',
    };

    // 1. Create the user in Supabase Auth (Authentication > Users) with full metadata
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: input.email.trim(),
      password: tempPassword,
      email_confirm: true,
      user_metadata: userMetadata,
    });

    if (authError || !authData.user) {
      console.error('Supabase Auth createUser error:', authError);
      return {
        success: false,
        error: authError?.message || 'ऑथेंटिकेशन उपयोगकर्ता बनाने में त्रुटि हुई।',
      };
    }

    const userId = authData.user.id;

    // 2. Safe Update/Upsert into public.profiles with standard confirmed columns
    const standardFields: Record<string, any> = {
      id: userId,
      full_name: input.full_name.trim(),
      full_name_hi: input.full_name_hi?.trim() || input.full_name.trim(),
      username: normalizedUsername,
      role: input.role,
      designation: input.designation || 'Staff',
      designation_hi: input.designation_hi || 'संपादकीय स्टाफ',
      phone_number: input.phone_number || null,
      whatsapp_number: input.whatsapp_number || null,
      reporter_beat: input.reporter_beat || null,
      avatar_url: input.avatar_url || null,
      bio: input.bio || null,
      bio_hi: input.bio_hi || null,
      is_active: true,
      updated_at: new Date().toISOString(),
    };

    // Try full upsert first
    const { error: fullUpsertError } = await (supabaseAdmin as any)
      .from('profiles')
      .upsert({
        ...standardFields,
        blood_group: input.blood_group || null,
        emergency_contact: input.emergency_contact || null,
        id_card_number: pressCardNumber,
        aadhaar_card_url: input.aadhaar_card_url || null,
        pan_card_url: input.pan_card_url || null,
        date_of_joining: input.date_of_joining || null,
        valid_until: input.valid_until || null,
        address: input.address || null,
      });

    // If extended columns failed in postgres, fallback to standard confirmed columns
    if (fullUpsertError) {
      console.warn('Extended profile upsert notice, falling back to core columns:', fullUpsertError.message);
      await (supabaseAdmin as any).from('profiles').upsert(standardFields);
    }

    revalidatePath('/admin/users');
    revalidatePath('/admin/profile');

    return {
      success: true,
      user: {
        id: userId,
        email: input.email,
        username: normalizedUsername,
        full_name: input.full_name,
        full_name_hi: input.full_name_hi,
        role: input.role,
        designation_hi: input.designation_hi,
        phone_number: input.phone_number,
        id_card_number: pressCardNumber,
        avatar_url: input.avatar_url,
        aadhaar_card_url: input.aadhaar_card_url,
        pan_card_url: input.pan_card_url,
        blood_group: input.blood_group,
        emergency_contact: input.emergency_contact,
        address: input.address,
        tempPassword,
        is_active: true,
      },
    };
  } catch (err: any) {
    console.error('createStaffUser exception:', err);
    return {
      success: false,
      error: err.message || 'कर्मचारी खाता बनाने में विफल।',
    };
  }
}

/**
 * Updates staff profile data and document attachments across both auth metadata and profiles
 */
export async function updateStaffProfile(userId: string, input: UpdateStaffInput) {
  try {
    const supabaseAdmin = await createAdminClient();

    // 1. Update Supabase Auth user_metadata
    try {
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
      const existingMeta = userData?.user?.user_metadata || {};
      
      const newMeta = {
        ...existingMeta,
        ...(input.full_name !== undefined && { full_name: input.full_name }),
        ...(input.full_name_hi !== undefined && { full_name_hi: input.full_name_hi }),
        ...(input.username !== undefined && { username: input.username }),
        ...(input.role !== undefined && { role: input.role }),
        ...(input.designation !== undefined && { designation: input.designation }),
        ...(input.designation_hi !== undefined && { designation_hi: input.designation_hi }),
        ...(input.phone_number !== undefined && { phone_number: input.phone_number }),
        ...(input.whatsapp_number !== undefined && { whatsapp_number: input.whatsapp_number }),
        ...(input.reporter_beat !== undefined && { reporter_beat: input.reporter_beat }),
        ...(input.blood_group !== undefined && { blood_group: input.blood_group }),
        ...(input.emergency_contact !== undefined && { emergency_contact: input.emergency_contact }),
        ...(input.id_card_number !== undefined && { id_card_number: input.id_card_number }),
        ...(input.avatar_url !== undefined && { avatar_url: input.avatar_url }),
        ...(input.aadhaar_card_url !== undefined && { aadhaar_card_url: input.aadhaar_card_url }),
        ...(input.pan_card_url !== undefined && { pan_card_url: input.pan_card_url }),
        ...(input.date_of_joining !== undefined && { date_of_joining: input.date_of_joining }),
        ...(input.valid_until !== undefined && { valid_until: input.valid_until }),
        ...(input.address !== undefined && { address: input.address }),
        ...(input.is_active !== undefined && { is_active: input.is_active }),
      };

      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: newMeta,
        ...(input.email && { email: input.email }),
        ...(input.password && input.password.length >= 6 && { password: input.password }),
      });
    } catch (authErr) {
      console.warn('Auth user metadata update warning:', authErr);
    }

    // 2. Update public.profiles table
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (input.full_name !== undefined) updatePayload.full_name = input.full_name;
    if (input.full_name_hi !== undefined) updatePayload.full_name_hi = input.full_name_hi;
    if (input.username !== undefined) updatePayload.username = input.username;
    if (input.role !== undefined) updatePayload.role = input.role;
    if (input.designation !== undefined) updatePayload.designation = input.designation;
    if (input.designation_hi !== undefined) updatePayload.designation_hi = input.designation_hi;
    if (input.phone_number !== undefined) updatePayload.phone_number = input.phone_number;
    if (input.whatsapp_number !== undefined) updatePayload.whatsapp_number = input.whatsapp_number;
    if (input.reporter_beat !== undefined) updatePayload.reporter_beat = input.reporter_beat;
    if (input.avatar_url !== undefined) updatePayload.avatar_url = input.avatar_url;
    if (input.is_active !== undefined) updatePayload.is_active = input.is_active;

    // Try full update
    const extendedPayload = {
      ...updatePayload,
      ...(input.blood_group !== undefined && { blood_group: input.blood_group }),
      ...(input.emergency_contact !== undefined && { emergency_contact: input.emergency_contact }),
      ...(input.id_card_number !== undefined && { id_card_number: input.id_card_number }),
      ...(input.aadhaar_card_url !== undefined && { aadhaar_card_url: input.aadhaar_card_url }),
      ...(input.pan_card_url !== undefined && { pan_card_url: input.pan_card_url }),
      ...(input.date_of_joining !== undefined && { date_of_joining: input.date_of_joining }),
      ...(input.valid_until !== undefined && { valid_until: input.valid_until }),
      ...(input.address !== undefined && { address: input.address }),
    };

    const { error } = await (supabaseAdmin as any)
      .from('profiles')
      .update(extendedPayload)
      .eq('id', userId);

    if (error) {
      console.warn('Extended profile update notice, falling back to core columns:', error.message);
      await (supabaseAdmin as any)
        .from('profiles')
        .update(updatePayload)
        .eq('id', userId);
    }

    revalidatePath('/admin/users');
    revalidatePath('/admin/profile');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'प्रोफ़ाइल अपडेट विफल रहा।' };
  }
}

/**
 * Self-service: Logged-in user updates their own profile details
 */
export async function updateSelfProfile(formData: {
  full_name?: string;
  full_name_hi?: string;
  bio?: string;
  bio_hi?: string;
  phone_number?: string;
  whatsapp_number?: string;
  twitter_handle?: string;
  address?: string;
  avatar_url?: string;
}) {
  try {
    const supabase: any = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: 'अनधिकृत अनुरोध। कृपया पुनः लॉगिन करें।' };
    }

    const { error } = await (supabase as any)
      .from('profiles')
      .update({
        ...formData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/admin/profile');
    revalidatePath('/admin/users');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'प्रोफ़ाइल सहेजने में त्रुटि।' };
  }
}

/**
 * Self-service: Logged-in user resets their password
 */
export async function changePassword(password: string) {
  try {
    if (!password || password.length < 6) {
      return { success: false, error: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'पासवर्ड बदलने में त्रुटि।' };
  }
}

/**
 * Toggles staff active/inactive status
 */
export async function toggleStaffStatus(userId: string, currentStatus: boolean) {
  try {
    const supabaseAdmin: any = await createAdminClient();
    const { error } = await (supabaseAdmin as any)
      .from('profiles')
      .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/users');
    return { success: true, newStatus: !currentStatus };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
