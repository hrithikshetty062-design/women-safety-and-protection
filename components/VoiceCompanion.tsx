
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { GeminiService } from '../services/geminiService';

const VoiceCompanion: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Standby');
  const [transcription, setTranscription] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close?.();
      sessionRef.current = null;
    }
    for (const source of sourcesRef.current) {
      source.stop();
    }
    sourcesRef.current.clear();
    setIsActive(false);
    setStatus('Finished');
  }, []);

  const startSession = async () => {
    try {
      setStatus('Connecting...');
      setIsActive(true);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const outputAudioContext = audioContextRef.current;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setStatus('Active');
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: GeminiService.encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (msg) => {
            const base64Audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
              const audioBuffer = await GeminiService.decodeAudioData(
                GeminiService.decode(base64Audio),
                outputAudioContext,
                24000,
                1
              );
              const source = outputAudioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContext.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (msg.serverContent?.outputTranscription) {
              setTranscription(prev => [...prev.slice(-4), `Guardian: ${msg.serverContent!.outputTranscription!.text}`]);
            }
            if (msg.serverContent?.interrupted) {
              for (const s of sourcesRef.current) s.stop();
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live Error', e);
            setStatus('Connection Error');
          },
          onclose: () => stopSession()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          outputAudioTranscription: {},
          systemInstruction: "You are Guardian, a supportive AI companion for a woman walking alone. Your goal is to stay on the line, talk friendly, keep her company, and make her feel safe. If she mentions trouble, reassure her and ask if she wants to use the SOS feature. Be conversational and human-like."
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Failed to Start');
      setIsActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, [stopSession]);

  return (
    <div className="space-y-6 animate-fade-in flex flex-col items-center">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Stay On The Line</h2>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">Talk to Guardian while you walk. It's like having a friend on the phone.</p>
      </div>

      <div className="relative">
        <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-700 ${isActive ? 'bg-rose-100 scale-105' : 'bg-slate-100'}`}>
          <div className={`w-40 h-40 rounded-full flex items-center justify-center border-4 ${isActive ? 'border-rose-500 animate-pulse' : 'border-slate-300'}`}>
            <svg className={`w-20 h-20 ${isActive ? 'text-rose-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
        </div>
        {isActive && (
          <div className="absolute -top-2 -right-2">
            <span className="flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 w-full">
        <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest ${isActive ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
          {status}
        </span>

        {!isActive ? (
          <button 
            onClick={startSession}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95"
          >
            Connect to Guardian
          </button>
        ) : (
          <button 
            onClick={stopSession}
            className="w-full py-4 bg-slate-800 hover:bg-black text-white font-bold rounded-2xl shadow-lg transition-all"
          >
            End Conversation
          </button>
        )}
      </div>

      {isActive && (
        <div className="w-full bg-white rounded-2xl p-4 border border-slate-200 min-h-[120px] shadow-inner">
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">Live Transcription</p>
          <div className="space-y-1">
            {transcription.length === 0 ? (
              <p className="text-sm text-slate-400 italic">Listening for your voice...</p>
            ) : (
              transcription.map((line, i) => (
                <p key={i} className="text-sm text-slate-600">{line}</p>
              ))
            )}
          </div>
        </div>
      )}
      
      <p className="text-xs text-slate-400 text-center px-8">
        *Guardian uses real-time AI to talk with you. For actual emergencies, please use the SOS button.
      </p>
    </div>
  );
};

export default VoiceCompanion;
