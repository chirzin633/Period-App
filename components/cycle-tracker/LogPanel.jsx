"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import useLogStore from "@/store/logStore";
import useAuthStore from "@/store/authStore";

const MOODS = [
  { value: "happy", emoji: "😊", label: "Happy" },
  { value: "calm", emoji: "😌", label: "Calm" },
  { value: "energetic", emoji: "⚡", label: "Energetic" },
  { value: "neutral", emoji: "😐", label: "Neutral" },
  { value: "sad", emoji: "😔", label: "Sad" },
  { value: "anxious", emoji: "😰", label: "Anxious" },
  { value: "irritable", emoji: "😤", label: "Irritable" },
];

const FLOWS = [
  { value: "spotting", label: "Spotting", dots: 1 },
  { value: "light", label: "Light", dots: 2 },
  { value: "medium", label: "Medium", dots: 3 },
  { value: "heavy", label: "Heavy", dots: 4 },
  { value: "very_heavy", label: "Very Heavy", dots: 5 },
];

export default function LogPanel({ selectedDate }) {
  const { user } = useAuthStore();
  const { symptoms, selectedSymptoms, selectedMood, selectedFlow, energyLevel, notes, loading, setSelectedMood, setSelectedFlow, setEnergyLevel, setNotes, toggleSymptom, saveLog, fetchLogByDate, fetchSymptoms, resetForm } = useLogStore();

  const dateLabel = selectedDate ? format(selectedDate, "EEEE, MMMM d") : format(new Date(), "EEEE, MMMM d");

  useEffect(() => {
    fetchSymptoms();
  }, []);

  useEffect(() => {
    if (user && selectedDate) {
      fetchLogByDate(user.id, selectedDate).then(({ data }) => {
        if (data) {
          setSelectedMood(data.mood_label);
          setSelectedFlow(data.flow_intensity);
          setEnergyLevel(data.energy_level || 3);
          setNotes(data.notes || "");
        } else {
          resetForm();
        }
      });
    }
  }, [selectedDate, user]);

  const handleSave = async () => {
    if (!user) return;
    const { error } = await saveLog(user.id);
    if (!error) {
      // Visual feedback could be added here
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-alice-blue-100 h-full">
      <div className="p-5 border-b border-alice-blue-100 bg-linear-to-r from-cerulean-50 to-alice-blue-50 rounded-t-2xl">
        <h2 className="font-semibold text-cerulean-800 flex items-center gap-2">
          <span className="material-symbols-outlined text-cerulean-500">edit_calendar</span>
          Log for {dateLabel}
        </h2>
      </div>

      <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(100vh-240px)]">
        {/* Mood */}
        <section>
          <h3 className="text-sm font-semibold text-cerulean-700 mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">sentiment_satisfied</span>
            How are you feeling?
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {MOODS.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value === selectedMood ? null : mood.value)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-medium transition-all duration-200",
                  selectedMood === mood.value ? "bg-cerulean-500 text-white shadow-sm scale-105" : "bg-alice-blue-50 text-cerulean-700 hover:bg-cerulean-100 hover:scale-105",
                )}
              >
                <span className="text-2xl">{mood.emoji}</span>
                {mood.label}
              </button>
            ))}
          </div>
        </section>

        {/* Flow */}
        <section>
          <h3 className="text-sm font-semibold text-cerulean-700 mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">water_drop</span>
            Flow Intensity
          </h3>
          <div className="flex gap-2">
            {FLOWS.map((flow) => (
              <button
                key={flow.value}
                onClick={() => setSelectedFlow(flow.value === selectedFlow ? null : flow.value)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-3 px-1 rounded-xl text-xs font-medium transition-all duration-200",
                  selectedFlow === flow.value ? "bg-cerulean-500 text-white shadow-sm" : "bg-alice-blue-50 text-cerulean-700 hover:bg-cerulean-100",
                )}
              >
                <div className="flex gap-0.5">
                  {Array(flow.dots)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} className={cn("w-1.5 h-1.5 rounded-full", selectedFlow === flow.value ? "bg-white" : "bg-cerulean-400")} />
                    ))}
                </div>
                {flow.label}
              </button>
            ))}
          </div>
        </section>

        {/* Energy Level */}
        <section>
          <h3 className="text-sm font-semibold text-cerulean-700 mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">bolt</span>
            Energy Level: {energyLevel}/5
          </h3>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setEnergyLevel(level)}
                className={cn("flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200", energyLevel >= level ? "bg-cerulean-500 text-white" : "bg-alice-blue-50 text-alice-blue-400")}
              >
                {level}
              </button>
            ))}
          </div>
        </section>

        {/* Symptoms */}
        {symptoms.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-cerulean-700 mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">health_and_safety</span>
              Symptoms
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {symptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={cn(
                    "flex items-center gap-2.5 p-3 rounded-xl text-sm transition-all duration-200 text-left",
                    selectedSymptoms.includes(symptom.id) ? "bg-cerulean-500 text-white shadow-sm" : "bg-alice-blue-50 text-cerulean-700 hover:bg-cerulean-100",
                  )}
                >
                  <span className="text-xl shrink-0">{symptom.icon}</span>
                  <span className="font-medium text-xs leading-tight">{symptom.name}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Notes */}
        <section>
          <h3 className="text-sm font-semibold text-cerulean-700 mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">notes</span>
            Notes
          </h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How are you feeling today? Any other observations..."
            className="w-full p-3.5 border border-alice-blue-200 rounded-xl text-sm text-cerulean-800 resize-none min-h-[90px] focus:outline-none focus:border-cerulean-500 focus:ring-2 focus:ring-cerulean-100 placeholder:text-alice-blue-400 transition-all"
          />
        </section>

        {/* Save Button */}
        <Button variant="primary" size="full" loading={loading} onClick={handleSave}>
          <span className="material-symbols-outlined text-lg">save</span>
          Save Log
        </Button>
      </div>
    </div>
  );
}
