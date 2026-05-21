
import React, { useState } from 'react';

interface TranslationRequest {
  id: string;
  project: string;
  targetLang: string;
  agency: string;
  status: 'Outsourced' | 'In Translation' | 'Awaiting Review' | 'Approved';
  dueDate: string;
  originalText: string;
  translatedText?: string;
  progress: number;
}

const Translations: React.FC = () => {
  const [requests, setRequests] = useState<TranslationRequest[]>([
    { 
      id: 'TR-4022', 
      project: 'Teamsterz Fire Engine', 
      targetLang: 'Japanese', 
      agency: 'GlobalLingua Ltd', 
      status: 'In Translation', 
      dueDate: 'Oct 28, 2023', 
      originalText: 'WARNING: CHOKING HAZARD - Small parts. Not for children under 3 yrs.',
      progress: 65 
    },
    { 
      id: 'TR-4023', 
      project: 'Bubble Mania Mega Wand', 
      targetLang: 'Arabic', 
      agency: 'TransPerfect', 
      status: 'Awaiting Review', 
      dueDate: 'Oct 30, 2023', 
      originalText: 'DANGER: Liquid contains small soapy particles.',
      translatedText: 'خطر: يحتوي السائل على جزيئات صابونية صغيرة.',
      progress: 100 
    },
    { 
      id: 'TR-4024', 
      project: 'Dolls World Carrycot', 
      targetLang: 'Polish', 
      agency: 'GlobalLingua Ltd', 
      status: 'Outsourced', 
      dueDate: 'Nov 02, 2023', 
      originalText: 'Adult assembly required. Keep away from fire.',
      progress: 0 
    },
  ]);

  const [selectedTask, setSelectedTask] = useState<TranslationRequest | null>(null);
  const [submission, setSubmission] = useState('');

  const handleSubmitReview = () => {
    if (!selectedTask) return;
    const updated = requests.map(r => 
      r.id === selectedTask.id 
        ? { ...r, status: 'Awaiting Review' as const, translatedText: submission, progress: 100 } 
        : r
    );
    setRequests(updated);
    setSelectedTask(null);
    setSubmission('');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard label="Open Requests" value="12" icon="assignment" color="text-primary" />
        <SummaryCard label="In Translation" value="5" icon="translate" color="text-amber-500" />
        <SummaryCard label="Pending Review" value="4" icon="rate_review" color="text-indigo-500" />
        <SummaryCard label="Avg. Turnaround" value="2.4d" icon="speed" color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Request Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-[#111c22] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#15242b]">
              <h2 className="font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">outbound</span>
                Active Outsourced Tasks
              </h2>
              <button className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">New Order</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-[#192b33] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Project & Language</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-[#192b33] transition-colors group">
                      <td className="px-6 py-4 text-xs font-mono font-bold text-slate-500">{req.id}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{req.project}</p>
                        <p className="text-xs text-primary font-medium">{req.targetLang} • {req.agency}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 w-32">
                           <span className={`text-[10px] font-black uppercase tracking-tighter ${
                             req.status === 'Awaiting Review' ? 'text-indigo-500' : 
                             req.status === 'In Translation' ? 'text-amber-500' : 'text-slate-400'
                           }`}>{req.status}</span>
                           <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className={`h-full transition-all duration-1000 ${
                                req.status === 'Awaiting Review' ? 'bg-indigo-500' : 'bg-amber-500'
                              }`} style={{ width: `${req.progress}%` }}></div>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => { setSelectedTask(req); setSubmission(req.translatedText || ''); }}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Panel: simulated for Agency Partner */}
        <div className="space-y-6">
          <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-6xl">cloud_sync</span>
            </div>
            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-2">Agency Workspace</h3>
            <p className="text-xs text-slate-600 dark:text-[#92b7c9] leading-relaxed mb-4">
              Select a task from the list to upload the completed safety string translations. Ensure all regional terminology is compliant with local toy safety laws.
            </p>
          </div>

          {selectedTask ? (
            <div className="p-6 bg-white dark:bg-[#111c22] rounded-2xl border border-primary/50 shadow-2xl animate-in slide-in-from-right-10 duration-300">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-sm">Submission: {selectedTask.id}</h4>
                <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-white"><span className="material-symbols-outlined text-sm">close</span></button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Source English</p>
                  <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 italic">
                    "{selectedTask.originalText}"
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Target Translation ({selectedTask.targetLang})</p>
                  <textarea 
                    value={submission}
                    onChange={(e) => setSubmission(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#192b33] border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs focus:ring-primary focus:border-primary"
                    placeholder="Enter translated text here..."
                    rows={4}
                  ></textarea>
                </div>
                <button 
                  onClick={handleSubmitReview}
                  className="w-full py-3 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-primary/30 hover:brightness-110 transition-all"
                >
                  Release to Quality Dept.
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-3 opacity-20">drafts</span>
              <p className="text-xs font-bold uppercase tracking-widest opacity-50">Select task to submit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, icon, color }: any) => (
  <div className="bg-white dark:bg-[#111c22] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white">{value}</h3>
    </div>
    <div className={`size-12 rounded-xl bg-slate-50 dark:bg-[#192b33] flex items-center justify-center ${color}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
  </div>
);

export default Translations;
