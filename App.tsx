
import React, { useState, useEffect } from 'react';
import { AppView, EmergencyContact } from './types';
import Dashboard from './components/Dashboard';
import SafetyMap from './components/SafetyMap';
import VoiceCompanion from './components/VoiceCompanion';
import SOSView from './components/SOSView';
import EducationView from './components/EducationView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'Emergency Services', phone: '911' }
  ]);

  const handleQuickExit = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">GuardianAngel</h1>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleQuickExit}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
            >
              QUICK EXIT
            </button>
            <button 
              onClick={() => setCurrentView(AppView.SOS)}
              className="px-4 py-1.5 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-all animate-pulse"
            >
              SOS
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 pb-24">
        {currentView === AppView.DASHBOARD && <Dashboard onNavigate={setCurrentView} />}
        {currentView === AppView.MAPS && <SafetyMap />}
        {currentView === AppView.VOICE_COMPANION && <VoiceCompanion />}
        {currentView === AppView.SOS && <SOSView contacts={contacts} onAddContact={(c) => setContacts([...contacts, c])} />}
        {currentView === AppView.EDUCATION && <EducationView />}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-around items-center z-50">
        <NavButton 
          active={currentView === AppView.DASHBOARD} 
          onClick={() => setCurrentView(AppView.DASHBOARD)} 
          label="Home"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />}
        />
        <NavButton 
          active={currentView === AppView.MAPS} 
          onClick={() => setCurrentView(AppView.MAPS)} 
          label="Safety Map"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />}
        />
        <NavButton 
          active={currentView === AppView.VOICE_COMPANION} 
          onClick={() => setCurrentView(AppView.VOICE_COMPANION)} 
          label="Guardian"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />}
        />
        <NavButton 
          active={currentView === AppView.EDUCATION} 
          onClick={() => setCurrentView(AppView.EDUCATION)} 
          label="Tips"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
        />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean, onClick: () => void, label: string, icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}>
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {icon}
    </svg>
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
  </button>
);

export default App;
