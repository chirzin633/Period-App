"use client";

import { differenceInDays, parseISO, format, addDays } from "date-fns";
import Badge from "@/components/ui/Badge";

const PHASES = [
  { name: "Menstrual", days: [1, 5], color: "text-powder-petal-600", desc: "Rest and be gentle with yourself.", icon: "water_drop" },
  { name: "Follicular", days: [6, 13], color: "text-cerulean-600", desc: "Energy is rising. Great for creativity and planning.", icon: "eco" },
  { name: "Ovulatory", days: [14, 16], color: "text-pacific-cyan-600", desc: "Peak energy and communication. Ideal for social activities.", icon: "brightness_high" },
  { name: "Luteal", days: [17, 28], color: "text-alice-blue-600", desc: "Wind down, focus on self-care and reflection.", icon: "nights_stay" },
];

function getCurrentPhase(cycleDay, cycleLength) {
  const scaled = Math.round((cycleDay / cycleLength) * 28);
  return PHASES.find((p) => scaled >= p.days[0] && scaled <= p.days[1]) || PHASES[1];
}

export default function CycleSummary({ cycles, prediction }) {
  const today = new Date();

  // Calculate current cycle day
  let cycleDay = null;
  let cycleLength = 28;
  let lastPeriodStart = null;

  if (cycles && cycles.length > 0) {
    const current = cycles.find((c) => c.is_current) || cycles[0];
    lastPeriodStart = parseISO(current.period_start_date);
    cycleDay = differenceInDays(today, lastPeriodStart) + 1;
    cycleLength = current.cycle_length || prediction?.computed_avg_cycle_length || 28;
  }

  if (!cycleDay) {
    return (
      <div className="bg-gradient-to-br from-cerulean-50 to-alice-blue-100 rounded-2xl p-6 mb-6 border border-cerulean-100">
        <p className="text-cerulean-600 text-center py-4">Log your first period to start tracking your cycle.</p>
      </div>
    );
  }

  const phase = getCurrentPhase(cycleDay, cycleLength);
  const progress = Math.min((cycleDay / cycleLength) * 100, 100);
  const daysLeft = Math.max(cycleLength - cycleDay, 0);

  return (
    <div className="bg-gradient-to-br from-cerulean-500 to-cerulean-700 rounded-2xl p-6 mb-6 text-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-cerulean-200 text-sm font-medium uppercase tracking-wider">Current Cycle</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-5xl font-display font-bold">Day {cycleDay}</span>
            <span className="text-cerulean-300 text-lg">of {cycleLength}</span>
          </div>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">{phase.icon}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-cerulean-200">Start</span>
          <span className="text-xs text-cerulean-200">{daysLeft} days until next period</span>
        </div>
      </div>

      {/* Phase Info */}
      <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="material-symbols-outlined text-base">info</span>
          <span className="font-semibold text-sm">{phase.name} Phase</span>
        </div>
        <p className="text-cerulean-100 text-sm">{phase.desc}</p>
      </div>

      {/* Prediction Badges */}
      {prediction && (
        <div className="flex gap-2 mt-4 flex-wrap">
          {prediction.predicted_ovulation_date && (
            <div className="bg-white/15 rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">brightness_high</span>
              Ovulation: {format(parseISO(prediction.predicted_ovulation_date), "MMM d")}
            </div>
          )}
          {prediction.predicted_period_start && (
            <div className="bg-white/15 rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              Next period: {format(parseISO(prediction.predicted_period_start), "MMM d")}
            </div>
          )}
          <div className={`rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 ${prediction.confidence_level === "high" ? "bg-green-400/30" : prediction.confidence_level === "medium" ? "bg-yellow-400/30" : "bg-red-400/30"}`}>
            <span className="material-symbols-outlined text-sm">verified</span>
            {prediction.confidence_level === "high" ? "High" : prediction.confidence_level === "medium" ? "Medium" : "Low"} accuracy
          </div>
        </div>
      )}
    </div>
  );
}
