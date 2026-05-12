import { useCallback } from 'react';
import Konva from 'konva';

export function useExport(stageRef: React.RefObject<Konva.Stage | null>) {
  const exportAsPNG = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const uri = stage.toDataURL({ mimeType: 'image/png', pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = `image-playground-${Date.now()}.png`;
    link.href = uri;
    link.click();
  }, [stageRef]);

  const copyToClipboard = useCallback(async () => {
    const stage = stageRef.current;
    if (!stage) return;
    const uri = stage.toDataURL({ mimeType: 'image/png', pixelRatio: 2 });
    const res = await fetch(uri);
    const blob = await res.blob();
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
  }, [stageRef]);

  return { exportAsPNG, copyToClipboard };
}
