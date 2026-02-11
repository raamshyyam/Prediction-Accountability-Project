
import React, { useState, useEffect } from 'react';
import { analyzeClaimDeeply } from '../services/geminiService.ts';
import { Category, Status, SourceType, Language, Claim, ClaimSource } from '../types.ts';
import { translations } from '../translations.ts';

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
  const [sources, setSources] = useState<ClaimSource[]>([{ type: SourceType.NEWS, url: '' }]);
  const [targetDate, setTargetDate] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [description, setDescription] = useState('');
  const t = translations[lang];

  useEffect(() => {
    if (editData) {
      setText(editData.text);
      setCategory(editData.category);
      setTopicGroup(editData.topicGroup || '');
      setStatus(editData.status);
      setTargetDate(editData.targetDate);
      setSources(Array.isArray(editData.sources) && editData.sources.length > 0 ? editData.sources : [{ type: SourceType.NEWS, url: '' }]);
      setDescription('');
    } else {
      setText('');
      setClaimantName('');
      setCategory(Category.POLITICS);
      setTopicGroup('');
      setStatus(Status.ONGOING);
      setTargetDate('');
      setSources([{ type: SourceType.NEWS, url: '' }]);
      setDescription('');
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const calculateVagueness = (claimText: string): number => {
    if (!claimText || !claimText.trim()) return 5;
    const len = claimText.length;
    const numbers = (claimText.match(/\d{3,}|\d+/g)|| []).length;
    const dates = (/\b(19|20)\d{2}\b/.test(claimText) ? 1 : 0) + (/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(claimText) ? 1 : 0);
    const named = /[A-Z][a-z]+\s[A-Z][a-z]+/.test(claimText) ? 1 : 0;
    // lower vagueness (clearer) if numbers/dates/names present
    let score = 10 - Math.min(8, numbers + dates + named + Math.round(len / 140));
    if (score < 1) score = 1;
    if (score > 10) score = 10;
    return score;
  };

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

  const addSource = () => {
    setSources([...sources, { type: SourceType.NEWS, url: '' }]);
  };

  const removeSource = (index: number) => {
    setSources(sources.filter((_, i) => i !== index));
  };

  const updateSource = (index: number, field: 'url' | 'type', value: string) => {
    const updated = [...sources];
    updated[index] = { ...updated[index], [field]: value };
    setSources(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalEvidence = aiAnalysis?.webEvidence || editData?.webEvidenceLinks || [];

    onAdd({
      ...(editData || {}),
      text,
      claimantName,
      category,
      topicGroup,
      status,
      targetDate,
      description,
      vaguenessIndex: aiAnalysis?.vaguenessScore || editData?.vaguenessIndex || calculateVagueness(text),
      analysisParams: aiAnalysis?.analysisParams || editData?.analysisParams || [],
      verificationVectors: aiAnalysis?.verificationVectors || editData?.verificationVectors || [],
      webEvidenceLinks: finalEvidence.length > 0 ? finalEvidence : [],
      sources: sources.filter(s => s.url.trim())
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-black text-slate-800">{editData ? t.editClaim : 'Record New Claim'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Main Claim Text */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t.prediction} *</label>
            <textarea 
              required 
              rows={4} 
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 text-base font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all" 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the exact claim or prediction made..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Additional Context</label>
            <textarea 
              rows={2} 
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 text-sm font-medium focus:border-blue 500 focus:ring-1 focus:ring-blue-200 outline-none transition-all" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any additional context or background information..."
            />
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!editData && (
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t.claimantName} *</label>
                <input 
                  required 
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 text-sm font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all" 
                  value={claimantName} 
                  onChange={(e) => setClaimantName(e.target.value)}
                  placeholder="Full name of the person making the claim"
                />
              </div>
            )}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t.category} *</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 text-sm font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all" 
                value={category} 
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                {Object.values(Category).map(c => (
                  <option key={c} value={c}>{t.categories[c as keyof typeof t.categories] || c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Topic/Subject *</label>
              <input 
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 text-sm font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all" 
                value={topicGroup} 
                onChange={(e) => setTopicGroup(e.target.value)}
                placeholder="e.g., Economic Growth, Political Alignment"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t.status} *</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 text-sm font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all" 
                value={status} 
                onChange={(e) => setStatus(e.target.value as Status)}
              >
                {Object.values(Status).map(s => (
                  <option key={s} value={s}>{t.statuses[s as keyof typeof t.statuses] || s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t.recordedAt} *</label>
              <input 
                type="date" 
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 text-sm font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all" 
                value={editData ? editData.dateMade : new Date().toISOString().split('T')[0]}
                disabled={!!editData}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t.targetAt} *</label>
              <input 
                type="date" 
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 text-sm font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all" 
                value={targetDate} 
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
          </div>

          {/* Sources */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Sources & References</label>
              <button
                type="button"
                onClick={addSource}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                Add Source
              </button>
            </div>
            {sources.map((source, i) => (
              <div key={i} className="flex gap-2 items-end">
                <div className="flex-1">
                  <input 
                    type="url"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 text-sm font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all" 
                    placeholder="https://..." 
                    value={source.url}
                    onChange={(e) => updateSource(i, 'url', e.target.value)}
                  />
                </div>
                <select 
                  className="px-3 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 text-sm font-bold focus:border-blue-500 outline-none transition-all"
                  value={source.type}
                  onChange={(e) => updateSource(i, 'type', e.target.value)}
                >
                  {Object.values(SourceType).map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                {sources.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSource(i)}
                    className="px-3 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* AI Analysis */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
            <button 
              type="button" 
              onClick={handleDeepAnalyze} 
              disabled={isAnalyzing} 
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 flex items-center justify-center gap-3 transition-all text-sm"
            >
              {isAnalyzing && <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"/>}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              {isAnalyzing ? 'Analyzing...' : 'AI Deep Analysis'}
            </button>
            {aiAnalysis && (
              <div className="mt-3 text-xs text-purple-700 space-y-1">
                <p><span className="font-bold">Vagueness Score:</span> {aiAnalysis.vaguenessScore}/10</p>
                <p><span className="font-bold">Parameters identified:</span> {aiAnalysis.analysisParams?.length || 0}</p>
                <p><span className="font-bold">Verification models:</span> {aiAnalysis.verificationVectors?.length || 0}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">{t.cancel}</button>
            <button type="submit" className="flex-[2] px-6 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all">{editData ? t.update : t.save}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
