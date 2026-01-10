-- YKK AP CRM Portal Database Schema
-- Migration: 001_initial_schema
-- Description: Creates all core tables for the CRM system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS & AUTHENTICATION
-- =============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'Sales', 'Dealer', 'Viewer')),
  company_name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- DEALERS
-- =============================================

CREATE TABLE public.dealers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  dealer_code TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  business_registration TEXT,
  tax_code TEXT,
  address TEXT,
  city TEXT,
  district TEXT,
  ward TEXT,
  postal_code TEXT,
  contact_person TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  secondary_contact TEXT,
  secondary_email TEXT,
  secondary_phone TEXT,
  bank_name TEXT,
  bank_account TEXT,
  bank_branch TEXT,
  payment_terms TEXT DEFAULT 'NET30',
  credit_limit DECIMAL(15, 2) DEFAULT 0,
  discount_rate DECIMAL(5, 2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'suspended')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PRODUCTS & MATERIALS
-- =============================================

CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_en TEXT,
  category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
  description TEXT,
  specifications JSONB,
  unit TEXT NOT NULL DEFAULT 'pcs',
  base_price DECIMAL(15, 2) DEFAULT 0,
  cost_price DECIMAL(15, 2) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 0,
  max_stock_level INTEGER,
  reorder_point INTEGER,
  supplier TEXT,
  supplier_code TEXT,
  lead_time_days INTEGER,
  weight_kg DECIMAL(10, 3),
  dimensions JSONB, -- {length, width, height}
  color TEXT,
  finish TEXT,
  material_type TEXT,
  image_url TEXT,
  technical_drawings JSONB, -- Array of URLs
  certifications JSONB, -- Array of certification info
  is_active BOOLEAN DEFAULT TRUE,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PRICING
-- =============================================

CREATE TABLE public.price_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  effective_date DATE NOT NULL,
  expiry_date DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  currency TEXT DEFAULT 'VND',
  description TEXT,
  created_by UUID REFERENCES public.users(id),
  approved_by UUID REFERENCES public.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, version)
);

CREATE TABLE public.price_list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  price_list_id UUID REFERENCES public.price_lists(id) ON DELETE CASCADE,
  material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
  base_price DECIMAL(15, 2) NOT NULL,
  dealer_price DECIMAL(15, 2) NOT NULL,
  min_quantity INTEGER DEFAULT 1,
  discount_percentage DECIMAL(5, 2) DEFAULT 0,
  special_price DECIMAL(15, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(price_list_id, material_id)
);

-- =============================================
-- BOM (BILL OF MATERIALS)
-- =============================================

CREATE TABLE public.bom_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  product_type TEXT NOT NULL CHECK (product_type IN ('Window', 'Door', 'Curtain Wall', 'Other')),
  category TEXT,
  base_width DECIMAL(10, 2),
  base_height DECIMAL(10, 2),
  version TEXT DEFAULT '1.0',
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
  is_module BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.bom_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bom_template_id UUID REFERENCES public.bom_templates(id) ON DELETE CASCADE,
  material_id UUID REFERENCES public.materials(id) ON DELETE RESTRICT,
  item_type TEXT CHECK (item_type IN ('frame', 'glass', 'hardware', 'accessory', 'other')),
  quantity DECIMAL(10, 3) NOT NULL DEFAULT 1,
  quantity_formula TEXT, -- Formula for dynamic calculation
  unit TEXT NOT NULL,
  position TEXT, -- left, right, top, bottom, etc.
  is_optional BOOLEAN DEFAULT FALSE,
  is_variable BOOLEAN DEFAULT FALSE, -- Can quantity vary based on dimensions
  notes TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Module BOM (for reusable components)
CREATE TABLE public.module_bom (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_bom_id UUID REFERENCES public.bom_templates(id) ON DELETE CASCADE,
  child_bom_id UUID REFERENCES public.bom_templates(id) ON DELETE CASCADE,
  quantity DECIMAL(10, 3) DEFAULT 1,
  position TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent_bom_id, child_bom_id, position)
);

-- =============================================
-- QUOTATIONS
-- =============================================

CREATE TABLE public.quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_number TEXT UNIQUE NOT NULL,
  dealer_id UUID REFERENCES public.dealers(id) ON DELETE RESTRICT,
  created_by UUID REFERENCES public.users(id),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  project_name TEXT NOT NULL,
  project_address TEXT,
  project_type TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'sent', 'approved', 'rejected', 'expired', 'converted')),
  valid_until DATE,
  subtotal DECIMAL(15, 2) DEFAULT 0,
  discount_amount DECIMAL(15, 2) DEFAULT 0,
  discount_percentage DECIMAL(5, 2) DEFAULT 0,
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  tax_percentage DECIMAL(5, 2) DEFAULT 10,
  shipping_cost DECIMAL(15, 2) DEFAULT 0,
  total_amount DECIMAL(15, 2) DEFAULT 0,
  currency TEXT DEFAULT 'VND',
  payment_terms TEXT,
  delivery_terms TEXT,
  notes TEXT,
  internal_notes TEXT,
  terms_conditions TEXT,
  approved_by UUID REFERENCES public.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.quotation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE CASCADE,
  item_type TEXT CHECK (item_type IN ('material', 'bom', 'custom')),
  material_id UUID REFERENCES public.materials(id) ON DELETE SET NULL,
  bom_template_id UUID REFERENCES public.bom_templates(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  specifications JSONB,
  quantity DECIMAL(10, 3) NOT NULL,
  unit TEXT NOT NULL,
  unit_price DECIMAL(15, 2) NOT NULL,
  discount_percentage DECIMAL(5, 2) DEFAULT 0,
  discount_amount DECIMAL(15, 2) DEFAULT 0,
  subtotal DECIMAL(15, 2) NOT NULL,
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  total_amount DECIMAL(15, 2) NOT NULL,
  width DECIMAL(10, 2),
  height DECIMAL(10, 2),
  notes TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ORDERS
-- =============================================

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE SET NULL,
  dealer_id UUID REFERENCES public.dealers(id) ON DELETE RESTRICT,
  created_by UUID REFERENCES public.users(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  project_name TEXT NOT NULL,
  project_address TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'manufacturing', 'ready_to_ship', 'shipped', 'delivered', 'completed', 'cancelled', 'on_hold')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  requested_delivery_date DATE,
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  subtotal DECIMAL(15, 2) DEFAULT 0,
  discount_amount DECIMAL(15, 2) DEFAULT 0,
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  shipping_cost DECIMAL(15, 2) DEFAULT 0,
  total_amount DECIMAL(15, 2) DEFAULT 0,
  paid_amount DECIMAL(15, 2) DEFAULT 0,
  currency TEXT DEFAULT 'VND',
  payment_method TEXT,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'refunded')),
  shipping_address TEXT,
  shipping_method TEXT,
  tracking_number TEXT,
  notes TEXT,
  internal_notes TEXT,
  cancelled_reason TEXT,
  cancelled_by UUID REFERENCES public.users(id),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  quotation_item_id UUID REFERENCES public.quotation_items(id) ON DELETE SET NULL,
  material_id UUID REFERENCES public.materials(id) ON DELETE SET NULL,
  bom_template_id UUID REFERENCES public.bom_templates(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  specifications JSONB,
  quantity DECIMAL(10, 3) NOT NULL,
  unit TEXT NOT NULL,
  unit_price DECIMAL(15, 2) NOT NULL,
  discount_amount DECIMAL(15, 2) DEFAULT 0,
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  total_amount DECIMAL(15, 2) NOT NULL,
  quantity_shipped DECIMAL(10, 3) DEFAULT 0,
  quantity_delivered DECIMAL(10, 3) DEFAULT 0,
  production_status TEXT DEFAULT 'pending' CHECK (production_status IN ('pending', 'in_production', 'completed', 'on_hold')),
  notes TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INVENTORY
-- =============================================

CREATE TABLE public.inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID REFERENCES public.materials(id) ON DELETE RESTRICT,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'sale', 'adjustment', 'return', 'transfer', 'production', 'scrap')),
  reference_type TEXT CHECK (reference_type IN ('order', 'quotation', 'manual', 'other')),
  reference_id UUID,
  quantity DECIMAL(10, 3) NOT NULL,
  unit_cost DECIMAL(15, 2),
  total_cost DECIMAL(15, 2),
  stock_before DECIMAL(10, 3) NOT NULL,
  stock_after DECIMAL(10, 3) NOT NULL,
  location TEXT,
  batch_number TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.stock_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  type TEXT CHECK (type IN ('warehouse', 'showroom', 'production', 'other')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.stock_by_location (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.stock_locations(id) ON DELETE CASCADE,
  quantity DECIMAL(10, 3) DEFAULT 0,
  reserved_quantity DECIMAL(10, 3) DEFAULT 0,
  available_quantity DECIMAL(10, 3) GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
  last_counted_at TIMESTAMP WITH TIME ZONE,
  last_counted_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(material_id, location_id)
);

-- =============================================
-- DOCUMENTS
-- =============================================

CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  category TEXT CHECK (category IN ('quotation', 'order', 'invoice', 'contract', 'technical', 'certificate', 'other')),
  reference_type TEXT CHECK (reference_type IN ('quotation', 'order', 'dealer', 'material', 'other')),
  reference_id UUID,
  visibility TEXT DEFAULT 'internal' CHECK (visibility IN ('public', 'internal', 'dealer', 'private')),
  uploaded_by UUID REFERENCES public.users(id),
  is_active BOOLEAN DEFAULT TRUE,
  tags TEXT[],
  version TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- MESSAGES & COMMUNICATIONS
-- =============================================

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  recipient_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'general' CHECK (message_type IN ('general', 'quotation', 'order', 'support', 'notification')),
  reference_type TEXT CHECK (reference_type IN ('quotation', 'order', 'other')),
  reference_id UUID,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  is_internal BOOLEAN DEFAULT FALSE,
  attachments JSONB, -- Array of file references
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ACTIVITY LOG
-- =============================================

CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

-- Users
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_status ON public.users(status);

-- Dealers
CREATE INDEX idx_dealers_user_id ON public.dealers(user_id);
CREATE INDEX idx_dealers_dealer_code ON public.dealers(dealer_code);
CREATE INDEX idx_dealers_status ON public.dealers(status);
CREATE INDEX idx_dealers_contact_email ON public.dealers(contact_email);

-- Materials
CREATE INDEX idx_materials_code ON public.materials(material_code);
CREATE INDEX idx_materials_category ON public.materials(category_id);
CREATE INDEX idx_materials_active ON public.materials(is_active);
CREATE INDEX idx_materials_name ON public.materials(name);

-- Price Lists
CREATE INDEX idx_price_lists_status ON public.price_lists(status);
CREATE INDEX idx_price_lists_effective_date ON public.price_lists(effective_date);
CREATE INDEX idx_price_list_items_material ON public.price_list_items(material_id);

-- BOM
CREATE INDEX idx_bom_templates_code ON public.bom_templates(template_code);
CREATE INDEX idx_bom_templates_type ON public.bom_templates(product_type);
CREATE INDEX idx_bom_items_template ON public.bom_items(bom_template_id);
CREATE INDEX idx_bom_items_material ON public.bom_items(material_id);

-- Quotations
CREATE INDEX idx_quotations_number ON public.quotations(quotation_number);
CREATE INDEX idx_quotations_dealer ON public.quotations(dealer_id);
CREATE INDEX idx_quotations_status ON public.quotations(status);
CREATE INDEX idx_quotations_created_by ON public.quotations(created_by);
CREATE INDEX idx_quotations_created_at ON public.quotations(created_at DESC);
CREATE INDEX idx_quotation_items_quotation ON public.quotation_items(quotation_id);

-- Orders
CREATE INDEX idx_orders_number ON public.orders(order_number);
CREATE INDEX idx_orders_dealer ON public.orders(dealer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_quotation ON public.orders(quotation_id);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);

-- Inventory
CREATE INDEX idx_inventory_transactions_material ON public.inventory_transactions(material_id);
CREATE INDEX idx_inventory_transactions_type ON public.inventory_transactions(transaction_type);
CREATE INDEX idx_inventory_transactions_created_at ON public.inventory_transactions(created_at DESC);
CREATE INDEX idx_stock_by_location_material ON public.stock_by_location(material_id);
CREATE INDEX idx_stock_by_location_location ON public.stock_by_location(location_id);

-- Documents
CREATE INDEX idx_documents_reference ON public.documents(reference_type, reference_id);
CREATE INDEX idx_documents_category ON public.documents(category);
CREATE INDEX idx_documents_uploaded_by ON public.documents(uploaded_by);

-- Messages
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX idx_messages_status ON public.messages(status);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- Activity Log
CREATE INDEX idx_activity_log_user ON public.activity_log(user_id);
CREATE INDEX idx_activity_log_entity ON public.activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_created_at ON public.activity_log(created_at DESC);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dealers_updated_at BEFORE UPDATE ON public.dealers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON public.materials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_price_lists_updated_at BEFORE UPDATE ON public.price_lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bom_templates_updated_at BEFORE UPDATE ON public.bom_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON public.quotations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate quotation number
CREATE OR REPLACE FUNCTION generate_quotation_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quotation_number IS NULL THEN
    NEW.quotation_number := 'QT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('quotation_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE quotation_seq START 1;
CREATE TRIGGER generate_quotation_number_trigger BEFORE INSERT ON public.quotations
  FOR EACH ROW EXECUTE FUNCTION generate_quotation_number();

-- Auto-generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_seq START 1;
CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Update material stock quantity
CREATE OR REPLACE FUNCTION update_material_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.materials
  SET stock_quantity = (
    SELECT COALESCE(SUM(quantity), 0)
    FROM public.stock_by_location
    WHERE material_id = NEW.material_id
  )
  WHERE id = NEW.material_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_material_stock_trigger AFTER INSERT OR UPDATE OR DELETE ON public.stock_by_location
  FOR EACH ROW EXECUTE FUNCTION update_material_stock();
