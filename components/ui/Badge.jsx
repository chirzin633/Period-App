import { cn } from "@/lib/utils";

export default function Badge({ children, variant = "default", className }) {
  const variants = {
    default: "bg-cerulean-100 text-cerulean-700",
    period: "bg-powder-petal-100 text-powder-petal-700",
    fertile: "bg-pacific-cyan-100 text-pacific-cyan-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    high: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-red-100 text-red-700",
  };

  return <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium", variants[variant] || variants.default, className)}>{children}</span>;
}
