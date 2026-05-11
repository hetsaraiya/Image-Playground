import { useState, useRef, type ReactNode } from 'react';
import { cn } from '@/utils';

interface TooltipProps {
  content: ReactNode;
  shortcut?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
  delay?: number;
}

export function Tooltip({ content, shortcut, side = 'right', children, delay = 400 }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {visible && (
        <div
          className={cn(
            'absolute z-50 pointer-events-none whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium shadow-lg',
            'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900',
            'animate-in fade-in-0 zoom-in-95 duration-100',
            {
              'bottom-full mb-1.5 left-1/2 -translate-x-1/2': side === 'top',
              'top-full mt-1.5 left-1/2 -translate-x-1/2': side === 'bottom',
              'right-full mr-1.5 top-1/2 -translate-y-1/2': side === 'left',
              'left-full ml-1.5 top-1/2 -translate-y-1/2': side === 'right',
            }
          )}
        >
          <span>{content}</span>
          {shortcut && (
            <span className="ml-1.5 opacity-60 font-mono text-[10px]">{shortcut}</span>
          )}
        </div>
      )}
    </div>
  );
}
