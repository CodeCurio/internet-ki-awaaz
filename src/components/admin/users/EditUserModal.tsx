'use client';

import { useState, useEffect, useRef } from 'react';
import {
  X,
  Edit,
  Upload,
  Shield,
  FileText,
  CreditCard,
  Phone,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { updateStaffProfile } from '@/lib/actions/user.actions';
import type { Database, UserRole } from '@/types/database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

interface EditUserModalProps {
  user: Partial<ProfileRow>;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedUser: any) => void;
}

const ROLE_OPTIONS: { role: UserRole; title: string; desc: string; badgeColor: string }[] = [
  {
    role: 'super_admin',
    title: 'सुपर एडमिन (Super Admin)',
    desc: 'संपादकीय पोर्टल, उपयोगकर्ता प्रबंधन व सेटिंग्स का पूर्ण नियंत्रण।',
    badgeColor: 'border-red-500 bg-red-50 text-red-900',
  },
  {
    role: 'editor',
    title: 'संपादक (Editor)',
    desc: 'सभी समाचारों की समीक्षा, संपादन, प्रकाशन व ब्रेकिंग न्यूज़ प्रबंधन।',
    badgeColor: 'border-blue-500 bg-blue-50 text-blue-900',
  },
  {
    role: 'reporter',
    title: 'संवाददाता / रिपोर्टर (Reporter)',
    desc: 'ग्राउंड रिपोर्टिंग, नए समाचार लेख व वीडियो बुलेटिन निर्माण।',
    badgeColor: 'border-emerald-500 bg-emerald-50 text-emerald-900',
  },
  {
    role: 'contributor',
    title: 'योगदानकर्ता / स्तंभकार (Contributor)',
    desc: 'विशेष लेख व स्तंभ सबमिशन।',
    badgeColor: 'border-slate-400 bg-slate-50 text-slate-800',
  },
];

export function EditUserModal({ user, isOpen, onClose, onSuccess }: EditUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State initialized from user
  const [fullName, setFullName] = useState(user.full_name || '');
  const [fullNameHi, setFullNameHi] = useState(user.full_name_hi || '');
  const [username, setUsername] = useState(user.username || '');
  const [role, setRole] = useState<UserRole>((user.role as UserRole) || 'reporter');
  const [designation, setDesignation] = useState(user.designation || '');
  const [designationHi, setDesignationHi] = useState(user.designation_hi || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number || '');
  const [whatsappNumber, setWhatsappNumber] = useState(user.whatsapp_number || '');
  const [reporterBeat, setReporterBeat] = useState(user.reporter_beat || '');
  const [bloodGroup, setBloodGroup] = useState(user.blood_group || 'O+');
  const [emergencyContact, setEmergencyContact] = useState(user.emergency_contact || '');
  const [idCardNumber, setIdCardNumber] = useState(user.id_card_number || '');
  const [address, setAddress] = useState(user.address || '');
  const [dateOfJoining, setDateOfJoining] = useState(user.date_of_joining || '');
  const [validUntil, setValidUntil] = useState(user.valid_until || '');

  // Document URLs State
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '');
  const [aadhaarUrl, setAadhaarUrl] = useState(user.aadhaar_card_url || '');
  const [panUrl, setPanUrl] = useState(user.pan_card_url || '');
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [translatingField, setTranslatingField] = useState<string | null>(null);
  const nameDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-translate Name: English -> Hindi
  const handleNameEnChange = (val: string) => {
    setFullName(val);
    if (nameDebounceRef.current) clearTimeout(nameDebounceRef.current);
    if (!val.trim()) return;

    nameDebounceRef.current = setTimeout(async () => {
      setTranslatingField('nameHi');
      try {
        const res = await fetch(`/api/translate?text=${encodeURIComponent(val)}&from=en&to=hi`);
        const data = await res.json();
        if (data.hindi || data.translated) {
          setFullNameHi(data.hindi || data.translated);
        }
      } catch {
        // Ignored
      } finally {
        setTranslatingField(null);
      }
    }, 450);
  };

  // Auto-translate Name: Hindi -> English
  const handleNameHiChange = (val: string) => {
    setFullNameHi(val);
    if (nameDebounceRef.current) clearTimeout(nameDebounceRef.current);
    if (!val.trim()) return;

    nameDebounceRef.current = setTimeout(async () => {
      setTranslatingField('nameEn');
      try {
        const res = await fetch(`/api/translate?text=${encodeURIComponent(val)}&from=hi&to=en`);
        const data = await res.json();
        if (data.english || data.translated) {
          setFullName(data.english || data.translated);
        }
      } catch {
        // Ignored
      } finally {
        setTranslatingField(null);
      }
    }, 450);
  };

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setFullNameHi(user.full_name_hi || '');
      setUsername(user.username || '');
      setRole((user.role as UserRole) || 'reporter');
      setDesignation(user.designation || '');
      setDesignationHi(user.designation_hi || '');
      setPhoneNumber(user.phone_number || '');
      setWhatsappNumber(user.whatsapp_number || '');
      setReporterBeat(user.reporter_beat || '');
      setBloodGroup(user.blood_group || 'O+');
      setEmergencyContact(user.emergency_contact || '');
      setIdCardNumber(user.id_card_number || '');
      setAddress(user.address || '');
      setDateOfJoining(user.date_of_joining || '');
      setValidUntil(user.valid_until || '');
      setAvatarUrl(user.avatar_url || '');
      setAadhaarUrl(user.aadhaar_card_url || '');
      setPanUrl(user.pan_card_url || '');
    }
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, context: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(context);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('context', context);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        if (context === 'staff-photo') setAvatarUrl(data.url);
        if (context === 'staff-aadhaar') setAadhaarUrl(data.url);
        if (context === 'staff-pan') setPanUrl(data.url);
      } else {
        alert(data.error || 'अपलोड में समस्या हुई।');
      }
    } catch (err: any) {
      alert('फ़ाइल अपलोड विफल: ' + err.message);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      setError('कृपया नाम अनिवार्य रूप से भरें।');
      return;
    }

    if (!user.id) {
      setError('उपयोगकर्ता आईडी उपलब्ध नहीं है।');
      return;
    }

    setLoading(true);
    setError(null);

    const updatedData = {
      full_name: fullName,
      full_name_hi: fullNameHi || fullName,
      username: username || user.username,
      role,
      designation: designation || 'Staff',
      designation_hi: designationHi || 'संपादकीय स्टाफ',
      phone_number: phoneNumber,
      whatsapp_number: whatsappNumber || phoneNumber,
      reporter_beat: reporterBeat,
      blood_group: bloodGroup,
      emergency_contact: emergencyContact,
      id_card_number: idCardNumber,
      avatar_url: avatarUrl,
      aadhaar_card_url: aadhaarUrl,
      pan_card_url: panUrl,
      date_of_joining: dateOfJoining,
      valid_until: validUntil,
      address,
    };

    const res = await updateStaffProfile(user.id, updatedData);
    setLoading(false);

    if (res.success) {
      onSuccess({
        ...user,
        ...updatedData,
      });
      onClose();
    } else {
      setError(res.error || 'प्रोफ़ाइल अपडेट करने में त्रुटि।');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-y-auto relative flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur z-20 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Edit size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                कर्मचारी विवरण संपादित करें (Edit Staff Details)
              </h2>
              <p className="text-xs text-slate-500">
                {user.email || user.username} • आईडी: {idCardNumber || user.id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8 flex-1">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Selection */}
          <div className="space-y-3">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={15} className="text-red-700" />
              <span>भूमिका (Role)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ROLE_OPTIONS.map((item) => {
                const isSelected = role === item.role;
                return (
                  <div
                    key={item.role}
                    onClick={() => setRole(item.role)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? `${item.badgeColor} shadow-sm ring-2 ring-red-500/20`
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">{item.title}</span>
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-red-700 bg-red-700' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Names and Contact */}
          <div className="space-y-4">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={15} className="text-red-700" />
              <span>नाम व पदनाम (Personal & Editorial Info)</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-semibold">
                    पूरा नाम अंग्रेजी (Full Name English) *
                  </label>
                  {translatingField === 'nameEn' && (
                    <span className="text-[10px] text-red-600 flex items-center gap-1 font-semibold animate-pulse">
                      <RefreshCw size={10} className="animate-spin" />
                      अनुवाद...
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => handleNameEnChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-semibold">
                    पूरा नाम हिंदी (Full Name Hindi)
                  </label>
                  {translatingField === 'nameHi' && (
                    <span className="text-[10px] text-red-600 flex items-center gap-1 font-semibold animate-pulse">
                      <RefreshCw size={10} className="animate-spin" />
                      अनुवाद...
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={fullNameHi}
                  onChange={(e) => handleNameHiChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  यूज़रनेम (Username)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  पदनाम हिंदी (Designation Hindi)
                </label>
                <input
                  type="text"
                  value={designationHi}
                  onChange={(e) => setDesignationHi(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Phone size={15} className="text-red-700" />
              <span>संपर्क, बीट व आईडी विवरण</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">फ़ोन नंबर (Mobile)</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">व्हाट्सएप नंबर</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">रिपोर्टिंग बीट</label>
                <input
                  type="text"
                  placeholder="e.g. गोंडा शहर / कैसरगंज"
                  value={reporterBeat}
                  onChange={(e) => setReporterBeat(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">रक्त समूह (Blood Group)</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600 bg-white"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">प्रेस आईडी क्रमांक (Card No)</label>
                <input
                  type="text"
                  value={idCardNumber}
                  onChange={(e) => setIdCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">कार्ड वैधता तिथि (Valid Until)</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-700 font-semibold mb-1">स्थाई / वर्तमान पता (Address)</label>
              <input
                type="text"
                placeholder="e.g. फ़ोर्विशगंज, गोंडा, उत्तर प्रदेश"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          {/* Photo & Documents Upload */}
          <div className="space-y-4">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard size={15} className="text-red-700" />
              <span>फ़ोटो व पहचान दस्तावेज़ (Photo, Aadhaar, PAN)</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Photo */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 flex flex-col items-center text-center">
                <span className="text-xs font-bold text-slate-800 mb-2">फ़ोटो (Avatar)</span>
                <div className="relative w-20 h-24 rounded-lg border-2 border-dashed border-slate-300 bg-white flex items-center justify-center overflow-hidden mb-3">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="text-slate-400" size={24} />
                  )}
                </div>
                <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold shadow-sm transition-colors">
                  {uploadingField === 'staff-photo' ? 'अपलोड हो रहा है...' : 'फ़ोटो बदलें'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'staff-photo')}
                    disabled={uploadingField !== null}
                  />
                </label>
              </div>

              {/* Aadhaar */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 flex flex-col items-center text-center">
                <span className="text-xs font-bold text-slate-800 mb-2">आधार कार्ड</span>
                <div className="relative w-20 h-24 rounded-lg border-2 border-dashed border-slate-300 bg-white flex items-center justify-center overflow-hidden mb-3">
                  {aadhaarUrl ? (
                    <div className="text-center p-1">
                      <CheckCircle2 size={24} className="text-emerald-600 mx-auto" />
                      <span className="text-[9px] text-emerald-800 font-bold block mt-1">संलग्न</span>
                    </div>
                  ) : (
                    <FileText className="text-slate-400" size={24} />
                  )}
                </div>
                <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold shadow-sm transition-colors">
                  {uploadingField === 'staff-aadhaar' ? 'अपलोड हो रहा है...' : 'आधार अपडेट'}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'staff-aadhaar')}
                    disabled={uploadingField !== null}
                  />
                </label>
              </div>

              {/* PAN */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 flex flex-col items-center text-center">
                <span className="text-xs font-bold text-slate-800 mb-2">पैन कार्ड</span>
                <div className="relative w-20 h-24 rounded-lg border-2 border-dashed border-slate-300 bg-white flex items-center justify-center overflow-hidden mb-3">
                  {panUrl ? (
                    <div className="text-center p-1">
                      <CheckCircle2 size={24} className="text-emerald-600 mx-auto" />
                      <span className="text-[9px] text-emerald-800 font-bold block mt-1">संलग्न</span>
                    </div>
                  ) : (
                    <FileText className="text-slate-400" size={24} />
                  )}
                </div>
                <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold shadow-sm transition-colors">
                  {uploadingField === 'staff-pan' ? 'अपलोड हो रहा है...' : 'पैन अपडेट'}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'staff-pan')}
                    disabled={uploadingField !== null}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
            >
              रद्द करें
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={15} />
                  <span>सहेजा जा रहा है...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  <span>बदलाव सुरक्षित करें (Save Changes)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
