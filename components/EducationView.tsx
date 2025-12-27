
import React from 'react';

const EducationView: React.FC = () => {
  const tips = [
    {
      title: "Visual Awareness",
      content: "Always scan your path. If you notice someone following you, cross the street. If they follow, head to a public space immediately.",
      category: "Surroundings"
    },
    {
      title: "The 'A-B-C' Rule",
      content: "Avoid shortcuts, Be aware of shadows, and Carry your phone in your hand (not a bag) when walking in dimly lit areas.",
      category: "Preparation"
    },
    {
      title: "Legal Rights",
      content: "In many regions, you have the right to request a safe escort from public transport officials if you feel unsafe after hours.",
      category: "Rights"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-800">Safety Mastery</h2>
        <p className="text-slate-500 text-sm">Expert advice and tactical awareness for daily protection.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tips.map((tip, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:bg-rose-100"></div>
            <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded-md mb-3">
              {tip.category}
            </span>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{tip.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{tip.content}</p>
          </div>
        ))}
      </div>

      <section className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold">Safe Commuting</h3>
        </div>
        <ul className="space-y-3 text-sm text-slate-300">
          <li className="flex gap-2">
            <span className="text-indigo-400">•</span>
            Wait for trains/buses in well-lit areas near cameras.
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-400">•</span>
            Share your live location with a friend via GuardianAngel.
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-400">•</span>
            Sit near the driver or in the first carriage on public transport.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default EducationView;
