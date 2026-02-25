"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import Header from "@/components/layout/Header";
import Calendar from "@/components/cycle-tracker/Calendar";
import LogPanel from "@/components/cycle-tracker/LogPanel";
import AddCycleForm from "@/components/cycle-tracker/AddCycleForm";
import useAuthStore from "@/store/authStore";
import useCycleStore from "@/store/cycleStore";
import useLogStore from "@/store/logStore";

export default function CycleTrackerPage() {
  const { user } = useAuthStore();
  const { cycles, activePrediction, selectedDate, fetchCycles, fetchActivePrediction, buildCalendar, currentMonth } = useCycleStore();
  const { fetchSymptoms, fetchActivities } = useLogStore();

  useEffect(() => {
    if (user) {
      fetchCycles(user.id);
      fetchActivePrediction(user.id);
      fetchSymptoms();
      fetchActivities();
    }
  }, [user]);

  useEffect(() => {
    buildCalendar(currentMonth);
  }, [cycles, activePrediction, currentMonth]);

  return (
    <div className="animate-fade-in">
      <Header title="Cycle Tracker 📅" subtitle="Log your period and track your cycle patterns" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Calendar + Add Cycle */}
        <div className="lg:col-span-3 space-y-5">
          <Calendar />
          <AddCycleForm />
        </div>

        {/* Right: Log Panel */}
        <div className="lg:col-span-2">
          <LogPanel selectedDate={selectedDate || new Date()} />
        </div>
      </div>
    </div>
  );
}
