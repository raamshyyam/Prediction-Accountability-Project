
import React, { useState, useEffect } from 'react';
import { analyzeClaimDeeply, discoverClaims } from '../services/geminiService';
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
  const [screenshotUrl, setScreenshotUrl] = useState('');
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
      // We don't easily have claimant name string without lookup, 
      // but App.tsx will handle the ID link.
      setSourceUrl(editData.sources[0]?.url || '');
      setSourceType(editData.sources[0]?.type || SourceType.NEWS);
    } else {
      setText('');
      setClaimantName('');
      setCategory(Category.POLITICS);
      setTopicGroup('');
      setStatus(Status.ONGOING);
      setTargetDate('');
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleDeepAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeClaimDeeply(text, lang);
      setAiAnalysis(result);
    } catch (err) {
      console.error("Deep analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      webEvidenceLinks: aiAnalysis?.webEvidence || editData?.webEvidenceLinks || [],
      sources: [{ type: sourceType, url: sourceUrl, screenshotUrl }]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-black text-slate-800">{editData ? t.editClaim : t.addClaim}</h2>
          <button onClick={onClose} className="p-2 text-slate-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t.sourceLinks}</label>
              <input 
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-blue-500 outline-none text-sm"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t.status}</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm font-bold"
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
              >
                {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t.targetAt}</label>
              <input type="date" className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm font-bold" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
            </div>

            {!editData && (
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t.claimantName}</label>
                <input required className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm font-bold" value={claimantName} onChange={(e) => setClaimantName(e.target.value)} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t.prediction}</label>
            <textarea required rows={3} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-lg font-bold" value={text} onChange={(e) => setText(e.target.value)} />
          </div>

          <button 
            type="button"
            onClick={handleDeepAnalyze}
            disabled={isAnalyzing}
            className="w-full py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isAnalyzing && <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"/>}
            {t.aiAnalysis}
          </button>

          <div className="flex gap-4 pt-6 border-t border-slate-100">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-4 text-slate-500 font-bold">{t.cancel}</button>
            <button type="submit" className="flex-[2] px-6 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700">{editData ? t.update : t.save}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
