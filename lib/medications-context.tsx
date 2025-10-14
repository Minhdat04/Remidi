"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
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
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const addMedication = async (medication: Omit<Medication, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) throw new Error("User not authenticated")

    const newMedication: Medication = {
      ...medication,
      id: `med-${Date.now()}`,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setMedications((prev) => [newMedication, ...prev])
  }

  const updateMedication = async (id: string, updates: Partial<Medication>) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === id
          ? {
              ...med,
              ...updates,
              updated_at: new Date().toISOString(),
            }
          : med,
      ),
    )
  }

  const deleteMedication = async (id: string) => {
    setMedications((prev) => prev.filter((med) => med.id !== id))
  }

  const toggleMedicationActive = async (id: string) => {
    const medication = medications.find((med) => med.id === id)
    if (!medication) return

    await updateMedication(id, { is_active: !medication.is_active })
  }

  const refreshMedications = async () => {
    // No-op for local state
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
