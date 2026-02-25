"use client";

import { format } from "date-fns";
import useAuthStore from "@/store/authStore";

export default function Header({ title, subtitle }) {
  const { profile, user } = useAuthStore();
  const displayName = profile?.display_name || user?.email?.split("@")[0] || "User";
  const today = format(new Date(), "EEEE, MMMM d");

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-cerulean-800">{title || `Good morning, ${displayName}! 🌸`}</h1>
        <p className="text-alice-blue-500 mt-1 text-sm">{subtitle || today}</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-10 h-10 rounded-xl bg-white border border-alice-blue-200 flex items-center justify-center text-cerulean-600 hover:bg-cerulean-50 transition-colors shadow-sm">
          <span className="material-symbols-outlined text-xl">notifications</span>
        </button>
      </div>
    </header>
  );
}
