"use client";

import { useEffect, useMemo } from "react";
import { format, parseISO } from "date-fns";
import Header from "@/components/layout/Header";
import useAuthStore from "@/store/authStore";
import useCycleStore from "@/store/cycleStore";
import useLogStore from "@/store/logStore";

export default function InsightsPage() {
  const { user } = useAuthStore();
  const { cycles, activePrediction, fetchCycles, fetchActivePrediction, computeLocalPrediction } = useCycleStore();
  const { allLogs, fetchMonthLogs, fetchSymptoms } = useLogStore();

  const today = new Date();

  useEffect(() => {
    if (user) {
      fetchCycles(user.id);
      fetchActivePrediction(user.id);
      fetchMonthLogs(user.id, today.getFullYear(), today.getMonth() + 1);
      fetchSymptoms();
    }
  }, [user]);

  const localPrediction = useMemo(() => computeLocalPrediction(cycles), [cycles]);
  const stats = activePrediction || {};

  const cycleLengths = cycles.filter((c) => c.cycle_length).map((c) => c.cycle_length);
  const periodLengths = cycles.filter((c) => c.period_length).map((c) => c.period_length);

  const moodDistribution = allLogs.reduce((acc, log) => {
    if (log.mood_label) acc[log.mood_label] = (acc[log.mood_label] || 0) + 1;
    return acc;
  }, {});
  const topMoods = Object.entries(moodDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const avgEnergy = allLogs.length > 0 ? (allLogs.reduce((s, l) => s + (l.energy_level || 3), 0) / allLogs.length).toFixed(1) : null;

  const confidenceColor = {
    high: "text-green-600 bg-green-50 border-green-200",
    medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
    low: "text-red-600 bg-red-50 border-red-200",
  };

  const moodEmoji = {
    happy: "😊",
    energetic: "⚡",
    calm: "😌",
    neutral: "😐",
    sad: "😔",
    anxious: "😰",
    irritable: "😤",
  };

  return (
    <div className="animate-fade-in">
      <Header title="Insights 📊" subtitle="Understand your cycle patterns over time" />

      {cycles.length < 2 ? (
        <div className="bg-white rounded-2xl border border-alice-blue-100 shadow-sm p-10 text-center">
          <span className="material-symbols-outlined text-5xl text-alice-blue-300 mb-4 block">insights</span>
          <h3 className="text-xl font-semibold text-cerulean-700 mb-2">Not enough data yet</h3>
          <p className="text-alice-blue-500 text-sm">Log at least 2 cycles to start seeing your personalized insights and patterns.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Algorithm Stats */}
          <div className="bg-white rounded-2xl border border-alice-blue-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-cerulean-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-cerulean-500">functions</span>
              Mean-Cycle Algorithm Results
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InsightStat value={stats.computed_avg_cycle_length?.toFixed(1) || "–"} unit="days" label="Avg Cycle Length" icon="loop" color="cerulean" />
              <InsightStat value={stats.computed_avg_period_length?.toFixed(1) || "–"} unit="days" label="Avg Period Duration" icon="water_drop" color="powder-petal" />
              <InsightStat value={stats.std_deviation?.toFixed(1) || "–"} unit="days" label="Std Deviation" icon="show_chart" color="pacific-cyan" />
              <InsightStat value={stats.cycles_used_count || cycles.length} unit="cycles" label="Data Points" icon="data_usage" color="alice-blue" />
            </div>

            {stats.confidence_level && (
              <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${confidenceColor[stats.confidence_level]}`}>
                <span className="material-symbols-outlined text-base">verified</span>
                {stats.confidence_level.charAt(0).toUpperCase() + stats.confidence_level.slice(1)} prediction accuracy
                {stats.confidence_level === "high" && " — Your cycle is very regular!"}
                {stats.confidence_level === "medium" && " — Moderate cycle variation detected"}
                {stats.confidence_level === "low" && " — High variation — keep logging!"}
              </div>
            )}
          </div>

          {/* Cycle Length Chart (Simple bar visualization) */}
          {cycleLengths.length >= 2 && (
            <div className="bg-white rounded-2xl border border-alice-blue-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-cerulean-800 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-cerulean-500">bar_chart</span>
                Cycle Length History
              </h2>
              <div className="flex items-end gap-2 h-32">
                {cycleLengths
                  .slice()
                  .reverse()
                  .map((len, i) => {
                    const max = Math.max(...cycleLengths, 35);
                    const min = Math.min(...cycleLengths, 21);
                    const height = ((len - min + 3) / (max - min + 6)) * 100;
                    const avg = cycleLengths.reduce((s, c) => s + c, 0) / cycleLengths.length;
                    const isAboveAvg = len > avg;

                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs text-alice-blue-500 font-medium">{len}d</span>
                        <div className={`w-full rounded-t-lg transition-all duration-500 ${isAboveAvg ? "bg-pacific-cyan-400" : "bg-cerulean-400"}`} style={{ height: `${height}%` }} />
                      </div>
                    );
                  })}
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-alice-blue-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-pacific-cyan-400 inline-block" /> Above average
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-cerulean-400 inline-block" /> Below average
                </span>
              </div>
            </div>
          )}

          {/* Mood Distribution */}
          {topMoods.length > 0 && (
            <div className="bg-white rounded-2xl border border-alice-blue-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-cerulean-800 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-cerulean-500">sentiment_satisfied</span>
                Mood Patterns This Month
              </h2>
              <div className="space-y-3">
                {topMoods.map(([mood, count]) => {
                  const pct = Math.round((count / allLogs.length) * 100);
                  return (
                    <div key={mood} className="flex items-center gap-3">
                      <span className="text-2xl w-8">{moodEmoji[mood] || "😊"}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-cerulean-700 capitalize">{mood}</span>
                          <span className="text-alice-blue-500">
                            {count} days ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 bg-alice-blue-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cerulean-400 to-cerulean-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {avgEnergy && (
                <div className="mt-4 pt-4 border-t border-alice-blue-100 flex items-center gap-3">
                  <span className="material-symbols-outlined text-cerulean-500">bolt</span>
                  <span className="text-sm text-cerulean-700">
                    Average energy this month: <strong>{avgEnergy}/5</strong>
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Upcoming Prediction Summary */}
          {activePrediction && (
            <div className="bg-gradient-to-br from-cerulean-500 to-cerulean-700 rounded-2xl p-6 text-white shadow-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">calendar_month</span>
                Next Cycle Predictions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activePrediction.predicted_period_start && <PredictionBadge label="Next Period" date={activePrediction.predicted_period_start} icon="water_drop" />}
                {activePrediction.predicted_ovulation_date && <PredictionBadge label="Ovulation" date={activePrediction.predicted_ovulation_date} icon="brightness_high" />}
                {activePrediction.fertile_window_start && (
                  <PredictionBadge label="Fertile Window" date={`${format(parseISO(activePrediction.fertile_window_start), "MMM d")} – ${format(parseISO(activePrediction.fertile_window_end), "MMM d")}`} icon="spa" isRange />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InsightStat({ value, unit, label, icon, color }) {
  const colors = {
    cerulean: "bg-cerulean-50 text-cerulean-600 border-cerulean-100",
    "powder-petal": "bg-powder-petal-50 text-powder-petal-600 border-powder-petal-100",
    "pacific-cyan": "bg-pacific-cyan-50 text-pacific-cyan-600 border-pacific-cyan-100",
    "alice-blue": "bg-alice-blue-50 text-alice-blue-600 border-alice-blue-100",
  };
  const iconColors = {
    cerulean: "text-cerulean-500",
    "powder-petal": "text-powder-petal-500",
    "pacific-cyan": "text-pacific-cyan-500",
    "alice-blue": "text-alice-blue-500",
  };

  return (
    <div className={`rounded-xl p-4 border ${colors[color]}`}>
      <span className={`material-symbols-outlined text-xl mb-2 block ${iconColors[color]}`}>{icon}</span>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs mt-0.5 opacity-70">{unit}</div>
      <div className="text-xs mt-1 font-medium opacity-80">{label}</div>
    </div>
  );
}

function PredictionBadge({ label, date, icon, isRange }) {
  return (
    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
      <span className="material-symbols-outlined text-base text-cerulean-200 mb-1 block">{icon}</span>
      <p className="text-cerulean-200 text-xs mb-1">{label}</p>
      <p className="font-semibold text-sm">{isRange ? date : format(parseISO(date), "MMMM d, yyyy")}</p>
    </div>
  );
}
