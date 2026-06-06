import { useState } from 'react';
import { Toaster } from 'sonner';
import { SportSelector } from './components/SportSelector';
import { PredictionForm } from './components/PredictionForm';
import { PredictionResult } from './components/PredictionResult';
import { RecentPredictions } from './components/RecentPredictions';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { Login } from './pages/Login';
import type { PredictionResultData } from './lib/predictor';
import type { Sport } from './lib/sports-data';
import { User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [sport, setSport] = useState<Sport | null>(null);
  const [result, setResult] = useState<PredictionResultData | null>(null);
  const [currentView, setCurrentView] = useState<'new' | 'history' | 'analytics'>('new');
  const [predictions, setPredictions] = useState<any[]>([]);

  const handlePredict = (data: PredictionResultData) => {
    setResult(data);
    setPredictions(prev => [{
      date: new Date().toLocaleDateString('en-GB'),
      sport,
      ...data,
      outcome: data.homeWin > data.awayWin ? 'Home Win' : data.awayWin > data.homeWin ? 'Away Win' : 'Draw',
    }, ...prev]);
  };

  const navItems = [
    { id: 'new', label: 'New Prediction', icon: '✨' },
    { id: 'history', label: 'History', icon: '📋' },
    { id: 'analytics', label: 'Model Analytics', icon: '📊' },
  ] as const;

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-sage-light font-sans p-6 overflow-hidden">
      <Toaster position="bottom-right" />
      
      {/* Sidebar - sits directly on sage-light background */}
      <aside className="w-[280px] bg-transparent flex flex-col pt-4 shrink-0 pr-6">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-8 h-8 bg-sage-dark text-olive-dark flex items-center justify-center rounded-full font-bold">P</div>
          <span className="font-bold text-xl tracking-tight text-olive-dark">AI Predictor</span>
        </div>
        
        <nav className="flex-1 px-2 flex flex-col gap-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                "flex items-center gap-4 px-5 py-3.5 rounded-full text-sm font-semibold transition-all text-left",
                currentView === item.id 
                  ? "bg-sage-active text-olive-dark shadow-sm" 
                  : "text-olive/70 hover:bg-sage/40 hover:text-olive-dark"
              )}
            >
              <span className="text-xl w-6 text-center">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-8 pb-4 mt-auto">
          <div className="text-xs text-olive/70 mb-1 font-medium capitalize">total predictions</div>
          <div className="text-3xl font-bold text-olive-dark">{predictions.length}</div>
        </div>
      </aside>

      {/* Main Content Area - Huge White Rounded Card */}
      <div className="flex-1 flex flex-col overflow-hidden bg-card rounded-3xl shadow-sm border border-sage/20 relative">
        {/* Top Navbar */}
        <header className="h-24 flex items-center justify-between px-10 shrink-0 border-b border-sage/10">
          <div className="font-bold text-2xl text-textMain capitalize">
            {navItems.find(n => n.id === currentView)?.label}
          </div>
          <div className="flex items-center gap-5 text-olive">
            <button className="hover:text-olive-dark transition-colors p-2 hover:bg-sage-light rounded-full" onClick={() => setShowAboutModal(true)}>
              <User size={20} />
            </button>
            <button className="hover:text-olive-dark transition-colors p-2 hover:bg-sage-light rounded-full"><HelpCircle size={20} /></button>
            <button className="hover:text-olive-dark transition-colors p-2 hover:bg-sage-light rounded-full"><Settings size={20} /></button>
            <button className="hover:text-red-700 transition-colors p-2 hover:bg-red-50 text-red-500 rounded-full" onClick={() => setIsAuthenticated(false)}>
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-10 overflow-y-auto">
            
          {currentView === 'new' && (
            <div className="flex flex-col gap-8 max-w-4xl">
              <SportSelector onSelect={(s) => { setSport(s); setResult(null); }} />
              
              {sport && !result && (
                <PredictionForm sport={sport} onPredict={handlePredict} />
              )}
              
              {result && (
                <PredictionResult 
                  result={result} 
                  sport={sport!} 
                  onReset={() => { setResult(null); setSport(null); }} 
                />
              )}
            </div>
          )}

          {currentView === 'history' && (
            <RecentPredictions predictions={predictions} />
          )}

          {currentView === 'analytics' && (
            <AnalyticsDashboard />
          )}

        </main>
      </div>

      {/* About / Developer Modal */}
      {showAboutModal && (
        <div className="absolute inset-0 bg-sage-light/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-xl p-8 w-[500px] max-w-full border border-sage/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-textMain">About App</h2>
              <button 
                onClick={() => setShowAboutModal(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-sage-light text-olive hover:bg-sage hover:text-olive-dark transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4 text-sm text-textMuted leading-relaxed">
              <p>
                <strong className="text-textMain font-semibold">Project Vision:</strong><br />
                The AI Sports Predictor demonstrates complex Machine Learning inference through an elegant, light-themed ERP dashboard. 
              </p>
              <p>
                <strong className="text-textMain font-semibold">Developer Idea:</strong><br />
                By blending clean UI design inspired by Uizard's FinPlanner with sports data, we prove that analytics don't have to look intimidating.
              </p>
              
              <div className="pt-6 mt-8 flex justify-end">
                <button 
                  onClick={() => setShowAboutModal(false)}
                  className="px-6 py-2.5 bg-sage hover:bg-sage-dark text-olive-dark font-semibold rounded-full transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
