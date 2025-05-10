export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      domos: {
        Row: {
          caracteristicas: string[]
          created_at: string
          descripcion: string
          id: string
          imagen_url: string
          nombre: string
          precio: number
        }
        Insert: {
          caracteristicas: string[]
          created_at?: string
          descripcion: string
          id?: string
          imagen_url: string
          nombre: string
          precio: number
        }
        Update: {
          caracteristicas?: string[]
          created_at?: string
          descripcion?: string
          id?: string
          imagen_url?: string
          nombre?: string
          precio?: number
        }
        Relationships: []
      }
      glamping_units: {
        Row: {
          available_activities: Json[] | null
          available_services: Json[] | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          max_guests: number
          max_pets: number
          name: string
          pet_price: number
          prices: Json
        }
        Insert: {
          available_activities?: Json[] | null
          available_services?: Json[] | null
          created_at?: string | null
          description?: string | null
          id: string
          image_url?: string | null
          max_guests?: number
          max_pets?: number
          name: string
          pet_price?: number
          prices: Json
        }
        Update: {
          available_activities?: Json[] | null
          available_services?: Json[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          max_guests?: number
          max_pets?: number
          name?: string
          pet_price?: number
          prices?: Json
        }
        Relationships: []
      }
      reservation_clients: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          phone: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservation_clients_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      reservation_communications: {
        Row: {
          created_at: string | null
          email: string
          id: string
          phone: string
          reservation_details: Json | null
          sent_at: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          phone: string
          reservation_details?: Json | null
          sent_at?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          phone?: string
          reservation_details?: Json | null
          sent_at?: string | null
          type?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          activities: string[] | null
          check_in: string
          check_out: string
          client_email: string | null
          client_name: string | null
          client_phone: string | null
          created_at: string | null
          guests: number
          id: string
          payment_details: Json | null
          payment_method: string
          pets: number | null
          reservation_code: string | null
          selected_activities: string[] | null
          selected_packages: string[] | null
          services: string[] | null
          status: string
          total_price: number
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          activities?: string[] | null
          check_in: string
          check_out: string
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          created_at?: string | null
          guests: number
          id?: string
          payment_details?: Json | null
          payment_method?: string
          pets?: number | null
          reservation_code?: string | null
          selected_activities?: string[] | null
          selected_packages?: string[] | null
          services?: string[] | null
          status?: string
          total_price: number
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          activities?: string[] | null
          check_in?: string
          check_out?: string
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          created_at?: string | null
          guests?: number
          id?: string
          payment_details?: Json | null
          payment_method?: string
          pets?: number | null
          reservation_code?: string | null
          selected_activities?: string[] | null
          selected_packages?: string[] | null
          services?: string[] | null
          status?: string
          total_price?: number
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "glamping_units"
            referencedColumns: ["id"]
          },
        ]
      }
      themed_packages: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
