
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Category, Status, Claim } from '../types';

interface DashboardProps {
  claims: Claim[];
}

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#0ea5e9'];

export const Dashboard: React.FC<DashboardProps> = ({ claims }) => {
  const categoryData = Object.values(Category).map(cat => ({
    name: cat,
    count: claims.filter(c => c.category === cat).length
  })).filter(d => d.count > 0);

  const statusData = Object.values(Status).map(stat => ({
    name: stat,
    value: claims.filter(c => c.status === stat).length
  })).filter(d => d.value > 0);

  // Dynamic accuracy trend (mocked by date made)
  const accuracyTrend = [
    { m: 'Jan', acc: 45 },
    { m: 'Feb', acc: 52 },
    { m: 'Mar', acc: 48 },
    { m: 'Apr', acc: 61 },
    { m: 'May', acc: 58 },
    { m: 'Jun', acc: 65 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Claims by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Verification Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {statusData.map((s, i) => (
                <div key={s.name} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{s.name}</span>
                </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Accuracy Trend (Live)</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={accuracyTrend}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="m" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="acc" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6, fill: '#8b5cf6', strokeWidth: 0 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};
