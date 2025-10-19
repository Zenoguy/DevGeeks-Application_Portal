export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          title: string
          company: string
          location: string
          type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract'
          salary: string | null
          description: string
          requirements: string[]
          posted_date: string
          featured: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          company: string
          location: string
          type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract'
          salary?: string | null
          description: string
          requirements?: string[]
          posted_date?: string
          featured?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          company?: string
          location?: string
          type?: 'Full-time' | 'Part-time' | 'Internship' | 'Contract'
          salary?: string | null
          description?: string
          requirements?: string[]
          posted_date?: string
          featured?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          job_id: string
          user_id: string
          status: 'pending' | 'reviewing' | 'accepted' | 'rejected'
          applied_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          job_id: string
          user_id: string
          status?: 'pending' | 'reviewing' | 'accepted' | 'rejected'
          applied_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          job_id?: string
          user_id?: string
          status?: 'pending' | 'reviewing' | 'accepted' | 'rejected'
          applied_at?: string
          notes?: string | null
        }
      }
    }
  }
}
