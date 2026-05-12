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
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-7 h-7 rounded-lg border-2 border-[#333] shadow-md hover:scale-110 transition-transform cursor-pointer flex-shrink-0"
        style={{ backgroundColor: color }}
        aria-label="Pick color"
      />
      {open && (
        <div className="absolute left-10 top-0 z-50 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-3 shadow-2xl w-52">
          <div className="grid grid-cols-6 gap-1.5 mb-3">
            {PALETTE_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => { onChange(c); setOpen(false); }}
                className={cn(
                  'w-6 h-6 rounded-md border-2 hover:scale-110 transition-transform cursor-pointer',
                  c === color ? 'border-indigo-400' : 'border-transparent'
                )}
                style={{ backgroundColor: c }}
                aria-label={c}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-[#222]">
            <span className="text-xs text-[#666]">Custom</span>
            <input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="w-8 h-7 rounded cursor-pointer bg-transparent border-0 p-0"
            />
            <span className="text-xs font-mono text-[#888] uppercase ml-auto">{color}</span>
          </div>
        </div>
      )}
    </div>
  );
}
