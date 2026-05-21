
import React, { useState, useEffect } from 'react';

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
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Sync React state with the actual class on documentElement
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-[#111c22] border-b border-slate-200 dark:border-[#233c48] z-10 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-slate-500">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#233c48] transition-all flex items-center justify-center border border-transparent hover:border-slate-200 dark:hover:border-[#2d4552]"
          aria-label="Toggle Theme"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <span className="material-symbols-outlined">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

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
