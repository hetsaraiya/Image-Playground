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
          <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
          <span className="text-xs font-mono text-slate-600 dark:text-slate-300 tabular-nums">
            {displayValue ?? value}
          </span>
        </div>
      )}
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'w-full h-1.5 appearance-none rounded-full cursor-pointer',
          'bg-slate-200 dark:bg-slate-700',
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5',
          '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500',
          '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm',
          '[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5',
          '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-500'
        )}
        {...props}
      />
    </div>
  );
}
