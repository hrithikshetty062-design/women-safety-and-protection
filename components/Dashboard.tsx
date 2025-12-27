
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { GeminiService } from '../services/geminiService';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [locationName, setLocationName] = useState('Determining location...');
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        // Simple reverse geocoding simulation/placeholder
        // In a real app, use a proper reverse geocoding API
        const loc = `Current Coordinates (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`;
        setLocationName(loc);
        
        setLoading(true);
        const service = new GeminiService();
        try {
          const res = await service.getSafetyInsights("your current neighborhood");
          setInsights(res.text);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      });
    }
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Location Status Card */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-slate-500 text-sm font-medium">Your current location</p>
            <h2 className="text-xl font-bold text-slate-800">{locationName}</h2>
          </div>
          <div className="bg-green-100 px-3 py-1 rounded-full flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-700 text-xs font-bold uppercase">Monitoring</span>
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
            </svg>
            AI Safety Insight
          </h3>
          <p className="text-sm text-slate-600 italic">
            {loading ? "Analyzing area data..." : insights || "AI is ready to provide safety advice based on your surroundings."}
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <ActionButton 
          onClick={() => onNavigate(AppView.VOICE_COMPANION)}
          title="Stay On Line"
          desc="AI companion for walks"
          color="bg-indigo-600"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />}
        />
        <ActionButton 
          onClick={() => onNavigate(AppView.MAPS)}
          title="Safe Havens"
          desc="Find nearby safe zones"
          color="bg-teal-600"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />}
        />
      </div>

      {/* Safety Tips Preview */}
      <section className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
        <h3 className="text-lg font-bold text-rose-900 mb-3">Today's Safety Focus</h3>
        <p className="text-rose-700 text-sm mb-4 leading-relaxed">
          When walking alone at night, keep your head up and stay aware of your surroundings. Avoid wearing noise-canceling headphones to ensure you can hear approaching footsteps or vehicles.
        </p>
        <button 
          onClick={() => onNavigate(AppView.EDUCATION)}
          className="text-rose-600 font-bold text-sm flex items-center gap-1 hover:underline"
        >
          See more tips
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>
    </div>
  );
};

const ActionButton: React.FC<{ onClick: () => void, title: string, desc: string, color: string, icon: React.ReactNode }> = ({ onClick, title, desc, color, icon }) => (
  <button 
    onClick={onClick}
    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col items-start gap-3 group text-left"
  >
    <div className={`${color} p-2.5 rounded-xl text-white group-hover:scale-110 transition-transform`}>
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {icon}
      </svg>
    </div>
    <div>
      <h4 className="font-bold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  </button>
);

export default Dashboard;
