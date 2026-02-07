import React, { useState } from 'react';
import { Language } from '../types.ts';
import { translations } from '../translations.ts';

interface ManifestoDocument {
  id: string;
  party: string;
  year: number;
  uploadDate: string;
  extractedClaims: ManifestoClaim[];
  content?: string;
}

interface ManifestoClaim {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  status: 'pending' | 'fulfilled' | 'failed' | 'ongoing';
  progressPercentage: number;
  evidenceUrl?: string;
  notes?: string;
}

interface ManifestoTrackerProps {
  lang: Language;
}

export const ManifestoTracker: React.FC<ManifestoTrackerProps> = ({ lang }) => {
  const t = translations[lang];
  const [manifestos, setManifestos] = useState<ManifestoDocument[]>([]);
  const [selectedManifesto, setSelectedManifesto] = useState<ManifestoDocument | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadParty, setUploadParty] = useState('');
  const [uploadYear, setUploadYear] = useState(new Date().getFullYear());
  const [uploadContent, setUploadContent] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // Simple fallback: show user the PDF was selected but requires manual extraction
    // In production, you'd install pdfjs-dist: npm install pdfjs-dist
    const fileName = file.name;
    return `[Extracted from: ${fileName}]\n\nTo extract PDF content:\n1. Install dependency: npm install pdfjs-dist\n2. Or paste the PDF text manually below`;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert(lang === 'ne' ? 'कृपया PDF फाइल चयन गर्नुहोस्' : 'Please select a PDF file');
      return;
    }

    setIsProcessing(true);
    try {
      const text = await extractTextFromPDF(file);
      setUploadContent(text);
      setUploadFile(file);
    } catch (error) {
      console.error('Error extracting PDF:', error);
      alert(lang === 'ne' ? 'PDF पार्स गर्न त्रुटि' : 'Error parsing PDF. Please paste text manually.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadManifesto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadParty.trim() || !uploadContent.trim()) return;

    setIsProcessing(true);
    try {
      // TODO: Add AI-powered claim extraction
      const newManifesto: ManifestoDocument = {
        id: `manifesto-${Date.now()}`,
        party: uploadParty,
        year: uploadYear,
        uploadDate: new Date().toISOString(),
        extractedClaims: [],
        content: uploadContent
      };
      
      setManifestos([...manifestos, newManifesto]);
      setShowUploadModal(false);
      setUploadParty('');
      setUploadContent('');
    } catch (error) {
      console.error('Error uploading manifesto:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateClaimStatus = (manifestoId: string, claimId: string, status: ManifestoClaim['status'], progress: number) => {
    setManifestos(manifestos.map(m => {
      if (m.id === manifestoId) {
        return {
          ...m,
          extractedClaims: m.extractedClaims.map(c => 
            c.id === claimId ? { ...c, status, progressPercentage: progress } : c
          )
        };
      }
      return m;
    }));
  };

  const getCompletionPercentage = (manifesto: ManifestoDocument) => {
    if (manifesto.extractedClaims.length === 0) return 0;
    const fulfilled = manifesto.extractedClaims.filter(c => c.status === 'fulfilled').length;
    return Math.round((fulfilled / manifesto.extractedClaims.length) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Manifesto Tracker 📋</h2>
          <p className="text-slate-600">Track political party manifesto promises and their fulfillment</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="px-8 py-3 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all shadow-lg flex items-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Upload Manifesto
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-black text-slate-800">Upload Party Manifesto</h2>
              <button onClick={() => setShowUploadModal(false)} className="p-2 text-slate-400 hover:text-slate-800 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleUploadManifesto} className="p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Party Name *</label>
                <input 
                  required 
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 text-sm font-bold focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none transition-all" 
                  value={uploadParty} 
                  onChange={(e) => setUploadParty(e.target.value)}
                  placeholder="e.g., Nepali Congress, NCP"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Election Year *</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 text-sm font-bold focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none transition-all"
                  value={uploadYear}
                  onChange={(e) => setUploadYear(Number(e.target.value))}
                >
                  <option value={2022}>2022 Election</option>
                  <option value={2026}>2026 Election</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Manifesto Content * (PDF or Text)</label>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <label className="flex-1 cursor-pointer">
                      <div className="px-4 py-3 rounded-xl border-2 border-dashed border-purple-300 bg-purple-50 text-center hover:bg-purple-100 transition-all">
                        <input 
                          type="file" 
                          accept=".pdf"
                          onChange={handleFileSelect}
                          disabled={isProcessing}
                          className="hidden"
                        />
                        <p className="text-sm font-bold text-purple-700">
                          {uploadFile ? `📄 ${uploadFile.name}` : '📤 Click to upload PDF'}
                        </p>
                      </div>
                    </label>
                    {uploadFile && (
                      <button 
                        type="button"
                        onClick={() => {
                          setUploadFile(null);
                          setUploadContent('');
                        }}
                        className="px-4 py-3 rounded-xl bg-red-100 text-red-700 font-bold hover:bg-red-200 transition-all"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="px-2 bg-white text-slate-500 font-bold">Or paste text</span>
                    </div>
                  </div>

                  <textarea 
                    rows={6} 
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 text-sm font-medium focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none transition-all" 
                    value={uploadContent} 
                    onChange={(e) => setUploadContent(e.target.value)}
                    placeholder="Paste the manifesto text here if not uploading PDF..."
                  />
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
                <p className="text-sm text-purple-700">
                  <span className="font-bold">AI Processing:</span> The system will automatically extract key promises and claims from the manifesto and create tracking items.
                </p>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowUploadModal(false)} className="flex-1 px-6 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                <button type="submit" disabled={isProcessing} className="flex-[2] px-6 py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {isProcessing && <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"/>}
                  {isProcessing ? 'Processing...' : 'Upload & Extract'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manifestos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {manifestos.map(manifesto => (
          <div 
            key={manifesto.id}
            onClick={() => setSelectedManifesto(manifesto)}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
              <h3 className="text-xl font-black mb-2">{manifesto.party}</h3>
              <p className="text-sm text-white/80 font-bold">{manifesto.year} Election Manifesto</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-600">Fulfillment Progress</span>
                  <span className="text-lg font-black text-slate-800">{getCompletionPercentage(manifesto)}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${getCompletionPercentage(manifesto)}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Claims</p>
                  <p className="text-xl font-black text-slate-700">{manifesto.extractedClaims.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Fulfilled</p>
                  <p className="text-xl font-black text-green-600">{manifesto.extractedClaims.filter(c => c.status === 'fulfilled').length}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Pending</p>
                  <p className="text-xl font-black text-yellow-600">{manifesto.extractedClaims.filter(c => c.status === 'pending').length}</p>
                </div>
              </div>

              <button className="w-full py-3 bg-purple-50 text-purple-700 font-bold rounded-lg hover:bg-purple-100 transition-colors mt-4 group-hover:bg-purple-100">
                View Details →
              </button>
            </div>
          </div>
        ))}

        {manifestos.length === 0 && (
          <div className="col-span-full text-center py-16">
            <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C6.228 6.253 2 10.507 2 15.5S6.228 24.747 12 24.747s10-4.254 10-9.247S17.772 6.253 12 6.253z" /></svg>
            <h3 className="text-lg font-bold text-slate-600 mb-2">No Manifestos Yet</h3>
            <p className="text-slate-500 mb-4">Upload political party manifestos to start tracking their promises</p>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="inline-block px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all"
            >
              Upload First Manifesto
            </button>
          </div>
        )}
      </div>

      {/* Detail View */}
      {selectedManifesto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-black">{selectedManifesto.party}</h2>
                <p className="text-purple-100 text-sm">{selectedManifesto.year} Election Manifesto</p>
              </div>
              <button onClick={() => setSelectedManifesto(null)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {selectedManifesto.extractedClaims.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-600 mb-4">No claims extracted yet. AI processing is coming soon.</p>
                  <p className="text-sm text-slate-500">Please check back after the manifesto is processed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedManifesto.extractedClaims.map(claim => (
                    <div key={claim.id} className="border border-slate-200 rounded-xl p-4 hover:border-purple-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-bold text-slate-800 mb-1">{claim.text}</p>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            claim.priority === 'high' ? 'bg-red-100 text-red-700' :
                            claim.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {claim.priority.toUpperCase()} Priority
                          </span>
                        </div>
                        <select 
                          value={claim.status}
                          onChange={(e) => updateClaimStatus(selectedManifesto.id, claim.id, e.target.value as any, claim.progressPercentage)}
                          className="px-3 py-2 rounded-lg border border-slate-200 font-bold text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="fulfilled">Fulfilled</option>
                          <option value="failed">Failed</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-bold text-slate-600">Progress</span>
                            <span className="text-xs font-bold text-slate-800">{claim.progressPercentage}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={claim.progressPercentage}
                            onChange={(e) => updateClaimStatus(selectedManifesto.id, claim.id, claim.status, Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer"
                          />
                        </div>
                      </div>

                      {claim.notes && (
                        <p className="text-sm text-slate-600 mt-3 p-3 bg-slate-50 rounded-lg">{claim.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-slate-100 p-6 border-t border-slate-200">
              <button
                onClick={() => setSelectedManifesto(null)}
                className="w-full px-6 py-3 bg-slate-200 text-slate-800 font-black rounded-xl hover:bg-slate-300 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
