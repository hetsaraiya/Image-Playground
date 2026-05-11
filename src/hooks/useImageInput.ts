import { useCallback } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { loadImageFromFile, loadImageFromClipboard, getImageDimensions, fitToViewport } from '@/utils';

export function useImageInput() {
  const { setBackgroundImage, setZoom, setPanOffset } = useEditorStore();

  const loadImage = useCallback(async (src: string) => {
    const { width, height } = await getImageDimensions(src);
    const zoom = fitToViewport(width, height, window.innerWidth, window.innerHeight);
    setBackgroundImage(src, width, height);
    setZoom(zoom);
    setPanOffset({ x: 0, y: 0 });
  }, [setBackgroundImage, setZoom, setPanOffset]);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const src = await loadImageFromFile(file);
    await loadImage(src);
  }, [loadImage]);

  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    if (!e.clipboardData?.items) return;
    const src = await loadImageFromClipboard(e.clipboardData.items);
    if (src) await loadImage(src);
  }, [loadImage]);

  const handleDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (file) await handleFile(file);
  }, [handleFile]);

  return { handleFile, handlePaste, handleDrop };
}
