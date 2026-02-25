"use client";

import { cn } from "@/lib/utils";

export default function Button({ children, variant = "primary", size = "md", loading = false, className, ...props }) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cerulean-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-gradient-to-r from-cerulean-500 to-cerulean-700 text-white hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0",
    secondary: "bg-cerulean-100 text-cerulean-700 hover:bg-cerulean-200",
    outline: "border-2 border-cerulean-500 text-cerulean-600 hover:bg-cerulean-50",
    ghost: "text-cerulean-600 hover:bg-cerulean-100",
    danger: "bg-red-500 text-white hover:bg-red-600",
    white: "bg-white text-cerulean-600 hover:-translate-y-0.5 hover:shadow-md",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-3 text-base",
    lg: "px-7 py-4 text-lg",
    full: "px-5 py-3.5 text-base w-full",
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={loading || props.disabled} {...props}>
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}
