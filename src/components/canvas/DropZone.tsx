import { useRef, useState, useCallback, type ReactNode } from 'react';
import { cn } from '@/utils';

interface DropZoneProps {
  onFile: (file: File) => void;
  children: ReactNode;
}

export function DropZone({ onFile, children }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCountRef = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCountRef.current++;
    if (e.dataTransfer.types.includes('Files')) setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    dragCountRef.current--;
    if (dragCountRef.current === 0) setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCountRef.current = 0;
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) onFile(file);
  }, [onFile]);

  return (
    <div
      className={cn('relative w-full h-full', isDragOver && 'ring-2 ring-inset ring-indigo-500 ring-offset-0')}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      {isDragOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-indigo-500/10 pointer-events-none">
          <div className="bg-slate-900/90 border border-indigo-500 rounded-2xl px-8 py-6 text-center shadow-2xl">
            <div className="text-indigo-400 text-4xl mb-2">⬇</div>
            <p className="text-white font-semibold text-lg">Drop image here</p>
          </div>
        </div>
      )}
    </div>
  );
}
