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
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-40 disabled:pointer-events-none select-none',
          {
            'bg-indigo-500 text-white hover:bg-indigo-600 active:scale-95 shadow-sm': variant === 'default',
            'hover:bg-white/10 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 active:scale-95': variant === 'ghost',
            'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300': variant === 'outline',
            'bg-red-500/10 text-red-500 hover:bg-red-500/20': variant === 'danger',
          },
          {
            'h-7 px-2 text-xs': size === 'sm',
            'h-9 px-3 text-sm': size === 'md',
            'h-10 px-4 text-base': size === 'lg',
            'h-9 w-9 p-0': size === 'icon',
          },
          active && variant === 'ghost' && 'bg-indigo-500/15 text-indigo-500 dark:text-indigo-400',
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
