import { createClient } from '@/lib/supabase/server';
import { ProfileManager } from '@/components/admin/profile/ProfileManager';

export const dynamic = 'force-dynamic';

export default async function AdminProfilePage() {
  const supabase = await createClient();

  let userProfile: any = {
    id: 'ika_admin_default',
    full_name: 'Editorial Desk Admin',
    full_name_hi: 'मुख्य संपादक',
    username: 'ika_admin',
    email: 'editor@internetkiawaaz.in',
    role: 'super_admin',
    designation: 'Chief Editor',
    designation_hi: 'प्रधान संपादक',
    phone_number: '07905895936',
    whatsapp_number: '7905895936',
    reporter_beat: 'समग्र पूर्वांचल / उत्तर प्रदेश',
    blood_group: 'O+',
    emergency_contact: '07905895936',
    id_card_number: 'IKA-PRESS-2026-0001',
    address: 'फ़ोर्विशगंज, पंत नगर, गोंडा, उत्तर प्रदेश 271001',
    date_of_joining: '2026-01-01',
    valid_until: '2027-12-31',
  };

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        userProfile = {
          ...(profile as any),
          email: user.email,
        };
      } else {
        userProfile = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || 'Staff Member',
          full_name_hi: user.user_metadata?.full_name_hi || 'स्टाफ सदस्य',
          username: user.user_metadata?.username || user.email?.split('@')[0] || 'staff',
          role: user.user_metadata?.role || 'reporter',
          designation_hi: 'संपादकीय स्टाफ',
          id_card_number: `IKA-PRESS-${new Date().getFullYear()}-${user.id.slice(0, 4).toUpperCase()}`,
        };
      }
    }
  } catch (err) {
    console.error('Failed to fetch current user profile:', err);
  }

  return (
    <div className="space-y-6">
      <ProfileManager user={userProfile} />
    </div>
  );
}
