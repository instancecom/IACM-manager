export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      banners: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          link_url: string | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          link_url?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          link_url?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      consent_logs: {
        Row: {
          consent_given: boolean
          consent_type: string
          created_at: string | null
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          consent_given: boolean
          consent_type: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          consent_given?: boolean
          consent_type?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      event_confirmations: {
        Row: {
          confirmed: boolean | null
          confirmed_at: string | null
          created_at: string | null
          event_id: string
          guests: string[] | null
          id: string
          member_id: string | null
          paid: boolean | null
          participant_name: string | null
          responsible_name: string | null
          total_amount: number | null
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          confirmed?: boolean | null
          confirmed_at?: string | null
          created_at?: string | null
          event_id: string
          guests?: string[] | null
          id?: string
          member_id?: string | null
          paid?: boolean | null
          participant_name?: string | null
          responsible_name?: string | null
          total_amount?: number | null
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          confirmed?: boolean | null
          confirmed_at?: string | null
          created_at?: string | null
          event_id?: string
          guests?: string[] | null
          id?: string
          member_id?: string | null
          paid?: boolean | null
          participant_name?: string | null
          responsible_name?: string | null
          total_amount?: number | null
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_confirmations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_confirmations_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      event_payments: {
        Row: {
          amount: number
          confirmation_id: string
          created_at: string | null
          created_by: string | null
          id: string
          payment_date: string
          payment_type: string
        }
        Insert: {
          amount: number
          confirmation_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          payment_date: string
          payment_type: string
        }
        Update: {
          amount?: number
          confirmation_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          payment_date?: string
          payment_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_payments_confirmation_id_fkey"
            columns: ["confirmation_id"]
            isOneToOne: false
            referencedRelation: "event_confirmations"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: string
          allow_guests: boolean
          banner_url: string | null
          created_at: string | null
          created_by: string | null
          description: string
          end_date: string
          end_time: string
          id: string
          start_date: string
          start_time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          address: string
          allow_guests?: boolean
          banner_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description: string
          end_date: string
          end_time: string
          id?: string
          start_date: string
          start_time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          allow_guests?: boolean
          banner_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          end_date?: string
          end_time?: string
          id?: string
          start_date?: string
          start_time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      members: {
        Row: {
          birth_date: string
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          photo_url: string | null
          updated_at: string | null
          user_id: string | null
          whatsapp: string
        }
        Insert: {
          birth_date: string
          created_at?: string | null
          first_name: string
          id?: string
          last_name: string
          photo_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp: string
        }
        Update: {
          birth_date?: string
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          photo_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      ministries: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ministry_members: {
        Row: {
          id: string
          joined_at: string | null
          member_id: string
          ministry_id: string
          role: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          member_id: string
          ministry_id: string
          role?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          member_id?: string
          ministry_id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ministry_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ministry_members_ministry_id_fkey"
            columns: ["ministry_id"]
            isOneToOne: false
            referencedRelation: "ministries"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          created_at: string | null
          data_processing_consent: boolean | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          privacy_consent_given_at: string | null
          terms_accepted_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string | null
          data_processing_consent?: boolean | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          privacy_consent_given_at?: string | null
          terms_accepted_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string | null
          data_processing_consent?: boolean | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          privacy_consent_given_at?: string | null
          terms_accepted_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      schedules: {
        Row: {
          created_at: string | null
          created_by: string | null
          date: string
          event_id: string | null
          external_person_name: string | null
          external_person_phone: string | null
          id: string
          member_id: string | null
          notes: string | null
          schedule_type: Database["public"]["Enums"]["schedule_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date: string
          event_id?: string | null
          external_person_name?: string | null
          external_person_phone?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          schedule_type: Database["public"]["Enums"]["schedule_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date?: string
          event_id?: string | null
          external_person_name?: string | null
          external_person_phone?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          schedule_type?: Database["public"]["Enums"]["schedule_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedules_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit: { Args: { _user_id: string }; Returns: boolean }
      get_email_by_phone: { Args: { phone_number: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor" | "reader" | "user"
      schedule_type: "louvor" | "marketing" | "recepcao" | "obreiros"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "reader", "user"],
      schedule_type: ["louvor", "marketing", "recepcao", "obreiros"],
    },
  },
} as const
