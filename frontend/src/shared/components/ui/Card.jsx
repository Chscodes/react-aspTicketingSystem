import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export function Card({ children, className, hover = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { y: -2 } : undefined}
      className={cn(
        "overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200/80 shadow-sm shadow-zinc-900/[0.03]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ title, description, action, children }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-6 py-4">
      <div>
        {title && (
          <h2 className="text-base font-semibold tracking-tight text-zinc-900">
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-0.5 text-sm text-zinc-500">{description}</p>
        )}
        {children}
      </div>
      {action}
    </div>
  );
}
