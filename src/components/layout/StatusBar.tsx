import { useEditorStore } from '@/store/editorStore';
import { TOOL_LABELS } from '@/constants';
import { formatZoom } from '@/utils';

export function StatusBar() {
  const { tool, zoom, backgroundImage, imageWidth, imageHeight, annotations } = useEditorStore();

  return (
    <div className="flex items-center justify-between px-4 h-7 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-400 dark:text-slate-500 flex-shrink-0 select-none">
      <div className="flex items-center gap-4">
        <span>Tool: <span className="text-slate-600 dark:text-slate-300 font-medium">{TOOL_LABELS[tool]}</span></span>
        {backgroundImage && (
          <span>{imageWidth} × {imageHeight}px</span>
        )}
        <span>{annotations.length} annotation{annotations.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="flex items-center gap-4">
        <span>Scroll to zoom · Alt+drag to pan · Space+drag to pan</span>
        <span className="font-mono tabular-nums">{formatZoom(zoom)}</span>
      </div>
    </div>
  );
}
