import React, { useState, useEffect } from 'react';
import { Claimant, Claim, Language, Status } from '../types.ts';
import { translations } from '../translations.ts';
import { searchClaimantBackground } from '../services/geminiService.ts';
import { isAIConfigured } from '../utils/aiConfig.ts';

interface ClaimantProfileProps {
  claimant: Claimant;
  claims: Claim[];
  lang: Language;
  onClose: () => void;
  onUpdateClaimant?: (claimant: Claimant) => void;
}

export const ClaimantProfile: React.FC<ClaimantProfileProps> = ({ claimant, claims, lang, onClose, onUpdateClaimant }) => {
  const t = translations[lang];
  const [backgroundInfo, setBackgroundInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedClaimant, setEditedClaimant] = useState<Claimant>(claimant);

  useEffect(() => {
    let isMounted = true;
    
    // Skip AI loading if not configured
    if (!isAIConfigured()) {
      setBackgroundInfo(null);
      setLoading(false);
      return;
    }
    
    const loadBackground = async () => {
      setLoading(true);
      try {
        // Add timeout: if AI call takes more than 10 seconds, skip it
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Background search timeout')), 10000)
        );
        
        const infoPromise = searchClaimantBackground(editedClaimant.name);
        const info = await Promise.race([infoPromise, timeoutPromise]);
        
        if (isMounted) {
          setBackgroundInfo(info);
        }
      } catch (e) {
        if (isMounted) {
          console.warn("Failed to load claimant background:", e);
          setBackgroundInfo(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadBackground();
    
    return () => {
      isMounted = false;
    };
  }, [editedClaimant.name]);

  const claimantClaims = claims.filter(c => c.claimantId === editedClaimant.id);
  const fulfilledCount = claimantClaims.filter(c => c.status === Status.FULFILLED).length;
  const disprovenCount = claimantClaims.filter(c => c.status === Status.DISPROVEN).length;
  const ongoingCount = claimantClaims.filter(c => c.status === Status.ONGOING).length;

  const accuracyPercentage = claimantClaims.length > 0 
    ? Math.round((fulfilledCount / claimantClaims.length) * 100) 
    : 0;

  const handleSaveChanges = () => {
    if (onUpdateClaimant) {
      onUpdateClaimant(editedClaimant);
    }
    setIsEditMode(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Convert image to base64 for storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setEditedClaimant({ ...editedClaimant, photoUrl: base64String });
    };
    reader.readAsDataURL(file);
  };

  const handleReloadBackground = async () => {
    setLoading(true);
    try {
      const info = await searchClaimantBackground(editedClaimant.name);
      if (info) {
        setBackgroundInfo(info);
        // Optionally update affiliation if not already set
        if (info.role && editedClaimant.affiliation === 'Independent') {
          setEditedClaimant({ ...editedClaimant, affiliation: info.role });
        }
      }
    } catch (e) {
      console.warn("Failed to reload background:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-8 flex justify-between items-start text-white z-10">
          <div className="flex items-start gap-4 flex-1">
            <div className="relative group">
              <img 
                src={editedClaimant.photoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(editedClaimant.name)} 
                alt={editedClaimant.name} 
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg" 
              />
              {isEditMode && (
                <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="text-white font-bold text-sm">📸</span>
                </label>
              )}
            </div>
            <div>
              {isEditMode ? (
                <input 
                  type="text"
                  value={editedClaimant.name}
                  onChange={(e) => setEditedClaimant({ ...editedClaimant, name: e.target.value })}
                  className="text-2xl font-black mb-1 bg-purple-700 text-white rounded px-2 py-1"
                />
              ) : (
                <h2 className="text-2xl font-black mb-1">{editedClaimant.name}</h2>
              )}
              {isEditMode ? (
                <input 
                  type="text"
                  value={editedClaimant.affiliation}
                  onChange={(e) => setEditedClaimant({ ...editedClaimant, affiliation: e.target.value })}
                  className="text-purple-100 mb-2 bg-purple-700 text-white rounded px-2 py-1 w-full"
                />
              ) : (
                <p className="text-purple-100 mb-2">{editedClaimant.affiliation}</p>
              )}
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
          <div className="flex gap-2">
            {isEditMode ? (
              <>
                <button 
                  onClick={() => setIsEditMode(false)} 
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Cancel"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <button 
                  onClick={handleSaveChanges} 
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Save changes"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditMode(true)} 
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Edit profile"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Bio */}
          {editedClaimant.bio && (
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Biography</h3>
              {isEditMode ? (
                <textarea 
                  value={editedClaimant.bio}
                  onChange={(e) => setEditedClaimant({ ...editedClaimant, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 bg-blue-50 text-slate-700 font-medium leading-relaxed focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-slate-700 leading-relaxed">{editedClaimant.bio}</p>
              )}
            </div>
          )}

          {/* Tags */}
          {editedClaimant.tags.length > 0 && (
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Expertise Areas</h3>
              <div className="flex flex-wrap gap-2">
                {editedClaimant.tags.map((tag, i) => (
                  <div key={i} className="relative group">
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-black rounded-full">
                      {tag}
                    </span>
                    {isEditMode && (
                      <button
                        onClick={() => setEditedClaimant({ ...editedClaimant, tags: editedClaimant.tags.filter((_, idx) => idx !== i) })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove tag"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {isEditMode && (
                  <input 
                    type="text"
                    placeholder="Add tag..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                        setEditedClaimant({ 
                          ...editedClaimant, 
                          tags: [...editedClaimant.tags, (e.target as HTMLInputElement).value.trim()] 
                        });
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-black rounded-full border border-blue-300 focus:outline-none focus:border-blue-500"
                  />
                )}
              </div>
            </div>
          )}

          {/* Background Info from AI */}
          {backgroundInfo && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">AI Research Summary</h3>
                {isAIConfigured() && !isEditMode && (
                  <button 
                    onClick={handleReloadBackground}
                    disabled={loading}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 disabled:opacity-50 flex items-center gap-1"
                  >
                    {loading && <div className="animate-spin w-3 h-3 border-2 border-amber-600 border-t-transparent rounded-full"/>}
                    Reload
                  </button>
                )}
              </div>
              {backgroundInfo.bio && (
                <p className="text-sm text-slate-700 mb-4">{backgroundInfo.bio}</p>
              )}
              {backgroundInfo.affiliations && backgroundInfo.affiliations.length > 0 && (
                <p className="text-xs text-slate-600 mb-3">
                  <span className="font-bold">Affiliations:</span> {Array.isArray(backgroundInfo.affiliations) ? backgroundInfo.affiliations.join(', ') : backgroundInfo.affiliations}
                </p>
              )}
              {backgroundInfo.accuracyInfo && (
                <p className="text-xs text-slate-600">
                  <span className="font-bold">Accuracy Info:</span> {backgroundInfo.accuracyInfo}
                </p>
              )}
              {backgroundInfo.role && (
                <p className="text-xs text-slate-600 mt-3">
                  <span className="font-bold">Detected Role:</span> {backgroundInfo.role}
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
        <div className="sticky bottom-0 bg-slate-100 p-6 border-t border-slate-200 flex gap-3">
          {isEditMode ? (
            <>
              <button
                onClick={() => setIsEditMode(false)}
                className="flex-1 px-6 py-3 bg-slate-200 text-slate-800 font-black rounded-xl hover:bg-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-slate-200 text-slate-800 font-black rounded-xl hover:bg-slate-300 transition-all"
            >
              Close Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
