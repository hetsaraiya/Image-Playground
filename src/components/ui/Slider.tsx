import { type InputHTMLAttributes } from 'react';
import { cn } from '@/utils';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  displayValue?: string;
}

export function Slider({ label, value, onChange, displayValue, className, ...props }: SliderProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#666]">{label}</span>
          <span className="text-xs font-mono text-[#999] tabular-nums">{displayValue ?? value}</span>
        </div>
      )}
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'w-full h-1 appearance-none rounded-full cursor-pointer',
          'bg-[#222]',
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3',
          '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-400',
          '[&::-webkit-slider-thumb]:cursor-pointer',
          '[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3',
          '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-400'
        )}
        {...props}
      />
    </div>
  );
}
