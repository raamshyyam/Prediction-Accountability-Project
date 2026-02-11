
import React, { useState } from 'react';
import { Claim, Language, AnalysisParameter } from '../types.ts';
import { translations } from '../translations.ts';

interface Props {
  claim: Claim;
  lang: Language;
  onUpdateParams: (params: AnalysisParameter[]) => void;
}

export const ClaimAnalysis: React.FC<Props> = ({ claim, lang, onUpdateParams }) => {
  const t = translations[lang];
  const [newParamLabel, setNewParamLabel] = useState('');
  const analysisParams = Array.isArray(claim.analysisParams) ? claim.analysisParams : [];
  const verificationVectors = Array.isArray(claim.verificationVectors) ? claim.verificationVectors : [];

  const toggleParam = (index: number) => {
    const next = [...analysisParams];
    if (!next[index]) return;
    next[index].fulfilled = !next[index].fulfilled;
    onUpdateParams(next);
  };

  const addHumanParam = () => {
    if (!newParamLabel.trim()) return;
    const next = [
      ...analysisParams,
      { label: newParamLabel, fulfilled: false, isHumanAdded: true }
    ];
    onUpdateParams(next);
    setNewParamLabel('');
  };

  return (
    <div className="mt-6 border-t border-slate-100 pt-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex justify-between">
            {t.vagueBoxes}
            <span className="text-blue-600">
              {analysisParams.filter(p => p.fulfilled).length}/{analysisParams.length}
            </span>
          </h4>
          <div className="space-y-2 mb-4">
            {analysisParams.map((param, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs group cursor-pointer"
                onClick={() => toggleParam(i)}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${param.fulfilled ? 'bg-green-500 text-white shadow-sm' : 'bg-slate-100 text-slate-300'}`}>
                  {param.fulfilled ? '✓' : '×'}
                </div>
                <span className={`flex-1 ${param.fulfilled ? 'text-slate-700 font-bold' : 'text-slate-400 font-medium'}`}>
                  {param.label}
                  {param.isHumanAdded && <span className="ml-2 text-[8px] bg-amber-100 text-amber-600 px-1 rounded">HUMAN</span>}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
              placeholder={t.addParam}
              value={newParamLabel}
              onChange={(e) => setNewParamLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addHumanParam()}
            />
            <button
              onClick={addHumanParam}
              className="px-3 py-2 bg-blue-600 text-white text-[10px] font-bold rounded-lg hover:bg-blue-700"
            >
              ADD
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{t.vectors}</h4>
          <div className="space-y-3">
            {verificationVectors.map((vector, i) => (
              <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-800">{vector.modelName}</span>
                  <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${vector.verdict === 'Fulfilled' ? 'bg-green-100 text-green-700' :
                      vector.verdict === 'Disproven' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {vector.verdict}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">{vector.reasoning}</p>
                <div className="mt-2 w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${vector.confidence * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          {claim.history && claim.history.length > 0 && (
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{t.history}</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {claim.history.map((rev, i) => (
                  <div key={i} className="text-[10px] bg-slate-50 border border-slate-100 p-2 rounded-lg">
                    <div className="flex justify-between font-bold text-slate-400 mb-1">
                      <span>{new Date(rev.timestamp).toLocaleString(lang === 'ne' ? 'ne-NP' : 'en-US')}</span>
                      <span className="text-blue-500 uppercase">{rev.status}</span>
                    </div>
                    <p className="text-slate-600 italic">"{rev.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {claim.webEvidenceLinks && claim.webEvidenceLinks.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">{t.evidence}</h4>
          <div className="flex flex-wrap gap-2">
            {claim.webEvidenceLinks.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {link.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
