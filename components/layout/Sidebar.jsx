"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/authStore";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/cycle-tracker", icon: "calendar_month", label: "Cycle Tracker" },
  { href: "/symptom-log", icon: "health_and_safety", label: "Symptom Log" },
  { href: "/insights", icon: "insights", label: "Insights" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, user, signOut } = useAuthStore();

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-alice-blue-100 flex flex-col z-40 shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-alice-blue-100">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-cerulean-500 to-cerulean-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg">water_drop</span>
          </div>
          <span className="font-display font-bold text-xl text-cerulean-800">Flo-ra</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group", isActive ? "bg-cerulean-500 text-white shadow-sm" : "text-cerulean-600 hover:bg-cerulean-50 hover:text-cerulean-700")}
            >
              <span className={cn("material-symbols-outlined text-xl transition-transform duration-200", !isActive && "group-hover:scale-110")}>{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-alice-blue-100">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-alice-blue-50 transition-colors">
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-cerulean-400 to-cerulean-600 flex items-center justify-center text-white font-bold text-sm shrink-0">{initials}</div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-cerulean-800 text-sm truncate">{displayName}</p>
            <p className="text-xs text-alice-blue-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleSignOut} className="mt-2 w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-alice-blue-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-sm font-medium">
          <span className="material-symbols-outlined text-xl">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
