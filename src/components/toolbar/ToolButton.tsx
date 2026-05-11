import { type ReactNode } from 'react';
import { Button, Tooltip } from '@/components/ui';
import { cn } from '@/utils';
import type { ToolType } from '@/types';
import { TOOL_LABELS } from '@/constants';

interface ToolButtonProps {
  tool: ToolType;
  activeTool: ToolType;
  onSelect: (tool: ToolType) => void;
  icon: ReactNode;
  shortcut?: string;
}

export function ToolButton({ tool, activeTool, onSelect, icon, shortcut }: ToolButtonProps) {
  const isActive = tool === activeTool;
  return (
    <Tooltip content={TOOL_LABELS[tool]} shortcut={shortcut} side="right">
      <Button
        variant="ghost"
        size="icon"
        active={isActive}
        onClick={() => onSelect(tool)}
        className={cn(
          'relative w-10 h-10',
          isActive && 'after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-0.5 after:h-5 after:bg-indigo-500 after:rounded-r'
        )}
        aria-label={TOOL_LABELS[tool]}
      >
        {icon}
      </Button>
    </Tooltip>
  );
}
