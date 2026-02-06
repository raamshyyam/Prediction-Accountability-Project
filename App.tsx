
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { ClaimCard } from './components/ClaimCard.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { AddClaimModal } from './components/AddClaimModal.tsx';
import { ClaimDetailView } from './components/ClaimDetailView.tsx';
import { ClaimantProfile } from './components/ClaimantProfile.tsx';
import { MOCK_CLAIMS, MOCK_CLAIMANTS } from './constants.ts';
import { Claim, Category, Language, Status, Claimant } from './types.ts';
import { translations } from './translations.ts';
import { getClaims, getClaimants, syncAllClaims, syncAllClaimants, saveClaim, saveClaimant } from './services/databaseService.ts';

const STORAGE_KEY = 'pap_claims_v1';
const CLAIMANTS_KEY = 'pap_claimants_v1';

function App() {
  const [lang, setLang] = useState<Language>('en');
  const [claims, setClaims] = useState<Claim[]>([]);
  const [claimants, setClaimants] = useState<Claimant[]>([]);
  const [activeTab, setActiveTab] = useState<'claims' | 'dashboard' | 'claimants'>('claims');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editClaim, setEditClaim] = useState<Claim | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedClaimForDetail, setSelectedClaimForDetail] = useState<Claim | null>(null);
  const [selectedClaimantProfile, setSelectedClaimantProfile] = useState<Claimant | null>(null);

  const t = translations[lang];

  // Load data from Firebase or localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to load from Firebase first
        const firebaseClaims = await getClaims();
        const firebaseClaimants = await getClaimants();
        
        if (firebaseClaims.length > 0) {
          setClaims(firebaseClaims);
        } else {
          // Fall back to localStorage
          const savedClaims = localStorage.getItem(STORAGE_KEY);
          if (savedClaims) {
            const parsed = JSON.parse(savedClaims);
            setClaims(Array.isArray(parsed) ? parsed : MOCK_CLAIMS);
          } else {
            setClaims(MOCK_CLAIMS);
          }
        }
        
        if (firebaseClaimants.length > 0) {
          setClaimants(firebaseClaimants);
        } else {
          // Fall back to localStorage
          const savedClaimants = localStorage.getItem(CLAIMANTS_KEY);
          if (savedClaimants) {
            const parsed = JSON.parse(savedClaimants);
            setClaimants(Array.isArray(parsed) ? parsed : MOCK_CLAIMANTS);
          } else {
            setClaimants(MOCK_CLAIMANTS);
          }
        }
      } catch (e) {
        console.error("Error loading data:", e);
        // Fall back to localStorage and mock data
        try {
          const savedClaims = localStorage.getItem(STORAGE_KEY);
          setClaims(savedClaims ? JSON.parse(savedClaims) : MOCK_CLAIMS);
        } catch {
          setClaims(MOCK_CLAIMS);
        }
        
        try {
          const savedClaimants = localStorage.getItem(CLAIMANTS_KEY);
          setClaimants(savedClaimants ? JSON.parse(savedClaimants) : MOCK_CLAIMANTS);
        } catch {
          setClaimants(MOCK_CLAIMANTS);
        }
      }
    };
    
    loadData();
  }, []);

  // Sync claims to both localStorage and Firebase
  useEffect(() => {
    if (claims.length > 0) {
      // Always save to localStorage as backup
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
      } catch (e) {
        console.error("Failed to save claims to localStorage", e);
      }
      
      // Try to sync to Firebase
      syncAllClaims(claims).catch(e => {
        console.warn("Failed to sync claims to Firebase (will retry later):", e);
      });
    }
  }, [claims]);

  // Sync claimants to both localStorage and Firebase
  useEffect(() => {
    if (claimants.length > 0) {
      // Always save to localStorage as backup
      try {
        localStorage.setItem(CLAIMANTS_KEY, JSON.stringify(claimants));
      } catch (e) {
        console.error("Failed to save claimants to localStorage", e);
      }
      
      // Try to sync to Firebase
      syncAllClaimants(claimants).catch(e => {
        console.warn("Failed to sync claimants to Firebase (will retry later):", e);
      });
    }
  }, [claimants]);

  const filteredClaims = useMemo(() => {
    return claims.filter(c => {
      const claimant = claimants.find(cl => cl.id === c.claimantId);
      const textMatch = c.text.toLowerCase().includes(searchQuery.toLowerCase());
      const nameMatch = claimant?.name.toLowerCase().includes(searchQuery.toLowerCase());
      const topicMatch = c.topicGroup?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSearch = textMatch || nameMatch || topicMatch;
      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [claims, claimants, searchQuery, selectedCategory]);

  const handleAddClaim = (newClaimData: any) => {
    if (newClaimData.id && claims.some(c => c.id === newClaimData.id)) {
      setClaims(prev => prev.map(c => {
        if (c.id === newClaimData.id) {
          const historyItem = {
            timestamp: new Date().toISOString(),
            text: c.text,
            status: c.status,
            vaguenessIndex: c.vaguenessIndex
          };
          return { ...newClaimData, history: [...(c.history || []), historyItem] };
        }
        return c;
      }));
    } else {
      let claimant = claimants.find(c => c.name.toLowerCase() === newClaimData.claimantName.toLowerCase());
      if (!claimant) {
        claimant = {
          id: `cl-${Date.now()}`,
          name: newClaimData.claimantName,
          bio: 'Recorded via PAP platform.',
          affiliation: 'Independent',
          photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(newClaimData.claimantName)}&background=random`,
          accuracyRate: 0,
          vaguenessScore: newClaimData.vaguenessIndex,
          totalClaims: 1,
          tags: [newClaimData.category]
        };
        setClaimants(prev => [...prev, claimant!]);
      }
      
      const claim: Claim = {
        ...newClaimData,
        id: `new-${Date.now()}`,
        claimantId: claimant!.id,
        dateMade: new Date().toISOString().split('T')[0],
        history: []
      };
      setClaims(prev => [claim, ...prev]);
    }
    setEditClaim(null);
  };

  const handleDeleteClaim = (id: string) => {
    const updatedClaims = claims.filter(c => c.id !== id);
    setClaims(updatedClaims);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClaims));
  };

  const handleImportData = (jsonStr: string) => {
    try {
      const importedClaims = JSON.parse(jsonStr);
      if (Array.isArray(importedClaims)) {
        setClaims(importedClaims);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(importedClaims));
        alert(lang === 'ne' ? 'डाटा सफलतापूर्वक अपलोड भयो!' : 'Data imported successfully!');
      }
    } catch (e) {
      alert(lang === 'ne' ? 'अमान्य फाइल फॉर्मेट।' : 'Invalid file format.');
    }
  };

  const handleUpdateClaim = (updatedClaim: Claim) => {
    setClaims(prev => prev.map(c => c.id === updatedClaim.id ? updatedClaim : c));
  };

  const handleEditClick = (claim: Claim) => {
    setEditClaim(claim);
    setIsModalOpen(true);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${lang === 'ne' ? 'font-sans' : 'font-inter'}`}>
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        lang={lang}
        setLang={setLang}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 inline-flex shadow-sm overflow-x-auto max-w-full">
            {(['claims', 'claimants', 'dashboard'] as const).map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 sm:px-8 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap ${activeTab === tab ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {t[tab] || tab}
              </button>
            ))}
          </div>

          <button 
            onClick={() => { setEditClaim(null); setIsModalOpen(true); }}
            className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
            {t.recordClaim}
          </button>
        </div>

        {activeTab === 'claims' && (
          <>
            <div className="mb-8 flex gap-3 overflow-x-auto pb-4 no-scrollbar">
              {['All', ...Object.values(Category)].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as Category | 'All')}
                  className={`px-5 py-2 rounded-full text-xs font-black border-2 transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
                >
                  {cat === 'All' ? (lang === 'ne' ? 'सबै' : 'All') : (t.categories[cat as keyof typeof t.categories] || cat)}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredClaims.map(claim => (
                <ClaimCard 
                  key={claim.id} 
                  claim={claim} 
                  claimants={claimants}
                  lang={lang} 
                  onUpdateClaim={handleUpdateClaim}
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDeleteClaim}
                  onViewDetails={(claim) => setSelectedClaimForDetail(claim)}
                  onViewClaimantProfile={(claimantId) => {
                    const claimant = claimants.find(c => c.id === claimantId);
                    if (claimant) setSelectedClaimantProfile(claimant);
                  }}
                />
              ))}
              {filteredClaims.length === 0 && (
                <div className="col-span-full py-32 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="text-2xl font-black text-slate-800">{t.noClaims}</h3>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'dashboard' && <Dashboard claims={claims} lang={lang} onImport={handleImportData} />}

        {activeTab === 'claimants' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {claimants.map(claimant => (
              <button 
                key={claimant.id} 
                onClick={() => setSelectedClaimantProfile(claimant)}
                className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center group hover:shadow-xl transition-all hover:border-blue-300 cursor-pointer"
              >
                <img src={claimant.photoUrl} alt={claimant.name} className="w-28 h-28 rounded-full border-4 border-slate-50 mb-4 group-hover:ring-4 ring-blue-300 transition-all" />
                <h3 className="text-xl font-black text-slate-800">{claimant.name}</h3>
                <p className="text-sm text-blue-600 font-bold mb-3">{claimant.affiliation}</p>
                <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-50 pt-8 mt-4 text-xs">
                    <div className="text-left"><p className="font-black text-slate-300 uppercase">{t.claims}</p><p className="text-lg font-black text-slate-700">{claimant.totalClaims}</p></div>
                    <div className="text-right"><p className="font-black text-slate-300 uppercase">{t.accuracy}</p><p className="text-lg font-black text-slate-700">{claimant.accuracyRate}%</p></div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      <AddClaimModal 
        isOpen={isModalOpen} 
        lang={lang}
        editData={editClaim}
        onClose={() => { setIsModalOpen(false); setEditClaim(null); }} 
        onAdd={handleAddClaim}
      />

      {selectedClaimForDetail && (
        <ClaimDetailView
          claim={selectedClaimForDetail}
          claimant={claimants.find(c => c.id === selectedClaimForDetail.claimantId)}
          lang={lang}
          onClose={() => setSelectedClaimForDetail(null)}
          onUpdateClaim={handleUpdateClaim}
        />
      )}

      {selectedClaimantProfile && (
        <ClaimantProfile
          claimant={selectedClaimantProfile}
          claims={claims}
          lang={lang}
          onClose={() => setSelectedClaimantProfile(null)}
        />
      )}
    </div>
  );
}

export default App;
