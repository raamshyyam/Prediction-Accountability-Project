import React, { useState, useEffect } from 'react';
import { Claim, Language, Claimant, Status } from '../types.ts';
import { translations } from '../translations.ts';
import { generateVaguenessInsight, analyzeClaimDeeply } from '../services/geminiService.ts';
 

interface ClaimDetailViewProps {
  claim: Claim;
  claimant: Claimant | undefined;
  lang: Language;
  onClose: () => void;
  onUpdateClaim?: (claim: Claim) => void;
}

export const ClaimDetailView: React.FC<ClaimDetailViewProps> = ({ claim, claimant, lang, onClose, onUpdateClaim }) => {
  const t = translations[lang];
  const [vaguenessInsight, setVaguenessInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentClaim, setCurrentClaim] = useState(claim);

  useEffect(() => {
    let isMounted = true;
    
    // Generate vagueness insight (uses local heuristic when AI is not configured)
    
    const loadInsight = async () => {
      setLoading(true);
      setError(false);
      try {
        // Add timeout: if AI call takes more than 5 seconds, skip it
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('AI insight timeout')), 5000)
        );
        
        const insightPromise = generateVaguenessInsight(currentClaim.text, currentClaim.vaguenessIndex);
        const insight = await Promise.race([insightPromise, timeoutPromise]) as string;
        
        if (isMounted) {
          setVaguenessInsight(insight);
        }
      } catch (e) {
        if (isMounted) {
          console.warn("Vagueness insight unavailable:", e);
          setVaguenessInsight('Analysis not available at this time.');
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadInsight();
    
    return () => {
      isMounted = false;
    };
  }, [currentClaim.text, currentClaim.vaguenessIndex]);

  const handleDeepAnalyze = async () => {
    if (!currentClaim.text.trim()) return;
    setLoading(true);
    try {
      const result = await analyzeClaimDeeply(currentClaim.text, lang);
      if (result) {
        const updatedClaim = {
          ...currentClaim,
          vaguenessIndex: result.vaguenessScore || currentClaim.vaguenessIndex,
          analysisParams: result.analysisParams || currentClaim.analysisParams,
          verificationVectors: result.verificationVectors || currentClaim.verificationVectors,
          webEvidenceLinks: result.webEvidence || currentClaim.webEvidenceLinks
        };
        setCurrentClaim(updatedClaim);
        if (onUpdateClaim) {
          onUpdateClaim(updatedClaim);
        }
        // Reload the insight
        const insight = await generateVaguenessInsight(currentClaim.text, result.vaguenessScore || currentClaim.vaguenessIndex);
        setVaguenessInsight(insight);
      }
    } catch (err) {
      console.error("Deep analysis failed", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getVaguenessColor = (score: number) => {
    if (score >= 8) return 'from-red-500 to-orange-500';
    if (score >= 5) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-emerald-500';
  };

  const getVaguenessLabel = (score: number) => {
    if (score >= 8) return 'Very Vague';
    if (score >= 6) return 'Somewhat Vague';
    if (score >= 4) return 'Moderately Clear';
    return 'Very Clear';
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-start text-white z-10">
          <div>
            <h2 className="text-2xl font-black mb-2">Claim Details</h2>
            <p className="text-blue-100 text-sm">{currentClaim.category}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Main Claim */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">The Claim</h3>
            <p className="text-xl font-bold text-slate-900 leading-relaxed">{currentClaim.text}</p>
          </div>

          {/* Claimant Info */}
          {claimant && (
            <div className="flex gap-4 items-start bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6">
              <img 
                src={claimant.photoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(claimant.name)} 
                alt={claimant.name} 
                className="w-16 h-16 rounded-full border-3 border-white shadow-md" 
              />
              <div className="flex-1">
                <h4 className="text-lg font-black text-slate-800 mb-1">{claimant.name}</h4>
                <p className="text-sm text-slate-600 mb-3">{claimant.bio}</p>
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Accuracy Rate</p>
                    <p className="text-lg font-black text-green-600">{claimant.accuracyRate}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Total Claims</p>
                    <p className="text-lg font-black text-blue-600">{claimant.totalClaims}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Affiliation</p>
                    <p className="text-sm font-bold text-slate-700">{claimant.affiliation}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vagueness Analysis */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Vagueness Analysis</h3>
            <div className={`bg-gradient-to-r ${getVaguenessColor(currentClaim.vaguenessIndex)} rounded-2xl p-6 text-white`}>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-4xl font-black">{currentClaim.vaguenessIndex}/10</p>
                  <p className="text-white/80 text-sm font-bold">{getVaguenessLabel(currentClaim.vaguenessIndex)}</p>
                </div>
                <div className="w-24 h-24 rounded-full flex items-center justify-center bg-white/20">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-4">
                {loading ? 'Analyzing vagueness...' : vaguenessInsight || 'This claim contains several vague elements that make verification difficult.'}
              </p>
              {isAIConfigured() && (
                <button 
                  onClick={handleDeepAnalyze} 
                  disabled={loading}
                  className="w-full mt-4 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white font-bold rounded-lg transition-all text-sm flex items-center justify-center gap-2"
                >
                  {loading && <div className="animate-spin w-3 h-3 border-2 border-white/30 border-t-white rounded-full"/>}
                  {loading ? 'Analyzing...' : 'Re-Analyze Vagueness'}
                </button>
              )}
            </div>
          </div>

          {/* Verification Parameters */}
          {currentClaim.analysisParams && Array.isArray(currentClaim.analysisParams) && currentClaim.analysisParams.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Verifiability Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentClaim.analysisParams.map((param, i) => {
                  if (!param || typeof param !== 'object') return null;
                  const isFulfilled = Boolean(param.fulfilled);
                  return (
                    <div key={i} className={`rounded-lg p-3 flex items-center gap-3 ${isFulfilled ? 'bg-green-50 border border-green-200' : 'bg-slate-50 border border-slate-200'}`}>
                      <div className={`w-6 h-6 rounded flex items-center justify-center text-sm font-bold ${isFulfilled ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                        {isFulfilled ? '✓' : '○'}
                      </div>
                      <span className={`text-sm ${isFulfilled ? 'text-green-900 font-bold' : 'text-slate-600'}`}>
                        {param.label || 'Parameter'}
                      </span>
                    </div>
                  );
                <button 
                  onClick={handleDeepAnalyze} 
                  disabled={loading}
                  className="w-full mt-4 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white font-bold rounded-lg transition-all text-sm flex items-center justify-center gap-2"
                >
                  {loading && <div className="animate-spin w-3 h-3 border-2 border-white/30 border-t-white rounded-full"/>}
                  {loading ? 'Analyzing...' : 'Re-Analyze Vagueness'}
                </button>
                  if (!vector || typeof vector !== 'object') return null;
                  const verdict = vector.verdict || 'Inconclusive';
                  const confidence = typeof vector.confidence === 'number' ? Math.max(0, Math.min(1, vector.confidence)) : 0.5;
                  return (
                    <div key={i} className="border-l-4 border-blue-500 bg-slate-50 rounded-r-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800">{vector.modelName || 'Model'}</h4>
                        <span className={`text-xs font-black px-2 py-1 rounded uppercase ${
                          verdict === 'Fulfilled' ? 'bg-green-100 text-green-700' :
                          verdict === 'Disproven' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {verdict}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{vector.reasoning || 'No reasoning provided'}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">Confidence:</span>
                        <div className="flex-1 h-2 bg-slate-300 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${confidence * 100}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{Math.round(confidence * 100)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Evidence & Sources */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Sources & Evidence</h3>
            
            {/* Original Sources */}
            {currentClaim.sources && Array.isArray(currentClaim.sources) && currentClaim.sources.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Claim Sources</h4>
                {currentClaim.sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors group"
                  >
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider mb-1">{source.type}</p>
                      <p className="text-sm font-bold text-blue-900 truncate group-hover:text-clip">{source.url}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* Web Evidence */}
            {currentClaim.webEvidenceLinks && Array.isArray(currentClaim.webEvidenceLinks) && currentClaim.webEvidenceLinks.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Related Evidence</h4>
                {currentClaim.webEvidenceLinks.map((evidence, i) => (
                  <a
                    key={i}
                    href={evidence.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors group"
                  >
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-green-900 mb-0.5">{evidence.title}</p>
                      <p className="text-[10px] text-green-700 truncate">{evidence.url}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Status & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status</p>
              <p className={`text-lg font-black ${
                currentClaim.status === Status.FULFILLED ? 'text-green-600' :
                currentClaim.status === Status.DISPROVEN ? 'text-red-600' :
                currentClaim.status === Status.ONGOING ? 'text-blue-600' :
                'text-slate-600'
              }`}>{currentClaim.status}</p>
              {currentClaim.status === Status.ONGOING && (
                <div className="mt-3 flex items-center gap-2 text-blue-600">
                  <div className="animate-spin w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full" />
                  <span className="text-xs font-bold">Monitoring in progress...</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Timeline</p>
              <div className="space-y-2 text-sm">
                <p className="text-slate-700"><span className="font-bold">Made:</span> {currentClaim.dateMade}</p>
                <p className="text-slate-700"><span className="font-bold">Target:</span> {currentClaim.targetDate}</p>
              </div>
            </div>
          </div>

          {currentClaim.history && Array.isArray(currentClaim.history) && currentClaim.history.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Claim History</h3>
              <div className="space-y-3">
                {currentClaim.history.map((version, i) => (
                  <div key={i} className="border-l-2 border-slate-300 pl-4 py-2">
                    <p className="text-[10px] font-bold text-slate-500 mb-1">{new Date(version.timestamp).toLocaleDateString()}</p>
                    <p className="text-sm text-slate-700 font-medium">{version.text}</p>
                    <p className="text-xs text-slate-500 mt-1">Status: <span className="font-bold">{version.status}</span> • Vagueness: <span className="font-bold">{version.vaguenessIndex}/10</span></p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-100 p-6 flex gap-3 border-t border-slate-200">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-200 text-slate-800 font-black rounded-xl hover:bg-slate-300 transition-all"
          >
            Close
          </button>
          {onUpdateClaim && (
            <button
              onClick={() => {
                onClose();
                // Trigger edit if callback provided
              }}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all"
            >
              Edit Claim
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
