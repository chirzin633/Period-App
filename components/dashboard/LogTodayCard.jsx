"use client";

import Link from "next/link";
import { format } from "date-fns";
import Button from "@/components/ui/Button";

export default function LogTodayCard({ todayLog }) {
  const today = format(new Date(), "EEEE, MMMM d");

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
    <div className="bg-linear-to-br from-cerulean-600 to-alice-blue-700 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <span className="material-symbols-outlined text-2xl">edit_calendar</span>
        <h2 className="text-lg font-semibold">{todayLog ? "Today's Log Updated" : "Log Today's Data"}</h2>
      </div>

      {todayLog ? (
        <div className="mb-4">
          <div className="flex items-center gap-4 bg-white/15 rounded-xl p-4">
            {todayLog.mood_label && (
              <div className="text-center">
                <div className="text-3xl">{moodEmoji[todayLog.mood_label] || "😊"}</div>
                <p className="text-xs mt-1 text-cerulean-200 capitalize">{todayLog.mood_label}</p>
              </div>
            )}
            {todayLog.flow_intensity && (
              <div className="text-center">
                <div className="text-3xl">💧</div>
                <p className="text-xs mt-1 text-cerulean-200 capitalize">{todayLog.flow_intensity}</p>
              </div>
            )}
            {todayLog.energy_level && (
              <div className="text-center">
                <div className="text-3xl">{"⚡".repeat(todayLog.energy_level)}</div>
                <p className="text-xs mt-1 text-cerulean-200">Energy {todayLog.energy_level}/5</p>
              </div>
            )}
          </div>
          <p className="text-cerulean-200 text-sm mt-3">{today} · Logged successfully</p>
        </div>
      ) : (
        <p className="text-cerulean-200 text-sm mb-4">Logging your mood and symptoms helps improve prediction accuracy over time.</p>
      )}

      <Link href="/cycle-tracker">
        <Button variant="white" size="full">
          <span className="material-symbols-outlined text-lg">{todayLog ? "edit" : "add"}</span>
          {todayLog ? "Update Today's Log" : "Log Today's Feelings & Symptoms"}
        </Button>
      </Link>
    </div>
  );
}
