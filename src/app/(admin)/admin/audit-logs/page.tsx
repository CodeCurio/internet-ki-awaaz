import { createClient } from '@/lib/supabase/server';
import { History, ShieldAlert, Clock, User } from 'lucide-react';
import { formatRelativeHindiTime } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const MOCK_AUDIT_LOGS = [
  {
    id: 'a1',
    actor_name: 'मुख्य संपादक (ika_admin)',
    action: 'PUBLISH',
    entity_type: 'posts',
    entity_id: 'gonda-medical-college-super-speciality-inauguration',
    created_at: new Date().toISOString(),
    ip_address: '103.211.54.12',
  },
  {
    id: 'a2',
    actor_name: 'अमित कुमार सिंह (amit_singh)',
    action: 'SUBMIT_REVIEW',
    entity_type: 'posts',
    entity_id: 'kaiserganj-sugar-mill-crushing-season-record',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    ip_address: '103.211.54.44',
  },
  {
    id: 'a3',
    actor_name: 'मुख्य संपादक (ika_admin)',
    action: 'APPROVE_DIRECTORY',
    entity_type: 'directory_listings',
    entity_id: 'avadh-super-speciality-hospital-gonda',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    ip_address: '103.211.54.12',
  },
  {
    id: 'a4',
    actor_name: 'मुख्य संपादक (ika_admin)',
    action: 'CREATE_BREAKING',
    entity_type: 'breaking_news',
    entity_id: 'ghaghra-water-level-alert',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    ip_address: '103.211.54.12',
  },
];

export default async function AdminAuditLogsPage() {
  const supabase = await createClient();
  let logs = MOCK_AUDIT_LOGS;

  try {
    const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50);
    if (data && data.length > 0) {
      logs = data.map((d: any) => ({
        id: d.id,
        actor_name: d.actor_id || 'सिस्टम',
        action: d.action,
        entity_type: d.entity_type,
        entity_id: d.entity_id || '',
        created_at: d.created_at,
        ip_address: d.ip_address || '127.0.0.1',
      }));
    }
  } catch {
    // Fallback
  }

  const actionBadge = (act: string) => {
    switch (act) {
      case 'PUBLISH':
      case 'INSERT':
        return <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">{act}</span>;
      case 'UPDATE':
      case 'SUBMIT_REVIEW':
        return <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">{act}</span>;
      case 'DELETE':
        return <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[10px]">{act}</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-[10px]">{act}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <History size={20} className="text-red-700" />
            <span>ऑडिट लॉग्स व संपादकीय जवाबदेही (Audit Trail)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            प्रकाशन, संपादन और प्रशासनिक कार्रवाइयों का अपरिवर्तनीय सुरक्षित रिकॉर्ड।
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th className="py-3.5 px-4">समय (Timestamp)</th>
                <th className="py-3.5 px-4">स्टाफ / प्रयोक्ता</th>
                <th className="py-3.5 px-4">कार्रवाई (Action)</th>
                <th className="py-3.5 px-4">इकाई (Entity)</th>
                <th className="py-3.5 px-4">आईपी पता</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-mono whitespace-nowrap">
                    {formatRelativeHindiTime(log.created_at)}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{log.actor_name}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{actionBadge(log.action)}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{log.entity_type}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{log.ip_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
