
import React from 'react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'projects', label: 'Projects', icon: 'folder_open' },
    { id: 'database', label: 'Database', icon: 'database' },
    { id: 'translations', label: 'Translations', icon: 'translate' },
  ];

  const secondaryItems = [
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'help', label: 'Documentation', icon: 'help_outline' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#111c22] border-r border-[#233c48] hidden lg:flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined fill-1">draw</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-white text-base font-bold leading-tight">HTI Artwork</h1>
          <p className="text-primary text-xs font-semibold uppercase tracking-wider">Generator Tool</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-left ${
              activePage === item.id 
                ? 'bg-primary/10 text-primary' 
                : 'text-slate-400 hover:bg-[#233c48] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
        
        <div className="my-4 border-t border-[#233c48]"></div>

        {secondaryItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {}}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-[#233c48] hover:text-white transition-colors w-full text-left"
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-[#233c48]/50 p-4 rounded-xl flex items-center gap-3">
          <div className="size-8 rounded-full bg-slate-600 overflow-hidden ring-2 ring-primary/20">
            <img 
              alt="User" 
              src="https://picsum.photos/seed/james/100/100" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">James Harrison</p>
            <p className="text-[10px] text-slate-400 truncate uppercase">Lead Designer</p>
          </div>
          <button className="material-symbols-outlined text-slate-500 text-sm hover:text-white transition-colors">logout</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
