import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils';
import { PALETTE_COLORS } from '@/constants';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ color, onChange, className }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-7 h-7 rounded-lg border-2 border-white/20 shadow-sm hover:scale-110 transition-transform cursor-pointer flex-shrink-0"
        style={{ backgroundColor: color }}
        aria-label="Pick color"
      />

      {open && (
        <div className="absolute left-10 top-0 z-50 bg-slate-900 dark:bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl w-48">
          <div className="grid grid-cols-6 gap-1.5 mb-3">
            {PALETTE_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => { onChange(c); setOpen(false); }}
                className={cn(
                  'w-6 h-6 rounded-md border-2 hover:scale-110 transition-transform cursor-pointer',
                  c === color ? 'border-white' : 'border-transparent'
                )}
                style={{ backgroundColor: c }}
                aria-label={c}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Custom:</span>
            <input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="w-8 h-7 rounded cursor-pointer bg-transparent border-0 p-0"
            />
            <span className="text-xs font-mono text-slate-300 uppercase">{color}</span>
          </div>
        </div>
      )}
    </div>
  );
}
