import { ColorPicker, Slider, Divider } from '@/components/ui';
import { useEditorStore } from '@/store/editorStore';
import { STROKE_WIDTHS } from '@/constants';
import { cn } from '@/utils';

export function BrushControls() {
  const { color, setColor, strokeWidth, setStrokeWidth, opacity, setOpacity, fontSize, setFontSize, tool } = useEditorStore();

  const showFontSize = tool === 'text';
  const showBrushSize = tool !== 'select' && tool !== 'pan';

  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      {/* Color */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Color</span>
        <ColorPicker color={color} onChange={setColor} />
      </div>

      <Divider />

      {/* Stroke size dots */}
      {showBrushSize && !showFontSize && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Size</span>
          <div className="flex flex-wrap gap-1.5">
            {STROKE_WIDTHS.map((w) => (
              <button
                key={w}
                onClick={() => setStrokeWidth(w)}
                className={cn(
                  'rounded-full bg-current transition-all hover:scale-110 cursor-pointer',
                  strokeWidth === w ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900' : 'opacity-50 hover:opacity-80'
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

      {/* Font size */}
      {showFontSize && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Font Size</span>
          <Slider
            value={fontSize}
            onChange={setFontSize}
            min={8}
            max={72}
            displayValue={`${fontSize}px`}
          />
        </div>
      )}

      <Divider />

      {/* Opacity */}
      <Slider
        label="Opacity"
        value={Math.round(opacity * 100)}
        onChange={(v) => setOpacity(v / 100)}
        min={10}
        max={100}
        displayValue={`${Math.round(opacity * 100)}%`}
      />
    </div>
  );
}
