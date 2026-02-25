"use client";

import { useEffect } from "react";
import Header from "@/components/layout/Header";
import CycleSummary from "@/components/dashboard/CycleSummary";
import PredictionCard from "@/components/dashboard/PredictionCard";
import LogTodayCard from "@/components/dashboard/LogTodayCard";
import useAuthStore from "@/store/authStore";
import useCycleStore from "@/store/cycleStore";
import useLogStore from "@/store/logStore";

export default function DashboardPage() {
  const { user, fetchProfile } = useAuthStore();
  const { cycles, activePrediction, fetchCycles, fetchActivePrediction, buildCalendar, currentMonth } = useCycleStore();
  const { todayLog, fetchTodayLog, fetchSymptoms } = useLogStore();

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
      fetchCycles(user.id);
      fetchActivePrediction(user.id);
      fetchTodayLog(user.id);
      fetchSymptoms();
    }
  }, [user]);

  // Build calendar after cycles loaded
  useEffect(() => {
    buildCalendar(currentMonth);
  }, [cycles, activePrediction]);

  // Recent symptoms from today's log
  const recentSymptomIds = todayLog?.log_symptoms?.map((s) => s.symptom_id) || [];

  return (
    <div className="animate-fade-in">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <CycleSummary cycles={cycles} prediction={activePrediction} />

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard icon="calendar_today" value={activePrediction?.computed_avg_cycle_length?.toFixed(0) || "–"} label="Avg cycle" unit="days" color="cerulean" />
            <StatCard icon="water_drop" value={activePrediction?.computed_avg_period_length?.toFixed(0) || "–"} label="Avg period" unit="days" color="powder-petal" />
            <StatCard icon="monitoring" value={cycles.length || 0} label="Cycles tracked" unit="total" color="pacific-cyan" />
          </div>

          <PredictionCard prediction={activePrediction} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <LogTodayCard todayLog={todayLog} />

          {/* Tips card */}
          <TipsCard cycleDay={getCycleDay(cycles)} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, unit, color }) {
  const colorMap = {
    cerulean: "bg-cerulean-50 text-cerulean-600 border-cerulean-100",
    "powder-petal": "bg-powder-petal-50 text-powder-petal-600 border-powder-petal-100",
    "pacific-cyan": "bg-pacific-cyan-50 text-pacific-cyan-600 border-pacific-cyan-100",
  };
  const iconBg = {
    cerulean: "bg-cerulean-100 text-cerulean-600",
    "powder-petal": "bg-powder-petal-100 text-powder-petal-600",
    "pacific-cyan": "bg-pacific-cyan-100 text-pacific-cyan-600",
  };

  return (
    <div className={`rounded-2xl p-4 border ${colorMap[color]} bg-white`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${iconBg[color]}`}>
        <span className="material-symbols-outlined text-lg">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-cerulean-800">{value}</div>
      <div className="text-xs text-alice-blue-500 mt-0.5">
        {label} <span className="text-alice-blue-400">/ {unit}</span>
      </div>
    </div>
  );
}

function TipsCard({ cycleDay }) {
  const tips = [
    { day: [1, 5], tip: "💆 Rest is productive. Take it easy and listen to your body.", title: "Rest & Restore" },
    { day: [6, 13], tip: "🎨 Your energy is building — great time for creative projects!", title: "Creative Boost" },
    { day: [14, 16], tip: "🗣️ Peak communication skills! Ideal for important conversations.", title: "Peak Performance" },
    { day: [17, 28], tip: "🧘 Wind down and focus on self-care routines.", title: "Self-Care Mode" },
  ];

  const currentTip = tips.find((t) => cycleDay >= t.day[0] && cycleDay <= t.day[1]) || tips[1];

  return (
    <div className="bg-gradient-to-br from-alice-blue-50 to-cerulean-50 rounded-2xl p-5 border border-alice-blue-100">
      <h3 className="font-semibold text-cerulean-700 mb-1 flex items-center gap-2">
        <span className="material-symbols-outlined text-base">lightbulb</span>
        Phase Tip: {currentTip.title}
      </h3>
      <p className="text-sm text-alice-blue-700 leading-relaxed">{currentTip.tip}</p>
    </div>
  );
}

function getCycleDay(cycles) {
  if (!cycles || cycles.length === 0) return 1;
  const { parseISO, differenceInDays } = require("date-fns");
  const current = cycles.find((c) => c.is_current) || cycles[0];
  return differenceInDays(new Date(), parseISO(current.period_start_date)) + 1;
}
