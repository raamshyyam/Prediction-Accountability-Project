
import React, { useState } from 'react';
import { Claim, Status, Category, Language, Claimant, AnalysisParameter } from '../types';
import { translations } from '../translations';
import { ClaimAnalysis } from './ClaimAnalysis';

interface ClaimCardProps {
  claim: Claim;
  claimants: Claimant[];
  lang: Language;
  onUpdateClaim: (claim: Claim) => void;
  onEditClick: (claim: Claim) => void;
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

export const ClaimCard: React.FC<ClaimCardProps> = ({ claim, claimants, lang, onUpdateClaim, onEditClick }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const claimant = claimants.find(c => c.id === claim.claimantId);
  const t = translations[lang];

  const handleUpdateParams = (params: AnalysisParameter[]) => {
    onUpdateClaim({ ...claim, analysisParams: params });
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all duration-300 ${showAnalysis ? 'col-span-full' : 'hover:shadow-lg'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${statusColors[claim.status]}`}>
            {claim.status}
          </span>
          {claim.sources.map((s, i) => (
            <span key={i} className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-500">
              {s.type}
            </span>
          ))}
          {claim.topicGroup && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-50 text-blue-600 border border-blue-100">
              {claim.topicGroup}
            </span>
          )}
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => onEditClick(claim)}
             className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
             title={t.editClaim}
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
           </button>
           <span className="text-2xl" title={claim.category}>{categoryIcons[claim.category]}</span>
        </div>
      </div>
      
      <p className="text-slate-900 font-bold text-xl leading-snug mb-5">
        "{claim.text}"
      </p>
      
      <div className="flex items-center gap-4 mb-6">
        <img 
          src={claimant?.photoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(claimant?.name || 'User')} 
          alt={claimant?.name} 
          className="w-10 h-10 rounded-full border-2 border-slate-50" 
        />
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-800 leading-none mb-1">{claimant?.name || 'Unknown'}</p>
          <p className="text-xs text-slate-500 font-medium">{claimant?.affiliation || 'Individual'}</p>
        </div>
        <div className="text-right">
           <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{t.accuracy}</p>
           <p className="text-sm font-black text-green-600">{claimant?.accuracyRate || 0}%</p>
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

      <div className="flex items-center justify-between">
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
         <button 
           onClick={() => setShowAnalysis(!showAnalysis)}
           className="px-4 py-2 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2"
         >
           {showAnalysis ? t.cancel : t.analysis}
           <svg className={`w-3 h-3 transition-transform ${showAnalysis ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
         </button>
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
