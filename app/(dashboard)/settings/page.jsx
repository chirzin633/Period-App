"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import useAuthStore from "@/store/authStore";

export default function SettingsPage() {
  const { user, profile, fetchProfile, updateProfile, signOut, loading } = useAuthStore();
  const router = useRouter();

  const [form, setForm] = useState({
    display_name: "",
    date_of_birth: "",
    average_cycle_length: 28,
    average_period_length: 5,
    cycle_regularity: "regular",
    reminder_enabled: true,
    reminder_days_before: 2,
    timezone: "Asia/Jakarta",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) fetchProfile(user.id);
  }, [user]);

  useEffect(() => {
    if (profile) {
      setForm((prev) => ({
        ...prev,
        display_name: profile.display_name || "",
        date_of_birth: profile.date_of_birth || "",
        average_cycle_length: profile.average_cycle_length || 28,
        average_period_length: profile.average_period_length || 5,
        cycle_regularity: profile.cycle_regularity || "regular",
        reminder_enabled: profile.reminder_enabled ?? true,
        reminder_days_before: profile.reminder_days_before || 2,
        timezone: profile.timezone || "Asia/Jakarta",
      }));
    }
  }, [profile]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await updateProfile(form);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="animate-fade-in">
      <Header title="Settings ⚙️" subtitle="Manage your profile and app preferences" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Info */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-alice-blue-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-cerulean-800 mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-cerulean-500">person</span>
              Profile Information
            </h2>

            {saved && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                Profile saved successfully!
              </div>
            )}

            <div className="space-y-4">
              <Input label="Display Name" icon="person" type="text" value={form.display_name} onChange={handleChange("display_name")} placeholder="Your name" wrapperClassName="mb-0" />
              <Input label="Date of Birth" icon="cake" type="date" value={form.date_of_birth} onChange={handleChange("date_of_birth")} wrapperClassName="mb-0" />

              <div>
                <label className="block text-sm font-medium text-cerulean-800 mb-2">Email</label>
                <div className="w-full px-4 py-3 border border-alice-blue-200 rounded-xl text-alice-blue-400 bg-alice-blue-50 text-sm">{user?.email}</div>
                <p className="text-xs text-alice-blue-400 mt-1">Email cannot be changed here</p>
              </div>
            </div>
          </form>

          {/* Cycle Settings */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-alice-blue-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-cerulean-800 mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-cerulean-500">cycle</span>
              Cycle Preferences
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cerulean-800 mb-2">Average Cycle Length</label>
                  <div className="flex items-center gap-3">
                    <input type="range" min="21" max="45" value={form.average_cycle_length} onChange={handleChange("average_cycle_length")} className="flex-1 accent-cerulean-500" />
                    <span className="text-cerulean-700 font-bold w-12 text-center">{form.average_cycle_length}d</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-cerulean-800 mb-2">Average Period Length</label>
                  <div className="flex items-center gap-3">
                    <input type="range" min="1" max="10" value={form.average_period_length} onChange={handleChange("average_period_length")} className="flex-1 accent-cerulean-500" />
                    <span className="text-cerulean-700 font-bold w-12 text-center">{form.average_period_length}d</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cerulean-800 mb-2">Cycle Regularity</label>
                <div className="flex gap-3">
                  {["regular", "irregular", "unknown"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, cycle_regularity: opt }))}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 capitalize ${
                        form.cycle_regularity === opt ? "bg-cerulean-500 text-white" : "bg-alice-blue-50 text-cerulean-700 hover:bg-cerulean-100"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </form>

          {/* Notifications */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-alice-blue-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-cerulean-800 mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-cerulean-500">notifications</span>
              Notification Preferences
            </h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-cerulean-800 text-sm">Period Reminders</p>
                  <p className="text-xs text-alice-blue-500">Get notified before your period starts</p>
                </div>
                <div
                  onClick={() => setForm((prev) => ({ ...prev, reminder_enabled: !prev.reminder_enabled }))}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative cursor-pointer ${form.reminder_enabled ? "bg-cerulean-500" : "bg-alice-blue-200"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${form.reminder_enabled ? "left-7" : "left-1"}`} />
                </div>
              </label>

              {form.reminder_enabled && (
                <div>
                  <label className="block text-sm font-medium text-cerulean-800 mb-2">
                    Notify me {form.reminder_days_before} day{form.reminder_days_before !== 1 ? "s" : ""} before
                  </label>
                  <div className="flex items-center gap-3">
                    <input type="range" min="1" max="7" value={form.reminder_days_before} onChange={handleChange("reminder_days_before")} className="flex-1 accent-cerulean-500" />
                    <span className="text-cerulean-700 font-bold w-8 text-center">{form.reminder_days_before}</span>
                  </div>
                </div>
              )}
            </div>
          </form>

          <Button variant="primary" size="full" loading={loading} onClick={handleSubmit}>
            <span className="material-symbols-outlined text-lg">save</span>
            Save All Settings
          </Button>
        </div>

        {/* Right: Account Actions */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-alice-blue-100 shadow-sm p-5">
            <h3 className="font-semibold text-cerulean-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-cerulean-500">account_circle</span>
              Account
            </h3>
            <div className="space-y-3 text-sm text-alice-blue-600">
              <div className="flex justify-between">
                <span>Email</span>
                <span className="text-cerulean-700 font-medium truncate ml-2 max-w-[140px]">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Member since</span>
                <span className="text-cerulean-700 font-medium">{user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "–"}</span>
              </div>
            </div>
            <button onClick={handleSignOut} className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-red-600 hover:bg-red-50 border border-red-100 text-sm font-medium transition-all duration-200">
              <span className="material-symbols-outlined text-base">logout</span>
              Sign Out
            </button>
          </div>

          <div className="bg-alice-blue-50 rounded-2xl border border-alice-blue-100 p-5">
            <h3 className="font-semibold text-cerulean-700 mb-2 flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-base">security</span>
              Data & Privacy
            </h3>
            <p className="text-xs text-alice-blue-600 leading-relaxed">Your health data is encrypted and stored securely. We never share your personal information with third parties.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
