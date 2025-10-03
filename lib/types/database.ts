export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  date_of_birth: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  user_id: string
  title: string
  description: string | null
  target_value: number | null
  current_value: number
  unit: string | null
  start_date: string
  end_date: string
  status: "active" | "completed" | "cancelled"
  created_at: string
  updated_at: string
}

export interface Medication {
  id: string
  user_id: string
  name: string
  dosage: string
  frequency: string
  time_slots: string[]
  start_date: string
  end_date: string | null
  notes: string | null
  status: "active" | "completed" | "paused"
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  due_date: string
  due_time: string | null
  priority: "low" | "medium" | "high"
  status: "pending" | "completed" | "cancelled"
  category: string | null
  created_at: string
  updated_at: string
}

export interface MedicationLog {
  id: string
  user_id: string
  medication_id: string
  taken_at: string
  scheduled_time: string
  status: "taken" | "missed" | "skipped"
  notes: string | null
  created_at: string
}

export interface GoalProgress {
  id: string
  user_id: string
  goal_id: string
  value: number
  recorded_at: string
  notes: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "medication" | "task" | "goal" | "system"
  reference_id: string | null
  is_read: boolean
  created_at: string
}
