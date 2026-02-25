import { create } from 'zustand'
import { addDays, differenceInDays, format, parseISO } from 'date-fns'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

const useCycleStore = create((set, get) => ({
    cycles: [],
    activePrediction: null,
    currentMonth: new Date(),
    selectedDate: new Date(),
    calendarDays: [],
    loading: false,
    error: null,

    setCurrentMonth: (date) => {
        set({ currentMonth: date })
        get().buildCalendar(date)
    },

    setSelectedDate: (date) => set({ selectedDate: date }),

    // ─── Fetch cycles from Supabase ───────────────────────────────
    fetchCycles: async (userId) => {
        set({ loading: true, error: null })
        const { data, error } = await supabase
            .from('cycles')
            .select('*')
            .eq('user_id', userId)
            .order('period_start_date', { ascending: false })
        if (error) {
            set({ error: error.message, loading: false })
            return
        }
        set({ cycles: data || [], loading: false })
        get().buildCalendar(get().currentMonth)
        return data
    },

    // ─── Fetch active prediction ───────────────────────────────────
    fetchActivePrediction: async (userId) => {
        const { data, error } = await supabase
            .from('predictions')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)
            .single()
        if (!error && data) {
            set({ activePrediction: data })
        }
        return { data, error }
    },

    // ─── Add new cycle (triggers DB recalculation via trigger) ────
    addCycle: async ({ userId, periodStartDate, notes }) => {
        set({ loading: true, error: null })

        // Calculate cycle_length from previous cycle
        const { cycles } = get()
        const lastCycle = cycles[0]
        let cycleLength = null
        if (lastCycle) {
            cycleLength = differenceInDays(
                parseISO(periodStartDate),
                parseISO(lastCycle.period_start_date)
            )
        }

        // Mark previous current cycle as not current
        if (lastCycle?.is_current) {
            await supabase
                .from('cycles')
                .update({ is_current: false })
                .eq('id', lastCycle.id)
        }

        const { data, error } = await supabase
            .from('cycles')
            .insert({
                user_id: userId,
                period_start_date: periodStartDate,
                cycle_length: cycleLength,
                is_current: true,
                data_source: 'manual',
                notes,
            })
            .select()
            .single()

        if (error) {
            set({ error: error.message, loading: false })
            return { error }
        }

        // Refresh cycles and prediction
        await get().fetchCycles(userId)
        await get().fetchActivePrediction(userId)
        set({ loading: false })
        return { data }
    },

    // ─── Update period end date ────────────────────────────────────
    updatePeriodEnd: async (cycleId, periodEndDate) => {
        const periodEnd = format(periodEndDate, 'yyyy-MM-dd')
        const { data, error } = await supabase
            .from('cycles')
            .update({
                period_end_date: periodEnd,
                period_length: null, // recalculated by trigger or here
                updated_at: new Date().toISOString(),
            })
            .eq('id', cycleId)
            .select()
            .single()
        return { data, error }
    },

    // ─── Build calendar day statuses ─────────────────────────────
    buildCalendar: (month) => {
        const { cycles, activePrediction } = get()
        const year = month.getFullYear()
        const m = month.getMonth()
        const daysInMonth = new Date(year, m + 1, 0).getDate()
        const days = []

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, m, d)
            const dateStr = format(date, 'yyyy-MM-dd')
            const status = getDayStatus(dateStr, cycles, activePrediction)
            days.push({ date, dateStr, ...status })
        }
        set({ calendarDays: days })
    },

    // ─── Local mean-cycle calculation (client preview) ─────────
    computeLocalPrediction: (cycles) => {
        if (!cycles || cycles.length === 0) return null

        const validCycles = cycles
            .filter(c => c.cycle_length != null && c.cycle_length > 0)
            .slice(0, 12) // last 12 cycles

        if (validCycles.length === 0) return null

        const avgCycle = validCycles.reduce((s, c) => s + c.cycle_length, 0) / validCycles.length
        const avgPeriod = cycles
            .filter(c => c.period_length != null)
            .slice(0, 12)
            .reduce((s, c, _, arr) => s + c.period_length / arr.length, 0) || 5

        // Std deviation
        const variance = validCycles.reduce((s, c) => s + Math.pow(c.cycle_length - avgCycle, 2), 0) / validCycles.length
        const stdDev = Math.sqrt(variance)
        const confidence = stdDev < 3 ? 'high' : stdDev < 7 ? 'medium' : 'low'

        const lastCycle = cycles[0]
        const lastStart = parseISO(lastCycle.period_start_date)
        const nextStart = addDays(lastStart, Math.round(avgCycle))
        const ovulation = addDays(nextStart, Math.round(avgCycle - 14))

        return {
            avgCycleDays: Math.round(avgCycle * 10) / 10,
            avgPeriodDays: Math.round(avgPeriod * 10) / 10,
            stdDev: Math.round(stdDev * 10) / 10,
            confidence,
            nextPeriodStart: nextStart,
            nextPeriodEnd: addDays(nextStart, Math.round(avgPeriod) - 1),
            ovulationDate: ovulation,
            fertileStart: addDays(ovulation, -5),
            fertileEnd: addDays(ovulation, 1),
            cyclesUsed: validCycles.length,
        }
    },
}))

// ─── Helper: determine day status ──────────────────────────────
function getDayStatus(dateStr, cycles, prediction) {
    const date = parseISO(dateStr)

    // Check if it's a period day (from actual cycles)
    for (const cycle of cycles) {
        const start = parseISO(cycle.period_start_date)
        const end = cycle.period_end_date
            ? parseISO(cycle.period_end_date)
            : addDays(start, 4) // default 5-day period

        if (date >= start && date <= end) {
            return { isPeriod: true, isActual: true }
        }
    }

    // Check predictions
    if (prediction) {
        const predStart = parseISO(prediction.predicted_period_start)
        const predEnd = prediction.predicted_period_end
            ? parseISO(prediction.predicted_period_end)
            : addDays(predStart, 4)
        const ovulation = prediction.predicted_ovulation_date
            ? parseISO(prediction.predicted_ovulation_date)
            : null
        const fertileStart = prediction.fertile_window_start
            ? parseISO(prediction.fertile_window_start)
            : null
        const fertileEnd = prediction.fertile_window_end
            ? parseISO(prediction.fertile_window_end)
            : null

        if (date >= predStart && date <= predEnd) {
            return { isPeriod: true, isPredicted: true }
        }
        if (ovulation && format(date, 'yyyy-MM-dd') === format(ovulation, 'yyyy-MM-dd')) {
            return { isOvulation: true }
        }
        if (fertileStart && fertileEnd && date >= fertileStart && date <= fertileEnd) {
            return { isFertile: true }
        }
    }

    return {}
}

export default useCycleStore