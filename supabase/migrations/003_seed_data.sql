-- Seed Data
-- Migration: 003_seed_data
-- Description: Inserts sample data for testing and development

-- =============================================
-- PRODUCT CATEGORIES
-- =============================================

INSERT INTO public.product_categories (id, name, description, display_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Windows', 'Window products and components', 1),
  ('22222222-2222-2222-2222-222222222222', 'Doors', 'Door products and components', 2),
  ('33333333-3333-3333-3333-333333333333', 'Curtain Walls', 'Curtain wall systems', 3),
  ('44444444-4444-4444-4444-444444444444', 'Hardware', 'Locks, handles, hinges, and accessories', 4),
  ('55555555-5555-5555-5555-555555555555', 'Glass', 'Glass panels and components', 5),
  ('66666666-6666-6666-6666-666666666666', 'Profiles', 'Aluminum profiles and extrusions', 6),
  ('77777777-7777-7777-7777-777777777777', 'Sealants', 'Sealants and gaskets', 7);

-- Subcategories for Windows
INSERT INTO public.product_categories (name, description, parent_id, display_order) VALUES
  ('Sliding Windows', 'Horizontal sliding window systems', '11111111-1111-1111-1111-111111111111', 1),
  ('Casement Windows', 'Side-hinged window systems', '11111111-1111-1111-1111-111111111111', 2),
  ('Awning Windows', 'Top-hinged window systems', '11111111-1111-1111-1111-111111111111', 3),
  ('Fixed Windows', 'Non-operable window systems', '11111111-1111-1111-1111-111111111111', 4);

-- =============================================
-- STOCK LOCATIONS
-- =============================================

INSERT INTO public.stock_locations (location_code, name, address, type) VALUES
  ('WH-HCM', 'Ho Chi Minh Warehouse', '123 Nguyen Van Linh, District 7, HCMC', 'warehouse'),
  ('WH-HN', 'Hanoi Warehouse', '456 Giai Phong, Hai Ba Trung, Hanoi', 'warehouse'),
  ('SR-HCM', 'HCMC Showroom', '789 Le Van Luong, District 7, HCMC', 'showroom'),
  ('PROD-01', 'Production Facility 1', 'Industrial Park, Binh Duong', 'production');

-- =============================================
-- SAMPLE MATERIALS
-- =============================================

-- Aluminum Profiles
INSERT INTO public.materials (
  material_code, name, name_en, category_id, description,
  specifications, unit, base_price, cost_price,
  stock_quantity, min_stock_level, supplier, is_active
) VALUES
  (
    'PROF-001',
    'Profile nhôm 60x40mm',
    'Aluminum Profile 60x40mm',
    '66666666-6666-6666-6666-666666666666',
    'Standard aluminum profile for window frames',
    '{"thickness": "2.0mm", "finish": "Anodized", "color": "Silver"}',
    'meter',
    150000,
    120000,
    500,
    100,
    'YKK AP Vietnam',
    TRUE
  ),
  (
    'PROF-002',
    'Profile nhôm 80x50mm',
    'Aluminum Profile 80x50mm',
    '66666666-6666-6666-6666-666666666666',
    'Heavy-duty aluminum profile for large windows',
    '{"thickness": "2.5mm", "finish": "Powder Coated", "color": "Black"}',
    'meter',
    200000,
    160000,
    300,
    50,
    'YKK AP Vietnam',
    TRUE
  );

-- Glass
INSERT INTO public.materials (
  material_code, name, name_en, category_id, description,
  specifications, unit, base_price, cost_price,
  stock_quantity, min_stock_level, is_active
) VALUES
  (
    'GLASS-001',
    'Kính cường lực 6mm',
    'Tempered Glass 6mm',
    '55555555-5555-5555-5555-555555555555',
    'Clear tempered safety glass',
    '{"thickness": "6mm", "type": "Tempered", "color": "Clear"}',
    'sqm',
    450000,
    350000,
    200,
    50,
    TRUE
  ),
  (
    'GLASS-002',
    'Kính Low-E 8mm',
    'Low-E Glass 8mm',
    '55555555-5555-5555-5555-555555555555',
    'Energy-efficient Low-E glass',
    '{"thickness": "8mm", "type": "Low-E", "coating": "ClimaGuard"}',
    'sqm',
    750000,
    600000,
    150,
    30,
    TRUE
  );

-- Hardware
INSERT INTO public.materials (
  material_code, name, name_en, category_id, description,
  specifications, unit, base_price, cost_price,
  stock_quantity, min_stock_level, is_active
) VALUES
  (
    'HW-LOCK-001',
    'Khóa cửa sổ tiêu chuẩn',
    'Standard Window Lock',
    '44444444-4444-4444-4444-444444444444',
    'Multi-point locking system',
    '{"material": "Stainless Steel", "finish": "Chrome"}',
    'pcs',
    85000,
    65000,
    1000,
    200,
    TRUE
  ),
  (
    'HW-HANDLE-001',
    'Tay nắm cửa sổ',
    'Window Handle',
    '44444444-4444-4444-4444-444444444444',
    'Ergonomic window handle',
    '{"material": "Aluminum Alloy", "color": "Silver"}',
    'pcs',
    45000,
    35000,
    1500,
    300,
    TRUE
  ),
  (
    'HW-HINGE-001',
    'Bản lề cửa sổ',
    'Window Hinge',
    '44444444-4444-4444-4444-444444444444',
    'Heavy-duty window hinge',
    '{"material": "Stainless Steel", "load_capacity": "50kg"}',
    'pcs',
    35000,
    25000,
    2000,
    400,
    TRUE
  );

-- Sealants
INSERT INTO public.materials (
  material_code, name, name_en, category_id, description,
  specifications, unit, base_price, cost_price,
  stock_quantity, min_stock_level, is_active
) VALUES
  (
    'SEAL-001',
    'Gioăng cao su EPDM',
    'EPDM Rubber Gasket',
    '77777777-7777-7777-7777-777777777777',
    'Weather-resistant rubber gasket',
    '{"material": "EPDM", "hardness": "Shore A 60"}',
    'meter',
    25000,
    18000,
    3000,
    500,
    TRUE
  ),
  (
    'SEAL-002',
    'Silicone trám khe',
    'Silicone Sealant',
    '77777777-7777-7777-7777-777777777777',
    'Professional grade silicone sealant',
    '{"type": "Neutral Cure", "volume": "300ml"}',
    'tube',
    55000,
    42000,
    500,
    100,
    TRUE
  );

-- =============================================
-- BOM TEMPLATES
-- =============================================

-- Sliding Window Template
INSERT INTO public.bom_templates (
  id, template_code, name, description,
  product_type, category, base_width, base_height,
  version, status
) VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    'WIN-SLIDE-STD',
    'Standard Sliding Window',
    'Standard 2-panel sliding window',
    'Window',
    'Sliding',
    1200,
    1500,
    '1.0',
    'active'
  );

-- BOM Items for Sliding Window
INSERT INTO public.bom_items (
  bom_template_id, material_id, item_type,
  quantity, quantity_formula, unit, position, is_variable
)
SELECT
  'a1111111-1111-1111-1111-111111111111',
  id,
  'frame',
  0,
  '((width * 2) + (height * 2)) / 1000', -- Convert mm to m
  'meter',
  'perimeter',
  TRUE
FROM public.materials WHERE material_code = 'PROF-001';

INSERT INTO public.bom_items (
  bom_template_id, material_id, item_type,
  quantity, quantity_formula, unit, position, is_variable
)
SELECT
  'a1111111-1111-1111-1111-111111111111',
  id,
  'glass',
  0,
  '(width * height) / 1000000', -- Convert mm² to m²
  'sqm',
  'panel',
  TRUE
FROM public.materials WHERE material_code = 'GLASS-001';

INSERT INTO public.bom_items (
  bom_template_id, material_id, item_type,
  quantity, unit, position
)
SELECT
  'a1111111-1111-1111-1111-111111111111',
  id,
  'hardware',
  2,
  'pcs',
  'lock'
FROM public.materials WHERE material_code = 'HW-LOCK-001';

INSERT INTO public.bom_items (
  bom_template_id, material_id, item_type,
  quantity, unit, position
)
SELECT
  'a1111111-1111-1111-1111-111111111111',
  id,
  'hardware',
  2,
  'pcs',
  'handle'
FROM public.materials WHERE material_code = 'HW-HANDLE-001';

INSERT INTO public.bom_items (
  bom_template_id, material_id, item_type,
  quantity, quantity_formula, unit, position, is_variable
)
SELECT
  'a1111111-1111-1111-1111-111111111111',
  id,
  'accessory',
  0,
  '((width * 2) + (height * 2)) / 1000',
  'meter',
  'gasket',
  TRUE
FROM public.materials WHERE material_code = 'SEAL-001';

-- =============================================
-- PRICE LISTS
-- =============================================

INSERT INTO public.price_lists (
  id, name, version, effective_date, expiry_date,
  status, currency, description
) VALUES
  (
    'p1111111-1111-1111-1111-111111111111',
    'Standard Price List 2024',
    'v1.0',
    '2024-01-01',
    '2024-12-31',
    'active',
    'VND',
    'Standard dealer pricing for 2024'
  );

-- Price List Items
INSERT INTO public.price_list_items (
  price_list_id, material_id, base_price, dealer_price, min_quantity
)
SELECT
  'p1111111-1111-1111-1111-111111111111',
  id,
  base_price,
  base_price * 0.85, -- 15% discount for dealers
  1
FROM public.materials
WHERE is_active = TRUE;

-- =============================================
-- INITIAL STOCK BY LOCATION
-- =============================================

-- Distribute stock across warehouses
INSERT INTO public.stock_by_location (material_id, location_id, quantity)
SELECT
  m.id,
  (SELECT id FROM public.stock_locations WHERE location_code = 'WH-HCM'),
  FLOOR(m.stock_quantity * 0.6)
FROM public.materials m
WHERE m.is_active = TRUE;

INSERT INTO public.stock_by_location (material_id, location_id, quantity)
SELECT
  m.id,
  (SELECT id FROM public.stock_locations WHERE location_code = 'WH-HN'),
  FLOOR(m.stock_quantity * 0.4)
FROM public.materials m
WHERE m.is_active = TRUE;

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

DO $$
BEGIN
  RAISE NOTICE 'Seed data inserted successfully!';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '- 7 product categories with subcategories';
  RAISE NOTICE '- 4 stock locations';
  RAISE NOTICE '- 8 sample materials';
  RAISE NOTICE '- 1 BOM template with items';
  RAISE NOTICE '- 1 active price list';
  RAISE NOTICE '- Stock distributed across locations';
END $$;
