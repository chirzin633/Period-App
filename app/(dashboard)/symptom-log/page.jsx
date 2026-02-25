"use client";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import Header from "@/components/layout/Header";
import LogPanel from "@/components/cycle-tracker/LogPanel";
import useAuthStore from "@/store/authStore";
import useLogStore from "@/store/logStore";

export default function SymptomLogPage() {
  const { user } = useAuthStore();
  const { fetchSymptoms, fetchActivities, fetchMonthLogs, allLogs } = useLogStore();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const today = new Date();

  useEffect(() => {
    if (user) {
      fetchSymptoms();
      fetchActivities();
      fetchMonthLogs(user.id, today.getFullYear(), today.getMonth() + 1);
    }
  }, [user]);

  // Last 7 days for quick select
  const recentDays = Array.from({ length: 7 }, (_, i) => subDays(today, i));

  const hasLog = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return allLogs.some((l) => l.log_date === dateStr);
  };

  return (
    <div className="animate-fade-in">
      <Header title="Symptom Log 🩺" subtitle="Track your daily symptoms, mood, and energy" />

      {/* Quick Date Selector */}
      <div className="bg-white rounded-2xl border border-alice-blue-100 shadow-sm p-4 mb-6">
        <p className="text-sm font-medium text-alice-blue-500 mb-3 uppercase tracking-wider">Select Day</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {recentDays.map((date) => {
            const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
            const logged = hasLog(date);
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all duration-200 min-w-[60px] ${
                  isSelected ? "bg-cerulean-500 text-white shadow-sm" : "bg-alice-blue-50 text-cerulean-700 hover:bg-cerulean-100"
                }`}
              >
                <span className="text-xs font-medium opacity-80">{format(date, "EEE")}</span>
                <span className="text-lg font-bold">{format(date, "d")}</span>
                {logged && <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-cerulean-500"}`} />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Log Panel */}
        <div className="lg:col-span-3">
          <LogPanel selectedDate={selectedDate} />
        </div>

        {/* Symptom History Summary */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-alice-blue-100 shadow-sm p-5">
            <h3 className="font-semibold text-cerulean-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-cerulean-500">bar_chart</span>
              This Month Summary
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <SummaryItem icon="edit_note" value={allLogs.length} label="Days Logged" color="cerulean" />
              <SummaryItem icon="sentiment_satisfied" value={allLogs.filter((l) => l.mood_score >= 4).length} label="Good Mood Days" color="pacific-cyan" />
              <SummaryItem icon="water_drop" value={allLogs.filter((l) => l.is_menstruating).length} label="Period Days" color="powder-petal" />
              <SummaryItem icon="bolt" value={allLogs.length > 0 ? (allLogs.reduce((s, l) => s + (l.energy_level || 3), 0) / allLogs.length).toFixed(1) : "–"} label="Avg Energy" color="alice-blue" />
            </div>
          </div>

          <div className="bg-linear-to-br from-alice-blue-50 to-cerulean-50 rounded-2xl border border-alice-blue-100 p-5">
            <h3 className="font-semibold text-cerulean-700 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">lightbulb</span>
              Logging Tip
            </h3>
            <p className="text-sm text-alice-blue-700 leading-relaxed">The more consistently you log, the more accurate your predictions become. Try to log at the same time each day — morning or evening works best!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ icon, value, label, color }) {
  const colors = {
    cerulean: "bg-cerulean-50 text-cerulean-600",
    "pacific-cyan": "bg-pacific-cyan-50 text-pacific-cyan-600",
    "powder-petal": "bg-powder-petal-50 text-powder-petal-600",
    "alice-blue": "bg-alice-blue-100 text-alice-blue-600",
  };

  return (
    <div className={`rounded-xl p-3 ${colors[color]}`}>
      <span className="material-symbols-outlined text-lg mb-1 block">{icon}</span>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs mt-0.5 opacity-75">{label}</div>
    </div>
  );
}
