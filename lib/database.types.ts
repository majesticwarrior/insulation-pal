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
      contractors: {
        Row: {
          id: string
          email: string
          password_hash: string
          business_name: string
          established_date: string | null
          county: string
          license_number: string | null
          bbb_accredited: boolean
          about: string | null
          phone: string | null
          exclusive_leads_interested: boolean
          lead_preference: 'email' | 'text' | 'both'
          credits: number
          status: 'pending' | 'approved' | 'suspended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          business_name: string
          established_date?: string | null
          county: string
          license_number?: string | null
          bbb_accredited?: boolean
          about?: string | null
          phone?: string | null
          exclusive_leads_interested?: boolean
          lead_preference?: 'email' | 'text' | 'both'
          credits?: number
          status?: 'pending' | 'approved' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          business_name?: string
          established_date?: string | null
          county?: string
          license_number?: string | null
          bbb_accredited?: boolean
          about?: string | null
          phone?: string | null
          exclusive_leads_interested?: boolean
          lead_preference?: 'email' | 'text' | 'both'
          credits?: number
          status?: 'pending' | 'approved' | 'suspended'
          created_at?: string
          updated_at?: string
        }
      }
      contractor_services: {
        Row: {
          id: string
          contractor_id: string
          service_type: 'attic' | 'basement' | 'wall' | 'crawl_space' | 'garage'
          created_at: string
        }
        Insert: {
          id?: string
          contractor_id: string
          service_type: 'attic' | 'basement' | 'wall' | 'crawl_space' | 'garage'
          created_at?: string
        }
        Update: {
          id?: string
          contractor_id?: string
          service_type?: 'attic' | 'basement' | 'wall' | 'crawl_space' | 'garage'
          created_at?: string
        }
      }
      contractor_insulation_types: {
        Row: {
          id: string
          contractor_id: string
          insulation_type: 'blown_in' | 'spray_foam' | 'roll_batt' | 'foam_board' | 'radiant_barrier'
          created_at: string
        }
        Insert: {
          id?: string
          contractor_id: string
          insulation_type: 'blown_in' | 'spray_foam' | 'roll_batt' | 'foam_board' | 'radiant_barrier'
          created_at?: string
        }
        Update: {
          id?: string
          contractor_id?: string
          insulation_type?: 'blown_in' | 'spray_foam' | 'roll_batt' | 'foam_board' | 'radiant_barrier'
          created_at?: string
        }
      }
      contractor_service_areas: {
        Row: {
          id: string
          contractor_id: string
          city: string
          created_at: string
        }
        Insert: {
          id?: string
          contractor_id: string
          city: string
          created_at?: string
        }
        Update: {
          id?: string
          contractor_id?: string
          city?: string
          created_at?: string
        }
      }
      contractor_images: {
        Row: {
          id: string
          contractor_id: string
          image_url: string
          watermarked_url: string | null
          caption: string | null
          created_at: string
        }
        Insert: {
          id?: string
          contractor_id: string
          image_url: string
          watermarked_url?: string | null
          caption?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          contractor_id?: string
          image_url?: string
          watermarked_url?: string | null
          caption?: string | null
          created_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          home_size_sqft: number
          areas_needed: string[] // JSON array of area types
          insulation_types: string[] // JSON array of insulation types
          quote_preference: 'random_three' | 'choose_three'
          additional_services: string[] | null
          ceiling_fan_count: number | null
          project_type: 'residential' | 'commercial'
          attic_insulation_depth: string | null
          customer_name: string | null
          customer_email: string | null
          customer_phone: string | null
          city: string
          state: string
          zip_code: string | null
          property_address: string | null
          status: 'pending' | 'assigned' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          home_size_sqft: number
          areas_needed: string[]
          insulation_types: string[]
          quote_preference: 'random_three' | 'choose_three'
          additional_services?: string[] | null
          ceiling_fan_count?: number | null
          project_type?: 'residential' | 'commercial'
          attic_insulation_depth?: string | null
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          city: string
          state: string
          zip_code?: string | null
          property_address?: string | null
          status?: 'pending' | 'assigned' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          home_size_sqft?: number
          areas_needed?: string[]
          insulation_types?: string[]
          quote_preference?: 'random_three' | 'choose_three'
          additional_services?: string[] | null
          ceiling_fan_count?: number | null
          project_type?: 'residential' | 'commercial'
          attic_insulation_depth?: string | null
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          city?: string
          state?: string
          zip_code?: string | null
          property_address?: string | null
          status?: 'pending' | 'assigned' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      lead_assignments: {
        Row: {
          id: string
          lead_id: string
          contractor_id: string
          cost: number
          status: 'sent' | 'viewed' | 'responded' | 'hired'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          contractor_id: string
          cost?: number
          status?: 'sent' | 'viewed' | 'responded' | 'hired'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          contractor_id?: string
          cost?: number
          status?: 'sent' | 'viewed' | 'responded' | 'hired'
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          contractor_id: string
          lead_id: string | null
          lead_assignment_id: string | null
          customer_id: string | null
          customer_name: string
          customer_email: string | null
          customer_city: string | null
          customer_state: string | null
          rating: number
          title: string | null
          comment: string | null
          service_type: string | null
          project_cost: number | null
          project_duration_days: number | null
          location: string | null
          verified: boolean
          helpful_votes: number
          quality_rating: number | null
          timeliness_rating: number | null
          communication_rating: number | null
          value_rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contractor_id: string
          lead_id?: string | null
          lead_assignment_id?: string | null
          customer_id?: string | null
          customer_name: string
          customer_email?: string | null
          customer_city?: string | null
          customer_state?: string | null
          rating: number
          title?: string | null
          comment?: string | null
          service_type?: string | null
          project_cost?: number | null
          project_duration_days?: number | null
          location?: string | null
          verified?: boolean
          helpful_votes?: number
          quality_rating?: number | null
          timeliness_rating?: number | null
          communication_rating?: number | null
          value_rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contractor_id?: string
          lead_id?: string | null
          lead_assignment_id?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_email?: string | null
          customer_city?: string | null
          customer_state?: string | null
          rating?: number
          title?: string | null
          comment?: string | null
          service_type?: string | null
          project_cost?: number | null
          project_duration_days?: number | null
          location?: string | null
          verified?: boolean
          helpful_votes?: number
          quality_rating?: number | null
          timeliness_rating?: number | null
          communication_rating?: number | null
          value_rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          contractor_id: string
          amount: number
          credits_purchased: number
          payment_method: 'stripe' | 'paypal' | 'venmo' | 'square'
          payment_intent_id: string | null
          status: 'pending' | 'completed' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          contractor_id: string
          amount: number
          credits_purchased: number
          payment_method: 'stripe' | 'paypal' | 'venmo' | 'square'
          payment_intent_id?: string | null
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
        }
        Update: {
          id?: string
          contractor_id?: string
          amount?: number
          credits_purchased?: number
          payment_method?: 'stripe' | 'paypal' | 'venmo' | 'square'
          payment_intent_id?: string | null
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
