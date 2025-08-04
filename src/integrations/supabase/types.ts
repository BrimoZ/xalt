export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bug_reports: {
        Row: {
          actual_behavior: string | null
          browser_info: string | null
          category: string
          created_at: string
          description: string
          expected_behavior: string | null
          id: string
          screenshot_url: string | null
          severity: string
          status: string
          steps_to_reproduce: string | null
          title: string
          updated_at: string
          url: string | null
          user_id: string | null
        }
        Insert: {
          actual_behavior?: string | null
          browser_info?: string | null
          category: string
          created_at?: string
          description: string
          expected_behavior?: string | null
          id?: string
          screenshot_url?: string | null
          severity?: string
          status?: string
          steps_to_reproduce?: string | null
          title: string
          updated_at?: string
          url?: string | null
          user_id?: string | null
        }
        Update: {
          actual_behavior?: string | null
          browser_info?: string | null
          category?: string
          created_at?: string
          description?: string
          expected_behavior?: string | null
          id?: string
          screenshot_url?: string | null
          severity?: string
          status?: string
          steps_to_reproduce?: string | null
          title?: string
          updated_at?: string
          url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      price_history: {
        Row: {
          created_at: string
          id: string
          market_cap: number
          price: number
          token_id: string
          volume: number
        }
        Insert: {
          created_at?: string
          id?: string
          market_cap?: number
          price: number
          token_id: string
          volume?: number
        }
        Update: {
          created_at?: string
          id?: string
          market_cap?: number
          price?: number
          token_id?: string
          volume?: number
        }
        Relationships: [
          {
            foreignKeyName: "price_history_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
          username: string | null
          x_account_id: string | null
          x_display_name: string | null
          x_username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
          username?: string | null
          x_account_id?: string | null
          x_display_name?: string | null
          x_username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          username?: string | null
          x_account_id?: string | null
          x_display_name?: string | null
          x_username?: string | null
        }
        Relationships: []
      }
      token_claims: {
        Row: {
          claimed: boolean
          claimed_at: string | null
          created_at: string
          expires_at: string
          id: string
          token_amount: number
          token_name: string
          token_value: number
          user_id: string
        }
        Insert: {
          claimed?: boolean
          claimed_at?: string | null
          created_at?: string
          expires_at: string
          id?: string
          token_amount: number
          token_name: string
          token_value: number
          user_id: string
        }
        Update: {
          claimed?: boolean
          claimed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          token_amount?: number
          token_name?: string
          token_value?: number
          user_id?: string
        }
        Relationships: []
      }
      token_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          token_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          token_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          token_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tokens: {
        Row: {
          bonding_curve_progress: number
          contributor_type: string
          created_at: string
          creator_id: string
          creator_username: string
          current_price: number
          description: string
          discord_url: string | null
          hardcap: number
          holders: number
          id: string
          image_url: string | null
          market_cap: number
          name: string
          price_change_24h: number
          progress: number
          raised: number
          symbol: string
          telegram_url: string | null
          total_contributions: number
          total_supply: number
          updated_at: string
          volume_24h: number
          website_url: string | null
          x_handle: string | null
        }
        Insert: {
          bonding_curve_progress?: number
          contributor_type: string
          created_at?: string
          creator_id: string
          creator_username: string
          current_price?: number
          description: string
          discord_url?: string | null
          hardcap: number
          holders?: number
          id?: string
          image_url?: string | null
          market_cap?: number
          name: string
          price_change_24h?: number
          progress?: number
          raised?: number
          symbol: string
          telegram_url?: string | null
          total_contributions?: number
          total_supply: number
          updated_at?: string
          volume_24h?: number
          website_url?: string | null
          x_handle?: string | null
        }
        Update: {
          bonding_curve_progress?: number
          contributor_type?: string
          created_at?: string
          creator_id?: string
          creator_username?: string
          current_price?: number
          description?: string
          discord_url?: string | null
          hardcap?: number
          holders?: number
          id?: string
          image_url?: string | null
          market_cap?: number
          name?: string
          price_change_24h?: number
          progress?: number
          raised?: number
          symbol?: string
          telegram_url?: string | null
          total_contributions?: number
          total_supply?: number
          updated_at?: string
          volume_24h?: number
          website_url?: string | null
          x_handle?: string | null
        }
        Relationships: []
      }
      trades: {
        Row: {
          created_at: string
          id: string
          price_per_token: number
          sol_amount: number
          token_amount: number
          token_id: string
          trade_type: string
          transaction_hash: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          price_per_token: number
          sol_amount: number
          token_amount: number
          token_id: string
          trade_type: string
          transaction_hash?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          price_per_token?: number
          sol_amount?: number
          token_amount?: number
          token_id?: string
          trade_type?: string
          transaction_hash?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      user_holdings: {
        Row: {
          average_price: number
          balance: number
          created_at: string
          id: string
          token_id: string
          total_invested: number
          updated_at: string
          user_id: string
        }
        Insert: {
          average_price?: number
          balance?: number
          created_at?: string
          id?: string
          token_id: string
          total_invested?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          average_price?: number
          balance?: number
          created_at?: string
          id?: string
          token_id?: string
          total_invested?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_holdings_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_sample_data_for_user: {
        Args: { user_uuid: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
