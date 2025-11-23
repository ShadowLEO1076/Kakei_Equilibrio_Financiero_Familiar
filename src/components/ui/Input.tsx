// src/components/ui/Input.tsx
import * as React from "react";
import clsx from "clsx";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={clsx(
          "flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm",
          "ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-400 dark:focus-visible:ring-teal-500",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };