import React, { useState } from 'react';
import { Language } from '../types.ts';
import { translations } from '../translations.ts';

interface LoginModalProps {
  lang: Language;
  onLoginSuccess: (isAdmin: boolean) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ lang, onLoginSuccess }) => {
  const t = translations[lang];
  const [role, setRole] = useState<'viewer' | 'admin'>('viewer');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const ADMIN_PASSWORD = 'pap2026'; // Simple password for demo

  const handleLogin = () => {
    if (role === 'admin') {
      if (adminPassword === ADMIN_PASSWORD) {
        setError('');
        localStorage.setItem('pap_auth', JSON.stringify({ role: 'admin', loginTime: Date.now() }));
        onLoginSuccess(true);
      } else {
        setError(lang === 'ne' ? 'गलत पासवर्ड' : 'Incorrect password');
        setAdminPassword('');
      }
    } else {
      setError('');
      localStorage.setItem('pap_auth', JSON.stringify({ role: 'viewer', loginTime: Date.now() }));
      onLoginSuccess(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-slate-800 mb-2">PAP</h1>
          <p className="text-slate-500">{lang === 'ne' ? 'भविष्यवाणी जवाफदेहिता' : 'Prediction Accountability'}</p>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4">
            <label className="flex-1 cursor-pointer">
              <input 
                type="radio" 
                name="role" 
                value="viewer" 
                checked={role === 'viewer'}
                onChange={(e) => {
                  setRole(e.target.value as 'viewer' | 'admin');
                  setAdminPassword('');
                  setError('');
                }}
                className="hidden"
              />
              <div className={`p-4 rounded-xl border-2 text-center transition-all font-bold ${role === 'viewer' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                👁️ {lang === 'ne' ? 'दर्शक' : 'Viewer'}
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input 
                type="radio" 
                name="role" 
                value="admin" 
                checked={role === 'admin'}
                onChange={(e) => {
                  setRole(e.target.value as 'viewer' | 'admin');
                  setError('');
                }}
                className="hidden"
              />
              <div className={`p-4 rounded-xl border-2 text-center transition-all font-bold ${role === 'admin' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                🔑 {lang === 'ne' ? 'व्यवस्थापक' : 'Admin'}
              </div>
            </label>
          </div>

          {role === 'admin' && (
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-2">
                {lang === 'ne' ? 'पासवर्ड' : 'Password'}
              </label>
              <input 
                type="password" 
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder={lang === 'ne' ? 'पासवर्ड दर्ज गर्नुहोस्' : 'Enter admin password'}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
              {error && <p className="text-red-500 text-xs mt-2 font-bold">{error}</p>}
              <p className="text-xs text-slate-400 mt-2">{lang === 'ne' ? 'डेमो: pap2026' : 'Demo: pap2026'}</p>
            </div>
          )}

          <button 
            onClick={handleLogin}
            className={`w-full py-3 rounded-xl font-black text-white transition-all ${role === 'admin' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {lang === 'ne' ? 'प्रवेश गर्नुहोस्' : 'Sign In'}
          </button>
        </div>

        <p className="text-xs text-slate-400 text-center mt-6">
          {lang === 'ne' ? 'दर्शक मोडमा कुनै पासवर्ड आवश्यक छैन' : 'No password needed for viewer mode'}
        </p>
      </div>
    </div>
  );
};
