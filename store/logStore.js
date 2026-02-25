import { create } from 'zustand'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

const useLogStore = create((set, get) => ({
    todayLog: null,
    allLogs: [],
    symptoms: [],    // master symptoms list
    activities: [],  // master activities list
    selectedSymptoms: [],   // IDs of selected symptoms for current log
    selectedActivities: [], // IDs of selected activities for current log
    selectedMood: null,
    selectedFlow: null,
    energyLevel: 3,
    notes: '',
    loading: false,
    error: null,

    // ─── Setters ────────────────────────────────────────────────
    setSelectedMood: (mood) => set({ selectedMood: mood }),
    setSelectedFlow: (flow) => set({ selectedFlow: flow }),
    setEnergyLevel: (level) => set({ energyLevel: level }),
    setNotes: (notes) => set({ notes }),

    toggleSymptom: (symptomId) => {
        const { selectedSymptoms } = get()
        if (selectedSymptoms.includes(symptomId)) {
            set({ selectedSymptoms: selectedSymptoms.filter(id => id !== symptomId) })
        } else {
            set({ selectedSymptoms: [...selectedSymptoms, symptomId] })
        }
    },

    toggleActivity: (activityId) => {
        const { selectedActivities } = get()
        if (selectedActivities.includes(activityId)) {
            set({ selectedActivities: selectedActivities.filter(id => id !== activityId) })
        } else {
            set({ selectedActivities: [...selectedActivities, activityId] })
        }
    },

    // ─── Fetch master data ───────────────────────────────────────
    fetchSymptoms: async () => {
        const { data } = await supabase
            .from('symptoms')
            .select('*')
            .eq('is_active', true)
            .order('category')
        if (data) set({ symptoms: data })
    },

    fetchActivities: async () => {
        const { data } = await supabase
            .from('activities')
            .select('*')
            .eq('is_active', true)
            .order('category')
        if (data) set({ activities: data })
    },

    // ─── Fetch today's log ───────────────────────────────────────
    fetchTodayLog: async (userId) => {
        const today = format(new Date(), 'yyyy-MM-dd')
        const { data, error } = await supabase
            .from('daily_logs')
            .select(`
        *,
        log_symptoms(symptom_id, severity),
        log_activities(activity_id, duration_minutes)
      `)
            .eq('user_id', userId)
            .eq('log_date', today)
            .single()

        if (!error && data) {
            set({
                todayLog: data,
                selectedMood: data.mood_label,
                selectedFlow: data.flow_intensity,
                energyLevel: data.energy_level || 3,
                notes: data.notes || '',
                selectedSymptoms: data.log_symptoms?.map(s => s.symptom_id) || [],
                selectedActivities: data.log_activities?.map(a => a.activity_id) || [],
            })
        }
        return { data, error }
    },

    // ─── Fetch log for a specific date ───────────────────────────
    fetchLogByDate: async (userId, date) => {
        const dateStr = format(date, 'yyyy-MM-dd')
        const { data, error } = await supabase
            .from('daily_logs')
            .select(`
        *,
        log_symptoms(symptom_id, severity, symptoms(name, icon, category)),
        log_activities(activity_id, duration_minutes, activities(name, icon, category))
      `)
            .eq('user_id', userId)
            .eq('log_date', dateStr)
            .single()
        return { data, error }
    },

    // ─── Fetch all logs for a month ──────────────────────────────
    fetchMonthLogs: async (userId, year, month) => {
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`
        const endDate = new Date(year, month, 0).toISOString().split('T')[0]
        const { data } = await supabase
            .from('daily_logs')
            .select(`*, log_symptoms(symptom_id), log_activities(activity_id)`)
            .eq('user_id', userId)
            .gte('log_date', startDate)
            .lte('log_date', endDate)
        if (data) set({ allLogs: data })
        return data
    },

    // ─── Save today's log (upsert) ───────────────────────────────
    saveLog: async (userId) => {
        const { selectedMood, selectedFlow, energyLevel, notes, selectedSymptoms, selectedActivities } = get()
        const today = format(new Date(), 'yyyy-MM-dd')

        set({ loading: true, error: null })

        const moodScoreMap = {
            'happy': 5, 'energetic': 5, 'calm': 4,
            'neutral': 3, 'sad': 2, 'anxious': 2, 'irritable': 2,
        }
        const moodScore = moodScoreMap[selectedMood] || 3

        // Upsert daily log
        const { data: log, error: logError } = await supabase
            .from('daily_logs')
            .upsert({
                user_id: userId,
                log_date: today,
                mood_score: moodScore,
                mood_label: selectedMood,
                flow_intensity: selectedFlow,
                energy_level: energyLevel,
                notes,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id,log_date' })
            .select()
            .single()

        if (logError) {
            set({ error: logError.message, loading: false })
            return { error: logError }
        }

        // Upsert symptoms
        if (selectedSymptoms.length > 0) {
            await supabase.from('log_symptoms').delete().eq('log_id', log.id)
            await supabase.from('log_symptoms').insert(
                selectedSymptoms.map(symptomId => ({
                    log_id: log.id,
                    symptom_id: symptomId,
                    severity: 2,
                }))
            )
        }

        // Upsert activities
        if (selectedActivities.length > 0) {
            await supabase.from('log_activities').delete().eq('log_id', log.id)
            await supabase.from('log_activities').insert(
                selectedActivities.map(activityId => ({
                    log_id: log.id,
                    activity_id: activityId,
                }))
            )
        }

        set({ todayLog: log, loading: false })
        return { data: log }
    },

    // Reset form state
    resetForm: () => set({
        selectedMood: null,
        selectedFlow: null,
        energyLevel: 3,
        notes: '',
        selectedSymptoms: [],
        selectedActivities: [],
    }),
}))

export default useLogStore