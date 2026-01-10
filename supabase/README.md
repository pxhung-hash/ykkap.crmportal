# YKK AP CRM Portal - Supabase Database Setup

## 📋 Overview

This directory contains all database migrations and configuration for the YKK AP CRM Portal. The database is built on Supabase (PostgreSQL) with Row Level Security (RLS) enabled for all tables.

## 🗄️ Database Schema

### Core Tables

#### **Users & Authentication**
- `users` - Extended user profiles (links to Supabase auth.users)
- `dealers` - Dealer company information and settings

#### **Products & Materials**
- `product_categories` - Hierarchical product categorization
- `materials` - Product catalog with specifications and inventory
- `price_lists` - Version-controlled pricing
- `price_list_items` - Material prices per price list

#### **BOM (Bill of Materials)**
- `bom_templates` - Reusable product configurations
- `bom_items` - Components within BOM templates
- `module_bom` - Hierarchical BOM structures

#### **Sales & Orders**
- `quotations` - Customer quotations
- `quotation_items` - Line items in quotations
- `orders` - Confirmed customer orders
- `order_items` - Line items in orders

#### **Inventory**
- `inventory_transactions` - Stock movement history
- `stock_locations` - Warehouse/storage locations
- `stock_by_location` - Current stock per location

#### **Documents & Communication**
- `documents` - File storage metadata
- `messages` - Internal messaging system
- `activity_log` - Audit trail for all actions

## 🚀 Quick Start

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/cuiaostlgsragtsyspml
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run Migrations

Run each migration file **in order**:

#### **Migration 1: Initial Schema** ✅
Copy and paste the contents of `001_initial_schema.sql` into the SQL Editor and click **Run**.

This creates:
- All database tables
- Indexes for performance
- Triggers for auto-updating timestamps
- Auto-generation of quotation/order numbers
- Stock quantity calculations

#### **Migration 2: Row Level Security** 🔒
Copy and paste the contents of `002_row_level_security.sql` into the SQL Editor and click **Run**.

This creates:
- RLS policies for all tables
- Helper functions for role checking
- Secure access control based on user roles

#### **Migration 3: Seed Data** 🌱
Copy and paste the contents of `003_seed_data.sql` into the SQL Editor and click **Run**.

This creates:
- 7 product categories
- 4 stock locations
- 8 sample materials
- 1 BOM template with items
- 1 active price list
- Initial stock distribution

### Step 3: Verify Installation

Run this query to verify everything is set up:

```sql
SELECT 
  'Users' as table_name, COUNT(*) as count FROM public.users
UNION ALL
SELECT 'Materials', COUNT(*) FROM public.materials
UNION ALL
SELECT 'Product Categories', COUNT(*) FROM public.product_categories
UNION ALL
SELECT 'Stock Locations', COUNT(*) FROM public.stock_locations
UNION ALL
SELECT 'BOM Templates', COUNT(*) FROM public.bom_templates
UNION ALL
SELECT 'Price Lists', COUNT(*) FROM public.price_lists;
```

Expected results:
- Materials: 8
- Product Categories: 11
- Stock Locations: 4
- BOM Templates: 1
- Price Lists: 1

## 👥 User Roles & Permissions

### Role Hierarchy

1. **Admin** - Full access to all features
   - User management
   - System configuration
   - All CRUD operations
   - Can delete records

2. **Sales** - Business operations
   - Create/manage quotations
   - Create/manage orders
   - Manage materials and pricing
   - View inventory
   - Cannot delete critical records

3. **Dealer** - Customer access
   - View assigned products and pricing
   - Create quotations
   - View own orders
   - Limited to own dealer account

4. **Viewer** - Read-only access
   - View products and materials
   - View assigned quotations/orders
   - No create/update/delete permissions

### RLS (Row Level Security) Examples

**Dealers can only see their own data:**
```sql
-- Automatically filtered by dealer_id
SELECT * FROM quotations; -- Returns only current dealer's quotations
```

**Sales can see all dealer data:**
```sql
-- No filtering for sales role
SELECT * FROM quotations; -- Returns all quotations
```

**Admins have full access:**
```sql
-- Complete access including deleted records
SELECT * FROM quotations; -- Returns everything
```

## 🔐 Security Features

### Enabled on All Tables
- ✅ Row Level Security (RLS)
- ✅ Automatic timestamp updates
- ✅ Foreign key constraints
- ✅ Check constraints for enums
- ✅ Unique constraints

### Data Protection
- Dealers can only access their own records
- Sales staff cannot delete critical data
- All changes are logged in `activity_log`
- User passwords never stored (handled by Supabase Auth)

## 📊 Database Functions

### Helper Functions

```sql
-- Get current user's role
SELECT public.get_user_role(); -- Returns: 'Admin', 'Sales', 'Dealer', or 'Viewer'

-- Check if current user is admin
SELECT public.is_admin(); -- Returns: true/false

-- Check if current user is dealer
SELECT public.is_dealer(); -- Returns: true/false

-- Check if current user is sales
SELECT public.is_sales(); -- Returns: true/false

-- Get current user's dealer_id
SELECT public.get_user_dealer_id(); -- Returns: UUID or NULL
```

## 🔄 Auto-Generated Fields

### Quotation Numbers
Format: `QT-YYYYMMDD-XXXX`
- Example: `QT-20240115-0001`
- Automatically increments daily

### Order Numbers
Format: `ORD-YYYYMMDD-XXXX`
- Example: `ORD-20240115-0001`
- Automatically increments daily

### Timestamps
All tables have:
- `created_at` - Set on insert
- `updated_at` - Auto-updated on every change

## 📈 Indexes for Performance

All frequently queried columns are indexed:
- Email addresses
- Status fields
- Foreign keys
- Date fields
- Unique codes (material_code, dealer_code, etc.)

## 🛠️ Maintenance

### Backup Strategy
Supabase provides automatic daily backups. For manual backups:

```sql
-- Export specific table
COPY (SELECT * FROM materials) TO '/path/to/backup.csv' CSV HEADER;
```

### Monitoring Queries

```sql
-- Check stock levels below minimum
SELECT m.name, m.stock_quantity, m.min_stock_level
FROM materials m
WHERE m.stock_quantity < m.min_stock_level
  AND m.is_active = true;

-- Recent activity by user
SELECT * FROM activity_log
WHERE user_id = 'your-user-id'
ORDER BY created_at DESC
LIMIT 50;

-- Pending orders count
SELECT status, COUNT(*) as count
FROM orders
GROUP BY status;
```

## 🧪 Testing

### Create Test User (Admin Panel Required)

After setting up Supabase Auth:

1. Sign up via your app's signup form
2. In Supabase Dashboard > Authentication > Users
3. Click on the user
4. Note their UUID
5. Insert into users table:

```sql
INSERT INTO public.users (id, email, full_name, role)
VALUES (
  'user-uuid-from-auth',
  'admin@ykkap.com',
  'Admin User',
  'Admin'
);
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🆘 Troubleshooting

### Issue: RLS Policies Not Working
**Solution:** Ensure you're authenticated and your user exists in the `users` table.

### Issue: Cannot Insert Data
**Solution:** Check if RLS policies allow your user role to perform the operation.

### Issue: Triggers Not Firing
**Solution:** Verify triggers are enabled:
```sql
SELECT * FROM pg_trigger WHERE tgname LIKE '%updated_at%';
```

### Issue: Foreign Key Violations
**Solution:** Ensure referenced records exist before insertion.

## 📞 Support

For database-related issues:
1. Check Supabase logs in Dashboard > Logs
2. Review RLS policies for your user role
3. Verify data integrity with foreign key constraints

---

**Last Updated:** January 2024
**Database Version:** PostgreSQL 15+ (Supabase)
**Schema Version:** 1.0
