import { cn } from "@/lib/utils";

export function Card({ children, className, ...props }) {
  return (
    <div className={cn("bg-white rounded-2xl shadow-sm border border-alice-blue-100", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn("p-6 pb-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h2 className={cn("text-xl font-semibold text-cerulean-700", className)} {...props}>
      {children}
    </h2>
  );
}
