import { useState, useEffect } from 'react';
import type { AppState } from './types';
import { fetchAppState } from './services/api';
import { BizGramApp } from './modules/bizgram/BizGramApp';

export function App() {
  const [lang, setLang] = useState<'ta' | 'en'>('ta');
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    fetchAppState().then((data) => {
      setState(data);
    });
  }, []);

  if (!state) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>
            <div className="font-black text-lg text-amber-400">NBN BizGram</div>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              வணிக இன்ஸ்டாகிராம் தளம் ஏற்றப்படுகிறது...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BizGramApp
      state={state}
      updateState={(s) => setState(s)}
      lang={lang}
    />
  );
}

export default App;
