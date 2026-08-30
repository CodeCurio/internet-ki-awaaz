'use client';

const CAPABILITIES: { label: string; roles: Record<string, boolean> }[] = [
  { label: 'ड्राफ्ट पोस्ट बनाएं', roles: { contributor: true, reporter: true, editor: true, super_admin: true } },
  { label: 'समीक्षा हेतु सबमिट करें', roles: { contributor: true, reporter: true, editor: true, super_admin: true } },
  { label: 'पोस्ट प्रकाशित करें', roles: { contributor: false, reporter: false, editor: true, super_admin: true } },
  { label: 'दूसरों की पोस्ट संपादित करें', roles: { contributor: false, reporter: false, editor: true, super_admin: true } },
  { label: 'पोस्ट हटाएं', roles: { contributor: false, reporter: false, editor: true, super_admin: true } },
  { label: 'श्रेणियां/टैग प्रबंधित करें', roles: { contributor: false, reporter: false, editor: true, super_admin: true } },
  { label: 'ब्रेकिंग न्यूज़ पोस्ट करें', roles: { contributor: false, reporter: false, editor: true, super_admin: true } },
  { label: 'उपयोगकर्ता आमंत्रित/निष्क्रिय करें', roles: { contributor: false, reporter: false, editor: false, super_admin: true } },
  { label: 'भूमिका बदलें', roles: { contributor: false, reporter: false, editor: false, super_admin: true } },
  { label: 'ऑडिट लॉग देखें', roles: { contributor: false, reporter: false, editor: false, super_admin: true } },
];

const ROLE_LABELS: Record<string, string> = {
  contributor: 'योगदानकर्ता',
  reporter: 'रिपोर्टर',
  editor: 'संपादक',
  super_admin: 'सुपर एडमिन',
};

export function RoleMatrixTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left">
            <th className="py-3 px-4 font-bold text-slate-700">संपादकीय क्षमता / अधिकार (Capability)</th>
            {Object.keys(ROLE_LABELS).map((role) => (
              <th key={role} className="py-3 px-3 text-center font-bold text-slate-700">
                {ROLE_LABELS[role]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {CAPABILITIES.map((capability) => (
            <tr key={capability.label} className="hover:bg-slate-50 transition-colors">
              <td className="py-2.5 px-4 font-medium text-slate-800">{capability.label}</td>
              {Object.keys(ROLE_LABELS).map((role) => (
                <td key={role} className="py-2.5 px-3 text-center">
                  {capability.roles[role] ? (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      ✓ अनुमति
                    </span>
                  ) : (
                    <span className="text-slate-300 font-mono">—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
