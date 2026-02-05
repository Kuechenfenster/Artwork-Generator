
import React from 'react';

interface HeaderProps {
  title: string;
  onAction: () => void;
  actionLabel?: string;
  actionIcon?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  onAction, 
  actionLabel = 'New Project', 
  actionIcon = 'add_circle' 
}) => {
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-[#111c22] border-b border-slate-200 dark:border-[#233c48] z-10">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-slate-500">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-[#233c48] rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300">
          <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
          Server Status: Stable
        </div>
        <button 
          onClick={onAction}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-lg">{actionIcon}</span>
          {actionLabel}
        </button>
      </div>
    </header>
  );
};

export default Header;
