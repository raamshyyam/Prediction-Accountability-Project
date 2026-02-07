
import React from 'react';
import { Language } from '../types.ts';
import { translations } from '../translations.ts';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  isAdmin?: boolean;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange, lang, setLang, isAdmin, onLogout }) => {
  const t = translations[lang];

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-xl shadow-blue-200">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{t.title}</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.subtitle}</p>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-12">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3.5 border-2 border-slate-50 rounded-2xl leading-5 bg-slate-50 placeholder-slate-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 text-sm font-bold transition-all"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-slate-100 p-1 rounded-xl flex">
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${lang === 'en' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('ne')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${lang === 'ne' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
              >
                नेपाली
              </button>
            </div>
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t.location}</span>
              <span className="text-xs font-black text-slate-700">{t.kathmandu}</span>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <span className="px-3 py-1 rounded-lg text-[10px] font-black bg-orange-100 text-orange-700">
                  🔑 ADMIN
                </span>
              )}
              <button
                onClick={() => onLogout?.()}
                className="px-3 py-2 rounded-lg text-[10px] font-black bg-slate-100 text-slate-700 hover:bg-red-100 hover:text-red-700 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
