
import React, { useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Category, Status, Claim, Language } from '../types.ts';
import { translations } from '../translations.ts';

interface DashboardProps {
  claims: Claim[];
  lang: Language;
  onImport: (data: string) => void;
}

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#0ea5e9'];

export const Dashboard: React.FC<DashboardProps> = ({ claims, lang, onImport }) => {
  const t = translations[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoryData = Object.values(Category).map(cat => ({
    name: t.categories[cat as keyof typeof t.categories] || cat,
    count: claims.filter(c => c.category === cat).length
  })).filter(d => d.count > 0);

  const statusData = Object.values(Status).map(stat => ({
    name: t.statuses[stat as keyof typeof t.statuses] || stat,
    value: claims.filter(c => c.status === stat).length
  })).filter(d => d.value > 0);

  const handleExport = () => {
    const dataStr = JSON.stringify(claims, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `pap-backup-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onImport(result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-600 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-200">
        <div>
          <h3 className="text-xl font-black">{lang === 'ne' ? 'डाटा ब्याकअप र सिंक' : 'Data Backup & Sync'}</h3>
          <p className="text-sm opacity-80">{lang === 'ne' ? 'तपाईंको डाटा अर्को उपकरणमा सार्न डाउनलोड गर्नुहोस्।' : 'Download your data to move it to another device.'}</p>
        </div>
        <div className="flex gap-4">
           <button onClick={handleExport} className="px-6 py-3 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all flex items-center gap-2 text-sm">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
             {t.export}
           </button>
           <button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 bg-blue-700 text-white font-black rounded-2xl hover:bg-blue-800 transition-all flex items-center gap-2 text-sm">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
             {t.import}
           </button>
           <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{lang === 'ne' ? 'श्रेणी अनुसार दाबी' : 'Claims by Category'}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{lang === 'ne' ? 'प्रमाणीकरण अवस्था' : 'Verification Status'}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{lang === 'ne' ? 'शुद्धता प्रवृत्ति' : 'Accuracy Trend'}</h3>
            <div className="h-64 flex items-center justify-center">
                <p className="text-xs text-slate-300 font-bold uppercase italic">{lang === 'ne' ? 'थप डाटा आवश्यक छ' : 'More data needed for trend'}</p>
            </div>
        </div>
      </div>
    </div>
  );
};
