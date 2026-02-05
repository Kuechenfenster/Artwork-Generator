
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import CreateProject from './pages/CreateProject';
import Database from './pages/Database';
import Translations from './pages/Translations';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'project' | 'create' | 'database' | 'translations'>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const navigateToProject = (id: string) => {
    setSelectedProjectId(id);
    setCurrentPage('project');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onProjectClick={navigateToProject} onNewProject={() => setCurrentPage('create')} />;
      case 'project':
        return <ProjectDetail projectId={selectedProjectId || 'HTI-9921'} onBack={() => setCurrentPage('dashboard')} />;
      case 'create':
        return <CreateProject onCancel={() => setCurrentPage('dashboard')} onCreate={() => setCurrentPage('dashboard')} />;
      case 'database':
        return <Database />;
      case 'translations':
        return <Translations />;
      default:
        return <Dashboard onProjectClick={navigateToProject} onNewProject={() => setCurrentPage('create')} />;
    }
  };

  const getHeaderProps = () => {
    const base = {
      title: 'Project Overview',
      onAction: () => setCurrentPage('create'),
      actionLabel: 'New Project',
      actionIcon: 'add_circle'
    };

    switch (currentPage) {
      case 'project':
        base.title = 'Project Details';
        break;
      case 'create':
        base.title = 'New Project';
        break;
      case 'translations':
        base.title = 'Outsourced Translations';
        base.actionLabel = 'New Translation Order';
        base.actionIcon = 'translate';
        base.onAction = () => { /* Handle new translation order */ };
        break;
      case 'database':
        base.title = 'Warning Database';
        base.actionLabel = 'New Template';
        base.actionIcon = 'add_box';
        base.onAction = () => { /* Handle new template creation */ };
        break;
    }
    return base;
  };

  const headerProps = getHeaderProps();

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar 
        activePage={currentPage} 
        onNavigate={(page: any) => setCurrentPage(page)} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={headerProps.title}
          onAction={headerProps.onAction}
          actionLabel={headerProps.actionLabel}
          actionIcon={headerProps.actionIcon}
        />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
