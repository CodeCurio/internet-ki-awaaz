import { createAdminClient } from '@/lib/supabase/server';
import { UserManagementTable } from '@/components/admin/users/UserManagementTable';
import { RoleMatrixTable } from '@/components/admin/users/RoleMatrixTable';
import { ShieldCheck, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  let staff: any[] = [];

  try {
    const supabaseAdmin: any = await createAdminClient();

    // 1. Fetch profiles table records
    const { data: profileRows } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    // 2. Fetch auth.users to get full metadata, emails, and any users created via Auth
    const { data: authUsersData } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000,
    });

    const authUsers = authUsersData?.users || [];
    const authMap = new Map<string, any>();
    for (const au of authUsers) {
      authMap.set(au.id, au);
    }

    const mergedStaff: any[] = [];
    const processedIds = new Set<string>();

    if (profileRows && profileRows.length > 0) {
      for (const p of profileRows) {
        processedIds.add(p.id);
        const authUser = authMap.get(p.id);
        const meta = authUser?.user_metadata || {};

        mergedStaff.push({
          ...p,
          email: authUser?.email || meta.email || `${p.username}@internetkiawaaz.in`,
          full_name: p.full_name || meta.full_name || p.username || 'स्टाफ सदस्य',
          full_name_hi: p.full_name_hi || meta.full_name_hi || p.full_name || meta.full_name || 'स्टाफ सदस्य',
          designation_hi: p.designation_hi || meta.designation_hi || p.designation || 'संपादकीय स्टाफ',
          phone_number: p.phone_number || meta.phone_number || '',
          whatsapp_number: p.whatsapp_number || meta.whatsapp_number || p.phone_number || '',
          reporter_beat: p.reporter_beat || meta.reporter_beat || '',
          blood_group: p.blood_group || meta.blood_group || 'O+',
          emergency_contact: p.emergency_contact || meta.emergency_contact || '',
          id_card_number: p.id_card_number || meta.id_card_number || `IKA-PRESS-2026-${p.id.slice(0, 4).toUpperCase()}`,
          avatar_url: p.avatar_url || meta.avatar_url || '',
          aadhaar_card_url: p.aadhaar_card_url || meta.aadhaar_card_url || '',
          pan_card_url: p.pan_card_url || meta.pan_card_url || '',
          date_of_joining: p.date_of_joining || meta.date_of_joining || p.created_at?.split('T')[0] || '2026-01-01',
          valid_until: p.valid_until || meta.valid_until || '2027-12-31',
          address: p.address || meta.address || '',
          is_active: p.is_active !== undefined ? p.is_active : true,
          role: p.role || meta.role || 'reporter',
        });
      }
    }

    // Add any auth users that might not have a profile row yet
    for (const au of authUsers) {
      if (!processedIds.has(au.id)) {
        const meta = au.user_metadata || {};
        mergedStaff.push({
          id: au.id,
          email: au.email,
          username: meta.username || au.email?.split('@')[0] || 'staff',
          full_name: meta.full_name || au.email?.split('@')[0] || 'स्टाफ सदस्य',
          full_name_hi: meta.full_name_hi || meta.full_name || 'स्टाफ सदस्य',
          role: meta.role || 'reporter',
          designation: meta.designation || 'Staff',
          designation_hi: meta.designation_hi || 'संपादकीय स्टाफ',
          phone_number: meta.phone_number || '',
          whatsapp_number: meta.whatsapp_number || '',
          reporter_beat: meta.reporter_beat || '',
          blood_group: meta.blood_group || 'O+',
          emergency_contact: meta.emergency_contact || '',
          id_card_number: meta.id_card_number || `IKA-PRESS-2026-${au.id.slice(0, 4).toUpperCase()}`,
          avatar_url: meta.avatar_url || '',
          aadhaar_card_url: meta.aadhaar_card_url || '',
          pan_card_url: meta.pan_card_url || '',
          date_of_joining: meta.date_of_joining || au.created_at?.split('T')[0] || '2026-01-01',
          valid_until: meta.valid_until || '2027-12-31',
          address: meta.address || '',
          is_active: true,
          created_at: au.created_at,
          updated_at: au.updated_at,
        });
      }
    }

    if (mergedStaff.length > 0) {
      staff = mergedStaff;
    }
  } catch (err) {
    console.error('Failed to load merged staff records:', err);
  }

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Users className="text-red-700" size={24} />
            <span>उपयोगकर्ता एवं अधिकार प्रबंधन (User & Staff RBAC)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            संपादकीय स्टाफ, रिपोर्टर्स, ऑथेंटिकेशन खाता निर्माण, आधार/पैन दस्तावेज़ व प्रेस आईडी कार्ड प्रबंधन।
          </p>
        </div>
      </div>

      {/* Interactive Staff Management Table */}
      <UserManagementTable initialStaff={staff} />

      {/* Normative Role Matrix Table */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck size={16} className="text-red-700" />
          <span>भूमिका-अधिकार मैट्रिक्स (Role-Permission Matrix)</span>
        </h2>
        <RoleMatrixTable />
      </div>
    </div>
  );
}
