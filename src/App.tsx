import { Zap } from 'lucide-react';

export function App() {
  return (
    <div className="flex h-screen w-screen flex-col bg-[#0b1120] text-slate-200 select-none">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-[#0f172a] px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
            <Zap className="h-5 w-5 fill-amber-400" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            PowerGrid
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-sm text-slate-400">Редактор електромережі</span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-60 shrink-0 flex-col border-r border-slate-800 bg-[#0f172a] p-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Інструменти
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Панель інструментів та бібліотека об&apos;єктів...
          </p>
        </aside>

        <main className="relative flex-1 overflow-hidden bg-[#5d9443] p-2">
          <div className="flex h-full w-full items-center justify-center rounded-xl border border-slate-700/60 bg-[#6ea84f]/80 text-sm text-white/80 shadow-inner">
            Робоча карта (GridWorkspace)
          </div>
        </main>

        <aside className="flex w-72 shrink-0 flex-col border-l border-slate-800 bg-[#0f172a] p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Інформація про об&apos;єкт
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">
            Оберіть об&apos;єкт на карті
          </p>
        </aside>
      </div>

      <footer className="flex h-11 shrink-0 items-center justify-between border-t border-slate-800 bg-[#0f172a] px-4 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-amber-400">
            Статистика мережі:
          </span>
          <span>0 опор</span>
          <span>0 ліній</span>
          <span>0 м</span>
          <span>0 трансформаторів</span>
        </div>
        <span className="text-slate-500">
          Оберіть інструмент або об&apos;єкт на карті
        </span>
      </footer>
    </div>
  );
}

export default App;
