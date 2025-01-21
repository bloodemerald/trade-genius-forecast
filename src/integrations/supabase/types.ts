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
      features: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          project_id: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          project_id?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          project_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "features_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_code: {
        Row: {
          backend_path: string | null
          frontend_path: string | null
          generated_at: string | null
          id: string
          project_id: string | null
          user_id: string | null
        }
        Insert: {
          backend_path?: string | null
          frontend_path?: string | null
          generated_at?: string | null
          id?: string
          project_id?: string | null
          user_id?: string | null
        }
        Update: {
          backend_path?: string | null
          frontend_path?: string | null
          generated_at?: string | null
          id?: string
          project_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_code_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          created_at: string | null
          date: string | null
          id: string
          project_id: string | null
          summary: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          project_id?: string | null
          summary?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          project_id?: string | null
          summary?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      panel_dependencies: {
        Row: {
          depends_on_panel_id: string | null
          id: string
          panel_id: string | null
        }
        Insert: {
          depends_on_panel_id?: string | null
          id?: string
          panel_id?: string | null
        }
        Update: {
          depends_on_panel_id?: string | null
          id?: string
          panel_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "panel_dependencies_depends_on_panel_id_fkey"
            columns: ["depends_on_panel_id"]
            isOneToOne: false
            referencedRelation: "panels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "panel_dependencies_panel_id_fkey"
            columns: ["panel_id"]
            isOneToOne: false
            referencedRelation: "panels"
            referencedColumns: ["id"]
          },
        ]
      }
      panels: {
        Row: {
          created_at: string | null
          description: string | null
          height: number | null
          id: string
          milestone_id: string | null
          position_x: number | null
          position_y: number | null
          roadmap_id: string | null
          title: string
          width: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          height?: number | null
          id?: string
          milestone_id?: string | null
          position_x?: number | null
          position_y?: number | null
          roadmap_id?: string | null
          title: string
          width?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          height?: number | null
          id?: string
          milestone_id?: string | null
          position_x?: number | null
          position_y?: number | null
          roadmap_id?: string | null
          title?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "panels_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "panels_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      roadmaps: {
        Row: {
          created_at: string | null
          id: string
          project_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roadmaps_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
