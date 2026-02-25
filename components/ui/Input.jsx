"use client";

import { cn } from "@/lib/utils";

export default function Input({ label, icon, error, className, wrapperClassName, ...props }) {
  return (
    <div className={cn("mb-4", wrapperClassName)}>
      {label && <label className="block mb-2 font-medium text-cerulean-800 text-sm">{label}</label>}
      <div className="relative">
        {icon && <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-cerulean-500 text-xl pointer-events-none">{icon}</span>}
        <input
          className={cn(
            "w-full py-3.5 border border-alice-blue-300 rounded-xl text-cerulean-900 bg-white",
            "transition-all duration-200 focus:outline-none focus:border-cerulean-500 focus:ring-2 focus:ring-cerulean-100",
            "placeholder:text-alice-blue-400",
            icon ? "pl-11 pr-4" : "px-4",
            error && "border-red-400 focus:border-red-500 focus:ring-red-100",
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}
