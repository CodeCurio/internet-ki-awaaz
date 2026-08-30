'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  User,
  Shield,
  KeyRound,
  Award,
  Upload,
  Save,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  FileText,
  Lock,
  RefreshCw,
  Sparkles,
  Languages,
  Eye,
  EyeOff,
} from 'lucide-react';
import { updateSelfProfile, changePassword } from '@/lib/actions/user.actions';
import { PressIdCard } from '../users/PressIdCard';
import type { Database } from '@/types/database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

interface ProfileManagerProps {
  user: Partial<ProfileRow> & {
    email?: string;
  };
}

export function ProfileManager({ user }: ProfileManagerProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'idcard'>('profile');

  // Form State
  const [fullName, setFullName] = useState(user.full_name || '');
  const [fullNameHi, setFullNameHi] = useState(user.full_name_hi || '');
  const [bio, setBio] = useState(user.bio || '');
  const [bioHi, setBioHi] = useState(user.bio_hi || '');
  const [phone, setPhone] = useState(user.phone_number || '');
  const [whatsapp, setWhatsapp] = useState(user.whatsapp_number || '');
  const [twitter, setTwitter] = useState(user.twitter_handle || '');
  const [address, setAddress] = useState(user.address || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '');

  // Translation State
  const [translatingField, setTranslatingField] = useState<string | null>(null);
  const nameDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const bioDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status State
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  // Auto-translate Bio: English -> Hindi
  const handleBioEnChange = (val: string) => {
    setBio(val);
    if (bioDebounceRef.current) clearTimeout(bioDebounceRef.current);
    if (!val.trim()) return;

    bioDebounceRef.current = setTimeout(async () => {
      setTranslatingField('bioHi');
      try {
        const res = await fetch(`/api/translate?text=${encodeURIComponent(val)}&from=en&to=hi`);
        const data = await res.json();
        if (data.hindi || data.translated) {
          setBioHi(data.hindi || data.translated);
        }
      } catch {
        // Ignored
      } finally {
        setTranslatingField(null);
      }
    }, 550);
  };

  // Auto-translate Bio: Hindi -> English
  const handleBioHiChange = (val: string) => {
    setBioHi(val);
    if (bioDebounceRef.current) clearTimeout(bioDebounceRef.current);
    if (!val.trim()) return;

    bioDebounceRef.current = setTimeout(async () => {
      setTranslatingField('bioEn');
      try {
        const res = await fetch(`/api/translate?text=${encodeURIComponent(val)}&from=hi&to=en`);
        const data = await res.json();
        if (data.english || data.translated) {
          setBio(data.english || data.translated);
        }
      } catch {
        // Ignored
      } finally {
        setTranslatingField(null);
      }
    }, 550);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('context', 'avatar');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setAvatarUrl(data.url);
        // Automatically save avatar in profile
        await updateSelfProfile({ avatar_url: data.url });
        setProfileMsg({ type: 'success', text: 'प्रोफ़ाइल फ़ोटो सफलतापूर्वक अपडेट हो गई!' });
      } else {
        alert(data.error || 'फ़ोटो अपलोड विफल रहा।');
      }
    } catch (err: any) {
      alert('अपलोड त्रुटि: ' + err.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);

    const res = await updateSelfProfile({
      full_name: fullName,
      full_name_hi: fullNameHi,
      bio,
      bio_hi: bioHi,
      phone_number: phone,
      whatsapp_number: whatsapp,
      twitter_handle: twitter,
      address,
      avatar_url: avatarUrl,
    });

    setSavingProfile(false);
    if (res.success) {
      setProfileMsg({ type: 'success', text: 'आपकी प्रोफ़ाइल जानकारी सफलतापूर्वक सुरक्षित हो गई!' });
    } else {
      setProfileMsg({ type: 'error', text: res.error || 'सहेजने में विफल।' });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'दोनों पासवर्ड मेल नहीं खाते।' });
      return;
    }

    setSavingPassword(true);
    setPasswordMsg(null);

    const res = await changePassword(newPassword);
    setSavingPassword(false);

    if (res.success) {
      setPasswordMsg({ type: 'success', text: 'पासवर्ड सफलतापूर्वक बदल दिया गया है!' });
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMsg({ type: 'error', text: res.error || 'पासवर्ड बदलने में त्रुटि।' });
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'super_admin':
        return 'सुपर एडमिन (Super Admin)';
      case 'editor':
        return 'संपादक (Editor)';
      case 'reporter':
        return 'मान्यता प्राप्त संवाददाता (Reporter)';
      default:
        return 'योगदानकर्ता (Contributor)';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Profile Summary Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar with quick upload */}
        <div className="relative group">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-red-600 bg-slate-800 shadow-xl shrink-0">
            <Image
              src={avatarUrl || '/logo.png'}
              alt={fullName || 'Avatar'}
              fill
              className="object-cover"
            />
            {uploadingAvatar && (
              <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                <RefreshCw className="animate-spin text-white" size={24} />
              </div>
            )}
          </div>

          <label className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-red-700 hover:bg-red-800 text-white cursor-pointer shadow-lg transition-transform hover:scale-110">
            <Upload size={14} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={uploadingAvatar}
            />
          </label>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <h1 className="text-2xl font-extrabold text-white">
              {fullNameHi || fullName || 'स्टाफ सदस्य'}
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-red-700/80 text-white font-bold text-xs">
              {getRoleLabel(user.role)}
            </span>
          </div>

          <p className="text-xs text-slate-300">
            {user.designation_hi || user.designation || 'संपादकीय स्टाफ'} •{' '}
            <span className="font-mono text-slate-400">@{user.username}</span>
            {user.email && ` • ${user.email}`}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Award size={14} className="text-amber-400" />
              <span>आईडी: <strong className="text-slate-200 font-mono">{user.id_card_number || 'IKA-PRESS-2026'}</strong></span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Phone size={14} className="text-emerald-400" />
              <span>{phone || 'फ़ोन नंबर दर्ज नहीं'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2 bg-white px-6 pt-3 rounded-2xl shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-4 font-bold text-xs border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'border-red-700 text-red-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <User size={15} />
          <span>प्रोफ़ाइल विवरण (Profile Info)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-4 font-bold text-xs border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'security'
              ? 'border-red-700 text-red-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <KeyRound size={15} />
          <span>पासवर्ड व सुरक्षा (Security)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('idcard')}
          className={`pb-3 px-4 font-bold text-xs border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'idcard'
              ? 'border-red-700 text-red-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Award size={15} />
          <span>मेरा प्रेस आईडी कार्ड (My Press ID)</span>
        </button>
      </div>

      {/* Tab 1: Profile Form */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {/* Live Translation Helper Banner */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-50 to-red-50 border border-amber-200/80 rounded-2xl text-xs text-amber-900 font-medium">
            <Sparkles size={16} className="text-amber-600 shrink-0 animate-pulse" />
            <span>
              <strong>द्विभाषी ऑटो-ट्रांसलेशन सक्रिय:</strong> अंग्रेजी या हिंदी किसी भी कॉलम में लिखने पर दूसरा कॉलम स्वतः अनुवादित हो जाएगा।
            </span>
          </div>

          {profileMsg && (
            <div
              className={`p-4 rounded-xl flex items-center gap-2 text-xs font-semibold ${
                profileMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {profileMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Full Name English */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-700 font-bold">पूरा नाम (अंग्रेजी / English)</label>
                {translatingField === 'nameEn' && (
                  <span className="text-[10px] text-red-600 flex items-center gap-1 font-semibold animate-pulse">
                    <RefreshCw size={10} className="animate-spin" />
                    अनुवाद हो रहा है...
                  </span>
                )}
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => handleNameEnChange(e.target.value)}
                placeholder="e.g. Ramesh Tripathi"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            {/* Full Name Hindi */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-700 font-bold">पूरा नाम (हिंदी / Hindi)</label>
                {translatingField === 'nameHi' && (
                  <span className="text-[10px] text-red-600 flex items-center gap-1 font-semibold animate-pulse">
                    <RefreshCw size={10} className="animate-spin" />
                    अनुवाद हो रहा है...
                  </span>
                )}
              </div>
              <input
                type="text"
                value={fullNameHi}
                onChange={(e) => handleNameHiChange(e.target.value)}
                placeholder="e.g. रमेश त्रिपाठी"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">फ़ोन नंबर (Mobile)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">व्हाट्सएप नंबर</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">ट्विटर / X हैंडल</label>
              <input
                type="text"
                placeholder="@username"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">स्थान / पता</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Bio English */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-700 font-bold">संक्षिप्त परिचय (Bio English)</label>
                {translatingField === 'bioEn' && (
                  <span className="text-[10px] text-red-600 flex items-center gap-1 font-semibold animate-pulse">
                    <RefreshCw size={10} className="animate-spin" />
                    अनुवाद हो रहा है...
                  </span>
                )}
              </div>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => handleBioEnChange(e.target.value)}
                placeholder="Senior Bureau Chief covering Gonda and Eastern UP..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            {/* Bio Hindi */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-700 font-bold">संक्षिप्त परिचय (Bio Hindi)</label>
                {translatingField === 'bioHi' && (
                  <span className="text-[10px] text-red-600 flex items-center gap-1 font-semibold animate-pulse">
                    <RefreshCw size={10} className="animate-spin" />
                    अनुवाद हो रहा है...
                  </span>
                )}
              </div>
              <textarea
                rows={3}
                value={bioHi}
                onChange={(e) => handleBioHiChange(e.target.value)}
                placeholder="गोंडा एवं पूर्वांचल के वरिष्ठ ब्यूरो चीफ..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={savingProfile}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {savingProfile ? (
                <>
                  <RefreshCw className="animate-spin" size={15} />
                  <span>सहेजा जा रहा है...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>प्रोफ़ाइल सुरक्षित करें</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Security & Password Reset */}
      {activeTab === 'security' && (
        <form onSubmit={handlePasswordSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-xl space-y-6">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              पासवर्ड बदलें (Reset / Change Password)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              अपने खाते की सुरक्षा हेतु एक मजबूत पासवर्ड चुनें जिसमें अक्षर, अंक व विशेष चिन्ह हों।
            </p>
          </div>

          {passwordMsg && (
            <div
              className={`p-4 rounded-xl flex items-center gap-2 text-xs font-semibold ${
                passwordMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {passwordMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">नया पासवर्ड (New Password) *</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  placeholder="कम से कम 6 अक्षर"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:outline-none font-mono"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-1"
                  title={showNewPassword ? 'पासवर्ड छिपाएं' : 'पासवर्ड देखें'}
                >
                  {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">पासवर्ड पुनः दर्ज करें (Confirm Password) *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="नया पासवर्ड दोबारा लिखें"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:outline-none font-mono"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-1"
                  title={showConfirmPassword ? 'पासवर्ड छिपाएं' : 'पासवर्ड देखें'}
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingPassword}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {savingPassword ? (
                <>
                  <RefreshCw className="animate-spin" size={15} />
                  <span>पासवर्ड बदला जा रहा है...</span>
                </>
              ) : (
                <>
                  <KeyRound size={15} />
                  <span>पासवर्ड अपडेट करें</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: My Press ID Card */}
      {activeTab === 'idcard' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <PressIdCard
            user={{
              ...user,
              full_name: fullName || user.full_name,
              full_name_hi: fullNameHi || user.full_name_hi,
              avatar_url: avatarUrl || user.avatar_url,
              phone_number: phone || user.phone_number,
              address: address || user.address,
            }}
          />
        </div>
      )}
    </div>
  );
}
