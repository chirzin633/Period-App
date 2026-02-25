"use client";

import { useState } from "react";
import { format } from "date-fns";
import Button from "@/components/ui/Button";
import useAuthStore from "@/store/authStore";
import useCycleStore from "@/store/cycleStore";

export default function AddCycleForm() {
  const { user } = useAuthStore();
  const { addCycle, loading, cycles } = useCycleStore();
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !startDate) return;

    const { error } = await addCycle({
      userId: user.id,
      periodStartDate: startDate,
      notes,
    });

    if (!error) {
      setSuccess(true);
      setNotes("");
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-alice-blue-100 shadow-sm p-5">
      <h3 className="font-semibold text-cerulean-800 mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-cerulean-500">add_circle</span>
        Log New Period Start
      </h3>

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">check_circle</span>
          Period logged! Predictions have been updated.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cerulean-700 mb-2">First day of period</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={format(new Date(), "yyyy-MM-dd")}
            className="w-full px-4 py-3 border border-alice-blue-300 rounded-xl text-cerulean-800 focus:outline-none focus:border-cerulean-500 focus:ring-2 focus:ring-cerulean-100 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-cerulean-700 mb-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any observations about this cycle..."
            className="w-full px-4 py-3 border border-alice-blue-200 rounded-xl text-sm text-cerulean-800 resize-none h-20 focus:outline-none focus:border-cerulean-500 focus:ring-2 focus:ring-cerulean-100 placeholder:text-alice-blue-400 transition-all"
          />
        </div>

        <Button type="submit" variant="primary" size="full" loading={loading}>
          <span className="material-symbols-outlined text-lg">water_drop</span>
          Log Period Start
        </Button>
      </form>

      {cycles.length > 0 && (
        <div className="mt-4 pt-4 border-t border-alice-blue-100">
          <p className="text-xs font-medium text-alice-blue-500 mb-2 uppercase tracking-wider">Recent Cycles</p>
          <div className="space-y-2">
            {cycles.slice(0, 3).map((cycle) => (
              <div key={cycle.id} className="flex items-center justify-between text-sm">
                <span className="text-cerulean-700">{format(new Date(cycle.period_start_date), "MMM d, yyyy")}</span>
                {cycle.cycle_length && <span className="text-alice-blue-500 bg-alice-blue-50 px-2 py-0.5 rounded-full text-xs">{cycle.cycle_length} days</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
