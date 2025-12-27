
import React, { useState } from 'react';
import { EmergencyContact } from '../types';

interface SOSViewProps {
  contacts: EmergencyContact[];
  onAddContact: (contact: EmergencyContact) => void;
}

const SOSView: React.FC<SOSViewProps> = ({ contacts, onAddContact }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const triggerSOS = () => {
    alert("SOS TRIGGERED! Simulating sending location to all contacts and calling emergency services.");
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newPhone) {
      onAddContact({ id: Date.now().toString(), name: newName, phone: newPhone });
      setNewName('');
      setNewPhone('');
      setShowAdd(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in flex flex-col items-center">
      <div className="text-center">
        <h2 className="text-3xl font-black text-rose-600 uppercase tracking-tighter">Emergency Hub</h2>
        <p className="text-slate-500">Immediate action for critical situations</p>
      </div>

      <button 
        onClick={triggerSOS}
        className="w-64 h-64 bg-rose-600 rounded-full shadow-[0_0_50px_rgba(225,29,72,0.4)] flex flex-col items-center justify-center border-8 border-rose-500 hover:bg-rose-700 active:scale-95 transition-all group"
      >
        <span className="text-white text-5xl font-black mb-1 group-hover:scale-110 transition-transform">SOS</span>
        <span className="text-rose-100 text-xs font-bold uppercase tracking-widest">Hold 3s to activate</span>
      </button>

      <section className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Trusted Contacts</h3>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="text-indigo-600 text-sm font-bold flex items-center gap-1"
          >
            {showAdd ? 'Cancel' : 'Add Contact'}
          </button>
        </div>

        {showAdd && (
          <form onSubmit={handleAdd} className="bg-white p-4 rounded-2xl border-2 border-indigo-100 space-y-3">
            <input 
              type="text" placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)}
              className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
            />
            <input 
              type="tel" placeholder="Phone Number" value={newPhone} onChange={e => setNewPhone(e.target.value)}
              className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
            />
            <button className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl">Save Contact</button>
          </form>
        )}

        <div className="space-y-3">
          {contacts.map(c => (
            <div key={c.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                  {c.name[0]}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.phone}</p>
                </div>
              </div>
              <a href={`tel:${c.phone}`} className="p-2 bg-green-50 text-green-600 rounded-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SOSView;
