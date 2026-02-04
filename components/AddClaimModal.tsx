
import React, { useState, useEffect } from 'react';
import { analyzeClaimDeeply } from '../services/geminiService';
import { Category, Status, SourceType, Language, Claim } from '../types';
import { translations } from '../translations';

interface AddClaimModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
  onAdd: (claim: any) => void;
  editData?: Claim | null;
}

export const AddClaimModal: React.FC<AddClaimModalProps> = ({ isOpen, lang, onClose, onAdd, editData }) => {
  const [text, setText] = useState('');
  const [claimantName, setClaimantName] = useState('');
  const [category, setCategory] = useState<Category>(Category.POLITICS);
  const [topicGroup, setTopicGroup] = useState('');
  const [status, setStatus] = useState<Status>(Status.ONGOING);
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceType, setSourceType] = useState<SourceType>(SourceType.NEWS);
  const [targetDate, setTargetDate] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const t = translations[lang];

  useEffect(() => {
    if (editData) {
      setText(editData.text);
      setCategory(editData.category);
      setTopicGroup(editData.topicGroup || '');
      setStatus(editData.status);
      setTargetDate(editData.targetDate);
      setSourceUrl(editData.sources[0]?.url || '');
      setSourceType(editData.sources[0]?.type || SourceType.NEWS);
    } else {
      setText('');
      setClaimantName('');
      setCategory(Category.POLITICS);
      setTopicGroup('');
      setStatus(Status.ONGOING);
      setTargetDate('');
      setSourceUrl('');
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleDeepAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeClaimDeeply(text, lang);
      if (result) setAiAnalysis(result);
    } catch (err) {
      console.error("Deep analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fix: Consolidate webEvidence from JSON with actual search groundingChunks as required
    const groundingLinks = aiAnalysis?.groundingLinks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Search Grounding Result',
      url: chunk.web?.uri
    })).filter((l: any) => l.url) || [];

    const finalEvidence = [
      ...(aiAnalysis?.webEvidence || []),
      ...groundingLinks
    ];

    onAdd({
      ...(editData || {}),
      text,
      claimantName,
      category,
      topicGroup,
      status,
      targetDate,
      vaguenessIndex: aiAnalysis?.vaguenessScore || editData?.vaguenessIndex || 5,
      analysisParams: aiAnalysis?.analysisParams || editData?.analysisParams || [],
      verificationVectors: aiAnalysis?.verificationVectors || editData?.verificationVectors || [],
      webEvidenceLinks: finalEvidence.length > 0 ? finalEvidence : (editData?.webEvidenceLinks || []),
      sources: [{ type: sourceType, url: sourceUrl }]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-black text-slate-800">{editData ? t.editClaim : t.addClaim}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t.sourceLinks}</label>
              <input 
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 focus:border-blue-500 bg-slate-50 outline-none text-sm font-bold"
                value={sourceUrl}
                placeholder="https://..."
                onChange={(e) => setSourceUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t.category}</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 text-sm font-bold"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                {Object.values(Category).map(c => (
                  <option key={c} value={c}>{t.categories[c as keyof typeof t.categories] || c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t.status}</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 text-sm font-bold"
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
              >
                {Object.values(Status).map(s => (
                  <option key={s} value={s}>{t.statuses[s as keyof typeof t.statuses] || s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t.targetAt}</label>
              <input type="date" className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 text-sm font-bold" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
            </div>

            {!editData && (
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t.claimantName}</label>
                <input required className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 text-sm font-bold" value={claimantName} onChange={(e) => setClaimantName(e.target.value)} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t.prediction}</label>
            <textarea required rows={3} className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 text-base font-bold" value={text} onChange={(e) => setText(e.target.value)} />
          </div>

          <button 
            type="button"
            onClick={handleDeepAnalyze}
            disabled={isAnalyzing}
            className="w-full py-3.5 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-3 transition-all text-sm"
          >
            {isAnalyzing && <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"/>}
            {t.aiAnalysis}
          </button>

          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">{t.cancel}</button>
            <button type="submit" className="flex-[2] px-6 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all">{editData ? t.update : t.save}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
