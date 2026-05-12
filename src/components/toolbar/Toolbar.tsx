import {
  MousePointer2,
  Pencil,
  Highlighter,
  Eraser,
  Type,
  MoveRight,
  Square,
  Circle,
  Minus,
  Hand,
} from 'lucide-react';
import { ToolButton } from './ToolButton';
import { Divider } from '@/components/ui';
import { useEditorStore } from '@/store/editorStore';
import type { ToolType } from '@/types';

const TOOL_GROUPS: Array<Array<{ tool: ToolType; icon: React.ReactNode; shortcut?: string }>> = [
  [
    { tool: 'select', icon: <MousePointer2 size={16} />, shortcut: 'V' },
    { tool: 'pan', icon: <Hand size={16} />, shortcut: 'Space' },
  ],
  [
    { tool: 'pen', icon: <Pencil size={16} />, shortcut: 'P' },
    { tool: 'highlighter', icon: <Highlighter size={16} />, shortcut: 'H' },
    { tool: 'eraser', icon: <Eraser size={16} />, shortcut: 'E' },
  ],
  [
    { tool: 'text', icon: <Type size={16} />, shortcut: 'T' },
    { tool: 'arrow', icon: <MoveRight size={16} />, shortcut: 'A' },
  ],
  [
    { tool: 'rectangle', icon: <Square size={16} />, shortcut: 'R' },
    { tool: 'circle', icon: <Circle size={16} />, shortcut: 'C' },
    { tool: 'line', icon: <Minus size={16} />, shortcut: 'L' },
  ],
];

export function Toolbar() {
  const { tool, setTool } = useEditorStore();

  return (
    <div className="flex flex-col items-center gap-1 py-3 px-1.5">
      {TOOL_GROUPS.map((group, gi) => (
        <div key={gi} className="flex flex-col items-center gap-0.5">
          {group.map(({ tool: t, icon, shortcut }) => (
            <ToolButton
              key={t}
              tool={t}
              activeTool={tool}
              onSelect={setTool}
              icon={icon}
              shortcut={shortcut}
            />
          ))}
          {gi < TOOL_GROUPS.length - 1 && (
            <Divider orientation="horizontal" className="w-6 my-1" />
          )}
        </div>
      ))}
    </div>
  );
}
