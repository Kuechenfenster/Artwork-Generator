
import React from 'react';
import { Project, ProjectStatus } from '../types';

// Helper components moved above the main component to resolve hoisting issues
const StatCard = ({ title, value, change, icon, changeType, colorClass = '', borderClass = '', bgClass = '' }: any) => (
  <div className={`bg-white dark:bg-[#111c22] p-6 rounded-xl border border-slate-200 dark:border-[#233c48] relative overflow-hidden group ${borderClass} ${bgClass}`}>
    <div className={`absolute top-0 right-0 p-4 text-slate-100 dark:text-slate-800 pointer-events-none transition-transform group-hover:scale-110`}>
      <span className="material-symbols-outlined text-6xl opacity-20">{icon}</span>
    </div>
    <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1">{title}</p>
    <h3 className={`text-3xl font-black text-slate-800 dark:text-white tracking-tight ${colorClass}`}>{value}</h3>
    <div className={`mt-4 flex items-center gap-2 text-xs font-bold ${changeType === 'positive' ? 'text-green-500' : changeType === 'warning' ? 'text-amber-500' : 'text-rose-500'}`}>
      <span className="material-symbols-outlined text-sm">{changeType === 'positive' ? 'trending_up' : changeType === 'warning' ? 'schedule' : 'priority_high'}</span>
      <span>{change}</span>
    </div>
  </div>
);

const FilterSelect = ({ label }: { label: string }) => (
  <select className="bg-slate-50 dark:bg-[#233c48] border-none rounded-lg text-sm font-medium py-2.5 pl-4 pr-10 text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-primary/50">
    <option>{label}</option>
  </select>
);

interface ProjectRowProps {
  project: Project;
  onClick: () => void;
}

// Using React.FC to ensure the component correctly handles reserved props like 'key'
const ProjectRow: React.FC<ProjectRowProps> = ({ project, onClick }) => {
  const statusColors = {
    [ProjectStatus.ACTIVE]: 'bg-green-500/10 text-green-500',
    [ProjectStatus.OVERDUE]: 'bg-rose-500/10 text-rose-500',
    [ProjectStatus.PENDING]: 'bg-amber-500/10 text-amber-500',
    [ProjectStatus.DRAFT]: 'bg-slate-500/10 text-slate-500 dark:text-slate-400'
  };

  const statusDot = {
    [ProjectStatus.ACTIVE]: 'bg-green-500',
    [ProjectStatus.OVERDUE]: 'bg-rose-500',
    [ProjectStatus.PENDING]: 'bg-amber-500',
    [ProjectStatus.DRAFT]: 'bg-slate-400'
  };

  return (
    <tr 
      onClick={onClick}
      className={`hover:bg-slate-50 dark:hover:bg-[#233c48]/20 transition-colors cursor-pointer ${project.status === ProjectStatus.OVERDUE ? 'bg-rose-500/5' : ''}`}
    >
      <td className={`px-6 py-4 ${project.status === ProjectStatus.OVERDUE ? 'border-l-4 border-rose-500' : ''}`}>
        <span className="text-sm font-black text-slate-800 dark:text-white">{project.id}</span>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-800 dark:text-white">{project.name}</span>
          <span className="text-xs text-primary font-medium">{project.brand}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-[#233c48] rounded text-slate-500 dark:text-slate-300">{project.category}</span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-bold ${statusColors[project.status]}`}>
          <span className={`size-1.5 rounded-full ${statusDot[project.status]}`}></span>
          {project.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`text-sm font-medium ${project.status === ProjectStatus.OVERDUE ? 'text-rose-500 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
          {project.dueDate}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </td>
    </tr>
  );
};

interface DashboardProps {
  onProjectClick: (id: string) => void;
  onNewProject: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onProjectClick, onNewProject }) => {
  const projects: Project[] = [
    { id: 'HTI-7721', name: 'Teamsterz Fire Engine', brand: 'Teamsterz', category: 'Vehicles', status: ProjectStatus.ACTIVE, dueDate: '24 Oct 2023' },
    { id: 'HTI-8812', name: 'Dolls World Carrycot', brand: 'Dolls World', category: 'Nurturing', status: ProjectStatus.OVERDUE, dueDate: '12 Oct 2023' },
    { id: 'HTI-4456', name: 'Peppa Pig Medical Kit', brand: 'Licenced Play', category: 'Roleplay', status: ProjectStatus.PENDING, dueDate: '05 Nov 2023' },
    { id: 'HTI-1290', name: 'Bubble Mania Mega Wand', brand: 'Bubble Mania', category: 'Summer', status: ProjectStatus.DRAFT, dueDate: '18 Nov 2023' },
    { id: 'HTI-9234', name: 'Micro Machines Super Van', brand: 'Micro Machines', category: 'Vehicles', status: ProjectStatus.ACTIVE, dueDate: '21 Dec 2023' },
  ];

  return (
    <div className="p-8">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Projects" 
          value="128" 
          change="+5% from last month" 
          icon="inventory_2" 
          changeType="positive" 
        />
        <StatCard 
          title="Pending Review" 
          value="14" 
          change="2 assigned to you" 
          icon="pending_actions" 
          changeType="warning" 
          colorClass="text-amber-500"
        />
        <StatCard 
          title="Overdue Tasks" 
          value="3" 
          change="Requires immediate action" 
          icon="error_outline" 
          changeType="negative" 
          colorClass="text-rose-500"
          borderClass="border-rose-500/20"
          bgClass="dark:bg-rose-500/5"
        />
      </div>

      {/* Project Database Table Section */}
      <div className="flex flex-col gap-6 bg-white dark:bg-[#111c22] border border-slate-200 dark:border-[#233c48] rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-[#233c48]">
          <h4 className="text-base font-bold text-slate-800 dark:text-white mb-6">Project Database</h4>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px] relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
              <input 
                className="w-full bg-slate-50 dark:bg-[#233c48] border-none rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-700 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/50 transition-all" 
                placeholder="Search Product ID, Name or SKU..." 
                type="text"
              />
            </div>
            <div className="flex items-center gap-3">
              <FilterSelect label="All Categories" />
              <FilterSelect label="Language" />
              <FilterSelect label="Age Grade" />
              <button className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold px-2">
                <span className="material-symbols-outlined text-lg">filter_list</span>
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-[#233c48]/30 border-b border-slate-100 dark:border-[#233c48]">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Product ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name & Brand</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Due Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#233c48]">
              {projects.map((p) => (
                <ProjectRow key={p.id} project={p} onClick={() => onProjectClick(p.id)} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50/50 dark:bg-[#233c48]/10 flex items-center justify-between border-t border-slate-100 dark:border-[#233c48]">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Showing 1 to 5 of 128 Projects</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-[#233c48] text-slate-400 disabled:opacity-30" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="size-8 rounded-lg bg-primary text-white text-xs font-bold">1</button>
            <button className="size-8 rounded-lg hover:bg-slate-200 dark:hover:bg-[#233c48] text-slate-600 dark:text-slate-300 text-xs font-bold">2</button>
            <button className="size-8 rounded-lg hover:bg-slate-200 dark:hover:bg-[#233c48] text-slate-600 dark:text-slate-300 text-xs font-bold">3</button>
            <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-[#233c48] text-slate-400">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
