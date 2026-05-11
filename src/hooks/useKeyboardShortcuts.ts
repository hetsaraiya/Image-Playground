import { useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { TOOL_SHORTCUTS } from '@/constants';
import type { ToolType } from '@/types';

export function useKeyboardShortcuts() {
  const { undo, redo, clearAnnotations, setTool, tool, canUndo, canRedo } = useEditorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      const key = e.key.toLowerCase();

      if ((e.metaKey || e.ctrlKey) && key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) undo();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && (key === 'y' || (key === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (canRedo()) redo();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && key === 'backspace') {
        e.preventDefault();
        clearAnnotations();
        return;
      }
      if (e.key === 'Escape') {
        setTool('select');
        return;
      }

      const mappedTool = TOOL_SHORTCUTS[e.key];
      if (mappedTool && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setTool(mappedTool as ToolType);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, clearAnnotations, setTool, tool, canUndo, canRedo]);
}
