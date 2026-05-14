import { cn } from '@/lib/cn';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md';
};

export function Button({ className, variant = 'primary', size = 'md', ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-accent)] disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' &&
          'bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-2))] text-white shadow-lg shadow-black/10 hover:brightness-110 active:scale-[0.98]',
        variant === 'ghost' && 'bg-transparent text-[color:var(--color-fg)] hover:bg-[color:var(--color-border)]/40',
        variant === 'outline' &&
          'border border-[color:var(--color-border)] bg-[color:var(--color-card)]/40 text-[color:var(--color-fg)] hover:border-[color:var(--color-accent)]/50',
        size === 'sm' && 'h-9 px-3 text-sm',
        size === 'md' && 'h-11 px-4 text-sm',
        className,
      )}
      {...props}
    />
  );
}
