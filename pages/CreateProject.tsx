
import React, { useState } from 'react';

interface Language {
  id: string;
  name: string;
  region: string;
}

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

const AGE_GRADES = [
  { label: '0m+', icon: 'baby_changing_station', sub: 'Newborn' },
  { label: '6m+', icon: 'child_care', sub: 'Infant' },
  { label: '12m+', icon: 'toys', sub: 'Toddler' },
  { label: '18m+', icon: 'stroller', sub: 'Toddler' },
  { label: '3+', icon: 'face', sub: 'Preschool' },
  { label: '5+', icon: 'backpack', sub: 'Child' },
  { label: '8+', icon: 'rocket_launch', sub: 'Junior' },
  { label: '12+', icon: 'videogame_asset', sub: 'Teen' },
];

interface CreateProjectProps {
  onCancel: () => void;
  onCreate: () => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({ onCancel, onCreate }) => {
  const [selectedLangs, setSelectedLangs] = useState<string[]>(['en']);
  const [selectedAge, setSelectedAge] = useState<string | null>('3+');
  const [isDragging, setIsDragging] = useState(false);

  const availableLangs = ALL_LANGUAGES.filter(l => !selectedLangs.includes(l.id));

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('langId', id);
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const id = e.dataTransfer.getData('langId');
    if (id && !selectedLangs.includes(id)) {
      setSelectedLangs([...selectedLangs, id]);
    }
  };

  const removeLang = (id: string) => {
    if (id === 'en') return;
    setSelectedLangs(selectedLangs.filter(l => l !== id));
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-2 uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm">add_circle</span>
          Project Initialization
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Create New Artwork</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-lg">Define product parameters and regional scope for automatic layout generation.</p>
      </div>

      <div className="space-y-10">
        {/* Section 1: Core Details */}
        <section className="bg-white dark:bg-[#192b33] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#15242b]">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
              <span className="material-symbols-outlined text-primary size-8 bg-primary/10 rounded-lg flex items-center justify-center">inventory_2</span>
              Core Product Details
            </h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormInput label="Product ID / SKU" placeholder="e.g. HTI-9901" required />
            <FormSelect label="License Partner" options={['Teamsterz', 'JCB', 'Bubblz', 'Disney Princess', 'Peppa Pig']} />
            <FormInput label="Internal Brand" placeholder="Enter brand name" />
            <FormSelect label="Product Category" options={['Die-cast Vehicles', 'Outdoor Play', 'Roleplay', 'Soft Toys', 'Nurturing']} />
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Project Brief / Notes</label>
              <textarea className="w-full bg-slate-50 dark:bg-[#101c22] border-slate-300 dark:border-slate-700 rounded-xl focus:ring-primary focus:border-primary text-slate-900 dark:text-white p-4 transition-all" placeholder="..." rows={3}></textarea>
            </div>
          </div>
        </section>

        {/* Section 2: Regional Localization (UI MATCHED TO SCREENSHOT) */}
        <section className="bg-white dark:bg-[#111c22] rounded-2xl border border-slate-200 dark:border-[#2d4552] shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-[#2d4552] bg-slate-50 dark:bg-[#15242b] flex items-center gap-3">
             <span className="material-symbols-outlined text-primary size-8 bg-primary/10 rounded-lg flex items-center justify-center">public</span>
             <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Regional Localization</h2>
          </div>
          <div className="p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left: Available Library */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Available Library</h3>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Drag items to right</span>
                </div>
                <div className="bg-[#101c22] p-8 rounded-2xl border-2 border-dashed border-[#2d4552] min-h-[380px]">
                  <div className="grid grid-cols-2 gap-3">
                    {availableLangs.map((lang) => (
                      <div
                        key={lang.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lang.id)}
                        onDragEnd={() => setIsDragging(false)}
                        className="px-4 py-2 bg-[#1a2a32] rounded-xl border border-[#2d4552] shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all flex items-center gap-3 group relative"
                      >
                        <span className="material-symbols-outlined text-sm text-slate-500 group-hover:text-primary">drag_indicator</span>
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-white leading-tight">{lang.name}</span>
                           <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{lang.region}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Project Scope */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Project Scope</h3>
                  <span className="text-[10px] text-primary font-black uppercase tracking-widest">{selectedLangs.length} Markets Included</span>
                </div>
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`p-8 rounded-2xl border-2 min-h-[380px] transition-all relative ${
                    isDragging 
                    ? 'border-primary bg-primary/5 scale-[1.01]' 
                    : 'border-[#2d4552] bg-[#101c22] shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]'
                  }`}
                >
                  <div className="flex flex-wrap gap-3">
                    {selectedLangs.map((id) => {
                      const lang = ALL_LANGUAGES.find(l => l.id === id) || { name: 'English', id: 'en' };
                      return (
                        <div
                          key={id}
                          className="px-6 py-2.5 bg-primary text-white rounded-xl shadow-[0_5px_15px_rgba(19,164,236,0.3)] flex items-center gap-4 animate-in fade-in zoom-in duration-200"
                        >
                          <span className="text-sm font-black">{lang.name}</span>
                          {id !== 'en' && (
                            <button onClick={() => removeLang(id)} className="hover:bg-white/20 rounded-full size-5 flex items-center justify-center transition-colors">
                              <span className="material-symbols-outlined text-xs">close</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-6 pt-2">
                  <button 
                    onClick={() => setSelectedLangs(['en', 'fr', 'de', 'es', 'it'])}
                    className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    + Add EU Core
                  </button>
                  <button 
                    onClick={() => setSelectedLangs(['en', 'zh-cn', 'ja', 'ko'])}
                    className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    + Add Asia Tier 1
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Age Grading */}
        <section className="bg-white dark:bg-[#192b33] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#15242b]">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-primary size-8 bg-primary/10 rounded-lg flex items-center justify-center">verified_user</span>
              Regulatory Age Grading
            </h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {AGE_GRADES.map((age) => (
                <button
                  key={age.label}
                  onClick={() => setSelectedAge(age.label)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    selectedAge === age.label 
                    ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20 scale-[1.05]' 
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#101c22] text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined mb-2">{age.icon}</span>
                  <span className="text-sm font-black">{age.label}</span>
                  <span className="text-[10px] uppercase font-bold opacity-60">{age.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Visual Assets */}
        <section className="bg-white dark:bg-[#192b33] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#15242b]">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3 uppercase tracking-tighter">
              <span className="material-symbols-outlined text-primary size-8 bg-primary/10 rounded-lg flex items-center justify-center">cloud_upload</span>
              Visual Assets & Deadline
            </h2>
          </div>
          <div className="p-8 space-y-8">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-[#101c22] hover:border-primary transition-all cursor-pointer group">
              <span className="material-symbols-outlined text-5xl text-slate-400 group-hover:text-primary mb-4 transition-transform group-hover:-translate-y-1">upload_file</span>
              <p className="text-base font-bold text-slate-700 dark:text-slate-300">Drop artwork files or click to browse</p>
              <p className="text-xs text-slate-500 mt-2 uppercase tracking-[0.2em] font-black">AI, PDF, JPG, or PNG up to 100MB</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Target Delivery Date</label>
                <input className="w-full bg-slate-50 dark:bg-[#101c22] border-slate-300 dark:border-slate-700 rounded-xl p-4 font-black" type="date" />
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl flex items-start gap-4">
                <span className="material-symbols-outlined text-amber-500">lightbulb</span>
                <p className="text-[11px] text-slate-600 dark:text-[#92b7c9] leading-relaxed">
                  <strong className="text-slate-900 dark:text-white block mb-1">Compliance Check:</strong> 
                  System will prioritize <span className="text-primary font-bold">Toy Safety Directive 2009/48/EC</span> strings for selected markets.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Actions */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-end gap-6 pb-20 pt-10 border-t border-slate-200 dark:border-slate-800">
        <button onClick={onCancel} className="w-full sm:w-auto px-12 py-4 text-slate-500 font-black hover:text-white transition-colors uppercase text-xs tracking-[0.2em]">Cancel</button>
        <button onClick={onCreate} className="w-full sm:w-auto px-16 py-5 bg-primary text-white font-black rounded-xl shadow-2xl shadow-primary/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-4 uppercase text-xs tracking-[0.2em]">
          <span className="material-symbols-outlined">rocket_launch</span>
          Generate Artwork
        </button>
      </div>
    </div>
  );
};

const FormInput = ({ label, placeholder, required }: any) => (
  <div className="flex flex-col gap-3">
    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input className="w-full bg-slate-50 dark:bg-[#101c22] border-slate-300 dark:border-slate-700 rounded-xl p-4 text-sm font-bold placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder={placeholder} type="text" />
  </div>
);

const FormSelect = ({ label, options }: any) => (
  <div className="flex flex-col gap-3">
    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">{label}</label>
    <select className="w-full bg-slate-50 dark:bg-[#101c22] border-slate-300 dark:border-slate-700 rounded-xl p-4 text-sm font-black outline-none focus:ring-2 focus:ring-primary/20 transition-all">
      {options.map((o: string) => <option key={o}>{o}</option>)}
    </select>
  </div>
);

export default CreateProject;
