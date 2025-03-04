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
          created_at: string | null
          guests: number
          id: string
          payment_details: Json | null
          payment_method: string
          pets: number | null
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
          created_at?: string | null
          guests: number
          id?: string
          payment_details?: Json | null
          payment_method?: string
          pets?: number | null
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
          created_at?: string | null
          guests?: number
          id?: string
          payment_details?: Json | null
          payment_method?: string
          pets?: number | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
