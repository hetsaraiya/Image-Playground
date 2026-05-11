import { Toolbar } from '@/components/toolbar';
import { BrushControls } from '@/components/toolbar';
import { Divider } from '@/components/ui';

export function LeftPanel() {
  return (
    <aside className="flex flex-col w-[60px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex-shrink-0 overflow-y-auto">
      <Toolbar />
    </aside>
  );
}

export function RightPanel() {
  return (
    <aside className="flex flex-col w-[200px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex-shrink-0 overflow-y-auto">
      <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Properties</span>
      </div>
      <BrushControls />
      <Divider />
      <KeyboardShortcutsPanel />
    </aside>
  );
}

function KeyboardShortcutsPanel() {
  const shortcuts = [
    ['V', 'Select'],
    ['P', 'Pen'],
    ['H', 'Highlighter'],
    ['E', 'Eraser'],
    ['T', 'Text'],
    ['A', 'Arrow'],
    ['R', 'Rectangle'],
    ['C', 'Circle'],
    ['L', 'Line'],
    ['Space', 'Pan'],
    ['⌘Z', 'Undo'],
    ['⌘⇧Z', 'Redo'],
  ];

  return (
    <div className="px-3 py-3 flex flex-col gap-1">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Shortcuts</span>
      {shortcuts.map(([key, label]) => (
        <div key={key} className="flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
          <kbd className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">{key}</kbd>
        </div>
      ))}
    </div>
  );
}
