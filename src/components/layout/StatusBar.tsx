import { useEditorStore } from '@/store/editorStore';
import { TOOL_LABELS } from '@/constants';
import { formatZoom } from '@/utils';

export function StatusBar() {
  const { tool, zoom, backgroundImage, imageWidth, imageHeight, annotations } = useEditorStore();

  return (
    <div className="flex items-center justify-between px-4 h-6 border-t border-[#1a1a1a] bg-black text-[11px] text-[#444] flex-shrink-0 select-none">
      <div className="flex items-center gap-4">
        <span>
          Tool: <span className="text-[#777]">{TOOL_LABELS[tool]}</span>
        </span>
        {backgroundImage && <span>{imageWidth} × {imageHeight}</span>}
        <span>{annotations.length} annotation{annotations.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="flex items-center gap-4">
        <span>Scroll to zoom · Alt+drag or Space to pan</span>
        <span className="font-mono tabular-nums text-[#555]">{formatZoom(zoom)}</span>
      </div>
    </div>
  );
}
