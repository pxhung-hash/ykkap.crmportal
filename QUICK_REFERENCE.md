# 🚀 Quick Reference - YKK AP CRM Portal Database

## 📊 Database Overview

| Category | Tables | Purpose |
|----------|--------|---------|
| **Users** | users, dealers | Authentication & user management |
| **Products** | materials, product_categories | Product catalog |
| **Pricing** | price_lists, price_list_items | Pricing management |
| **BOM** | bom_templates, bom_items, module_bom | Bill of materials |
| **Sales** | quotations, quotation_items, orders, order_items | Sales process |
| **Inventory** | inventory_transactions, stock_locations, stock_by_location | Stock management |
| **Documents** | documents, messages | File storage & communication |
| **Audit** | activity_log | System activity tracking |

---

## 🔑 Common Queries

### **Get Materials with Categories**
```sql
SELECT m.*, c.name as category_name
FROM materials m
LEFT JOIN product_categories c ON m.category_id = c.id
WHERE m.is_active = true
ORDER BY m.name;
```

### **Get Quotations with Details**
```sql
SELECT 
  q.*,
  d.company_name as dealer_name,
  u.full_name as created_by_name,
  COUNT(qi.id) as item_count
FROM quotations q
LEFT JOIN dealers d ON q.dealer_id = d.id
LEFT JOIN users u ON q.created_by = u.id
LEFT JOIN quotation_items qi ON q.id = qi.quotation_id
GROUP BY q.id, d.company_name, u.full_name
ORDER BY q.created_at DESC;
```

### **Get Current Stock by Material**
```sql
SELECT 
  m.material_code,
  m.name,
  SUM(sl.quantity) as total_stock,
  SUM(sl.reserved_quantity) as reserved,
  SUM(sl.available_quantity) as available,
  m.min_stock_level
FROM materials m
LEFT JOIN stock_by_location sl ON m.id = sl.material_id
GROUP BY m.id, m.material_code, m.name, m.min_stock_level
HAVING SUM(sl.quantity) < m.min_stock_level
ORDER BY m.name;
```

### **Get Orders by Status**
```sql
SELECT 
  status,
  COUNT(*) as order_count,
  SUM(total_amount) as total_value
FROM orders
GROUP BY status
ORDER BY status;
```

---

## 💻 TypeScript Helper Functions

### **Authentication**
```typescript
// Sign in
const user = await auth.signIn('email@example.com', 'password');

// Get current user profile
const profile = await auth.getCurrentUserProfile();

// Sign out
await auth.signOut();
```

### **Materials**
```typescript
// Get all materials
const materials = await materials.getAll();

// Search materials
const results = await materials.search('aluminum');

// Get low stock items
const lowStock = await materials.getLowStock();

// Create material
const newMaterial = await materials.create({
  material_code: 'PROF-003',
  name: 'Profile nhôm 70x50mm',
  category_id: 'category-uuid',
  unit: 'meter',
  base_price: 180000,
  cost_price: 145000,
  stock_quantity: 200,
  min_stock_level: 50,
  is_active: true,
});
```

### **Quotations**
```typescript
// Get all quotations
const quotations = await quotations.getAll();

// Get by ID with items
const quotation = await quotations.getById('quotation-uuid');

// Create quotation
const newQuote = await quotations.create({
  dealer_id: 'dealer-uuid',
  project_name: 'Office Building Project',
  status: 'draft',
  subtotal: 50000000,
  tax_amount: 5000000,
  total_amount: 55000000,
  currency: 'VND',
});

// Add item to quotation
await quotations.addItem({
  quotation_id: 'quotation-uuid',
  item_type: 'material',
  material_id: 'material-uuid',
  description: 'Aluminum Profile 60x40mm',
  quantity: 100,
  unit: 'meter',
  unit_price: 150000,
  subtotal: 15000000,
  total_amount: 15000000,
});
```

### **Orders**
```typescript
// Convert quotation to order
const order = await orders.createFromQuotation('quotation-uuid');

// Get orders by status
const pending = await orders.getByStatus('pending');

// Update order status
await orders.update('order-uuid', { 
  status: 'processing',
  payment_status: 'paid',
});
```

### **Dealers**
```typescript
// Get all dealers
const allDealers = await dealers.getAll();

// Create dealer
const newDealer = await dealers.create({
  dealer_code: 'DLR-001',
  company_name: 'ABC Construction Co.',
  contact_person: 'John Doe',
  contact_email: 'john@abc.com',
  contact_phone: '0901234567',
  payment_terms: 'NET30',
  credit_limit: 100000000,
  status: 'active',
});
```

---

## 🎯 User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Full access: Create, Read, Update, Delete all records |
| **Sales** | Create quotations/orders, manage materials, view inventory |
| **Dealer** | View own quotations/orders, create quotations, view products |
| **Viewer** | Read-only access to assigned data |

### **Check User Role**
```typescript
const profile = await auth.getCurrentUserProfile();
const isAdmin = profile?.role === 'Admin';
const isSales = ['Admin', 'Sales'].includes(profile?.role || '');
```

---

## 📈 Dashboard KPIs

### **Get Statistics**
```typescript
const stats = await dashboard.getStats();
// Returns: { quotations, orders, materials, dealers }
```

### **SQL for Monthly Sales**
```sql
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as order_count,
  SUM(total_amount) as total_sales
FROM orders
WHERE status NOT IN ('cancelled')
  AND created_at >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
```

### **Top Products**
```sql
SELECT 
  m.material_code,
  m.name,
  SUM(oi.quantity) as total_quantity,
  SUM(oi.total_amount) as total_revenue
FROM order_items oi
JOIN materials m ON oi.material_id = m.id
JOIN orders o ON oi.order_id = o.id
WHERE o.status NOT IN ('cancelled')
  AND o.created_at >= NOW() - INTERVAL '3 months'
GROUP BY m.id, m.material_code, m.name
ORDER BY total_revenue DESC
LIMIT 10;
```

---

## 🔧 Database Maintenance

### **Check Table Sizes**
```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### **Analyze Query Performance**
```sql
EXPLAIN ANALYZE
SELECT * FROM quotations
WHERE status = 'pending'
  AND created_at > NOW() - INTERVAL '30 days';
```

### **Reindex Tables** (if needed)
```sql
REINDEX TABLE materials;
REINDEX TABLE quotations;
REINDEX TABLE orders;
```

---

## 🚨 Common Issues & Solutions

### **Issue: RLS Policy Denies Access**
```sql
-- Check current user's role
SELECT public.get_user_role();

-- Verify user exists in users table
SELECT * FROM public.users WHERE id = auth.uid();

-- Temporarily disable RLS for testing (Admin only)
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;
-- Re-enable after testing
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
```

### **Issue: Quotation Number Not Auto-Generated**
```sql
-- Check sequence
SELECT last_value FROM quotation_seq;

-- Reset sequence if needed
SELECT setval('quotation_seq', 1, false);
```

### **Issue: Stock Quantity Not Updating**
```sql
-- Manually recalculate stock
UPDATE materials m
SET stock_quantity = (
  SELECT COALESCE(SUM(quantity), 0)
  FROM stock_by_location
  WHERE material_id = m.id
)
WHERE m.id = 'material-uuid';
```

---

## 📝 Sample Data Queries

### **Insert Sample Dealer**
```sql
-- First create user in Supabase Auth, then:
INSERT INTO public.dealers (
  user_id, dealer_code, company_name,
  contact_person, contact_email, contact_phone,
  status, credit_limit
) VALUES (
  'user-uuid-from-auth',
  'DLR-001',
  'Sample Dealer Company',
  'John Doe',
  'john@example.com',
  '0901234567',
  'active',
  50000000
);
```

### **Insert Sample Material**
```sql
INSERT INTO public.materials (
  material_code, name, name_en, category_id,
  description, unit, base_price, cost_price,
  stock_quantity, min_stock_level, is_active
) VALUES (
  'TEST-001',
  'Test Material',
  'Test Material EN',
  (SELECT id FROM product_categories WHERE name = 'Windows' LIMIT 1),
  'Test description',
  'pcs',
  100000,
  80000,
  100,
  20,
  true
);
```

---

## 🔐 Security Best Practices

1. **Never disable RLS in production**
2. **Always use parameterized queries** (Supabase client handles this)
3. **Validate user roles** before sensitive operations
4. **Log all important actions** to activity_log
5. **Use environment variables** for credentials (never hardcode)
6. **Regular backups** (Supabase provides automatic backups)

---

## 🎓 Learning Resources

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [SQL Tutorial](https://www.postgresqltutorial.com/)
- [Supabase Discord](https://discord.supabase.com/)

---

**Quick Links:**
- 📋 [Full Setup Guide](./SUPABASE_SETUP_GUIDE.md)
- 📖 [Database Schema Details](./supabase/README.md)
- 💾 [Migration Files](./supabase/migrations/)
- 🔧 [Helper Functions](./src/app/utils/supabaseHelpers.ts)
- 📘 [TypeScript Types](./src/app/types/database.types.ts)

---

Last Updated: January 2024
