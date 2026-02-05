
import React, { useState, useMemo, useRef } from 'react';
import { WarningTemplate, SymbolConstraint, RegionalPreset, Language } from '../types';

const INITIAL_LANGUAGES: Language[] = [
  { id: 'fr', name: 'French', region: 'EU' },
  { id: 'de', name: 'German', region: 'EU' },
  { id: 'es', name: 'Spanish', region: 'EU/LATAM' },
  { id: 'it', name: 'Italian', region: 'EU' },
  { id: 'nl', name: 'Dutch', region: 'EU' },
  { id: 'pl', name: 'Polish', region: 'EU' },
  { id: 'pt', name: 'Portuguese', region: 'EU/LATAM' },
  { id: 'tr', name: 'Turkish', region: 'MEA' },
  { id: 'ar', name: 'Arabic', region: 'MEA' },
  { id: 'zh-cn', name: 'Chinese (Simp)', region: 'Asia' },
  { id: 'ja', name: 'Japanese', region: 'Asia' },
  { id: 'ko', name: 'Korean', region: 'Asia' },
];

const Database: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'symbols' | 'localization' | 'logs'>('text');
  const [allLanguages, setAllLanguages] = useState<Language[]>(INITIAL_LANGUAGES);
  const [editingTemplate, setEditingTemplate] = useState<WarningTemplate | null>(null);
  const [editingSymbol, setEditingSymbol] = useState<SymbolConstraint | null>(null);
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const [newLangName, setNewLangName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState('All Tags');
  const [newTagInput, setNewTagInput] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [presets, setPresets] = useState<RegionalPreset[]>([
    { id: 'eu-core', name: 'EU Core', languages: ['fr', 'de', 'es', 'it'], type: 'Market' },
    { id: 'asia-t1', name: 'Asia Tier 1', languages: ['zh-cn', 'ja', 'ko'], type: 'Market' },
    { id: 'walmart-us', name: 'Walmart USA', languages: ['es'], type: 'Customer' },
    { id: 'target-intl', name: 'Target International', languages: ['fr', 'es'], type: 'Customer' },
  ]);

  const [symbols, setSymbols] = useState<SymbolConstraint[]>([
    { 
      id: 'S1', name: 'CE Mark', minWidth: 5, dimensionType: 'width', aspectRatio: '1 : 1.45', 
      regulatory: 'Toy Safety Directive 2009/48/EC', icon: 'stars', primaryTag: 'EU MANDATORY', 
      tags: ['#eu', '#toy-safety'], symbolColor: '#ffffff', bgColor: '#0ea5e9' 
    },
    { 
      id: 'S2', name: 'Age 0-3', minDiameter: 10, dimensionType: 'diameter', aspectRatio: '1 : 1', 
      regulatory: 'ISO 8124', icon: 'warning', primaryTag: 'GLOBAL', 
      tags: ['#age', '#safety'], symbolColor: '#ffffff', bgColor: '#334155' 
    },
    { 
      id: 'S3', name: 'UKCA', minWidth: 5, dimensionType: 'width', aspectRatio: '1 : 1.25', 
      regulatory: 'UK Regulation', icon: 'security', primaryTag: 'UK MANDATORY', 
      tags: ['#uk', '#brexit'], symbolColor: '#ffffff', bgColor: '#1e293b' 
    },
    { 
      id: 'S4', name: 'WEEE Symbol', minHeight: 7, dimensionType: 'height', aspectRatio: '1 : 1', 
      regulatory: '2012/19/EU', icon: 'delete', primaryTag: 'EU MANDATORY', 
      tags: ['#waste', '#recycling'], symbolColor: '#ffffff', bgColor: '#1e293b' 
    },
    { 
      id: 'S5', name: 'Recycle 01 PET', minDiameter: 6, dimensionType: 'diameter', aspectRatio: '1 : 1', 
      regulatory: 'Waste Mgmt', icon: 'recycling', primaryTag: 'GLOBAL', 
      tags: ['#packaging', '#sustainability'], symbolColor: '#ffffff', bgColor: '#1e293b' 
    },
    { 
      id: 'S6', name: 'Green Dot', minDiameter: 6, dimensionType: 'diameter', aspectRatio: '1 : 1', 
      regulatory: 'Packaging Waste', icon: 'circle', primaryTag: 'EU OPTIONAL', 
      tags: ['#packaging', '#eu-market'], symbolColor: '#ffffff', bgColor: '#1e293b' 
    },
  ]);

  const [templates, setTemplates] = useState<WarningTemplate[]>([
    { 
      id: 'WP-001', 
      name: 'Small Parts Warning', 
      subType: 'Choking Hazard', 
      en: 'WARNING: CHOKING HAZARD - Small parts. Not for children under 3 yrs.', 
      zh_cn: '警告：有窒息危险 - 小零件。不适合3岁以下儿童。', 
      fr: "ATTENTION ! DANGER D'ÉTOUFFEMENT – Petits éléments. Ne convient pas aux enfants de moins de 3 ans.", 
      de: 'ACHTUNG! ERSTICKUNGSGEFAHR – Kleine Teile. Nicht für Kinder unter 3 Jahren geeignet.', 
      es: 'ADVERTENCIA: PELIGRO DE ASFIXIA - Partes pequeñas. No apto para niños menores de 3 años.', 
      status: 'APPROVED', 
      category: 'GENERAL',
      tags: ['#preschool', 'safety', 'choking'],
      linkedSymbolIds: ['S1', 'S2']
    },
    { 
      id: 'WP-002', 
      name: 'Long Cord Danger', 
      subType: 'Strangulation risk', 
      en: 'WARNING: STRANGULATION HAZARD - Long cord.', 
      zh_cn: '警告：有勒颈危险 - 长绳。', 
      fr: 'ATTENTION ! DANGER DE STRANGULATION – Longue corde.', 
      de: 'ACHTUNG! STRANGULATIONSGEFAHR – Lange Schnur.', 
      es: 'Translation pending...', 
      status: 'PENDING QA', 
      category: 'ACTIVITY',
      tags: ['#scooter', 'parent supervision'],
      linkedSymbolIds: []
    }
  ]);

  const allAvailableTags = useMemo(() => {
    const tags = new Set<string>();
    templates.forEach(t => t.tags.forEach(tag => tags.add(tag)));
    return ['All Tags', ...Array.from(tags).sort()];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.en.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTagFilter === 'All Tags' || t.tags.includes(selectedTagFilter);
      return matchesSearch && matchesTag;
    });
  }, [templates, searchQuery, selectedTagFilter]);

  const togglePresetLanguage = (presetId: string, langId: string) => {
    setPresets(prev => prev.map(p => {
      if (p.id !== presetId) return p;
      const languages = p.languages.includes(langId)
        ? p.languages.filter(id => id !== langId)
        : [...p.languages, langId];
      return { ...p, languages };
    }));
  };

  const createNewTemplate = () => {
    const name = prompt("Enter Template Name:");
    if (!name) return;
    const newTemp: WarningTemplate = {
      id: `WP-${templates.length + 100}`,
      name,
      subType: 'General',
      en: 'Edit default warning text...',
      zh_cn: '', fr: '', de: '', es: '',
      status: 'DRAFT',
      category: 'GENERAL',
      tags: ['#new'],
      linkedSymbolIds: []
    };
    setTemplates([newTemp, ...templates]);
    setEditingTemplate(newTemp);
  };

  const createNewSymbol = () => {
    const name = prompt("Enter Symbol Name:");
    if (!name) return;
    const newSymbol: SymbolConstraint = {
      id: `S-${symbols.length + 1}`,
      name,
      dimensionType: 'width',
      minWidth: 5,
      aspectRatio: '1 : 1',
      regulatory: 'New Regulatory Standard',
      icon: 'category',
      primaryTag: 'NEW',
      tags: ['#draft'],
      symbolColor: '#ffffff',
      bgColor: '#1a2a32'
    };
    setSymbols([...symbols, newSymbol]);
    setEditingSymbol(newSymbol);
    setActiveTab('symbols');
  };

  const updateTemplateField = (field: keyof WarningTemplate, value: any) => {
    if (!editingTemplate) return;
    const updated = { ...editingTemplate, [field]: value };
    setEditingTemplate(updated);
    setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? updated : t));
  };

  const updateSymbolField = (field: keyof SymbolConstraint, value: any) => {
    if (!editingSymbol) return;
    const updated = { ...editingSymbol, [field]: value };
    setEditingSymbol(updated);
    setSymbols(prev => prev.map(s => s.id === editingSymbol.id ? updated : s));
  };

  const handleVectorUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingSymbol) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateSymbolField('vectorSvg', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTagToTemplate = () => {
    if (!editingTemplate || !newTagInput.trim()) return;
    const tag = newTagInput.startsWith('#') ? newTagInput : `#${newTagInput}`;
    if (!editingTemplate.tags.includes(tag)) {
      updateTemplateField('tags', [...editingTemplate.tags, tag]);
    }
    setNewTagInput('');
  };

  const removeTagFromTemplate = (tagToRemove: string) => {
    if (!editingTemplate) return;
    updateTemplateField('tags', editingTemplate.tags.filter(t => t !== tagToRemove));
  };

  const addTagToSymbol = () => {
    if (!editingSymbol || !newTagInput.trim()) return;
    const tag = newTagInput.startsWith('#') ? newTagInput : `#${newTagInput}`;
    if (!editingSymbol.tags.includes(tag)) {
      updateSymbolField('tags', [...editingSymbol.tags, tag]);
    }
    setNewTagInput('');
  };

  const removeTagFromSymbol = (tagToRemove: string) => {
    if (!editingSymbol) return;
    updateSymbolField('tags', editingSymbol.tags.filter(t => t !== tagToRemove));
  };

  const toggleSymbolLink = (symbolId: string) => {
    if (!editingTemplate) return;
    const currentLinks = editingTemplate.linkedSymbolIds || [];
    const newLinks = currentLinks.includes(symbolId) 
      ? currentLinks.filter(id => id !== symbolId)
      : [...currentLinks, symbolId];
    updateTemplateField('linkedSymbolIds', newLinks);
  };

  const addNewLanguageToSystem = () => {
    if (!newLangName.trim()) return;
    const id = newLangName.toLowerCase().replace(/\s+/g, '-');
    if (allLanguages.find(l => l.id === id)) {
      alert('Language already exists.');
      return;
    }
    const newLang: Language = { id, name: newLangName, region: 'CUSTOM' };
    setAllLanguages([...allLanguages, newLang]);
    setNewLangName('');
    setIsAddingLanguage(false);
  };

  return (
    <div className="flex-1 flex flex-col p-6 gap-6 max-w-[1600px] mx-auto w-full h-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-xs">verified_user</span>
            Senior QA Control Center
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Artwork Compliance Database</h1>
          <p className="text-slate-500 dark:text-[#92b7c9] text-sm max-w-2xl">Central repository for global packaging compliance. Managing safety strings and iconography for 23 regions.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={createNewTemplate} 
            className="px-6 py-2.5 bg-primary text-white text-xs font-black rounded-xl shadow-xl shadow-primary/30 hover:brightness-110 active:scale-95 transition-all uppercase tracking-[0.15em] flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-lg">add_box</span>
            New Template
          </button>
          <button 
            onClick={createNewSymbol} 
            className="px-6 py-2.5 bg-[#1a2a32] text-slate-300 border border-[#2d4552] text-xs font-black rounded-xl hover:bg-[#233c48] hover:text-white transition-all uppercase tracking-[0.15em] flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-lg">category</span>
            New Symbol
          </button>
        </div>
      </div>

      {/* Tabs & Search Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 dark:border-[#325567] mt-2 shrink-0">
        <div className="flex gap-8">
          <TabButton active={activeTab === 'text'} onClick={() => setActiveTab('text')} label="Warning Text Templates" icon="translate" />
          <TabButton active={activeTab === 'symbols'} onClick={() => setActiveTab('symbols')} label="Global Symbol Library" icon="category" />
          <TabButton active={activeTab === 'localization'} onClick={() => setActiveTab('localization')} label="Regional Localization" icon="public" />
          <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} label="Audit Logs" icon="history" />
        </div>
        
        <div className="py-2 flex items-center gap-4">
           {activeTab === 'text' && (
             <>
               <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-[#111c22] border border-slate-200 dark:border-[#325567] rounded-lg">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tag Filter:</span>
                  <select 
                    value={selectedTagFilter}
                    onChange={(e) => setSelectedTagFilter(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-bold text-slate-700 dark:text-white focus:ring-0 cursor-pointer py-0 uppercase tracking-widest"
                  >
                    {allAvailableTags.map(tag => <option key={tag} value={tag} className="bg-[#111c22]">{tag}</option>)}
                  </select>
               </div>
               <div className="relative min-w-[240px]">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                  <input 
                    type="text" 
                    placeholder="Search master database..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-[#111c22] border border-slate-200 dark:border-[#325567] rounded-lg pl-9 pr-4 py-2 text-[10px] font-bold focus:ring-primary focus:border-primary transition-all text-slate-700 dark:text-white uppercase tracking-widest"
                  />
               </div>
             </>
           )}
           {activeTab === 'localization' && (
             <button onClick={() => setIsAddingLanguage(true)} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-[10px] font-black rounded-lg border border-primary/20 hover:bg-primary/20 transition-all uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">add_circle</span>
                Register Global Language
             </button>
           )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden min-h-0">
        {activeTab === 'text' && (
          <div className="h-full flex flex-col bg-white dark:bg-[#111c22] rounded-xl border border-slate-200 dark:border-[#325567] shadow-sm animate-in fade-in duration-300">
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead className="sticky top-0 bg-slate-100 dark:bg-[#192b33] border-b border-slate-200 dark:border-[#325567] z-20">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-24">ID</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Name & Subtype</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tags</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-[350px]">English (Source)</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Symbols</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-32">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#233c48]">
                  {filteredTemplates.map(t => (
                    <tr key={t.id} className="group hover:bg-slate-50 dark:hover:bg-[#192b33] transition-colors cursor-pointer" onClick={() => setEditingTemplate(t)}>
                      <td className="px-6 py-4 text-xs font-mono font-bold text-slate-500 uppercase tracking-tighter group-hover:text-primary">{t.id}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{t.name}</p>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-0.5">{t.subType}</p>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex flex-wrap gap-1">
                            {t.tags.map(tag => (
                              <span key={tag} className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-[#1a2a32] px-1.5 py-0.5 rounded border border-transparent">{tag}</span>
                            ))}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 dark:text-[#92b7c9] leading-relaxed max-w-[350px] truncate group-hover:whitespace-normal transition-all">
                        {t.en}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {(t.linkedSymbolIds || []).map(sid => {
                            const s = symbols.find(sym => sym.id === sid);
                            return s ? <span key={sid} className="material-symbols-outlined text-sm text-slate-400 group-hover:text-primary transition-colors" title={s.name}>{s.icon}</span> : null;
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          t.status === 'APPROVED' ? 'bg-green-100 border-green-200 text-green-700' : 
                          t.status === 'PENDING QA' ? 'bg-amber-100 border-amber-200 text-amber-700' : 
                          'bg-slate-100 border-slate-200 text-slate-600'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'symbols' && (
          <div className="h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-5 duration-500 overflow-y-auto custom-scrollbar pb-10">
            {symbols.map(s => (
              <div 
                key={s.id} 
                onClick={() => setEditingSymbol(s)}
                className="bg-[#111c22] rounded-2xl border border-[#2d4552] p-6 flex flex-col gap-6 hover:border-primary transition-all group shadow-xl h-fit cursor-pointer"
              >
                 <div className="flex items-start justify-between">
                    <div className="size-14 rounded-xl flex items-center justify-center border border-[#2d4552] shadow-inner" style={{ backgroundColor: s.bgColor }}>
                      {s.vectorSvg ? (
                        <img src={s.vectorSvg} alt={s.name} className="size-8 object-contain" style={{ filter: 'brightness(100)' }} />
                      ) : (
                        <span className="material-symbols-outlined text-3xl" style={{ color: s.symbolColor }}>{s.icon}</span>
                      )}
                    </div>
                    <span className="text-[9px] font-black text-slate-400 bg-[#1a2a32] border border-[#2d4552] px-2.5 py-1 rounded-md uppercase tracking-widest">{s.primaryTag}</span>
                 </div>
                 <div>
                   <h3 className="text-lg font-black text-white tracking-tight">{s.name}</h3>
                   <p className="text-xs text-slate-500 dark:text-[#92b7c9] mt-1 leading-relaxed line-clamp-2">{s.regulatory}</p>
                 </div>
                 <div className="pt-4 border-t border-[#233c48] grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                        {s.dimensionType === 'diameter' ? 'Min Diameter' : s.dimensionType === 'width' ? 'Min Width' : 'Min Height'}
                      </p>
                      <p className="text-xs font-bold text-white">
                        {s.dimensionType === 'width' ? s.minWidth : s.dimensionType === 'height' ? s.minHeight : s.minDiameter} mm
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Ratio</p>
                      <p className="text-xs font-bold text-white">{s.aspectRatio}</p>
                    </div>
                 </div>
                 <button className="w-full py-3 bg-[#1a2a32] rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-all border border-[#2d4552] group-hover:border-primary/20">
                    Manage Variants
                 </button>
              </div>
            ))}
            <button onClick={createNewSymbol} className="border-2 border-dashed border-[#2d4552] rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-primary hover:border-primary transition-all group h-[280px] bg-[#111c22]/30">
              <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">add_circle</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Register New Symbol</span>
            </button>
          </div>
        )}

        {activeTab === 'localization' && (
          <div className="h-full overflow-y-auto custom-scrollbar space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Regional Localization UI - Same as before */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">public</span> Market Group Presets
                  </h3>
                  <button onClick={() => createNewTemplate()} className="text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest bg-primary/10 px-3 py-1 rounded border border-primary/20">+ Create New Group</button>
                </div>
                {presets.filter(p => p.type === 'Market').map(preset => (
                  <PresetEditor key={preset.id} preset={preset} allLanguages={allLanguages} onToggleLang={(lid) => togglePresetLanguage(preset.id, lid)} onDelete={() => {}} />
                ))}
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500">store</span> Customer Specific Artwork Presets
                  </h3>
                  <button onClick={() => createNewTemplate()} className="text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest bg-primary/10 px-3 py-1 rounded border border-primary/20">+ Create New Template</button>
                </div>
                {presets.filter(p => p.type === 'Customer').map(preset => (
                  <PresetEditor key={preset.id} preset={preset} allLanguages={allLanguages} onToggleLang={(lid) => togglePresetLanguage(preset.id, lid)} onDelete={() => {}} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TEXT TEMPLATE EDITOR MODAL */}
      {editingTemplate && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setEditingTemplate(null)}></div>
          <div className="relative bg-[#111c22] w-full max-w-6xl rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.6)] border border-[#2d4552] flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-[#2d4552] flex items-center justify-between bg-[#0d161b]">
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-primary uppercase tracking-[0.2em]">{editingTemplate.id}</span>
                  <span className="text-slate-700 text-xl font-thin">/</span>
                  <h3 className="text-2xl font-black text-white tracking-tight">{editingTemplate.name}</h3>
                </div>
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">{editingTemplate.subType}</span>
              </div>
              <button onClick={() => setEditingTemplate(null)} className="p-2 text-slate-500 hover:text-white transition-colors"><span className="material-symbols-outlined text-2xl">close</span></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Source Content: English (Master)</label>
                 <textarea 
                  value={editingTemplate.en}
                  onChange={(e) => updateTemplateField('en', e.target.value)}
                  className="w-full bg-[#1a2a32] border border-[#2d4552] rounded-xl p-8 text-xl font-medium text-white focus:ring-4 focus:ring-primary/10 outline-none min-h-[120px]"
                 />
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Applicable Project Tags</label>
                 <div className="flex flex-wrap items-center gap-2 p-6 bg-[#0d161b] rounded-2xl border border-[#2d4552]">
                    {editingTemplate.tags.map(tag => (
                      <button key={tag} onClick={() => removeTagFromTemplate(tag)} className="text-[9px] font-black text-white bg-primary/20 border border-primary/30 px-3 py-1.5 rounded-full hover:bg-rose-500/20 hover:text-rose-400 flex items-center gap-2 transition-all">
                        {tag} <span className="material-symbols-outlined text-[10px]">close</span>
                      </button>
                    ))}
                    <div className="flex items-center gap-2 ml-2">
                       <input 
                         className="bg-[#1a2a32] border border-[#2d4552] text-[10px] font-black text-white px-4 py-2 rounded-lg uppercase outline-none focus:border-primary w-40"
                         placeholder="Add Tag..."
                         value={newTagInput}
                         onChange={(e) => setNewTagInput(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && addTagToTemplate()}
                       />
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <TranslationField label="CHINESE (SIMP)" value={editingTemplate.zh_cn} onChange={(v: string) => updateTemplateField('zh_cn', v)} />
                 <TranslationField label="FRENCH (FR)" value={editingTemplate.fr} onChange={(v: string) => updateTemplateField('fr', v)} />
                 <TranslationField label="GERMAN (DE)" value={editingTemplate.de} onChange={(v: string) => updateTemplateField('de', v)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SYMBOL EDITOR MODAL */}
      {editingSymbol && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setEditingSymbol(null)}></div>
          <div className="relative bg-[#111c22] w-full max-w-5xl rounded-3xl shadow-[0_0_120px_rgba(0,0,0,0.8)] border border-[#2d4552] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-10 py-8 border-b border-[#2d4552] flex items-center justify-between bg-[#0d161b]">
               <div className="flex items-center gap-6">
                  <div className="size-16 rounded-2xl flex items-center justify-center border border-[#2d4552] shadow-2xl" style={{ backgroundColor: editingSymbol.bgColor }}>
                     {editingSymbol.vectorSvg ? (
                       <img src={editingSymbol.vectorSvg} alt="Preview" className="size-10 object-contain" />
                     ) : (
                       <span className="material-symbols-outlined text-4xl" style={{ color: editingSymbol.symbolColor }}>{editingSymbol.icon}</span>
                     )}
                  </div>
                  <div className="flex flex-col">
                     <h3 className="text-2xl font-black text-white tracking-tight">{editingSymbol.name}</h3>
                     <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">{editingSymbol.id} | Symbol Specification</span>
                  </div>
               </div>
               <button onClick={() => setEditingSymbol(null)} className="p-3 text-slate-500 hover:text-white transition-colors bg-[#1a2a32] rounded-full border border-[#2d4552]"><span className="material-symbols-outlined">close</span></button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  
                  {/* Left Column: Graphics & Colors */}
                  <div className="space-y-12">
                     <section className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vector Graphic Upload (SVG)</label>
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square w-full rounded-3xl border-4 border-dashed border-[#2d4552] bg-[#0d161b] hover:border-primary transition-all flex flex-col items-center justify-center cursor-pointer group"
                        >
                          {editingSymbol.vectorSvg ? (
                            <img src={editingSymbol.vectorSvg} alt="Uploaded Vector" className="w-1/2 h-1/2 object-contain group-hover:scale-105 transition-transform" />
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-6xl text-slate-700 group-hover:text-primary mb-4">upload_file</span>
                              <p className="text-sm font-bold text-slate-500 group-hover:text-white">Click to upload SVG vector</p>
                            </>
                          )}
                          <input type="file" ref={fileInputRef} className="hidden" accept=".svg" onChange={handleVectorUpload} />
                        </div>
                     </section>

                     <section className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Symbol Color</label>
                           <div className="flex items-center gap-3">
                              <input 
                                type="color" 
                                value={editingSymbol.symbolColor}
                                onChange={(e) => updateSymbolField('symbolColor', e.target.value)}
                                className="size-10 rounded-lg bg-transparent border-none cursor-pointer p-0"
                              />
                              <input 
                                type="text"
                                value={editingSymbol.symbolColor}
                                onChange={(e) => updateSymbolField('symbolColor', e.target.value)}
                                className="bg-[#1a2a32] border border-[#2d4552] rounded-lg px-3 py-2 text-xs font-mono font-bold text-white w-24 outline-none focus:border-primary"
                              />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Background Color</label>
                           <div className="flex items-center gap-3">
                              <input 
                                type="color" 
                                value={editingSymbol.bgColor}
                                onChange={(e) => updateSymbolField('bgColor', e.target.value)}
                                className="size-10 rounded-lg bg-transparent border-none cursor-pointer p-0"
                              />
                              <input 
                                type="text"
                                value={editingSymbol.bgColor}
                                onChange={(e) => updateSymbolField('bgColor', e.target.value)}
                                className="bg-[#1a2a32] border border-[#2d4552] rounded-lg px-3 py-2 text-xs font-mono font-bold text-white w-24 outline-none focus:border-primary"
                              />
                           </div>
                        </div>
                     </section>
                  </div>

                  {/* Right Column: Regulatory & Tags */}
                  <div className="space-y-12">
                     <section className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Regulatory Text / Reference</label>
                        <textarea 
                          value={editingSymbol.regulatory}
                          onChange={(e) => updateSymbolField('regulatory', e.target.value)}
                          rows={4}
                          className="w-full bg-[#1a2a32] border border-[#2d4552] rounded-2xl p-6 text-sm text-slate-300 focus:border-primary outline-none transition-all"
                        />
                     </section>

                     <section className="space-y-6">
                        <div className="flex items-center justify-between">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dimension Constraints</label>
                           <div className="flex gap-2 p-1 bg-[#0d161b] rounded-lg border border-[#2d4552]">
                              {(['width', 'height', 'diameter'] as const).map(type => (
                                <button
                                  key={type}
                                  onClick={() => updateSymbolField('dimensionType', type)}
                                  className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase transition-all ${
                                    editingSymbol.dimensionType === type 
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                    : 'text-slate-500 hover:text-white'
                                  }`}
                                >
                                  {type}
                                </button>
                              ))}
                           </div>
                        </div>
                        
                        <div className="flex items-end gap-6 bg-[#0d161b] p-6 rounded-2xl border border-[#2d4552]">
                           <div className="flex-1 space-y-2">
                              <p className="text-[10px] font-bold text-slate-600 uppercase">Requirement Value</p>
                              <div className="relative">
                                 <input 
                                   type="number"
                                   value={
                                     editingSymbol.dimensionType === 'width' ? editingSymbol.minWidth :
                                     editingSymbol.dimensionType === 'height' ? editingSymbol.minHeight : editingSymbol.minDiameter
                                   }
                                   onChange={(e) => {
                                      const val = parseInt(e.target.value);
                                      const field = editingSymbol.dimensionType === 'width' ? 'minWidth' :
                                                   editingSymbol.dimensionType === 'height' ? 'minHeight' : 'minDiameter';
                                      updateSymbolField(field as any, val);
                                   }}
                                   className="w-full bg-[#1a2a32] border border-[#2d4552] rounded-xl px-5 py-3 text-lg font-black text-white focus:border-primary outline-none"
                                 />
                                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold uppercase text-[10px]">mm</span>
                              </div>
                           </div>
                           <div className="flex-1 space-y-2">
                              <p className="text-[10px] font-bold text-slate-600 uppercase">Aspect Ratio (W:H)</p>
                              <input 
                                type="text"
                                value={editingSymbol.aspectRatio}
                                onChange={(e) => updateSymbolField('aspectRatio', e.target.value)}
                                className="w-full bg-[#1a2a32] border border-[#2d4552] rounded-xl px-5 py-3 text-lg font-black text-white focus:border-primary outline-none"
                              />
                           </div>
                        </div>
                     </section>

                     <section className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Metadata Tags</label>
                        <div className="flex flex-wrap items-center gap-3 p-6 bg-[#0d161b] rounded-2xl border border-[#2d4552]">
                          {editingSymbol.tags.map(tag => (
                            <button key={tag} onClick={() => removeTagFromSymbol(tag)} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-[10px] font-black text-slate-400 hover:border-rose-500 hover:text-rose-500 transition-all flex items-center gap-2">
                              {tag} <span className="material-symbols-outlined text-[12px]">close</span>
                            </button>
                          ))}
                          <input 
                            className="bg-transparent border-none text-[10px] font-black text-white outline-none focus:ring-0 w-32"
                            placeholder="+ Add New..."
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTagToSymbol()}
                          />
                        </div>
                     </section>
                  </div>
               </div>
            </div>

            {/* Modal Footer */}
            <div className="px-10 py-8 border-t border-[#2d4552] bg-[#0d161b] flex justify-end gap-6">
               <button onClick={() => setEditingSymbol(null)} className="px-8 py-3 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Discard Changes</button>
               <button onClick={() => setEditingSymbol(null)} className="px-12 py-3 bg-primary text-white text-xs font-black rounded-xl shadow-2xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest">Save Record</button>
            </div>
          </div>
        </div>
      )}

      {/* Register Language Modal - Same as before */}
      {isAddingLanguage && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsAddingLanguage(false)}></div>
          <div className="relative bg-[#1a2a32] border border-[#2d4552] rounded-xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">Register New Language</h3>
            <p className="text-sm text-slate-400 mb-6">Add a new regional language slot to the global database.</p>
            <input 
              autoFocus
              value={newLangName}
              onChange={(e) => setNewLangName(e.target.value)}
              placeholder="e.g. Vietnamese"
              className="w-full bg-[#111c22] border border-[#2d4552] rounded-lg p-4 text-white mb-6 outline-none focus:border-primary transition-all font-bold"
              onKeyDown={(e) => e.key === 'Enter' && addNewLanguageToSystem()}
            />
            <div className="flex justify-end gap-4">
              <button onClick={() => setIsAddingLanguage(false)} className="text-sm font-bold text-slate-500 hover:text-white uppercase tracking-widest">Cancel</button>
              <button onClick={addNewLanguageToSystem} className="bg-primary text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest">Register</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PresetEditor: React.FC<{ preset: RegionalPreset; allLanguages: Language[]; onToggleLang: (id: string) => void; onDelete: () => void }> = ({ preset, allLanguages, onToggleLang, onDelete }) => (
  <div className="bg-[#111c22] border border-[#2d4552] rounded-2xl p-8 space-y-6 shadow-[0_4px_30px_rgba(0,0,0,0.3)] hover:border-slate-700 transition-all group">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h4 className="text-lg font-black text-white tracking-tight">{preset.name}</h4>
        <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-rose-500">
           <span className="material-symbols-outlined text-sm">delete</span>
        </button>
      </div>
      <div className="bg-[#1a2a32] px-3 py-1 rounded-md border border-[#2d4552] shadow-sm">
        <span className="text-[10px] font-black text-white uppercase tracking-widest">{preset.languages.length} LANGUAGES</span>
      </div>
    </div>
    <div className="flex flex-wrap gap-2.5">
      {allLanguages.map(lang => {
        const isActive = preset.languages.includes(lang.id);
        return (
          <button
            key={lang.id}
            onClick={() => onToggleLang(lang.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all border duration-200 ${
              isActive 
              ? 'bg-[#13a4ec] border-[#13a4ec] text-white shadow-[0_5px_15px_rgba(19,164,236,0.3)]' 
              : 'bg-transparent border-[#2d4552] text-slate-500 hover:border-slate-600 hover:text-slate-300'
            }`}
          >
            {lang.name}
          </button>
        );
      })}
    </div>
  </div>
);

const TranslationField: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="space-y-3 p-6 bg-[#0d161b] rounded-2xl border border-[#2d4552]">
    <div className="flex items-center justify-between">
       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
       <span className="material-symbols-outlined text-xs text-slate-600">translate</span>
    </div>
    <textarea 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="w-full bg-[#1a2a32] border border-[#2d4552] rounded-xl p-4 text-[11px] font-medium text-slate-300 min-h-[90px] outline-none focus:border-primary/50 transition-all shadow-inner"
    />
  </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: string }> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 border-b-2 pb-3 pt-2 px-1 transition-all ${active ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'}`}
  >
    <span className="material-symbols-outlined text-lg">{icon}</span>
    <span className="text-xs font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default Database;
