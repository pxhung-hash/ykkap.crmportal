// Database Types for YKK AP CRM Portal
// Auto-generated from Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'Admin' | 'Sales' | 'Dealer' | 'Viewer'
export type UserStatus = 'active' | 'inactive' | 'suspended'
export type DealerStatus = 'active' | 'inactive' | 'pending' | 'suspended'
export type PriceListStatus = 'draft' | 'active' | 'archived'
export type BOMProductType = 'Window' | 'Door' | 'Curtain Wall' | 'Other'
export type BOMStatus = 'draft' | 'active' | 'archived'
export type BOMItemType = 'frame' | 'glass' | 'hardware' | 'accessory' | 'other'
export type QuotationStatus = 'draft' | 'pending' | 'sent' | 'approved' | 'rejected' | 'expired' | 'converted'
export type QuotationItemType = 'material' | 'bom' | 'custom'
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'manufacturing' | 'ready_to_ship' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'on_hold'
export type OrderPriority = 'low' | 'normal' | 'high' | 'urgent'
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded'
export type ProductionStatus = 'pending' | 'in_production' | 'completed' | 'on_hold'
export type TransactionType = 'purchase' | 'sale' | 'adjustment' | 'return' | 'transfer' | 'production' | 'scrap'
export type LocationType = 'warehouse' | 'showroom' | 'production' | 'other'
export type DocumentCategory = 'quotation' | 'order' | 'invoice' | 'contract' | 'technical' | 'certificate' | 'other'
export type DocumentVisibility = 'public' | 'internal' | 'dealer' | 'private'
export type MessageType = 'general' | 'quotation' | 'order' | 'support' | 'notification'
export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent'
export type MessageStatus = 'unread' | 'read' | 'archived'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          role: UserRole
          company_name: string | null
          status: UserStatus
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone?: string | null
          role: UserRole
          company_name?: string | null
          status?: UserStatus
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          role?: UserRole
          company_name?: string | null
          status?: UserStatus
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      dealers: {
        Row: {
          id: string
          user_id: string | null
          dealer_code: string
          company_name: string
          business_registration: string | null
          tax_code: string | null
          address: string | null
          city: string | null
          district: string | null
          ward: string | null
          postal_code: string | null
          contact_person: string
          contact_email: string
          contact_phone: string
          secondary_contact: string | null
          secondary_email: string | null
          secondary_phone: string | null
          bank_name: string | null
          bank_account: string | null
          bank_branch: string | null
          payment_terms: string
          credit_limit: number
          discount_rate: number
          status: DealerStatus
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['dealers']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['dealers']['Insert']>
      }
      product_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          parent_id: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['product_categories']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['product_categories']['Insert']>
      }
      materials: {
        Row: {
          id: string
          material_code: string
          name: string
          name_en: string | null
          category_id: string | null
          description: string | null
          specifications: Json | null
          unit: string
          base_price: number
          cost_price: number
          stock_quantity: number
          min_stock_level: number
          max_stock_level: number | null
          reorder_point: number | null
          supplier: string | null
          supplier_code: string | null
          lead_time_days: number | null
          weight_kg: number | null
          dimensions: Json | null
          color: string | null
          finish: string | null
          material_type: string | null
          image_url: string | null
          technical_drawings: Json | null
          certifications: Json | null
          is_active: boolean
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['materials']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['materials']['Insert']>
      }
      price_lists: {
        Row: {
          id: string
          name: string
          version: string
          effective_date: string
          expiry_date: string | null
          status: PriceListStatus
          currency: string
          description: string | null
          created_by: string | null
          approved_by: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['price_lists']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['price_lists']['Insert']>
      }
      price_list_items: {
        Row: {
          id: string
          price_list_id: string
          material_id: string
          base_price: number
          dealer_price: number
          min_quantity: number
          discount_percentage: number
          special_price: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['price_list_items']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['price_list_items']['Insert']>
      }
      bom_templates: {
        Row: {
          id: string
          template_code: string
          name: string
          description: string | null
          product_type: BOMProductType
          category: string | null
          base_width: number | null
          base_height: number | null
          version: string
          status: BOMStatus
          is_module: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['bom_templates']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['bom_templates']['Insert']>
      }
      bom_items: {
        Row: {
          id: string
          bom_template_id: string
          material_id: string
          item_type: BOMItemType | null
          quantity: number
          quantity_formula: string | null
          unit: string
          position: string | null
          is_optional: boolean
          is_variable: boolean
          notes: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['bom_items']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['bom_items']['Insert']>
      }
      quotations: {
        Row: {
          id: string
          quotation_number: string
          dealer_id: string | null
          created_by: string | null
          customer_name: string | null
          customer_email: string | null
          customer_phone: string | null
          project_name: string
          project_address: string | null
          project_type: string | null
          status: QuotationStatus
          valid_until: string | null
          subtotal: number
          discount_amount: number
          discount_percentage: number
          tax_amount: number
          tax_percentage: number
          shipping_cost: number
          total_amount: number
          currency: string
          payment_terms: string | null
          delivery_terms: string | null
          notes: string | null
          internal_notes: string | null
          terms_conditions: string | null
          approved_by: string | null
          approved_at: string | null
          sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['quotations']['Row'], 'id' | 'quotation_number' | 'created_at' | 'updated_at'> & {
          id?: string
          quotation_number?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['quotations']['Insert']>
      }
      quotation_items: {
        Row: {
          id: string
          quotation_id: string
          item_type: QuotationItemType | null
          material_id: string | null
          bom_template_id: string | null
          description: string
          specifications: Json | null
          quantity: number
          unit: string
          unit_price: number
          discount_percentage: number
          discount_amount: number
          subtotal: number
          tax_amount: number
          total_amount: number
          width: number | null
          height: number | null
          notes: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['quotation_items']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['quotation_items']['Insert']>
      }
      orders: {
        Row: {
          id: string
          order_number: string
          quotation_id: string | null
          dealer_id: string | null
          created_by: string | null
          customer_name: string
          customer_email: string | null
          customer_phone: string | null
          project_name: string
          project_address: string | null
          status: OrderStatus
          priority: OrderPriority
          order_date: string
          requested_delivery_date: string | null
          expected_delivery_date: string | null
          actual_delivery_date: string | null
          subtotal: number
          discount_amount: number
          tax_amount: number
          shipping_cost: number
          total_amount: number
          paid_amount: number
          currency: string
          payment_method: string | null
          payment_status: PaymentStatus
          shipping_address: string | null
          shipping_method: string | null
          tracking_number: string | null
          notes: string | null
          internal_notes: string | null
          cancelled_reason: string | null
          cancelled_by: string | null
          cancelled_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'order_number' | 'created_at' | 'updated_at'> & {
          id?: string
          order_number?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          quotation_item_id: string | null
          material_id: string | null
          bom_template_id: string | null
          description: string
          specifications: Json | null
          quantity: number
          unit: string
          unit_price: number
          discount_amount: number
          tax_amount: number
          total_amount: number
          quantity_shipped: number
          quantity_delivered: number
          production_status: ProductionStatus
          notes: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }
      inventory_transactions: {
        Row: {
          id: string
          material_id: string
          transaction_type: TransactionType
          reference_type: string | null
          reference_id: string | null
          quantity: number
          unit_cost: number | null
          total_cost: number | null
          stock_before: number
          stock_after: number
          location: string | null
          batch_number: string | null
          notes: string | null
          created_by: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['inventory_transactions']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['inventory_transactions']['Insert']>
      }
      stock_locations: {
        Row: {
          id: string
          location_code: string
          name: string
          address: string | null
          type: LocationType | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['stock_locations']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['stock_locations']['Insert']>
      }
      stock_by_location: {
        Row: {
          id: string
          material_id: string
          location_id: string
          quantity: number
          reserved_quantity: number
          available_quantity: number
          last_counted_at: string | null
          last_counted_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['stock_by_location']['Row'], 'id' | 'available_quantity' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['stock_by_location']['Insert']>
      }
      documents: {
        Row: {
          id: string
          title: string
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          category: DocumentCategory | null
          reference_type: string | null
          reference_id: string | null
          visibility: DocumentVisibility
          uploaded_by: string | null
          is_active: boolean
          tags: string[] | null
          version: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['documents']['Insert']>
      }
      messages: {
        Row: {
          id: string
          sender_id: string | null
          recipient_id: string | null
          subject: string
          message: string
          message_type: MessageType
          reference_type: string | null
          reference_id: string | null
          priority: MessagePriority
          status: MessageStatus
          is_internal: boolean
          attachments: Json | null
          read_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
      activity_log: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          changes: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['activity_log']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['activity_log']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: Record<string, never>
        Returns: string
      }
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      is_dealer: {
        Args: Record<string, never>
        Returns: boolean
      }
      is_sales: {
        Args: Record<string, never>
        Returns: boolean
      }
      get_user_dealer_id: {
        Args: Record<string, never>
        Returns: string
      }
    }
    Enums: {
      user_role: UserRole
      user_status: UserStatus
      dealer_status: DealerStatus
    }
  }
}
