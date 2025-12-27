
import React, { useState, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';
import { GroundingLink } from '../types';

const SafetyMap: React.FC = () => {
  const [havens, setHavens] = useState<GroundingLink[]>([]);
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchHavens = async () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const service = new GeminiService();
      try {
        const res = await service.findSafeHavens(pos.coords.latitude, pos.coords.longitude);
        setHavens(res.links);
        setAdvice(res.text);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchHavens();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-800">Safe Havens Near You</h2>
        <p className="text-slate-500 text-sm">Verified locations where you can find safety or assistance.</p>
      </div>

      {/* Simulated Map View */}
      <div className="aspect-video bg-slate-200 rounded-3xl overflow-hidden relative border-4 border-white shadow-inner flex items-center justify-center text-slate-400">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/800/600?grayscale')] opacity-30 mix-blend-overlay"></div>
        <div className="z-10 text-center p-4">
          <svg className="w-12 h-12 mx-auto mb-2 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <p className="font-bold text-slate-700">Map Interface</p>
          <p className="text-xs">Interactive markers powered by Gemini Grounding</p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center py-12 gap-4">
            <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 font-medium">Scanning local area for safe zones...</p>
          </div>
        ) : (
          <>
            {advice && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-sm text-slate-700 leading-relaxed shadow-sm">
                {advice}
              </div>
            )}
            <div className="grid grid-cols-1 gap-3">
              {havens.map((haven, idx) => (
                <a 
                  key={idx}
                  href={haven.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-rose-200 hover:bg-rose-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-rose-100 text-rose-600 p-2 rounded-lg">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span className="font-bold text-slate-800">{haven.title}</span>
                  </div>
                  <svg className="w-5 h-5 text-slate-300 group-hover:text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SafetyMap;
