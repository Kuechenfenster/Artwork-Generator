
import React from 'react';
import { ProjectStatus } from '../types';

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId, onBack }) => {
  return (
    <div className="max-w-[1400px] mx-auto p-6">
      {/* Breadcrumbs and Action Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <button onClick={onBack} className="hover:text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-base">arrow_back</span> Dashboard
            </button>
            <span>/</span>
            <span>Projects</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-200">#{projectId}</span>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">#{projectId} | Rev 01</h1>
            <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-800">Under Review</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Preschool Educational Toy Series - Artwork Generation</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-border-dark text-sm font-semibold hover:bg-slate-50 dark:hover:bg-panel-dark transition-colors">
            <span className="material-symbols-outlined text-lg">person_add</span> Invite Member
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
            <span className="material-symbols-outlined text-lg">edit_note</span> Open Project Editor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Metadata and Assets */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailCard icon="calendar_today" label="Due Date" value="Oct 24, 2023" />
            <DetailCard icon="category" label="Category" value="Preschool" />
            <DetailCard icon="child_care" label="Age Grade" value="3+ Years" />
          </div>

          <TeamSection />

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">image</span> Product Reference Assets
              </h3>
              <button className="text-sm font-semibold text-primary">Upload More</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AssetThumbnail src="https://picsum.photos/seed/toy1/400/400" />
              <AssetThumbnail src="https://picsum.photos/seed/toy2/400/400" />
              <AddAssetCard />
            </div>
          </div>
        </div>

        {/* Right Side: Workflow and Activity */}
        <div className="lg:col-span-4 space-y-6">
          <ResponsibilityCard 
            title="Current Action Required"
            message="Michael Chen (QA) needs to validate the multi-language symbol combinations."
            meta="Waiting since Oct 12, 11:45 AM"
          />
          
          <WorkflowTimeline />
          
          <ActivityLog />
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ icon, label, value }: any) => (
  <div className="p-5 rounded-xl bg-white dark:bg-panel-dark border border-slate-200 dark:border-border-dark">
    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
      <span className="material-symbols-outlined text-lg">{icon}</span>
      <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

const TeamSection = () => (
  <div className="bg-white dark:bg-panel-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex justify-between items-center">
      <h3 className="font-bold">Project Team</h3>
      <span className="text-xs text-primary font-bold cursor-pointer hover:underline">Manage Team</span>
    </div>
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <TeamMemberRow 
        name="Sarah Jenkins" 
        role="Lead Designer" 
        email="sarah.j@htitoys.com" 
        icon="design_services" 
        iconColor="text-indigo-500"
        bgColor="bg-indigo-500/10"
      />
      <TeamMemberRow 
        name="Michael Chen" 
        role="QA Manager" 
        email="m.chen@htitoys.com" 
        icon="verified_user" 
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
      />
    </div>
  </div>
);

const TeamMemberRow = ({ name, role, email, icon, iconColor, bgColor }: any) => (
  <div className="flex items-center gap-4">
    <div className={`size-12 rounded-lg ${bgColor} flex items-center justify-center`}>
      <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
    </div>
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{role}</p>
      <p className="font-bold">{name}</p>
      <p className="text-xs text-slate-400">{email}</p>
    </div>
  </div>
);

const AssetThumbnail = ({ src }: { src: string }) => (
  <div className="aspect-square rounded-xl bg-slate-200 dark:bg-border-dark overflow-hidden relative group cursor-pointer">
    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={src} alt="Reference" />
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
      <span className="material-symbols-outlined text-white">zoom_in</span>
    </div>
  </div>
);

const AddAssetCard = () => (
  <div className="aspect-square rounded-xl bg-slate-200 dark:bg-border-dark overflow-hidden relative group cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary hover:border-primary transition-all">
    <span className="material-symbols-outlined text-3xl">add_circle</span>
    <span className="text-xs font-bold uppercase tracking-wider">Add Asset</span>
  </div>
);

const ResponsibilityCard = ({ title, message, meta }: any) => (
  <div className="p-6 rounded-xl bg-primary/10 border border-primary/20">
    <div className="flex items-start gap-4">
      <div className="size-10 rounded-full bg-primary flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-white">assignment_ind</span>
      </div>
      <div>
        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{title}</p>
        <p className="text-sm font-bold dark:text-white leading-tight mb-2">{message}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{meta}</p>
      </div>
    </div>
  </div>
);

const WorkflowTimeline = () => (
  <div className="bg-white dark:bg-panel-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark">
      <h3 className="font-bold flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">analytics</span> Workflow Progress
      </h3>
    </div>
    <div className="p-6">
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-border-dark">
        <TimelineItem title="Template Selection" meta="Completed by Sarah J. • Oct 10" status="done" />
        <TimelineItem title="Language Mapping" meta="24 languages applied • Oct 11" status="done" />
        <TimelineItem title="Symbol Validation" meta="Under Review by QA Team" status="active" />
        <TimelineItem title="Final Export" meta="Scheduled after QA Approval" status="upcoming" />
      </div>
    </div>
  </div>
);

const TimelineItem = ({ title, meta, status }: any) => {
  const iconMap: any = {
    done: 'check',
    active: 'visibility',
    upcoming: 'lock'
  };
  const bgMap: any = {
    done: 'bg-emerald-500',
    active: 'bg-primary ring-4 ring-primary/20 animate-pulse',
    upcoming: 'bg-slate-100 dark:bg-border-dark'
  };
  
  return (
    <div className="relative flex items-center gap-6">
      <div className={`relative z-10 size-10 rounded-full flex items-center justify-center shadow-lg ${bgMap[status]}`}>
        <span className={`material-symbols-outlined text-white text-xl font-bold`}>{iconMap[status]}</span>
      </div>
      <div>
        <h4 className={`text-sm font-bold ${status === 'active' ? 'text-primary' : status === 'upcoming' ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>{title}</h4>
        <p className="text-xs text-slate-500">{meta}</p>
      </div>
    </div>
  );
};

const ActivityLog = () => (
  <div className="p-6 rounded-xl bg-white dark:bg-panel-dark border border-slate-200 dark:border-border-dark">
    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Activity</h4>
    <div className="space-y-4">
      <div className="flex gap-3">
        <span className="material-symbols-outlined text-slate-400 text-base mt-0.5">comment</span>
        <p className="text-xs text-slate-500 dark:text-slate-300">
          <span className="font-bold">Michael Chen</span> added a comment: "Double check the German translation for choking hazard."
        </p>
      </div>
      <div className="flex gap-3">
        <span className="material-symbols-outlined text-slate-400 text-base mt-0.5">history_edu</span>
        <p className="text-xs text-slate-500 dark:text-slate-300">
          <span className="font-bold">System</span> generated 01 revision for review.
        </p>
      </div>
    </div>
    <button className="w-full mt-6 py-2 text-xs font-bold text-slate-400 hover:text-primary transition-colors border-t border-slate-100 dark:border-border-dark">View Full History</button>
  </div>
);

export default ProjectDetail;
