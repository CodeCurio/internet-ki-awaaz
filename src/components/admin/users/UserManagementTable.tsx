'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  UserPlus,
  Search,
  Award,
  Power,
  Edit,
  Phone,
  CreditCard,
  FileText,
  Eye,
  FileCheck,
} from 'lucide-react';
import { IdCardModal } from './IdCardModal';
import { CreateUserModal } from './CreateUserModal';
import { EditUserModal } from './EditUserModal';
import { DocViewerModal } from './DocViewerModal';
import { toggleStaffStatus } from '@/lib/actions/user.actions';
import type { Database } from '@/types/database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

interface UserManagementTableProps {
  initialStaff: ProfileRow[];
}

export function UserManagementTable({ initialStaff }: UserManagementTableProps) {
  const [staff, setStaff] = useState<ProfileRow[]>(initialStaff);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ProfileRow | null>(null);
  const [selectedUserForId, setSelectedUserForId] = useState<ProfileRow | null>(null);
  const [docViewerState, setDocViewerState] = useState<{
    isOpen: boolean;
    title: string;
    docUrl?: string | null;
    userName?: string;
    docType: 'aadhaar' | 'pan' | 'document';
  }>({
    isOpen: false,
    title: '',
    docType: 'aadhaar',
  });

  // Filtered List
  const filteredStaff = staff.filter((u) => {
    const nameStr = `${u.full_name || ''} ${u.full_name_hi || ''} ${u.username || ''} ${u.designation_hi || ''} ${u.designation || ''} ${u.phone_number || ''}`.toLowerCase();
    const matchesSearch = nameStr.includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = async (user: ProfileRow) => {
    const res = await toggleStaffStatus(user.id, user.is_active);
    if (res.success && res.newStatus !== undefined) {
      setStaff((prev) =>
        prev.map((item) => (item.id === user.id ? { ...item, is_active: res.newStatus! } : item))
      );
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-[11px]">सुपर एडमिन</span>;
      case 'editor':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px]">संपादक (Editor)</span>;
      case 'reporter':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">संवाददाता (Reporter)</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">योगदानकर्ता</span>;
    }
  };

  const getDisplayName = (user: ProfileRow) => {
    if (user.full_name_hi && user.full_name_hi.trim().length > 0) return user.full_name_hi;
    if (user.full_name && user.full_name.trim().length > 0) return user.full_name;
    return user.username || 'स्टाफ सदस्य';
  };

  return (
    <div className="space-y-6">
      {/* Controls & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="नाम, यूज़रनेम, फ़ोन या पदनाम से खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 bg-slate-50"
            />
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 bg-slate-50 text-slate-700"
          >
            <option value="all">सभी भूमिकाएं (All Roles)</option>
            <option value="super_admin">सुपर एडमिन</option>
            <option value="editor">संपादक</option>
            <option value="reporter">संवाददाता</option>
            <option value="contributor">योगदानकर्ता</option>
          </select>
        </div>

        {/* Add User Button */}
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all shrink-0 hover:shadow cursor-pointer"
        >
          <UserPlus size={16} />
          <span>नया कर्मचारी जोड़ें</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center justify-between">
          <span>संपादकीय स्टाफ एवं संवाददाता सूची ({filteredStaff.length})</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4">कर्मचारी विवरण</th>
                <th className="py-3 px-4">भूमिका (Role)</th>
                <th className="py-3 px-4">प्रेस कार्ड व संपर्क</th>
                <th className="py-3 px-4">पहचान दस्तावेज़ (Aadhaar / PAN)</th>
                <th className="py-3 px-4">खाता स्थिति</th>
                <th className="py-3 px-4 text-right">कार्य (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    कोई कर्मचारी रिकॉर्ड नहीं मिला।
                  </td>
                </tr>
              ) : (
                filteredStaff.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Employee Profile Cell */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          <Image
                            src={user.avatar_url || '/logo.png'}
                            alt={getDisplayName(user)}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {getDisplayName(user)}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {user.designation_hi || user.designation || 'संपादकीय स्टाफ'} •{' '}
                            <span className="font-mono text-slate-400">@{user.username}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">{getRoleBadge(user.role)}</td>

                    {/* Press ID & Contact */}
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-slate-800 text-[11px]">
                        {user.id_card_number || `IKA-PRESS-2026-${user.id.slice(0, 4)}`}
                      </p>
                      <p className="text-[11px] text-slate-600 flex items-center gap-1.5 mt-1 font-medium">
                        <Phone size={12} className="text-emerald-600" />
                        <span>{user.phone_number || (user as any).phone || 'नंबर उपलब्ध नहीं'}</span>
                      </p>
                    </td>

                    {/* Simple 1-Click Document Viewers */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Aadhaar Button */}
                        {user.aadhaar_card_url ? (
                          <button
                            type="button"
                            onClick={() =>
                              setDocViewerState({
                                isOpen: true,
                                title: 'आधार कार्ड (Aadhaar Card)',
                                docUrl: user.aadhaar_card_url,
                                userName: getDisplayName(user),
                                docType: 'aadhaar',
                              })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                            title="आधार कार्ड 1-क्लिक में देखें"
                          >
                            <CreditCard size={12} className="text-emerald-700" />
                            <span>आधार देखें</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingUser(user)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 text-[10px] font-semibold transition-colors cursor-pointer"
                            title="आधार कार्ड अपलोड करें"
                          >
                            <span>+ आधार जोड़ें</span>
                          </button>
                        )}

                        {/* PAN Button */}
                        {user.pan_card_url ? (
                          <button
                            type="button"
                            onClick={() =>
                              setDocViewerState({
                                isOpen: true,
                                title: 'पैन कार्ड (PAN Card)',
                                docUrl: user.pan_card_url,
                                userName: getDisplayName(user),
                                docType: 'pan',
                              })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                            title="पैन कार्ड 1-क्लिक में देखें"
                          >
                            <FileText size={12} className="text-blue-700" />
                            <span>पैन देखें</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingUser(user)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 text-[10px] font-semibold transition-colors cursor-pointer"
                            title="पैन कार्ड अपलोड करें"
                          >
                            <span>+ पैन जोड़ें</span>
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Account Status */}
                    <td className="py-3.5 px-4">
                      {user.is_active ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1.5 text-xs">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          सक्रिय
                        </span>
                      ) : (
                        <span className="text-slate-400 font-semibold flex items-center gap-1.5 text-xs">
                          <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                          निष्क्रिय
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => setEditingUser(user)}
                          title="कर्मचारी विवरण व दस्तावेज़ संपादित करें"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          <Edit size={13} className="text-slate-700" />
                          <span>एडिट</span>
                        </button>

                        {/* ID Card Action */}
                        <button
                          type="button"
                          onClick={() => setSelectedUserForId(user)}
                          title="प्रेस पहचान पत्र देखें व PDF डाउनलोड करें"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          <Award size={13} className="text-amber-700" />
                          <span>प्रेस कार्ड PDF</span>
                        </button>

                        {/* Status Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user)}
                          title={user.is_active ? 'खाता निष्क्रिय करें' : 'खाता सक्रिय करें'}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            user.is_active
                              ? 'text-red-600 hover:bg-red-50 border-red-200'
                              : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200'
                          }`}
                        >
                          <Power size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          isOpen={editingUser !== null}
          onClose={() => setEditingUser(null)}
          onSuccess={(updated) => {
            setStaff((prev) =>
              prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
            );
          }}
        />
      )}

      {/* ID Card Modal */}
      {selectedUserForId && (
        <IdCardModal
          user={selectedUserForId}
          isOpen={selectedUserForId !== null}
          onClose={() => setSelectedUserForId(null)}
        />
      )}

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={(newUser) => {
          setStaff((prev) => [newUser as any, ...prev]);
        }}
      />

      {/* 1-Click Document Viewer Modal */}
      <DocViewerModal
        isOpen={docViewerState.isOpen}
        onClose={() => setDocViewerState((prev) => ({ ...prev, isOpen: false }))}
        title={docViewerState.title}
        docUrl={docViewerState.docUrl}
        userName={docViewerState.userName}
        docType={docViewerState.docType}
      />
    </div>
  );
}
