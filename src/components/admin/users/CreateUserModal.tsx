'use client';

import { useState, useRef } from 'react';
import {
  X,
  UserPlus,
  Upload,
  Shield,
  FileText,
  CreditCard,
  Phone,
  MapPin,
  Droplet,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { createStaffUser } from '@/lib/actions/user.actions';
import type { UserRole } from '@/types/database.types';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (createdUser: any) => void;
}

const ROLE_OPTIONS: { role: UserRole; title: string; desc: string; badgeColor: string }[] = [
  {
    role: 'super_admin',
    title: 'सुपर एडमिन (Super Admin)',
    desc: 'संपादकीय पोर्टल, उपयोगकर्ता प्रबंधन, ब्रेकिंग न्यूज़ व साइट सेटिंग्स का पूर्ण नियंत्रण।',
    badgeColor: 'border-red-500 bg-red-50 text-red-900',
  },
  {
    role: 'editor',
    title: 'संपादक (Editor)',
    desc: 'सभी समाचारों की समीक्षा, संपादन, प्रकाशन व ब्रेकिंग न्यूज़ प्रकाशित करने का अधिकार।',
    badgeColor: 'border-blue-500 bg-blue-50 text-blue-900',
  },
  {
    role: 'reporter',
    title: 'संवाददाता / रिपोर्टर (Reporter)',
    desc: 'ग्राउंड रिपोर्टिंग, नए समाचार लेख व वीडियो बुलेटिन ड्राफ़्ट बनाने का अधिकार।',
    badgeColor: 'border-emerald-500 bg-emerald-50 text-emerald-900',
  },
  {
    role: 'contributor',
    title: 'योगदानकर्ता / स्तंभकार (Contributor)',
    desc: 'विशेष लेख, विचार व स्तंभ लेखन हेतु ड्राफ़्ट सबमिशन की अनुमति।',
    badgeColor: 'border-slate-400 bg-slate-50 text-slate-800',
  },
];

export function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdResult, setCreatedResult] = useState<any | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [fullNameHi, setFullNameHi] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('reporter');
  const [designation, setDesignation] = useState('');
  const [designationHi, setDesignationHi] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [reporterBeat, setReporterBeat] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState(`${new Date().getFullYear() + 1}-12-31`);

  // Document URLs State
  const [avatarUrl, setAvatarUrl] = useState('');
  const [aadhaarUrl, setAadhaarUrl] = useState('');
  const [panUrl, setPanUrl] = useState('');
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [translatingField, setTranslatingField] = useState<string | null>(null);
  const nameDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-translate Name: English -> Hindi
  const handleNameEnChange = (val: string) => {
    setFullName(val);
    if (!username && val) {
      setUsername(val.toLowerCase().replace(/[^a-z0-9_]/g, '_'));
    }
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
          if (!username) {
            setUsername((data.english || data.translated).toLowerCase().replace(/[^a-z0-9_]/g, '_'));
          }
        }
      } catch {
        // Ignored
      } finally {
        setTranslatingField(null);
      }
    }, 450);
  };

  // Auto-generate secure password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pwd = 'IKA@';
    for (let i = 0; i < 8; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pwd);
  };

  // Upload handler for photo, aadhaar, pan
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
    if (!email || !fullName) {
      setError('कृपया ईमेल और कर्मचारी का नाम अनिवार्य रूप से भरें।');
      return;
    }

    setLoading(true);
    setError(null);

    const pressId = `IKA-PRESS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const res = await createStaffUser({
      email,
      password: password || undefined,
      full_name: fullName,
      full_name_hi: fullNameHi || fullName,
      username: username || email.split('@')[0],
      role,
      designation: designation || 'Staff',
      designation_hi: designationHi || 'संपादकीय स्टाफ',
      phone_number: phoneNumber,
      whatsapp_number: whatsappNumber || phoneNumber,
      reporter_beat: reporterBeat,
      blood_group: bloodGroup,
      emergency_contact: emergencyContact,
      id_card_number: pressId,
      avatar_url: avatarUrl,
      aadhaar_card_url: aadhaarUrl,
      pan_card_url: panUrl,
      date_of_joining: dateOfJoining,
      valid_until: validUntil,
      address,
    });

    setLoading(false);

    if (res.success && res.user) {
      setCreatedResult({
        ...res.user,
        full_name: fullName,
        full_name_hi: fullNameHi,
        designation_hi: designationHi,
        avatar_url: avatarUrl,
        blood_group: bloodGroup,
        phone_number: phoneNumber,
        reporter_beat: reporterBeat,
        valid_until: validUntil,
        date_of_joining: dateOfJoining,
        address,
      });
      if (onSuccess) onSuccess(res.user);
    } else {
      setError(res.error || 'उपयोगकर्ता बनाने में त्रुटि हुई।');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-y-auto relative flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur z-20 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                नया कर्मचारी / पत्रकार जोड़ें (Add Staff & Assign Role)
              </h2>
              <p className="text-xs text-slate-500">
                ऑथेंटिकेशन खाता निर्माण, पद, दस्तावेज़ (आधार, पैन) व प्रेस आईडी कार्ड जनरेटर।
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

        {/* Success Screen */}
        {createdResult ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">
                कर्मचारी सफलतापूर्वक जोड़ा गया!
              </h3>
              <p className="text-sm text-slate-600">
                उपयोगकर्ता Supabase Authentication में सुरक्षित रूप से पंजीकृत हो चुका है।
              </p>
            </div>

            {/* Credentials Card */}
            <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">ईमेल आईडी:</span>
                <span className="font-bold text-slate-900">{createdResult.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">अस्थायी पासवर्ड (Temp Password):</span>
                <span className="font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                  {createdResult.tempPassword}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">भूमिका (Role):</span>
                <span className="font-bold text-slate-900 uppercase">{createdResult.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">प्रेस आईडी क्रमांक:</span>
                <span className="font-mono font-bold text-amber-700">{createdResult.id_card_number}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs transition-colors shadow-sm"
              >
                सूची पर वापस जाएं
              </button>
            </div>
          </div>
        ) : (
          /* Main Creation Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-8 flex-1">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Role Selection */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Shield size={15} className="text-red-700" />
                <span>1. कर्मचारी की भूमिका चुनें (Select Role)</span>
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

            {/* Step 2: Authentication & Basic Details */}
            <div className="space-y-4">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={15} className="text-red-700" />
                <span>2. प्रमाणीकरण व व्यक्तिगत विवरण (Auth & Personal Info)</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    आधिकारिक ईमेल (Email ID) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="reporter@internetkiawaaz.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold">
                      लॉगिन पासवर्ड (Password)
                    </label>
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="text-[11px] text-red-700 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Sparkles size={12} />
                      <span>ऑटो जेनरेट करें</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="कम से कम 6 अक्षर या ऑटो जेनरेट करें"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600 font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-semibold">
                      पूरा नाम अंग्रेजी में (Full Name - English) *
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
                    placeholder="e.g. Ramesh Tripathi"
                    value={fullName}
                    onChange={(e) => handleNameEnChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-semibold">
                      पूरा नाम हिंदी में (Full Name - Hindi)
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
                    placeholder="e.g. रमेश त्रिपाठी"
                    value={fullNameHi}
                    onChange={(e) => handleNameHiChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    यूज़रनेम (Username / Byline Slug)
                  </label>
                  <input
                    type="text"
                    placeholder="ramesh_tripathi"
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
                    placeholder="e.g. वरिष्ठ संवाददाता / ब्यूरो चीफ"
                    value={designationHi}
                    onChange={(e) => setDesignationHi(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Contact & Reporting Beat */}
            <div className="space-y-4">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Phone size={15} className="text-red-700" />
                <span>3. संपर्क व बीट विवरण (Contact & Editorial Beat)</span>
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
                  <label className="block text-slate-700 font-semibold mb-1">रिपोर्टिंग बीट / क्षेत्र</label>
                  <input
                    type="text"
                    placeholder="e.g. गोंडा शहर / कैसरगंज / क्राइम"
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
                  <label className="block text-slate-700 font-semibold mb-1">आपातकालीन संपर्क नंबर</label>
                  <input
                    type="tel"
                    placeholder="Emergency Contact"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
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
                  placeholder="e.g. फ़ोर्विशगंज, गोंडा, उत्तर प्रदेश 271001"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            {/* Step 4: Documents & Photos Upload */}
            <div className="space-y-4">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard size={15} className="text-red-700" />
                <span>4. फ़ोटो व पहचान दस्तावेज़ अपलोड (Photo, Aadhaar, PAN)</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Profile Photo */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 flex flex-col items-center text-center">
                  <span className="text-xs font-bold text-slate-800 mb-2">
                    पासपोर्ट साइज फोटो (Photo)
                  </span>

                  <div className="relative w-20 h-24 rounded-lg border-2 border-dashed border-slate-300 bg-white flex items-center justify-center overflow-hidden mb-3">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="text-slate-400" size={24} />
                    )}
                  </div>

                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold shadow-sm transition-colors">
                    {uploadingField === 'staff-photo' ? 'अपलोड हो रहा है...' : 'फ़ोटो चुनें'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'staff-photo')}
                      disabled={uploadingField !== null}
                    />
                  </label>
                </div>

                {/* Aadhaar Card */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 flex flex-col items-center text-center">
                  <span className="text-xs font-bold text-slate-800 mb-2">
                    आधार कार्ड (Aadhaar Card)
                  </span>

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
                    {uploadingField === 'staff-aadhaar' ? 'अपलोड हो रहा है...' : 'आधार अपलोड'}
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'staff-aadhaar')}
                      disabled={uploadingField !== null}
                    />
                  </label>
                </div>

                {/* PAN Card */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 flex flex-col items-center text-center">
                  <span className="text-xs font-bold text-slate-800 mb-2">
                    पैन कार्ड (PAN Card)
                  </span>

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
                    {uploadingField === 'staff-pan' ? 'अपलोड हो रहा है...' : 'पैन कार्ड अपलोड'}
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

            {/* Submit Buttons */}
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
                    <span>खाता बनाया जा रहा है...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={15} />
                    <span>कर्मचारी पंजीकृत करें (Create Staff)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
