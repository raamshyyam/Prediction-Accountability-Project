
import React, { useState } from 'react';
import { Claim, Status, Category, Language, Claimant, AnalysisParameter } from '../types.ts';
import { translations } from '../translations.ts';
import { ClaimAnalysis } from './ClaimAnalysis.tsx';

interface ClaimCardProps {
  claim: Claim;
  claimants: Claimant[];
  lang: Language;
  isAdmin?: boolean;
  onTranslate?: (text: string, lang: Language) => Promise<string>;
  onUpdateClaim: (claim: Claim) => void;
  onEditClick: (claim: Claim) => void;
  onDeleteClick: (id: string) => void;
  onViewDetails?: (claim: Claim) => void;
  onViewClaimantProfile?: (claimantId: string) => void;
}

const statusColors = {
  [Status.FULFILLED]: 'bg-green-100 text-green-800',
  [Status.DISPROVEN]: 'bg-red-100 text-red-800',
  [Status.PARTIAL]: 'bg-yellow-100 text-yellow-800',
  [Status.ONGOING]: 'bg-blue-100 text-blue-800',
  [Status.INCONCLUSIVE]: 'bg-gray-100 text-gray-800',
};

const categoryIcons = {
  [Category.POLITICS]: '🗳️',
  [Category.ECONOMY]: '📉',
  [Category.ASTROLOGY]: '✨',
  [Category.HYDROPOWER]: '⚡',
  [Category.TOURISM]: '🏔️',
  [Category.MANIFESTO]: '📜',
};

export const ClaimCard: React.FC<ClaimCardProps> = ({ claim, claimants, lang, onUpdateClaim, onEditClick, onDeleteClick, onViewDetails, onViewClaimantProfile, isAdmin, onTranslate }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [translatedText, setTranslatedText] = useState<string>(claim.text);
  const [translating, setTranslating] = useState(false);
  const claimant = claimants.find(c => c.id === claim.claimantId);
  const claimSources = Array.isArray(claim.sources) ? claim.sources : [];
  const t = translations[lang];

  React.useEffect(() => {
    let mounted = true;
    const doTranslate = async () => {
      if (lang === 'en') {
        setTranslatedText(claim.text);
        return;
      }
      // if claim already has translations stored, use them
      // @ts-ignore
      const existing = (claim as any).translations?.[lang];
      if (existing) {
        setTranslatedText(existing);
        return;
      }
      if (!onTranslate) {
        setTranslatedText(claim.text);
        return;
      }
      setTranslating(true);
      try {
        const res = await onTranslate(claim.text, lang);
        if (mounted) setTranslatedText(res || claim.text);
      } catch (e) {
        if (mounted) setTranslatedText(claim.text);
      } finally {
        if (mounted) setTranslating(false);
      }
    };
    doTranslate();
    return () => { mounted = false; };
  }, [lang, claim.id, claim.text, onTranslate]);

  const handleUpdateParams = (params: AnalysisParameter[]) => {
    onUpdateClaim({ ...claim, analysisParams: params });
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all duration-300 ${showAnalysis ? 'col-span-full ring-2 ring-blue-500' : 'hover:shadow-lg'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${statusColors[claim.status]}`}>
            {t.statuses[claim.status as keyof typeof t.statuses] || claim.status}
          </span>
          {claimSources.map((s, i) => (
            <span key={i} className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-500">
              {s.type}
            </span>
          ))}
        </div>
        <div className="flex gap-1">
           <button 
             onClick={() => onEditClick(claim)}
             className="p-2 bg-slate-50 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
             title={t.editClaim}
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
           </button>
           {isAdmin && (
             <button 
               onClick={() => window.confirm('Delete this claim?') && onDeleteClick(claim.id)}
               className="p-2 bg-slate-50 hover:bg-red-100 rounded-lg text-red-400 transition-colors"
               title={t.delete}
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
             </button>
           )}
           <div className="ml-2 text-2xl" title={claim.category}>{categoryIcons[claim.category]}</div>
        </div>
      </div>
      
      <p className="text-slate-900 font-bold text-xl leading-snug mb-5">
        "{translating ? 'Translating...' : translatedText}"
      </p>

      {claim.topicGroup && (
        <p className="text-[10px] font-black uppercase text-blue-500 mb-4 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M17.707 9.293l-5-5a1 1 0 00-1.414 0l-7 7a1 1 0 000 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414zM9 11a1 1 0 110-2 1 1 0 010 2z"/></svg>
          {claim.topicGroup}
        </p>
      )}
      
      <div className="flex items-center gap-4 mb-6">
        <img 
          src={claimant?.photoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(claimant?.name || 'User')} 
          alt={claimant?.name} 
          className="w-10 h-10 rounded-full border-2 border-slate-50 cursor-pointer hover:ring-2 ring-blue-400 transition-all" 
          onClick={() => onViewClaimantProfile?.(claim.claimantId)}
        />
        <div className="flex-1 cursor-pointer hover:opacity-75 transition-opacity" onClick={() => onViewClaimantProfile?.(claim.claimantId)}>
          <p className="text-sm font-bold text-slate-800 leading-none mb-1">{claimant?.name || 'Unknown'}</p>
          <p className="text-xs text-slate-500 font-medium">{claimant?.affiliation || 'Individual'}</p>
        </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{t.accuracy}</p>
            <p className="text-sm font-black text-green-600">{(claimant && claimant.totalClaims && claimant.totalClaims > 0) ? `${claimant.accuracyRate}%` : '-'}</p>
          </div>
      </div>

      <div className="grid grid-cols-2 gap-6 text-[10px] text-slate-500 border-y border-slate-50 py-4 mb-4">
        <div>
          <p className="font-black text-slate-400 uppercase tracking-widest mb-1">{t.recordedAt}</p>
          <p className="text-sm font-bold text-slate-700">{claim.dateMade}</p>
        </div>
        <div>
          <p className="font-black text-slate-400 uppercase tracking-widest mb-1">{t.targetAt}</p>
          <p className="text-sm font-bold text-slate-700">{claim.targetDate}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
         <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{t.vagueness}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${claim.vaguenessIndex > 7 ? 'bg-red-400' : claim.vaguenessIndex > 4 ? 'bg-yellow-400' : 'bg-green-400'}`} 
                        style={{ width: `${claim.vaguenessIndex * 10}%` }}
                    />
                </div>
                <span className="text-xs font-black text-slate-700">{claim.vaguenessIndex}/10</span>
              </div>
            </div>
         </div>
         <div className="flex gap-2">
           <button 
             onClick={() => onViewDetails?.(claim)}
             className="px-3 py-2 bg-emerald-600 text-white text-xs font-black rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-2"
             title="View full details and evidence"
           >
             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
             Details
           </button>
           <button 
             onClick={() => setShowAnalysis(!showAnalysis)}
             className="px-3 py-2 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2"
           >
             {showAnalysis ? t.cancel : t.analysis}
             <svg className={`w-3 h-3 transition-transform ${showAnalysis ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
           </button>
         </div>
      </div>

      {showAnalysis && (
        <ClaimAnalysis 
          claim={claim} 
          lang={lang} 
          onUpdateParams={handleUpdateParams}
        />
      )}
    </div>
  );
};
