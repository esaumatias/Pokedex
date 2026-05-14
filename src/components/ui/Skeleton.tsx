import { cn } from '@/lib/cn';

type Props = {
  className?: string;
};

export function Skeleton({ className }: Props) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-[color:var(--color-border)]/60 dark:bg-[color:var(--color-border)]/80',
        className,
      )}
    />
  );
}
