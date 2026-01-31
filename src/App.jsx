import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import PresetForm from './components/PresetForm';
import AlarmNotifier from './components/AlarmNotifier';
import { completeStep } from './utils';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [scheduledProcesses, setScheduledProcesses] = useState(() => {
    // Load processes from localStorage on mount
    const saved = localStorage.getItem('scheduledProcesses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        return parsed.map(p => ({
          ...p,
          startTime: new Date(p.startTime),
          endTime: new Date(p.endTime),
          completedAt: p.completedAt ? new Date(p.completedAt) : null,
          steps: p.steps.map(s => ({
            ...s,
            scheduledTime: new Date(s.scheduledTime),
            endTime: new Date(s.endTime),
            completedAt: s.completedAt ? new Date(s.completedAt) : null
          }))
        }));
      } catch (err) {
        console.error('Failed to load processes:', err);
      }
    }
    return [];
  });

  // Save processes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('scheduledProcesses', JSON.stringify(scheduledProcesses));
  }, [scheduledProcesses]);

  const handleScheduleProcess = (process) => {
    setScheduledProcesses(prev => [...prev, process]);
    setCurrentView('dashboard');
  };

  const handleCompleteStep = (processId, stepIndex) => {
    setScheduledProcesses(prev =>
      prev.map(p =>
        p.id === processId ? completeStep(p, stepIndex) : p
      )
    );
  };

  const handleDeleteProcess = (processId) => {
    setScheduledProcesses(prev => prev.filter(p => p.id !== processId));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍞 Multi-Day Process Manager</h1>
        <nav className="app-nav">
          <button
            className={currentView === 'dashboard' ? 'active' : ''}
            onClick={() => setCurrentView('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={currentView === 'schedule' ? 'active' : ''}
            onClick={() => setCurrentView('schedule')}
          >
            Schedule Process
          </button>
        </nav>
      </header>

      <AlarmNotifier scheduledProcesses={scheduledProcesses} />

      <main className="app-main">
        {currentView === 'dashboard' && (
          <Dashboard
            scheduledProcesses={scheduledProcesses}
            onCompleteStep={handleCompleteStep}
            onDeleteProcess={handleDeleteProcess}
          />
        )}
        {currentView === 'schedule' && (
          <PresetForm onScheduleProcess={handleScheduleProcess} />
        )}
      </main>

      <footer className="app-footer">
        <p>Multi-Day Process Manager - Sourdough Edition</p>
      </footer>
    </div>
  );
}

export default App;
