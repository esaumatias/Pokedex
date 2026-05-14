import { cn } from '@/lib/cn';

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: Props) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/70 px-3 text-sm text-[color:var(--color-fg)] shadow-inner shadow-black/5 outline-none transition placeholder:text-[color:var(--color-muted)] focus:border-[color:var(--color-accent)]/60 focus:ring-2 focus:ring-[color:var(--color-accent)]/25',
        className,
      )}
      {...props}
    />
  );
}
