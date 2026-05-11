import { Slider, Divider, ColorPicker } from '@/components/ui';
import { useEditorStore } from '@/store/editorStore';
import { STROKE_WIDTHS } from '@/constants';
import { cn } from '@/utils';
import type { TextAnnotation } from '@/types';

export function BrushControls() {
  const {
    color, setColor,
    strokeWidth, setStrokeWidth,
    opacity, setOpacity,
    fontSize, setFontSize,
    tool,
    annotations, activeAnnotationId, updateAnnotation,
  } = useEditorStore();

  const selectedAnnotation = annotations.find((a) => a.id === activeAnnotationId);
  const selectedText = selectedAnnotation?.tool === 'text' ? (selectedAnnotation as TextAnnotation) : null;

  const showFontSize = tool === 'text';
  const showBrushSize = tool !== 'select' && tool !== 'pan';
  const showSelectedTextPanel = tool === 'select' && selectedText;

  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      {/* Selected text properties */}
      {showSelectedTextPanel && (
        <>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-[#666] font-medium">Text Color</span>
            <ColorPicker
              color={selectedText.color}
              onChange={(c) => updateAnnotation(selectedText.id, { color: c })}
            />
          </div>
          <Divider />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#666] font-medium">Font Size</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateAnnotation(selectedText.id, { fontSize: Math.max(8, selectedText.fontSize - 2) })}
                  className="w-5 h-5 rounded text-[#888] hover:text-[#ededed] hover:bg-[#1a1a1a] flex items-center justify-center text-xs transition-colors"
                >A-</button>
                <button
                  onClick={() => updateAnnotation(selectedText.id, { fontSize: Math.min(200, selectedText.fontSize + 2) })}
                  className="w-5 h-5 rounded text-[#888] hover:text-[#ededed] hover:bg-[#1a1a1a] flex items-center justify-center text-xs transition-colors"
                >A+</button>
              </div>
            </div>
            <Slider
              value={selectedText.fontSize}
              onChange={(v) => updateAnnotation(selectedText.id, { fontSize: v })}
              min={8}
              max={200}
              displayValue={`${selectedText.fontSize}px`}
            />
          </div>
          <Divider />
          <div className="flex flex-col gap-2">
            <span className="text-xs text-[#666] font-medium">Opacity</span>
            <Slider
              value={Math.round(selectedText.opacity * 100)}
              onChange={(v) => updateAnnotation(selectedText.id, { opacity: v / 100 })}
              min={10}
              max={100}
              displayValue={`${Math.round(selectedText.opacity * 100)}%`}
            />
          </div>
          <Divider />
          <button
            onClick={() => {
              const newText = window.prompt('Edit text:', selectedText.text);
              if (newText !== null && newText.trim()) {
                updateAnnotation(selectedText.id, { text: newText });
              }
            }}
            className="w-full text-xs text-[#888] hover:text-[#ededed] border border-[#2a2a2a] hover:border-[#444] rounded-lg py-1.5 transition-colors"
          >
            Edit text content
          </button>
        </>
      )}

      {/* Default draw-mode properties */}
      {!showSelectedTextPanel && (
        <>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-[#666] font-medium">Color</span>
            <ColorPicker color={color} onChange={setColor} />
          </div>

          <Divider />

          {showBrushSize && !showFontSize && (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[#666] font-medium">Size</span>
              <div className="flex flex-wrap gap-1.5">
                {STROKE_WIDTHS.map((w) => (
                  <button
                    key={w}
                    onClick={() => setStrokeWidth(w)}
                    className={cn(
                      'rounded-full bg-current transition-all hover:scale-110 cursor-pointer',
                      strokeWidth === w
                        ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-black'
                        : 'opacity-40 hover:opacity-70'
                    )}
                    style={{ width: Math.min(w * 2 + 4, 20), height: Math.min(w * 2 + 4, 20), color }}
                    aria-label={`${w}px`}
                  />
                ))}
              </div>
              <Slider
                value={strokeWidth}
                onChange={setStrokeWidth}
                min={1}
                max={30}
                displayValue={`${strokeWidth}px`}
              />
            </div>
          )}

          {showFontSize && (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[#666] font-medium">Font Size</span>
              <Slider
                value={fontSize}
                onChange={setFontSize}
                min={8}
                max={200}
                displayValue={`${fontSize}px`}
              />
            </div>
          )}

          <Divider />

          <Slider
            label="Opacity"
            value={Math.round(opacity * 100)}
            onChange={(v) => setOpacity(v / 100)}
            min={10}
            max={100}
            displayValue={`${Math.round(opacity * 100)}%`}
          />
        </>
      )}
    </div>
  );
}
