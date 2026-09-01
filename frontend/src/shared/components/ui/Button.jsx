import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

const variants = {
  primary:
    "bg-zinc-900 text-white hover:bg-zinc-800 focus-visible:ring-zinc-400",
  secondary:
    "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50 focus-visible:ring-zinc-300",
  danger:
    "bg-white text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50 focus-visible:ring-rose-300",
  ghost: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

export const Button = forwardRef(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    disabled,
    children,
    type = "button",
    ...props
  },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      whileHover={disabled ? undefined : { y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
});
