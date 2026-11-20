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
      <div className="min-h-screen flex items-center justify-center text-slate-900 select-none">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-slate-950 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>
            <div className="font-black text-lg text-slate-900 tracking-tight">Shinegah™ Enterprise Network</div>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Loading Verified Business Social Portal...
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
