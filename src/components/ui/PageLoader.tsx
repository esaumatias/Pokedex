import { motion } from 'framer-motion';

export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <motion.div
        className="h-12 w-12 rounded-full border-2 border-[color:var(--color-border)] border-t-[color:var(--color-accent)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
