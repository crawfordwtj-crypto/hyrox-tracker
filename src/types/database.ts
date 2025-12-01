export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          created_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          name: string
          comp_amount: number
          unit: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          comp_amount: number
          unit: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          comp_amount?: number
          unit?: string
          created_at?: string
        }
      }
      training_logs: {
        Row: {
          id: string
          user_id: string
          exercise_id: string
          amount: number
          weight: number | null
          logged_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exercise_id: string
          amount: number
          weight?: number | null
          logged_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          exercise_id?: string
          amount?: number
          weight?: number | null
          logged_at?: string
          created_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}
