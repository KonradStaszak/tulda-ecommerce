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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string
          woocommerce_id: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
          woocommerce_id?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
          woocommerce_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      order_addresses: {
        Row: {
          address_line_1: string
          address_line_2: string | null
          address_type: string
          city: string
          company: string | null
          country: string
          created_at: string
          first_name: string
          id: string
          last_name: string
          order_id: string
          postcode: string
          region: string | null
        }
        Insert: {
          address_line_1: string
          address_line_2?: string | null
          address_type: string
          city: string
          company?: string | null
          country: string
          created_at?: string
          first_name: string
          id?: string
          last_name: string
          order_id: string
          postcode: string
          region?: string | null
        }
        Update: {
          address_line_1?: string
          address_line_2?: string | null
          address_type?: string
          city?: string
          company?: string | null
          country?: string
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          order_id?: string
          postcode?: string
          region?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_addresses_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          currency: string
          id: string
          image_path: string | null
          line_total_minor: number
          order_id: string
          product_code: string | null
          product_id: string | null
          product_name: string
          product_slug: string | null
          quantity: number
          sku: string | null
          unit_price_minor: number
          variant_id: string | null
          variant_label: string
        }
        Insert: {
          created_at?: string
          currency: string
          id?: string
          image_path?: string | null
          line_total_minor: number
          order_id: string
          product_code?: string | null
          product_id?: string | null
          product_name: string
          product_slug?: string | null
          quantity: number
          sku?: string | null
          unit_price_minor: number
          variant_id?: string | null
          variant_label: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          image_path?: string | null
          line_total_minor?: number
          order_id?: string
          product_code?: string | null
          product_id?: string | null
          product_name?: string
          product_slug?: string | null
          quantity?: number
          sku?: string | null
          unit_price_minor?: number
          variant_id?: string | null
          variant_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          email: string
          fulfillment_status: string
          id: string
          idempotency_hash: string
          idempotency_key: string
          notes: string | null
          order_number: number
          order_status: string
          payment_status: string
          phone: string
          shipping_minor: number | null
          subtotal_minor: number
          tax_minor: number | null
          total_minor: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          email: string
          fulfillment_status?: string
          id?: string
          idempotency_hash: string
          idempotency_key: string
          notes?: string | null
          order_number?: never
          order_status?: string
          payment_status?: string
          phone: string
          shipping_minor?: number | null
          subtotal_minor: number
          tax_minor?: number | null
          total_minor?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          email?: string
          fulfillment_status?: string
          id?: string
          idempotency_hash?: string
          idempotency_key?: string
          notes?: string | null
          order_number?: never
          order_status?: string
          payment_status?: string
          phone?: string
          shipping_minor?: number | null
          subtotal_minor?: number
          tax_minor?: number | null
          total_minor?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          category_id: string
          product_id: string
        }
        Insert: {
          category_id: string
          product_id: string
        }
        Update: {
          category_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          is_primary: boolean
          product_id: string
          sort_order: number
          storage_path: string
          variant_id: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          product_id: string
          sort_order?: number
          storage_path: string
          variant_id?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          product_id?: string
          sort_order?: number
          storage_path?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_variant_product_fk"
            columns: ["variant_id", "product_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id", "product_id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string
          currency: string
          id: string
          is_active: boolean
          is_in_stock: boolean
          label: string
          price_minor: number
          product_id: string
          sku: string | null
          sort_order: number
          stock_quantity: number | null
          updated_at: string
          woocommerce_id: number | null
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          is_in_stock?: boolean
          label: string
          price_minor: number
          product_id: string
          sku?: string | null
          sort_order?: number
          stock_quantity?: number | null
          updated_at?: string
          woocommerce_id?: number | null
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          is_in_stock?: boolean
          label?: string
          price_minor?: number
          product_id?: string
          sku?: string | null
          sort_order?: number
          stock_quantity?: number | null
          updated_at?: string
          woocommerce_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string
          code: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          name: string
          short_description: string | null
          slug: string
          updated_at: string
          woocommerce_id: number | null
        }
        Insert: {
          brand?: string
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          name: string
          short_description?: string | null
          slug: string
          updated_at?: string
          woocommerce_id?: number | null
        }
        Update: {
          brand?: string
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          name?: string
          short_description?: string | null
          slug?: string
          updated_at?: string
          woocommerce_id?: number | null
        }
        Relationships: []
      }
      technical_documents: {
        Row: {
          created_at: string
          document_type: string
          external_url: string | null
          id: string
          product_id: string | null
          published_at: string | null
          storage_path: string | null
          title: string
          version: string | null
        }
        Insert: {
          created_at?: string
          document_type: string
          external_url?: string | null
          id?: string
          product_id?: string | null
          published_at?: string | null
          storage_path?: string | null
          title: string
          version?: string | null
        }
        Update: {
          created_at?: string
          document_type?: string
          external_url?: string | null
          id?: string
          product_id?: string | null
          published_at?: string | null
          storage_path?: string | null
          title?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technical_documents_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_order_draft: {
        Args: { p_payload: Json }
        Returns: {
          currency: string
          order_id: string
          order_number: number
          order_status: string
          payment_status: string
          reused_existing_order: boolean
          subtotal_minor: number
        }[]
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
