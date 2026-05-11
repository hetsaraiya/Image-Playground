import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  active?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', active = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:opacity-30 disabled:pointer-events-none select-none',
          {
            'bg-indigo-500 text-white hover:bg-indigo-600 active:scale-95 shadow-sm': variant === 'default',
            'hover:bg-white/8 text-slate-500 dark:text-[#888] hover:text-slate-800 dark:hover:text-[#ededed] active:scale-95': variant === 'ghost',
            'border border-slate-200 dark:border-[#2a2a2a] hover:bg-slate-50 dark:hover:bg-[#111] text-slate-700 dark:text-[#bbb]': variant === 'outline',
            'bg-red-500/10 text-red-400 hover:bg-red-500/20': variant === 'danger',
          },
          {
            'h-7 px-2 text-xs': size === 'sm',
            'h-9 px-3 text-sm': size === 'md',
            'h-10 px-4 text-base': size === 'lg',
            'h-9 w-9 p-0': size === 'icon',
          },
          active && variant === 'ghost' && 'bg-indigo-500/15 text-indigo-400 dark:text-indigo-400',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
