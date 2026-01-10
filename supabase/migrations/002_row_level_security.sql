-- Row Level Security (RLS) Policies
-- Migration: 002_row_level_security
-- Description: Sets up RLS policies for secure data access

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bom_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bom_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_bom ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_by_location ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Get current user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'Admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Check if user is dealer
CREATE OR REPLACE FUNCTION public.is_dealer()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'Dealer'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Check if user is sales
CREATE OR REPLACE FUNCTION public.is_sales()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('Admin', 'Sales')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Get dealer_id for current user
CREATE OR REPLACE FUNCTION public.get_user_dealer_id()
RETURNS UUID AS $$
  SELECT id FROM public.dealers WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- =============================================
-- USERS POLICIES
-- =============================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (public.is_admin());

-- Admins can insert users
CREATE POLICY "Admins can insert users"
  ON public.users FOR INSERT
  WITH CHECK (public.is_admin());

-- Admins can update all users
CREATE POLICY "Admins can update users"
  ON public.users FOR UPDATE
  USING (public.is_admin());

-- Admins can delete users
CREATE POLICY "Admins can delete users"
  ON public.users FOR DELETE
  USING (public.is_admin());

-- =============================================
-- DEALERS POLICIES
-- =============================================

-- Dealers can view their own dealer profile
CREATE POLICY "Dealers can view own dealer profile"
  ON public.dealers FOR SELECT
  USING (user_id = auth.uid());

-- Sales and Admins can view all dealers
CREATE POLICY "Sales can view all dealers"
  ON public.dealers FOR SELECT
  USING (public.is_sales() OR public.is_admin());

-- Admins can manage dealers
CREATE POLICY "Admins can insert dealers"
  ON public.dealers FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update dealers"
  ON public.dealers FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete dealers"
  ON public.dealers FOR DELETE
  USING (public.is_admin());

-- =============================================
-- PRODUCT CATEGORIES POLICIES
-- =============================================

-- Everyone can view active categories
CREATE POLICY "Everyone can view categories"
  ON public.product_categories FOR SELECT
  USING (is_active = TRUE OR public.is_sales());

-- Admins can manage categories
CREATE POLICY "Admins can insert categories"
  ON public.product_categories FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories"
  ON public.product_categories FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete categories"
  ON public.product_categories FOR DELETE
  USING (public.is_admin());

-- =============================================
-- MATERIALS POLICIES
-- =============================================

-- Everyone can view active materials
CREATE POLICY "Everyone can view active materials"
  ON public.materials FOR SELECT
  USING (is_active = TRUE OR public.is_sales());

-- Sales and Admins can manage materials
CREATE POLICY "Sales can insert materials"
  ON public.materials FOR INSERT
  WITH CHECK (public.is_sales());

CREATE POLICY "Sales can update materials"
  ON public.materials FOR UPDATE
  USING (public.is_sales());

CREATE POLICY "Admins can delete materials"
  ON public.materials FOR DELETE
  USING (public.is_admin());

-- =============================================
-- PRICE LISTS POLICIES
-- =============================================

-- Sales and Admins can view price lists
CREATE POLICY "Sales can view price lists"
  ON public.price_lists FOR SELECT
  USING (public.is_sales());

-- Dealers can view active price lists
CREATE POLICY "Dealers can view active price lists"
  ON public.price_lists FOR SELECT
  USING (public.is_dealer() AND status = 'active');

-- Admins can manage price lists
CREATE POLICY "Admins can insert price lists"
  ON public.price_lists FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update price lists"
  ON public.price_lists FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete price lists"
  ON public.price_lists FOR DELETE
  USING (public.is_admin());

-- =============================================
-- PRICE LIST ITEMS POLICIES
-- =============================================

-- Sales and Admins can view price list items
CREATE POLICY "Sales can view price list items"
  ON public.price_list_items FOR SELECT
  USING (public.is_sales());

-- Dealers can view active price list items
CREATE POLICY "Dealers can view active price list items"
  ON public.price_list_items FOR SELECT
  USING (
    public.is_dealer() AND
    EXISTS (
      SELECT 1 FROM public.price_lists
      WHERE id = price_list_id AND status = 'active'
    )
  );

-- Admins can manage price list items
CREATE POLICY "Admins can insert price list items"
  ON public.price_list_items FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update price list items"
  ON public.price_list_items FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete price list items"
  ON public.price_list_items FOR DELETE
  USING (public.is_admin());

-- =============================================
-- BOM TEMPLATES POLICIES
-- =============================================

-- Everyone can view active BOM templates
CREATE POLICY "Everyone can view BOM templates"
  ON public.bom_templates FOR SELECT
  USING (status = 'active' OR public.is_sales());

-- Sales can manage BOM templates
CREATE POLICY "Sales can insert BOM templates"
  ON public.bom_templates FOR INSERT
  WITH CHECK (public.is_sales());

CREATE POLICY "Sales can update BOM templates"
  ON public.bom_templates FOR UPDATE
  USING (public.is_sales());

CREATE POLICY "Admins can delete BOM templates"
  ON public.bom_templates FOR DELETE
  USING (public.is_admin());

-- =============================================
-- BOM ITEMS POLICIES
-- =============================================

-- View policies same as BOM templates
CREATE POLICY "Everyone can view BOM items"
  ON public.bom_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bom_templates
      WHERE id = bom_template_id AND (status = 'active' OR public.is_sales())
    )
  );

-- Sales can manage BOM items
CREATE POLICY "Sales can insert BOM items"
  ON public.bom_items FOR INSERT
  WITH CHECK (public.is_sales());

CREATE POLICY "Sales can update BOM items"
  ON public.bom_items FOR UPDATE
  USING (public.is_sales());

CREATE POLICY "Sales can delete BOM items"
  ON public.bom_items FOR DELETE
  USING (public.is_sales());

-- =============================================
-- MODULE BOM POLICIES
-- =============================================

CREATE POLICY "Everyone can view module BOM"
  ON public.module_bom FOR SELECT
  USING (TRUE);

CREATE POLICY "Sales can insert module BOM"
  ON public.module_bom FOR INSERT
  WITH CHECK (public.is_sales());

CREATE POLICY "Sales can update module BOM"
  ON public.module_bom FOR UPDATE
  USING (public.is_sales());

CREATE POLICY "Sales can delete module BOM"
  ON public.module_bom FOR DELETE
  USING (public.is_sales());

-- =============================================
-- QUOTATIONS POLICIES
-- =============================================

-- Users can view their own quotations
CREATE POLICY "Users can view own quotations"
  ON public.quotations FOR SELECT
  USING (
    created_by = auth.uid() OR
    dealer_id = public.get_user_dealer_id() OR
    public.is_sales()
  );

-- Dealers can create quotations
CREATE POLICY "Dealers can create quotations"
  ON public.quotations FOR INSERT
  WITH CHECK (
    public.is_dealer() AND
    dealer_id = public.get_user_dealer_id()
  );

-- Sales can create quotations for any dealer
CREATE POLICY "Sales can create quotations"
  ON public.quotations FOR INSERT
  WITH CHECK (public.is_sales());

-- Users can update their own quotations (if in draft)
CREATE POLICY "Users can update own draft quotations"
  ON public.quotations FOR UPDATE
  USING (
    (created_by = auth.uid() OR dealer_id = public.get_user_dealer_id()) AND
    status = 'draft'
  );

-- Sales can update all quotations
CREATE POLICY "Sales can update quotations"
  ON public.quotations FOR UPDATE
  USING (public.is_sales());

-- Admins can delete quotations
CREATE POLICY "Admins can delete quotations"
  ON public.quotations FOR DELETE
  USING (public.is_admin());

-- =============================================
-- QUOTATION ITEMS POLICIES
-- =============================================

CREATE POLICY "Users can view own quotation items"
  ON public.quotation_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quotations
      WHERE id = quotation_id AND (
        created_by = auth.uid() OR
        dealer_id = public.get_user_dealer_id() OR
        public.is_sales()
      )
    )
  );

CREATE POLICY "Users can insert quotation items"
  ON public.quotation_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quotations
      WHERE id = quotation_id AND (
        (created_by = auth.uid() OR dealer_id = public.get_user_dealer_id()) AND status = 'draft'
      ) OR public.is_sales()
    )
  );

CREATE POLICY "Users can update quotation items"
  ON public.quotation_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.quotations
      WHERE id = quotation_id AND (
        (created_by = auth.uid() OR dealer_id = public.get_user_dealer_id()) AND status = 'draft'
      ) OR public.is_sales()
    )
  );

CREATE POLICY "Users can delete quotation items"
  ON public.quotation_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.quotations
      WHERE id = quotation_id AND (
        (created_by = auth.uid() OR dealer_id = public.get_user_dealer_id()) AND status = 'draft'
      ) OR public.is_sales()
    )
  );

-- =============================================
-- ORDERS POLICIES
-- =============================================

-- Similar to quotations
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (
    created_by = auth.uid() OR
    dealer_id = public.get_user_dealer_id() OR
    public.is_sales()
  );

CREATE POLICY "Sales can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (public.is_sales());

CREATE POLICY "Sales can update orders"
  ON public.orders FOR UPDATE
  USING (public.is_sales());

CREATE POLICY "Admins can delete orders"
  ON public.orders FOR DELETE
  USING (public.is_admin());

-- =============================================
-- ORDER ITEMS POLICIES
-- =============================================

CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id AND (
        created_by = auth.uid() OR
        dealer_id = public.get_user_dealer_id() OR
        public.is_sales()
      )
    )
  );

CREATE POLICY "Sales can manage order items"
  ON public.order_items FOR ALL
  USING (public.is_sales());

-- =============================================
-- INVENTORY POLICIES
-- =============================================

-- Sales can view inventory
CREATE POLICY "Sales can view inventory transactions"
  ON public.inventory_transactions FOR SELECT
  USING (public.is_sales());

CREATE POLICY "Sales can insert inventory transactions"
  ON public.inventory_transactions FOR INSERT
  WITH CHECK (public.is_sales());

-- Stock locations
CREATE POLICY "Sales can view stock locations"
  ON public.stock_locations FOR SELECT
  USING (public.is_sales());

CREATE POLICY "Admins can manage stock locations"
  ON public.stock_locations FOR ALL
  USING (public.is_admin());

-- Stock by location
CREATE POLICY "Sales can view stock by location"
  ON public.stock_by_location FOR SELECT
  USING (public.is_sales());

CREATE POLICY "Sales can manage stock by location"
  ON public.stock_by_location FOR ALL
  USING (public.is_sales());

-- =============================================
-- DOCUMENTS POLICIES
-- =============================================

CREATE POLICY "Users can view relevant documents"
  ON public.documents FOR SELECT
  USING (
    visibility = 'public' OR
    public.is_sales() OR
    (visibility = 'dealer' AND public.is_dealer())
  );

CREATE POLICY "Sales can upload documents"
  ON public.documents FOR INSERT
  WITH CHECK (public.is_sales());

CREATE POLICY "Sales can update documents"
  ON public.documents FOR UPDATE
  USING (public.is_sales());

CREATE POLICY "Admins can delete documents"
  ON public.documents FOR DELETE
  USING (public.is_admin());

-- =============================================
-- MESSAGES POLICIES
-- =============================================

CREATE POLICY "Users can view their messages"
  ON public.messages FOR SELECT
  USING (
    sender_id = auth.uid() OR
    recipient_id = auth.uid() OR
    public.is_admin()
  );

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their messages"
  ON public.messages FOR UPDATE
  USING (
    sender_id = auth.uid() OR
    recipient_id = auth.uid()
  );

CREATE POLICY "Users can delete their sent messages"
  ON public.messages FOR DELETE
  USING (sender_id = auth.uid() OR public.is_admin());

-- =============================================
-- ACTIVITY LOG POLICIES
-- =============================================

CREATE POLICY "Users can view own activity"
  ON public.activity_log FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

-- Activity log is insert-only via triggers
CREATE POLICY "System can insert activity"
  ON public.activity_log FOR INSERT
  WITH CHECK (TRUE);
