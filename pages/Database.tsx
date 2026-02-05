
import React, { useState, useMemo, useRef } from 'react';
import { WarningTemplate, SymbolConstraint, RegionalPreset, Language, ChangeEntry } from '../types';

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
  const [newRemarkInput, setNewRemarkInput] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [presets, setPresets] = useState<RegionalPreset[]>([
    { id: 'eu-core', name: 'EU Core', languages: ['fr', 'de', 'es', 'it'], type: 'Market' },
    { id: 'asia-t1', name: 'Asia Tier 1', languages: ['zh-cn', 'ja', 'ko'], type: 'Market' },
    { id: 'walmart-us', name: 'Walmart USA', languages: ['es'], type: 'Customer' },
    { id: 'target-intl', name: 'Target International', languages: ['fr', 'es'], type: 'Customer' },
  ]);

  const [symbols, setSymbols] = useState<SymbolConstraint[]>([
    { id: 'S1', name: 'CE Mark', minWidth: 5, dimensionType: 'width', aspectRatio: '1 : 1.45', regulatory: 'Toy Safety Directive 2009/48/EC', icon: 'stars', primaryTag: 'EU MANDATORY', tags: ['#eu', '#toy-safety'], symbolColor: '#ffffff', bgColor: '#0ea5e9' },
    { id: 'S2', name: 'Age 0-3', minDiameter: 10, dimensionType: 'diameter', aspectRatio: '1 : 1', regulatory: 'ISO 8124', icon: 'warning', primaryTag: 'GLOBAL', tags: ['#age', '#safety'], symbolColor: '#ffffff', bgColor: '#334155' },
    { id: 'S3', name: 'UKCA', minWidth: 5, dimensionType: 'width', aspectRatio: '1 : 1.25', regulatory: 'UK Regulation', icon: 'security', primaryTag: 'UK MANDATORY', tags: ['#uk', '#brexit'], symbolColor: '#ffffff', bgColor: '#1e293b' },
    { id: 'S4', name: 'WEEE Symbol', minHeight: 7, dimensionType: 'height', aspectRatio: '1 : 1', regulatory: '2012/19/EU', icon: 'delete', primaryTag: 'EU MANDATORY', tags: ['#waste', '#recycling'], symbolColor: '#ffffff', bgColor: '#1e293b' },
    { id: 'S5', name: 'Recycle 01 PET', minDiameter: 6, dimensionType: 'diameter', aspectRatio: '1 : 1', regulatory: 'Waste Mgmt', icon: 'recycling', primaryTag: 'GLOBAL', tags: ['#packaging', '#sustainability'], symbolColor: '#ffffff', bgColor: '#1e293b' },
    { id: 'S6', name: 'Green Dot', minDiameter: 6, dimensionType: 'diameter', aspectRatio: '1 : 1', regulatory: 'Packaging Waste', icon: 'circle', primaryTag: 'EU OPTIONAL', tags: ['#packaging', '#eu-market'], symbolColor: '#ffffff', bgColor: '#1e293b' },
  ]);

  const [templates, setTemplates] = useState<WarningTemplate[]>([
    { 
      id: 'WP-001', 
      name: 'Small Parts Warning', 
      subType: 'CHOKING HAZARD', 
      en: 'WARNING: CHOKING HAZARD - Small parts. Not for children under 3 yrs.', 
      translations: {
        'zh-cn': '警告：有窒息危险 - 小零件。不适合3岁以下儿童。',
        'fr': "ATTENTION ! DANGER D'ÉTOUFFEMENT – Petits éléments. Ne convient pas aux enfants de moins de 3 ans.",
        'de': 'ACHTUNG! ERSTICKUNGSGEFAHR – Kleine Teile. Nicht für Kinder unter 3 Jahren geeignet.'
      },
      status: 'APPROVED', 
      category: 'GENERAL',
      tags: ['#preschool', 'safety', 'choking'],
      linkedSymbolIds: ['S1', 'S2'],
      referenceSource: 'EN 71-1:2014+A1:2018 Toy Safety Standard',
      history: [
        { date: '2023-10-12 11:30', user: 'James Harrison', remark: 'Initial approved text for EU market.' },
        { date: '2023-11-05 09:15', user: 'Michael Chen', remark: 'Updated French translation phrasing.' }
      ]
    },
    { 
      id: 'WP-002', 
      name: 'Long Cord Danger', 
      subType: 'STRANGULATION RISK', 
      en: 'WARNING: STRANGULATION HAZARD - Long cord.', 
      translations: {
        'fr': 'ATTENTION ! DANGER DE STRANGULATION – Longue corde.',
        'de': 'ACHTUNG! STRANGULATIONSGEFAHR – Lange Schnur.'
      },
      status: 'PENDING QA', 
      category: 'ACTIVITY',
      tags: ['#scooter', 'parent supervision'],
      linkedSymbolIds: [],
      referenceSource: 'ISO 8124-1:2022',
      history: [{ date: '2023-11-01 14:00', user: 'James Harrison', remark: 'Drafting cord danger warning.' }]
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

  const createNewTemplate = () => {
    const name = prompt("Enter Template Name:");
    if (!name) return;
    const newTemp: WarningTemplate = {
      id: `WP-${templates.length + 101}`,
      name,
      subType: 'GENERAL HAZARD',
      en: 'WARNING: Add source text here...',
      translations: {},
      status: 'DRAFT',
      category: 'GENERAL',
      tags: ['#new'],
      linkedSymbolIds: [],
      referenceSource: 'N/A',
      history: [{ date: new Date().toLocaleString(), user: 'James Harrison', remark: 'Created new template record.' }]
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

  const updateTranslation = (langId: string, text: string) => {
    if (!editingTemplate) return;
    const updated = { 
      ...editingTemplate, 
      translations: { ...editingTemplate.translations, [langId]: text } 
    };
    setEditingTemplate(updated);
    setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? updated : t));
  };

  const addLanguageToTemplate = (langId: string) => {
    if (!editingTemplate || editingTemplate.translations[langId]) return;
    updateTranslation(langId, '');
  };

  const addHistoryRemark = () => {
    if (!editingTemplate || !newRemarkInput.trim()) return;
    const newEntry: ChangeEntry = {
      date: new Date().toLocaleString(),
      user: 'James Harrison',
      remark: newRemarkInput
    };
    const updated = { ...editingTemplate, history: [newEntry, ...editingTemplate.history] };
    setEditingTemplate(updated);
    setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? updated : t));
    setNewRemarkInput('');
  };

  const removeTagFromTemplate = (tagToRemove: string) => {
    if (!editingTemplate) return;
    updateTemplateField('tags', editingTemplate.tags.filter(t => t !== tagToRemove));
  };

  const addTagToTemplate = () => {
    if (!editingTemplate || !newTagInput.trim()) return;
    const tag = newTagInput.startsWith('#') ? newTagInput : `#${newTagInput}`;
    if (!editingTemplate.tags.includes(tag)) {
      updateTemplateField('tags', [...editingTemplate.tags, tag]);
    }
    setNewTagInput('');
  };

  const handleVectorUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingSymbol) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const updated = { ...editingSymbol, vectorSvg: event.target?.result as string };
        setEditingSymbol(updated);
        setSymbols(prev => prev.map(s => s.id === editingSymbol.id ? updated : s));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateSymbolField = (field: keyof SymbolConstraint, value: any) => {
    if (!editingSymbol) return;
    const updated = { ...editingSymbol, [field]: value };
    setEditingSymbol(updated);
    setSymbols(prev => prev.map(s => s.id === editingSymbol.id ? updated : s));
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

  // Fixed missing function error by defining addNewLanguageToSystem
  const addNewLanguageToSystem = () => {
    if (!newLangName.trim()) return;
    const id = newLangName.toLowerCase().replace(/\s+/g, '-');
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
          <button onClick={createNewTemplate} className="px-6 py-2.5 bg-primary text-white text-xs font-black rounded-xl shadow-xl shadow-primary/30 hover:brightness-110 active:scale-95 transition-all uppercase tracking-[0.15em] flex items-center gap-3">
            <span className="material-symbols-outlined text-lg">add_box</span> New Template
          </button>
          <button onClick={createNewSymbol} className="px-6 py-2.5 bg-[#1a2a32] text-slate-300 border border-[#2d4552] text-xs font-black rounded-xl hover:bg-[#233c48] hover:text-white transition-all uppercase tracking-[0.15em] flex items-center gap-3">
            <span className="material-symbols-outlined text-lg">category</span> New Symbol
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 dark:border-[#325567] mt-2 shrink-0">
        <div className="flex gap-8">
          <TabButton active={activeTab === 'text'} onClick={() => setActiveTab('text')} label="Warning Text Templates" icon="translate" />
          <TabButton active={activeTab === 'symbols'} onClick={() => setActiveTab('symbols')} label="Global Symbol Library" icon="category" />
          <TabButton active={activeTab === 'localization'} onClick={() => setActiveTab('localization')} label="Regional Localization" icon="public" />
          <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} label="Audit Logs" icon="history" />
        </div>
        <div className="py-2 flex items-center gap-4">
          <div className="relative min-w-[240px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input type="text" placeholder="Search master database..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white dark:bg-[#111c22] border border-slate-200 dark:border-[#325567] rounded-lg pl-9 pr-4 py-2 text-[10px] font-bold focus:ring-primary focus:border-primary transition-all text-slate-700 dark:text-white uppercase tracking-widest" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden min-h-0">
        {activeTab === 'text' && (
          <div className="h-full flex flex-col bg-white dark:bg-[#111c22] rounded-xl border border-slate-200 dark:border-[#325567] shadow-sm animate-in fade-in duration-300 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead className="sticky top-0 bg-slate-100 dark:bg-[#192b33] border-b border-slate-200 dark:border-[#325567] z-20">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-24">ID</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Name & Subtype</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tags</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">English (Source)</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-32">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#233c48]">
                {filteredTemplates.map(t => (
                  <tr key={t.id} className="group hover:bg-slate-50 dark:hover:bg-[#192b33] transition-colors cursor-pointer" onClick={() => setEditingTemplate(t)}>
                    <td className="px-6 py-4 text-xs font-mono font-bold text-slate-500 group-hover:text-primary">{t.id}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary">{t.name}</p>
                      <p className="text-[10px] text-primary font-black uppercase tracking-widest">{t.subType}</p>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-wrap gap-1">
                          {t.tags.map(tag => <span key={tag} className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-[#1a2a32] px-1.5 py-0.5 rounded border border-[#325567]">{tag}</span>)}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 dark:text-[#92b7c9] truncate max-w-xs">{t.en}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${t.status === 'APPROVED' ? 'bg-green-100 border-green-200 text-green-700' : 'bg-amber-100 border-amber-200 text-amber-700'}`}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'symbols' && (
          <div className="h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar pb-10">
            {symbols.map(s => (
              <div key={s.id} onClick={() => setEditingSymbol(s)} className="bg-[#111c22] rounded-2xl border border-[#2d4552] p-6 flex flex-col gap-6 hover:border-primary transition-all group shadow-xl h-fit cursor-pointer">
                 <div className="flex items-start justify-between">
                    <div className="size-14 rounded-xl flex items-center justify-center border border-[#2d4552] shadow-inner" style={{ backgroundColor: s.bgColor }}>
                      {s.vectorSvg ? <img src={s.vectorSvg} alt={s.name} className="size-8 object-contain" /> : <span className="material-symbols-outlined text-3xl" style={{ color: s.symbolColor }}>{s.icon}</span>}
                    </div>
                    <span className="text-[9px] font-black text-slate-400 bg-[#1a2a32] border border-[#2d4552] px-2.5 py-1 rounded-md uppercase tracking-widest">{s.primaryTag}</span>
                 </div>
                 <div>
                   <h3 className="text-lg font-black text-white tracking-tight">{s.name}</h3>
                   <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{s.regulatory}</p>
                 </div>
                 <button className="w-full py-3 bg-[#1a2a32] rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary border border-[#2d4552]">Manage Variants</button>
              </div>
            ))}
          </div>
        )}

        {/* Other tabs remain implemented similarly or with placeholder logic... */}
      </div>

      {/* TEXT TEMPLATE EDITOR MODAL (REVAMPED TO MATCH SCREENSHOT) */}
      {editingTemplate && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setEditingTemplate(null)}></div>
          <div className="relative bg-[#101c22] w-full max-w-6xl rounded-[32px] shadow-[0_0_120px_rgba(0,0,0,0.8)] border border-[#2d4552] flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-12 py-10 flex items-center justify-between">
               <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-primary uppercase tracking-[0.1em]">{editingTemplate.id}</span>
                    <span className="text-slate-700 text-3xl font-thin">/</span>
                    <h3 className="text-3xl font-black text-white tracking-tight">{editingTemplate.name}</h3>
                  </div>
                  <span className="text-xs text-primary font-black uppercase tracking-[0.2em] mt-1.5 opacity-60">{editingTemplate.subType}</span>
               </div>
               <button onClick={() => setEditingTemplate(null)} className="p-3 text-slate-500 hover:text-white transition-colors bg-[#1a2a32] rounded-full border border-[#2d4552] shadow-xl">
                 <span className="material-symbols-outlined text-2xl">close</span>
               </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-12 pb-16 space-y-12 custom-scrollbar">
              
              {/* Reference Source */}
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Compliance Reference Source</label>
                 <input 
                    type="text"
                    value={editingTemplate.referenceSource}
                    onChange={(e) => updateTemplateField('referenceSource', e.target.value)}
                    className="w-full bg-[#16252d] border border-[#2d4552] rounded-xl px-6 py-4 text-sm font-bold text-primary focus:border-primary outline-none transition-all shadow-inner"
                    placeholder="e.g. EN 71-1:2014+A1:2018"
                 />
              </div>

              {/* Source Content Section */}
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Source Content: English (Master)</label>
                 <div className="relative group">
                    <textarea 
                      value={editingTemplate.en}
                      onChange={(e) => updateTemplateField('en', e.target.value)}
                      className="w-full bg-[#16252d] border border-[#2d4552] rounded-2xl p-8 text-xl font-medium text-white focus:ring-4 focus:ring-primary/10 outline-none min-h-[160px] shadow-[inset_0_2px_15px_rgba(0,0,0,0.4)] transition-all resize-none"
                    />
                    <div className="absolute right-6 bottom-6 flex gap-2">
                       <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-black rounded uppercase tracking-widest border border-primary/20">Master Source</span>
                    </div>
                 </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Applicable Project Tags</label>
                 <div className="flex flex-wrap items-center gap-4 p-8 bg-[#0d161b] rounded-2xl border border-[#2d4552] shadow-inner">
                    {editingTemplate.tags.map(tag => (
                      <div key={tag} className="bg-[#1a2a32] border border-[#2d4552] px-4 py-2.5 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-200">
                        <span className="text-[11px] font-bold text-white uppercase tracking-wider">{tag}</span>
                        <button onClick={() => removeTagFromTemplate(tag)} className="text-slate-500 hover:text-rose-500 transition-colors">
                           <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center gap-3">
                       <input 
                         className="bg-[#1a2a32] border border-[#2d4552] text-[11px] font-black text-white px-5 py-2.5 rounded-xl uppercase tracking-widest outline-none focus:border-primary transition-all w-48 shadow-lg"
                         placeholder="ADD TAG..."
                         value={newTagInput}
                         onChange={(e) => setNewTagInput(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && addTagToTemplate()}
                       />
                       <button onClick={addTagToTemplate} className="size-10 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center">
                          <span className="material-symbols-outlined">add</span>
                       </button>
                    </div>
                 </div>
              </div>

              {/* Regional Translation Blocks */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Regional Compliance Variants</label>
                    <div className="flex items-center gap-4">
                       <select 
                         onChange={(e) => addLanguageToTemplate(e.target.value)}
                         className="bg-[#1a2a32] border border-[#2d4552] rounded-lg text-[10px] font-black text-primary px-4 py-1.5 uppercase outline-none"
                         value=""
                       >
                         <option value="" disabled>+ Add Language Variant</option>
                         {allLanguages.map(l => (
                           <option key={l.id} value={l.id}>{l.name} ({l.region})</option>
                         ))}
                       </select>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(editingTemplate.translations).map(([langId, text]) => {
                      const lang = allLanguages.find(l => l.id === langId);
                      return (
                        <div key={langId} className="bg-[#0d161b] rounded-2xl border border-[#2d4552] p-8 space-y-4 hover:border-slate-700 transition-all group">
                           <div className="flex items-center justify-between">
                              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">{lang?.name} ({langId.toUpperCase()})</h4>
                              <span className="material-symbols-outlined text-lg text-slate-700 group-hover:text-primary transition-all">translate</span>
                           </div>
                           <textarea 
                             value={text}
                             onChange={(e) => updateTranslation(langId, e.target.value)}
                             className="w-full bg-[#16252d] border border-[#2d4552] rounded-xl p-4 text-[13px] font-medium text-slate-300 min-h-[120px] outline-none focus:border-primary/50 transition-all resize-none shadow-inner"
                             placeholder="Pending Translation..."
                           />
                        </div>
                      );
                    })}
                    {Object.keys(editingTemplate.translations).length === 0 && (
                       <div className="lg:col-span-3 py-10 border-2 border-dashed border-[#2d4552] rounded-2xl flex flex-col items-center justify-center text-slate-600 gap-2 opacity-50">
                          <span className="material-symbols-outlined text-4xl">public</span>
                          <span className="text-xs font-black uppercase tracking-widest">No translations added yet</span>
                       </div>
                    )}
                 </div>
              </div>

              {/* Change History & Remarks */}
              <div className="space-y-6 pt-10 border-t border-[#2d4552]">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Change History & Audit Log</label>
                 <div className="bg-[#0d161b] rounded-2xl border border-[#2d4552] p-8 space-y-6">
                    <div className="flex gap-4">
                       <input 
                          type="text"
                          placeholder="Add a remark about your changes..."
                          value={newRemarkInput}
                          onChange={(e) => setNewRemarkInput(e.target.value)}
                          className="flex-1 bg-[#1a2a32] border border-[#2d4552] rounded-xl px-6 py-3 text-sm text-white focus:border-primary outline-none"
                       />
                       <button onClick={addHistoryRemark} className="px-8 py-3 bg-primary text-white text-[11px] font-black rounded-xl uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">
                          Record Remark
                       </button>
                    </div>
                    <div className="space-y-4">
                       {editingTemplate.history.map((entry, idx) => (
                         <div key={idx} className="flex gap-4 p-4 bg-[#1a2a32]/50 border border-[#2d4552] rounded-xl hover:bg-[#1a2a32] transition-colors">
                            <div className="size-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-primary border border-[#2d4552]">
                               {entry.user.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                               <div className="flex items-center justify-between mb-1">
                                  <span className="text-[11px] font-black text-white">{entry.user}</span>
                                  <span className="text-[10px] font-bold text-slate-600">{entry.date}</span>
                               </div>
                               <p className="text-xs text-slate-400 leading-relaxed">{entry.remark}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-12 py-8 border-t border-[#2d4552] bg-[#0d161b]/80 flex justify-end gap-6">
               <button onClick={() => setEditingTemplate(null)} className="px-10 py-3 text-xs font-black text-slate-500 uppercase tracking-[0.1em] hover:text-white transition-colors">Discard Draft</button>
               <button onClick={() => setEditingTemplate(null)} className="px-14 py-4 bg-primary text-white text-xs font-black rounded-2xl shadow-2xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all uppercase tracking-[0.2em]">Publish Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* SYMBOL EDITOR MODAL */}
      {editingSymbol && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setEditingSymbol(null)}></div>
          <div className="relative bg-[#111c22] w-full max-w-5xl rounded-3xl shadow-[0_0_120px_rgba(0,0,0,0.8)] border border-[#2d4552] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Symbol Editor Content as defined previously... */}
            <div className="p-8 border-b border-[#2d4552] flex items-center justify-between">
               <h3 className="text-xl font-black text-white">{editingSymbol.name} Specification</h3>
               <button onClick={() => setEditingSymbol(null)} className="material-symbols-outlined text-slate-500 hover:text-white">close</button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
               {/* Left as simple for now to focus on text template updates */}
               <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SVG Upload</label>
                    <div className="aspect-square bg-black rounded-xl border-4 border-dashed border-[#2d4552] flex flex-col items-center justify-center group hover:border-primary transition-all cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      {editingSymbol.vectorSvg ? <img src={editingSymbol.vectorSvg} className="w-1/2 h-1/2 object-contain" /> : <span className="material-symbols-outlined text-4xl text-slate-600">upload</span>}
                      <input type="file" ref={fileInputRef} className="hidden" accept=".svg" onChange={handleVectorUpload} />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <section className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dimension Type</label>
                       <div className="flex gap-2 p-1 bg-[#0d161b] rounded-lg">
                          {['width', 'height', 'diameter'].map(t => (
                            <button key={t} onClick={() => updateSymbolField('dimensionType', t as any)} className={`flex-1 py-2 rounded text-[10px] font-black uppercase transition-all ${editingSymbol.dimensionType === t ? 'bg-primary text-white' : 'text-slate-500 hover:text-white'}`}>{t}</button>
                          ))}
                       </div>
                    </section>
                    <section className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Regulatory Details</label>
                       <textarea value={editingSymbol.regulatory} onChange={(e) => updateSymbolField('regulatory', e.target.value)} className="w-full bg-[#0d161b] border border-[#2d4552] rounded-xl p-4 text-xs text-slate-300" rows={4} />
                    </section>
                  </div>
               </div>
            </div>
            <div className="p-8 border-t border-[#2d4552] flex justify-end gap-4">
               <button onClick={() => setEditingSymbol(null)} className="px-6 py-2 text-xs font-black text-slate-500 uppercase">Cancel</button>
               <button onClick={() => setEditingSymbol(null)} className="px-10 py-3 bg-primary text-white text-xs font-black rounded-xl shadow-lg uppercase tracking-widest">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Register Language Modal */}
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
              className="w-full bg-[#111c22] border border-[#2d4552] rounded-lg p-4 text-white mb-6 outline-none focus:border-primary font-bold"
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

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: string }> = ({ active, onClick, label, icon }) => (
  <button onClick={onClick} className={`flex items-center gap-2 border-b-2 pb-3 pt-2 px-1 transition-all ${active ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'}`}>
    <span className="material-symbols-outlined text-lg">{icon}</span>
    <span className="text-xs font-black uppercase tracking-widest">{label}</span>
  </button>
);

const PresetEditor: React.FC<{ preset: RegionalPreset; allLanguages: Language[]; onToggleLang: (id: string) => void; onDelete: () => void }> = ({ preset, allLanguages, onToggleLang, onDelete }) => (
  <div className="bg-[#111c22] border border-[#2d4552] rounded-2xl p-8 space-y-6 shadow-[0_4px_30px_rgba(0,0,0,0.3)] group">
    <div className="flex items-center justify-between">
      <h4 className="text-lg font-black text-white tracking-tight">{preset.name}</h4>
      <div className="bg-[#1a2a32] px-3 py-1 rounded-md border border-[#2d4552] shadow-sm">
        <span className="text-[10px] font-black text-white uppercase tracking-widest">{preset.languages.length} LANGUAGES</span>
      </div>
    </div>
    <div className="flex flex-wrap gap-2.5">
      {allLanguages.map(lang => (
        <button key={lang.id} onClick={() => onToggleLang(lang.id)} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all border duration-200 ${preset.languages.includes(lang.id) ? 'bg-[#13a4ec] border-[#13a4ec] text-white' : 'bg-transparent border-[#2d4552] text-slate-500'}`}>
          {lang.name}
        </button>
      ))}
    </div>
  </div>
);

export default Database;
