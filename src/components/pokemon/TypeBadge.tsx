import { motion } from 'framer-motion';

import { cn } from '@/lib/cn';

type Props = {
  type: string;
  className?: string;
};

export function TypeBadge({ type, className }: Props) {
  const key = type.toLowerCase();
  const cssVarName = `--color-type-${key}`;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm ring-1 ring-black/10',
        className,
      )}
      style={{ backgroundColor: `var(${cssVarName}, var(--color-type-unknown))` }}
    >
      {type}
    </span>
  );
}

export function TypeBadgeAnimated({ type, className }: Props) {
  return (
    <motion.span layout initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <TypeBadge type={type} className={className} />
    </motion.span>
  );
}
