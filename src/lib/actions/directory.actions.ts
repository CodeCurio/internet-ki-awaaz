'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function submitDirectoryListing(formData: {
  businessNameHi: string;
  businessNameEn?: string;
  categoryHi: string;
  descriptionHi?: string;
  addressHi?: string;
  locality?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  coverImageUrl?: string;
}) {
  const supabase: any = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const slugBase = formData.businessNameEn || formData.businessNameHi;
  const slug =
    slugBase
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\u0900-\u097F]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Date.now().toString(36);

  const { error } = await supabase.from('directory_listings').insert({
    business_name_hi: formData.businessNameHi,
    business_name_en: formData.businessNameEn ?? null,
    slug,
    category_hi: formData.categoryHi,
    description_hi: formData.descriptionHi ?? null,
    address_hi: formData.addressHi ?? null,
    locality: formData.locality ?? null,
    phone_number: formData.phoneNumber ?? null,
    whatsapp_number: formData.whatsappNumber ?? null,
    cover_image_url: formData.coverImageUrl ?? null,
    submitted_by: user?.id ?? null,
    is_approved: false,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/directory');
  return { success: true };
}

export async function approveDirectoryListing(listingId: string, isVerified: boolean) {
  const supabase: any = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('directory_listings')
    .update({
      is_approved: true,
      is_verified: isVerified,
      approved_by: user?.id ?? null,
    })
    .eq('id', listingId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/directory');
  revalidatePath('/directory');
  return { success: true };
}

export async function rejectDirectoryListing(listingId: string) {
  const supabase: any = await createClient();
  const { error } = await supabase.from('directory_listings').delete().eq('id', listingId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/directory');
  return { success: true };
}
