"use client";

import { differenceInDays, parseISO, format } from "date-fns";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";

function PredictionItem({ icon, iconBg, title, date, daysFrom }) {
  const today = new Date();
  const targetDate = typeof date === "string" ? parseISO(date) : date;
  const diff = daysFrom !== undefined ? daysFrom : differenceInDays(targetDate, today);

  const diffLabel = diff === 0 ? "Today" : diff > 0 ? `In ${diff} day${diff === 1 ? "" : "s"}` : `${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"} ago`;

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-alice-blue-50 hover:-translate-y-0.5 transition-all duration-200 border border-alice-blue-100">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${iconBg}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex-1">
        <p className="font-semibold text-cerulean-800">{title}</p>
        <p className="text-sm text-alice-blue-500">{date ? format(targetDate, "MMMM d, yyyy") : "–"}</p>
      </div>
      <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${diff === 0 ? "bg-cerulean-500 text-white" : diff > 0 && diff <= 3 ? "bg-powder-petal-100 text-powder-petal-700" : "bg-alice-blue-100 text-alice-blue-600"}`}>
        {diffLabel}
      </span>
    </div>
  );
}

export default function PredictionCard({ prediction }) {
  if (!prediction) {
    return (
      <Card className="mb-6">
        <CardContent>
          <CardTitle className="mb-4">Upcoming Predictions</CardTitle>
          <div className="text-center py-6 text-alice-blue-500">
            <span className="material-symbols-outlined text-4xl mb-2 block">schedule</span>
            <p>Add more cycle data to see predictions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Upcoming Predictions</CardTitle>
          <div className="text-xs text-alice-blue-500 bg-alice-blue-50 px-3 py-1 rounded-full">
            Based on {prediction.cycles_used_count} cycle{prediction.cycles_used_count !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="space-y-3">
          {prediction.predicted_ovulation_date && <PredictionItem icon="brightness_high" iconBg="bg-pacific-cyan-100 text-pacific-cyan-600" title="Predicted Ovulation" date={prediction.predicted_ovulation_date} />}
          {prediction.fertile_window_start && <PredictionItem icon="spa" iconBg="bg-cerulean-100 text-cerulean-600" title="Fertile Window Starts" date={prediction.fertile_window_start} />}
          {prediction.predicted_period_start && <PredictionItem icon="water_drop" iconBg="bg-powder-petal-100 text-powder-petal-600" title="Next Period Starts" date={prediction.predicted_period_start} />}
        </div>

        <div className="mt-4 pt-4 border-t border-alice-blue-100 grid grid-cols-2 gap-3 text-center">
          <div className="bg-cerulean-50 rounded-xl p-3">
            <p className="text-2xl font-bold text-cerulean-600">{prediction.computed_avg_cycle_length?.toFixed(0) || "–"}</p>
            <p className="text-xs text-alice-blue-500 mt-0.5">Avg cycle days</p>
          </div>
          <div className="bg-alice-blue-50 rounded-xl p-3">
            <p className="text-2xl font-bold text-alice-blue-600">{prediction.std_deviation?.toFixed(1) || "–"}</p>
            <p className="text-xs text-alice-blue-500 mt-0.5">Std deviation (days)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
