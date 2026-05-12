import { Toolbar } from '@/components/toolbar';
import { BrushControls } from '@/components/toolbar';
import { Divider } from '@/components/ui';

export function LeftPanel() {
  return (
    <aside className="flex flex-col w-[58px] border-r border-[#1a1a1a] bg-black flex-shrink-0 overflow-y-auto">
      <Toolbar />
    </aside>
  );
}

export function RightPanel() {
  return (
    <aside className="flex flex-col w-[200px] border-l border-[#1a1a1a] bg-black flex-shrink-0 overflow-y-auto">
      <div className="px-3 py-2 border-b border-[#1a1a1a]">
        <span className="text-[10px] font-semibold text-[#444] uppercase tracking-widest">Properties</span>
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
    ['Del', 'Delete selected'],
  ];

  return (
    <div className="px-3 py-3 flex flex-col gap-1">
      <span className="text-[10px] font-semibold text-[#444] uppercase tracking-widest mb-1">Shortcuts</span>
      {shortcuts.map(([key, label]) => (
        <div key={key} className="flex items-center justify-between gap-1">
          <span className="text-[11px] text-[#555]">{label}</span>
          <kbd className="text-[9px] font-mono bg-[#111] text-[#666] border border-[#222] px-1 py-0.5 rounded shrink-0">{key}</kbd>
        </div>
      ))}
    </div>
  );
}
