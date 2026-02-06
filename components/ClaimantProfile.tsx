import React, { useState, useEffect } from 'react';
import { Claimant, Claim, Language, Status } from '../types.ts';
import { translations } from '../translations.ts';
import { searchClaimantBackground } from '../services/geminiService.ts';

interface ClaimantProfileProps {
  claimant: Claimant;
  claims: Claim[];
  lang: Language;
  onClose: () => void;
}

export const ClaimantProfile: React.FC<ClaimantProfileProps> = ({ claimant, claims, lang, onClose }) => {
  const t = translations[lang];
  const [backgroundInfo, setBackgroundInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBackground = async () => {
      setLoading(true);
      try {
        const info = await searchClaimantBackground(claimant.name);
        setBackgroundInfo(info);
      } catch (e) {
        console.error("Failed to load background", e);
      } finally {
        setLoading(false);
      }
    };
    loadBackground();
  }, [claimant]);

  const claimantClaims = claims.filter(c => c.claimantId === claimant.id);
  const fulfilledCount = claimantClaims.filter(c => c.status === Status.FULFILLED).length;
  const disprovenCount = claimantClaims.filter(c => c.status === Status.DISPROVEN).length;
  const ongoingCount = claimantClaims.filter(c => c.status === Status.ONGOING).length;

  const accuracyPercentage = claimantClaims.length > 0 
    ? Math.round((fulfilledCount / claimantClaims.length) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-8 flex justify-between items-start text-white z-10">
          <div className="flex items-start gap-4 flex-1">
            <img 
              src={claimant.photoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(claimant.name)} 
              alt={claimant.name} 
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg" 
            />
            <div>
              <h2 className="text-2xl font-black mb-1">{claimant.name}</h2>
              <p className="text-purple-100 mb-2">{claimant.affiliation}</p>
              <div className="flex gap-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                  {claimantClaims.length} claims
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                  {accuracyPercentage}% accuracy
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Bio */}
          {claimant.bio && (
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Biography</h3>
              <p className="text-slate-700 leading-relaxed">{claimant.bio}</p>
            </div>
          )}

          {/* Tags */}
          {claimant.tags.length > 0 && (
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Expertise Areas</h3>
              <div className="flex flex-wrap gap-2">
                {claimant.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-black rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Background Info from AI */}
          {backgroundInfo && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">AI Research Summary</h3>
              {backgroundInfo.bio && (
                <p className="text-sm text-slate-700 mb-4">{backgroundInfo.bio}</p>
              )}
              {backgroundInfo.affiliations && backgroundInfo.affiliations.length > 0 && (
                <p className="text-xs text-slate-600 mb-3">
                  <span className="font-bold">Affiliations:</span> {backgroundInfo.affiliations.join(', ')}
                </p>
              )}
              {backgroundInfo.accuracyInfo && (
                <p className="text-xs text-slate-600">
                  <span className="font-bold">Accuracy Info:</span> {backgroundInfo.accuracyInfo}
                </p>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-2">Fulfilled</p>
              <p className="text-3xl font-black text-green-600">{fulfilledCount}</p>
              <p className="text-[10px] font-bold text-green-700 mt-1">{claimantClaims.length > 0 ? Math.round((fulfilledCount/claimantClaims.length)*100) : 0}%</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-4 border border-red-200">
              <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">Disproven</p>
              <p className="text-3xl font-black text-red-600">{disprovenCount}</p>
              <p className="text-[10px] font-bold text-red-700 mt-1">{claimantClaims.length > 0 ? Math.round((disprovenCount/claimantClaims.length)*100) : 0}%</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Ongoing</p>
              <p className="text-3xl font-black text-blue-600">{ongoingCount}</p>
              <p className="text-[10px] font-bold text-blue-700 mt-1">{claimantClaims.length > 0 ? Math.round((ongoingCount/claimantClaims.length)*100) : 0}%</p>
            </div>
          </div>

          {/* Accuracy Meter */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Track Record</h3>
            <div className="bg-slate-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-700">Historical Accuracy</span>
                <span className="text-2xl font-black text-slate-800">{claimant.accuracyRate}%</span>
              </div>
              <div className="w-full h-4 bg-slate-300 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${claimant.accuracyRate}%` }}
                />
              </div>
              <div className="flex items-center gap-2 mt-4 text-[10px] text-slate-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <span className="font-bold">Based on {claimantClaims.length} documented claims</span>
              </div>
            </div>
          </div>

          {/* Claims Summary */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Claims Overview</h3>
            <div className="space-y-3">
              {claimantClaims.slice(0, 5).map((claim, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                  <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 text-xs font-black text-white ${
                    claim.status === Status.FULFILLED ? 'bg-green-500' :
                    claim.status === Status.DISPROVEN ? 'bg-red-500' :
                    claim.status === Status.ONGOING ? 'bg-blue-500' :
                    'bg-slate-400'
                  }`}>
                    {claim.status === Status.FULFILLED ? '✓' :
                     claim.status === Status.DISPROVEN ? '✕' :
                     claim.status === Status.ONGOING ? '⟳' : '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 line-clamp-2">{claim.text}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Target: {claim.targetDate}</p>
                  </div>
                </div>
              ))}
              {claimantClaims.length > 5 && (
                <p className="text-xs font-bold text-blue-600 text-center py-2">
                  +{claimantClaims.length - 5} more claims
                </p>
              )}
            </div>
          </div>

          {/* Known Predictions from AI */}
          {backgroundInfo?.knownPredictions && backgroundInfo.knownPredictions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Known Predictions (External Sources)</h3>
              <div className="space-y-2">
                {backgroundInfo.knownPredictions.map((pred: string, i: number) => (
                  <p key={i} className="text-sm text-slate-700 p-3 bg-slate-50 rounded-lg border border-slate-200">• {pred}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-100 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-slate-200 text-slate-800 font-black rounded-xl hover:bg-slate-300 transition-all"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
