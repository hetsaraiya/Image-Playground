import { useRef, useEffect, useCallback } from 'react';
import type { Point } from '@/types';

interface InlineTextEditorProps {
  worldPos: Point;
  zoom: number;
  panOffset: Point;
  color: string;
  fontSize: number;
  opacity: number;
  defaultText?: string;
  onCommit: (text: string) => void;
  onCancel: () => void;
}

export function InlineTextEditor({
  worldPos, zoom, panOffset,
  color, fontSize, opacity,
  defaultText = '',
  onCommit, onCancel,
}: InlineTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const committed = useRef(false);

  // World → screen position (same transform Konva applies)
  const screenX = Math.round(worldPos.x * zoom + panOffset.x);
  const screenY = Math.round(worldPos.y * zoom + panOffset.y);
  const scaledFont = Math.round(fontSize * zoom);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.textContent = defaultText;
    el.focus();
    // Move caret to end
    const range = document.createRange();
    const sel = window.getSelection();
    if (sel) {
      range.selectNodeContents(el);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [defaultText]);

  const commit = useCallback(() => {
    if (committed.current) return;
    committed.current = true;
    const text = ref.current?.textContent?.trim() ?? '';
    if (text) onCommit(text);
    else onCancel();
  }, [onCommit, onCancel]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      commit();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      committed.current = true;
      onCancel();
    }
    // Stop canvas keyboard shortcuts from firing while typing
    e.stopPropagation();
  }, [commit, onCancel]);

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      style={{
        position: 'absolute',
        left: screenX,
        top: screenY,
        fontSize: scaledFont,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontWeight: 700,
        lineHeight: 1.2,
        color,
        opacity,
        minWidth: Math.max(48, scaledFont * 3),
        maxWidth: '80vw',
        whiteSpace: 'pre',
        outline: 'none',
        background: 'transparent',
        cursor: 'text',
        zIndex: 50,
        userSelect: 'text',
        // Subtle caret-colored underline so user sees where they're typing
        borderBottom: `2px solid ${color}`,
        paddingBottom: 1,
      }}
    />
  );
}
