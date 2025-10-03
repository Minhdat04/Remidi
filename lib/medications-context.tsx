"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useAuth } from "./auth-context"

export interface Medication {
  id: string
  user_id: string
  name: string
  dosage?: string
  frequency: string
  time_of_day: string[]
  start_date: string
  end_date?: string
  reminder_method: string
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface MedicationsContextType {
  medications: Medication[]
  loading: boolean
  addMedication: (medication: Omit<Medication, "id" | "user_id" | "created_at" | "updated_at">) => Promise<void>
  updateMedication: (id: string, updates: Partial<Medication>) => Promise<void>
  deleteMedication: (id: string) => Promise<void>
  toggleMedicationActive: (id: string) => Promise<void>
  refreshMedications: () => Promise<void>
}

const MedicationsContext = createContext<MedicationsContextType | undefined>(undefined)

export function MedicationsProvider({ children }: { children: ReactNode }) {
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const fetchMedications = async () => {
    if (!user) {
      setMedications([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setMedications(data || [])
    } catch (error) {
      console.error("[v0] Error fetching medications:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedications()
  }, [user])

  const addMedication = async (medication: Omit<Medication, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) throw new Error("User not authenticated")

    const { data, error } = await supabase
      .from("medications")
      .insert([{ ...medication, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    setMedications((prev) => [data, ...prev])
  }

  const updateMedication = async (id: string, updates: Partial<Medication>) => {
    const { data, error } = await supabase.from("medications").update(updates).eq("id", id).select().single()

    if (error) throw error
    setMedications((prev) => prev.map((med) => (med.id === id ? data : med)))
  }

  const deleteMedication = async (id: string) => {
    const { error } = await supabase.from("medications").delete().eq("id", id)

    if (error) throw error
    setMedications((prev) => prev.filter((med) => med.id !== id))
  }

  const toggleMedicationActive = async (id: string) => {
    const medication = medications.find((med) => med.id === id)
    if (!medication) return

    await updateMedication(id, { is_active: !medication.is_active })
  }

  const refreshMedications = async () => {
    await fetchMedications()
  }

  return (
    <MedicationsContext.Provider
      value={{
        medications,
        loading,
        addMedication,
        updateMedication,
        deleteMedication,
        toggleMedicationActive,
        refreshMedications,
      }}
    >
      {children}
    </MedicationsContext.Provider>
  )
}

export function useMedications() {
  const context = useContext(MedicationsContext)
  if (context === undefined) {
    throw new Error("useMedications must be used within a MedicationsProvider")
  }
  return context
}
