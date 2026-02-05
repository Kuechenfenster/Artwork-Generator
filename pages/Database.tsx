
import React, { useState, useMemo } from 'react';
import { WarningTemplate, SymbolConstraint, RegionalPreset, Language } from '../types';
import { suggestTranslation } from '../services/geminiService';

const ALL_LANGUAGES: Language[] = [
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
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedFilterTag, setSelectedFilterTag] = useState<string>('All Tags');
  const [editingTemplate, setEditingTemplate] = useState<WarningTemplate | null>(null);
  const [isSymbolPickerOpen, setIsSymbolPickerOpen] = useState(false);

  const [presets, setPresets] = useState<RegionalPreset[]>([
    { id: 'eu-core', name: 'EU Core', languages: ['fr', 'de', 'es', 'it'], type: 'Market' },
    { id: 'asia-t1', name: 'Asia Tier 1', languages: ['zh-cn', 'ja', 'ko'], type: 'Market' },
    { id: 'walmart-us', name: 'Walmart USA', languages: ['es'], type: 'Customer' },
    { id: 'target-intl', name: 'Target International', languages: ['fr', 'es'], type: 'Customer' },
  ]);

  const symbols: SymbolConstraint[] = [
    { id: 'S1', name: 'CE Mark', minWidth: 5, aspectRatio: '1 : 1.45', regulatory: 'Toy Safety Directive 2009/48/EC', icon: 'stars', tag: 'EU MANDATORY' },
    { id: 'S2', name: 'Age 0-3', minWidth: 10, aspectRatio: '1 : 1', regulatory: 'ISO 8124', icon: 'warning', tag: 'GLOBAL' },
    { id: 'S3', name: 'UKCA', minWidth: 5, aspectRatio: '1 : 1.25', regulatory: 'UK Regulation', icon: 'security', tag: 'UK MANDATORY' },
    { id: 'S4', name: 'Recycle', minWidth: 8, aspectRatio: '1 : 1', regulatory: 'Packaging Waste', icon: 'recycling', tag: 'GLOBAL' },
    { id: 'S5', name: 'Do Not Wash', minWidth: 10, aspectRatio: '1 : 1', regulatory: 'Textile Safety', icon: 'do_not_disturb_on', tag: 'GLOBAL' },
  ];

  const [templates, setTemplates] = useState<WarningTemplate[]>([
    { 
      id: 'WP-001', 
      name: 'Small Parts Warning', 
      subType: 'Choking Hazard (Toy Safety Act)', 
      en: 'WARNING: CHOKING HAZARD - Small parts. Not for children under 3 yrs.', 
      zh_cn: '警告：有窒息危险 - 小零件。不适合3岁以下儿童。', 
      fr: "ATTENTION ! DANGER D'ÉTOUFFEMENT – Petits éléments. Ne convient pas aux enfants de moins de 3 ans.", 
      de: 'ACHTUNG! ERSTICKUNGSGEFAHR – Kleine Teile. Nicht für Kinder unter 3 Jahren geeignet.', 
      es: 'ADVERTENCIA: PELIGRO DE ASFIXIA - Partes pequeñas. No apto para niños menores de 3 años.', 
      status: 'APPROVED', 
      category: 'GENERAL',
      tags: ['#general', 'preschool', 'safety'],
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
      tags: ['#general', 'scooter', 'parent supervision'],
      linkedSymbolIds: []
    }
  ]);

  const allUniqueTags = useMemo(() => {
    const tags = new Set<string>();
    templates.forEach(t => t.tags.forEach(tag => tags.add(tag)));
    return ['All Tags', ...Array.from(tags).sort()];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    if (selectedFilterTag === 'All Tags') return templates;
    return templates.filter(t => t.tags.includes(selectedFilterTag));
  }, [templates, selectedFilterTag]);

  const updateTemplateField = (field: keyof WarningTemplate, value: string) => {
    if (!editingTemplate) return;
    const updated = { ...editingTemplate, [field]: value };
    setEditingTemplate(updated);
    setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? updated : t));
  };

  const toggleSymbolLink = (symbolId: string) => {
    if (!editingTemplate) return;
    const currentLinks = editingTemplate.linkedSymbolIds || [];
    const newLinks = currentLinks.includes(symbolId) 
      ? currentLinks.filter(id => id !== symbolId)
      : [...currentLinks, symbolId];
    const updated = { ...editingTemplate, linkedSymbolIds: newLinks };
    setEditingTemplate(updated);
    setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? updated : t));
  };

  const togglePresetLanguage = (presetId: string, langId: string) => {
    setPresets(prev => prev.map(p => {
      if (p.id !== presetId) return p;
      const languages = p.languages.includes(langId)
        ? p.languages.filter(id => id !== langId)
        : [...p.languages, langId];
      return { ...p, languages };
    }));
  };

  return (
    <div className="flex-1 flex flex-col p-6 gap-6 max-w-[1600px] mx-auto w-full">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-xs">verified_user</span>
            Senior QA Control Center
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Warning Text & Symbol Database</h1>
          <p className="text-slate-500 dark:text-[#92b7c9] text-sm max-w-2xl">Central repository for global packaging compliance. Managing safety strings and iconography for 23 regions across all toy categories.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-[#233c48] text-slate-900 dark:text-white text-sm font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-[#325567] transition-all">
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Export CSV</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-[#233c48] text-slate-900 dark:text-white text-sm font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-[#325567] transition-all">
            <span className="material-symbols-outlined text-sm">upload_file</span>
            <span>Upload CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 dark:border-[#325567] mt-2">
        <div className="flex gap-8">
          <TabButton active={activeTab === 'text'} onClick={() => setActiveTab('text')} label="Warning Text Templates" icon="translate" />
          <TabButton active={activeTab === 'symbols'} onClick={() => setActiveTab('symbols')} label="Global Symbol Library" icon="category" />
          <TabButton active={activeTab === 'localization'} onClick={() => setActiveTab('localization')} label="Regional Localization" icon="public" />
          <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} label="Audit Logs" icon="history" />
        </div>
        
        {activeTab === 'text' && (
          <div className="py-2 flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter by Tag:</span>
            <select 
              value={selectedFilterTag}
              onChange={(e) => setSelectedFilterTag(e.target.value)}
              className="bg-white dark:bg-[#192b33] border border-slate-200 dark:border-[#325567] rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-white focus:ring-primary focus:border-primary transition-all"
            >
              {allUniqueTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
          </div>
        )}
      </div>

      {activeTab === 'text' && (
        <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-[#111c22] rounded-xl border border-slate-200 dark:border-[#325567] shadow-sm">
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1800px]">
              <thead className="sticky top-0 bg-slate-100 dark:bg-[#192b33] border-b border-slate-200 dark:border-[#325567] z-20">
                <tr>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-24">ID</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-64">Template Name</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-72">Tags</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[450px]">English (EN)</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-32 text-center">Linked Symbols</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-32">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#233c48]">
                {filteredTemplates.map(t => (
                  <tr key={t.id} className="group hover:bg-slate-50 dark:hover:bg-[#192b33] transition-colors">
                    <td className="px-4 py-4 text-xs font-mono text-slate-500">
                      <button onClick={() => setEditingTemplate(t)} className="hover:text-primary hover:underline font-bold transition-all">{t.id}</button>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => setEditingTemplate(t)} className="text-sm font-bold text-slate-900 dark:text-white hover:text-primary text-left">{t.name}</button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {t.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#233c48] text-slate-500">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 dark:text-[#92b7c9] truncate max-w-[400px]">{t.en}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {(t.linkedSymbolIds || []).map(sid => {
                          const s = symbols.find(sym => sym.id === sid);
                          return s ? <span key={sid} className="material-symbols-outlined text-sm text-slate-400" title={s.name}>{s.icon}</span> : null;
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
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

      {activeTab === 'localization' && (
        <div className="flex-1 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Presets */}
            <div className="bg-white dark:bg-[#111c22] rounded-xl border border-slate-200 dark:border-[#325567] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-[#325567] bg-slate-50 dark:bg-[#192b33] flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">public</span> Regional Market Presets
                </h3>
                <button className="text-xs font-bold text-primary hover:underline uppercase">+ Create New</button>
              </div>
              <div className="p-6 space-y-6">
                {presets.filter(p => p.type === 'Market').map(preset => (
                  <PresetEditor key={preset.id} preset={preset} onToggleLang={(lid) => togglePresetLanguage(preset.id, lid)} />
                ))}
              </div>
            </div>

            {/* Customer Specific Presets */}
            <div className="bg-white dark:bg-[#111c22] rounded-xl border border-slate-200 dark:border-[#325567] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-[#325567] bg-slate-50 dark:bg-[#192b33] flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500">store</span> Customer Specific Artworks
                </h3>
                <button className="text-xs font-bold text-primary hover:underline uppercase">+ Create New</button>
              </div>
              <div className="p-6 space-y-6">
                {presets.filter(p => p.type === 'Customer').map(preset => (
                  <PresetEditor key={preset.id} preset={preset} onToggleLang={(lid) => togglePresetLanguage(preset.id, lid)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal (Matches screenshot aesthetic) */}
      {editingTemplate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setEditingTemplate(null)}></div>
          <div className="relative bg-[#111c22] w-full max-w-5xl rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-[#2d4552] flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-[#2d4552] flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-primary uppercase tracking-widest">{editingTemplate.id}</span>
                  <span className="text-slate-500 text-xl font-thin">•</span>
                  <h3 className="text-xl font-black text-white tracking-tight">{editingTemplate.name}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editingTemplate.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-black text-slate-400 bg-[#1a2a32] border border-[#2d4552] px-3 py-1 rounded-sm">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Related Symbols</span>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 p-1.5 bg-[#1a2a32] rounded-lg border border-[#2d4552]">
                      {(editingTemplate.linkedSymbolIds || []).map(sid => {
                        const s = symbols.find(sym => sym.id === sid);
                        return s ? (
                          <div key={sid} className="size-8 bg-white rounded flex items-center justify-center shadow-lg"><span className="material-symbols-outlined text-slate-900 text-base">{s.icon}</span></div>
                        ) : null;
                      })}
                      <button onClick={() => setIsSymbolPickerOpen(!isSymbolPickerOpen)} className={`size-8 rounded border-2 border-dashed flex items-center justify-center ${isSymbolPickerOpen ? 'border-primary text-primary' : 'border-slate-700 text-slate-500'}`}>
                        <span className="material-symbols-outlined text-base">add</span>
                      </button>
                    </div>
                  </div>
                </div>
                <button onClick={() => setEditingTemplate(null)} className="p-3 text-slate-400 hover:text-white transition-colors bg-[#1a2a32] rounded-full border border-[#2d4552]"><span className="material-symbols-outlined">close</span></button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden flex relative p-8 space-y-10 flex-col">
              {isSymbolPickerOpen && (
                <div className="absolute right-8 top-0 z-50 w-72 bg-[#1a2a32] border border-primary/30 rounded-xl shadow-2xl p-4">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Symbol Library</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {symbols.map(s => (
                      <button key={s.id} onClick={() => toggleSymbolLink(s.id)} className={`aspect-square rounded border transition-all flex items-center justify-center ${(editingTemplate.linkedSymbolIds || []).includes(s.id) ? 'bg-primary border-primary text-white' : 'bg-[#111c22] border-[#2d4552] text-slate-400 hover:border-primary/50'}`}>
                        <span className="material-symbols-outlined text-lg">{s.icon}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">KEY LANGUAGE: ENGLISH (SOURCE)</label>
                  <span className="text-[10px] font-black text-primary uppercase px-3 py-1 bg-primary/10 rounded-full border border-primary/20">Master Record</span>
                </div>
                <textarea 
                  value={editingTemplate.en}
                  onChange={(e) => updateTemplateField('en', e.target.value)}
                  className="w-full bg-[#1a2a32] border border-primary/50 rounded-2xl p-6 text-lg font-medium text-white focus:ring-4 focus:ring-primary/10 outline-none min-h-[140px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                 <TranslationField label="CHINESE (SIMP)" value={editingTemplate.zh_cn} onChange={(v: string) => updateTemplateField('zh_cn', v)} />
                 <TranslationField label="FRENCH (FR)" value={editingTemplate.fr} onChange={(v: string) => updateTemplateField('fr', v)} />
                 <TranslationField label="GERMAN (DE)" value={editingTemplate.de} onChange={(v: string) => updateTemplateField('de', v)} />
                 <TranslationField label="SPANISH (ES)" value={editingTemplate.es} onChange={(v: string) => updateTemplateField('es', v)} />
              </div>
            </div>
            <div className="p-8 border-t border-[#2d4552] flex justify-end gap-8 bg-[#0d161b]">
              <button onClick={() => setEditingTemplate(null)} className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Close</button>
              <button onClick={() => setEditingTemplate(null)} className="px-12 py-4 bg-primary text-white text-sm font-black rounded-xl shadow-lg shadow-primary/20 uppercase tracking-[0.15em]">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface PresetEditorProps {
  preset: RegionalPreset;
  onToggleLang: (id: string) => void;
}

// Using React.FC to properly handle reserved props like 'key' in loops
const PresetEditor: React.FC<PresetEditorProps> = ({ preset, onToggleLang }) => (
  <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-[#15242b] border border-slate-200 dark:border-[#233c48]">
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{preset.name}</h4>
      <span className="text-[9px] font-black text-slate-400 bg-slate-200 dark:bg-[#1a2a32] px-2 py-0.5 rounded uppercase">{preset.languages.length} Languages</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {ALL_LANGUAGES.map(lang => (
        <button
          key={lang.id}
          onClick={() => onToggleLang(lang.id)}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${preset.languages.includes(lang.id) ? 'bg-primary border-primary text-white' : 'bg-white dark:bg-[#111c22] border-slate-200 dark:border-[#2d4552] text-slate-500 hover:border-primary/50'}`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  </div>
);

interface TranslationFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

// Using React.FC for consistent sub-component patterns
const TranslationField: React.FC<TranslationFieldProps> = ({ label, value, onChange }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
    <textarea 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="w-full bg-[#1a2a32] border border-[#2d4552] rounded-xl p-4 text-xs font-medium text-slate-300 min-h-[100px]"
    />
  </div>
);

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}

// Using React.FC for consistent sub-component patterns
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 border-b-2 pb-3 pt-2 px-1 transition-all ${active ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'}`}
  >
    <span className="material-symbols-outlined text-lg">{icon}</span>
    <span className="text-sm font-bold">{label}</span>
  </button>
);

export default Database;
