'use server';

import { createAdminClient, createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ContactSubmissionInput {
  fullName: string;
  phoneNumber: string;
  email?: string;
  subject: string;
  message: string;
  city?: string;
}

export async function submitContactMessage(input: ContactSubmissionInput) {
  try {
    const trimmedName = input.fullName?.trim();
    const trimmedPhone = input.phoneNumber?.trim();
    const trimmedSubject = input.subject?.trim() || 'समाचार सुझाव / जनसमस्या';
    const trimmedMessage = input.message?.trim();

    if (!trimmedName || trimmedName.length < 2) {
      return { success: false, error: 'कृपया अपना पूरा नाम दर्ज करें।' };
    }

    if (!trimmedPhone || trimmedPhone.length < 10) {
      return { success: false, error: 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' };
    }

    if (!trimmedMessage || trimmedMessage.length < 5) {
      return { success: false, error: 'कृपया संदेश या समाचार विवरण विस्तार से दर्ज करें।' };
    }

    const referenceId = `IKA-MSG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const supabaseAdmin = await createAdminClient();

    // 1. Insert into contact_submissions table in Supabase
    const { error: insertError } = await (supabaseAdmin as any)
      .from('contact_submissions')
      .insert({
        reference_id: referenceId,
        full_name: trimmedName,
        phone_number: trimmedPhone,
        email: input.email?.trim() || null,
        subject: trimmedSubject,
        message: trimmedMessage,
        city: input.city?.trim() || 'Gonda',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      console.warn('contact_submissions direct insert error (fallback logging):', insertError.message);
      // Fallback: log to audit_logs so nothing is lost
      await (supabaseAdmin as any).from('audit_logs').insert({
        action: 'contact_message_received',
        entity_type: 'contact_submission',
        entity_id: referenceId,
        details: {
          referenceId,
          fullName: trimmedName,
          phoneNumber: trimmedPhone,
          email: input.email?.trim() || null,
          city: input.city?.trim() || 'Gonda',
          subject: trimmedSubject,
          message: trimmedMessage,
        },
        created_at: new Date().toISOString(),
      });
    }

    revalidatePath('/admin/inquiries');

    return {
      success: true,
      referenceId,
      message: 'आपका संदेश सफलतापूर्वक दर्ज कर लिया गया है।',
    };
  } catch (err: any) {
    console.error('Contact submission error:', err);
    return {
      success: false,
      error: err.message || 'संदेश सबमिट करने में त्रुटि हुई। कृपया पुनः प्रयास करें।',
    };
  }
}

export async function getContactSubmissions() {
  try {
    const supabaseAdmin = await createAdminClient();

    // Fetch from contact_submissions
    const { data, error } = await (supabaseAdmin as any)
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Check audit_logs fallback
      const { data: auditData } = await (supabaseAdmin as any)
        .from('audit_logs')
        .select('*')
        .eq('action', 'contact_message_received')
        .order('created_at', { ascending: false });

      if (auditData && auditData.length > 0) {
        return (auditData as any[]).map((log) => ({
          id: log.id,
          reference_id: log.entity_id || log.details?.referenceId || 'IKA-MSG',
          full_name: log.details?.fullName || 'अनाम पाठक',
          phone_number: log.details?.phoneNumber || '-',
          email: log.details?.email || null,
          city: log.details?.city || 'Gonda',
          subject: log.details?.subject || 'समाचार सुझाव / जनसमस्या',
          message: log.details?.message || '',
          status: 'pending' as const,
          created_at: log.created_at,
          updated_at: log.created_at,
        }));
      }
      return [];
    }

    return data;
  } catch (err) {
    console.error('Error fetching submissions:', err);
    return [];
  }
}

export async function updateSubmissionStatus(id: string, status: 'pending' | 'in_review' | 'resolved') {
  try {
    const supabaseAdmin = await createAdminClient();
    const { error } = await (supabaseAdmin as any)
      .from('contact_submissions')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/inquiries');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteSubmission(id: string) {
  try {
    const supabaseAdmin = await createAdminClient();
    const { error } = await (supabaseAdmin as any)
      .from('contact_submissions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/inquiries');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
