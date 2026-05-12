import { useRef, useEffect } from 'react';
import type Konva from 'konva';
import { Header, LeftPanel, RightPanel, StatusBar } from '@/components/layout';
import { KonvaCanvas } from '@/components/canvas/KonvaCanvas';
import { DropZone } from '@/components/canvas/DropZone';
import { EmptyState } from '@/components/canvas/EmptyState';
import { useEditorStore } from '@/store/editorStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useImageInput } from '@/hooks/useImageInput';

export function EditorPage() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const { backgroundImage } = useEditorStore();
  const { handleFile, handlePaste } = useImageInput();

  useKeyboardShortcuts();

  useEffect(() => {
    const handler = (e: ClipboardEvent) => handlePaste(e);
    window.addEventListener('paste', handler);
    return () => window.removeEventListener('paste', handler);
  }, [handlePaste]);

  return (
    <div className="flex flex-col h-full bg-black">
      <Header stageRef={stageRef} />
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel />
        <main
          className="flex-1 relative overflow-hidden"
          style={{
            background: '#000',
            backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        >
          <DropZone onFile={handleFile}>
            {backgroundImage ? (
              <KonvaCanvas stageRef={stageRef} />
            ) : (
              <EmptyState />
            )}
          </DropZone>
        </main>
        <RightPanel />
      </div>
      <StatusBar />
    </div>
  );
}
