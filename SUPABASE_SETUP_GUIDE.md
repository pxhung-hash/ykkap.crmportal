# 🚀 Supabase Setup Guide - YKK AP CRM Portal

## ✅ Prerequisites Completed

- ✅ Supabase project created (ID: `cuiaostlgsragtsyspml`)
- ✅ Supabase client library installed (`@supabase/supabase-js@2.90.1`)
- ✅ Supabase client configured (`/src/app/utils/supabaseClient.ts`)
- ✅ Database schema designed and ready to deploy
- ✅ TypeScript types generated

---

## 📝 Step-by-Step Setup Instructions

### **Step 1: Access Your Supabase Dashboard** 🖥️

1. Open your browser and navigate to:
   ```
   https://supabase.com/dashboard/project/cuiaostlgsragtsyspml
   ```

2. Sign in with your Supabase account

3. You should see your project dashboard

---

### **Step 2: Enable Email Authentication** 📧

1. In the left sidebar, click **Authentication**
2. Click **Providers**
3. Find **Email** provider
4. Make sure it's **enabled** (toggle should be ON)
5. Scroll down to **Email Templates** (optional but recommended):
   - Customize "Confirm signup" email
   - Customize "Reset password" email
   - Add your company branding

---

### **Step 3: Run Database Migrations** 🗄️

#### **Migration 1: Initial Schema**

1. In the left sidebar, click **SQL Editor**
2. Click **New Query** button
3. Copy the **entire contents** of `/supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL Editor
5. Click **Run** (bottom right)
6. ✅ You should see: "Success. No rows returned"

This creates all your database tables, indexes, and triggers.

---

#### **Migration 2: Row Level Security**

1. Click **New Query** again
2. Copy the **entire contents** of `/supabase/migrations/002_row_level_security.sql`
3. Paste into the SQL Editor
4. Click **Run**
5. ✅ You should see: "Success. No rows returned"

This enables secure access control based on user roles.

---

#### **Migration 3: Seed Data**

1. Click **New Query** again
2. Copy the **entire contents** of `/supabase/migrations/003_seed_data.sql`
3. Paste into the SQL Editor
4. Click **Run**
5. ✅ You should see: "Success. No rows returned" plus notices about created records

This populates your database with sample data for testing.

---

### **Step 4: Verify Database Setup** ✔️

Run this verification query in SQL Editor:

```sql
SELECT 
  'Users' as table_name, COUNT(*) as count FROM public.users
UNION ALL
SELECT 'Dealers', COUNT(*) FROM public.dealers
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

**Expected Results:**
```
table_name          | count
--------------------|------
Users               | 0
Dealers             | 0
Materials           | 8
Product Categories  | 11
Stock Locations     | 4
BOM Templates       | 1
Price Lists         | 1
```

If you see these counts, your database is ready! 🎉

---

### **Step 5: Create Your First Admin User** 👤

#### **Option A: Using Supabase Auth UI (Recommended)**

1. Go to **Authentication** > **Users** in Supabase Dashboard
2. Click **Add User** > **Create new user**
3. Enter:
   - Email: `admin@ykkap.com` (or your email)
   - Password: Create a strong password
   - Auto Confirm User: ✅ Check this box
4. Click **Create user**
5. **Copy the User UUID** from the user list

Now add them to the users table:

1. Go to **SQL Editor** > **New Query**
2. Run this (replace `USER_UUID_HERE` with the UUID you copied):

```sql
INSERT INTO public.users (id, email, full_name, role, status)
VALUES (
  'USER_UUID_HERE',
  'admin@ykkap.com',
  'Admin User',
  'Admin',
  'active'
);
```

---

#### **Option B: Using Your App (After Frontend is Connected)**

1. Open your app in browser
2. Go to signup/registration page
3. Create account with email and password
4. After signup, get user UUID from Supabase Dashboard
5. Update user role in SQL Editor:

```sql
UPDATE public.users
SET role = 'Admin'
WHERE email = 'your-email@example.com';
```

---

### **Step 6: Test Database Connection** 🧪

Create a test file: `/src/test-supabase.ts`

```typescript
import { supabase } from './app/utils/supabaseClient';
import { materials } from './app/utils/supabaseHelpers';

async function testConnection() {
  console.log('🧪 Testing Supabase connection...');
  
  try {
    // Test 1: Fetch materials
    const allMaterials = await materials.getAll();
    console.log('✅ Materials fetched:', allMaterials.length);
    
    // Test 2: Test authentication
    const { data: { session } } = await supabase.auth.getSession();
    console.log('✅ Auth session:', session ? 'Active' : 'No session');
    
    // Test 3: Check connection
    const { data, error } = await supabase
      .from('materials')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection error:', error);
    } else {
      console.log('✅ Database connected successfully!');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testConnection();
```

Run with: `npm run dev` and check browser console.

---

### **Step 7: Configure Storage (Optional)** 📦

For file uploads (documents, images):

1. Go to **Storage** in left sidebar
2. Click **Create a new bucket**
3. Create buckets:
   - `documents` - For quotation PDFs, contracts, etc.
   - `materials` - For product images
   - `avatars` - For user profile pictures
4. For each bucket:
   - Click bucket name
   - Click **Policies**
   - Add policies for your access control

Example policy for `materials` bucket:
```sql
-- Allow authenticated users to read
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'materials' AND auth.role() IS NOT NULL);

-- Allow sales/admin to upload
CREATE POLICY "Sales can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'materials' AND
  (public.get_user_role() IN ('Admin', 'Sales'))
);
```

---

## 🎯 What You Have Now

### **Database Tables** (19 total)
- ✅ Users & Dealers
- ✅ Materials & Categories
- ✅ Price Lists
- ✅ BOM Templates
- ✅ Quotations & Orders
- ✅ Inventory Management
- ✅ Documents & Messages
- ✅ Activity Logging

### **Security Features**
- ✅ Row Level Security on all tables
- ✅ Role-based access control (Admin, Sales, Dealer, Viewer)
- ✅ Auto-generated quotation/order numbers
- ✅ Audit trail for all actions

### **Sample Data**
- ✅ 8 materials (aluminum profiles, glass, hardware, sealants)
- ✅ 11 product categories
- ✅ 4 stock locations
- ✅ 1 BOM template (sliding window)
- ✅ 1 active price list

---

## 🔧 Using the Database in Your App

### **Import helpers:**
```typescript
import { auth, materials, quotations, orders, dealers } from './utils/supabaseHelpers';
```

### **Examples:**

#### **Sign in:**
```typescript
const { user } = await auth.signIn('email@example.com', 'password');
```

#### **Get all materials:**
```typescript
const allMaterials = await materials.getAll();
```

#### **Create quotation:**
```typescript
const newQuotation = await quotations.create({
  dealer_id: 'dealer-uuid',
  project_name: 'ABC Office Building',
  status: 'draft',
  subtotal: 10000000,
  total_amount: 11000000,
  currency: 'VND',
});
```

#### **Search materials:**
```typescript
const results = await materials.search('aluminum');
```

---

## 🎨 Next Steps

### **1. Connect Frontend Components**
Update your existing React components to use Supabase:
- Replace mock data with real database calls
- Use `supabaseHelpers.ts` functions
- Add loading states and error handling

### **2. Implement Authentication Flow**
- Update `LoginPage.tsx` to use `auth.signIn()`
- Add sign up page using `auth.signUp()`
- Implement password reset
- Add protected routes

### **3. Build Features**
- User Management Dashboard
- Material Catalog with real data
- Quotation system with database
- Order tracking
- Inventory management

### **4. Add Real-time Features**
```typescript
// Example: Listen for new orders
supabase
  .channel('orders')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'orders' },
    (payload) => {
      console.log('New order:', payload.new);
    }
  )
  .subscribe();
```

---

## 🆘 Troubleshooting

### **Issue: Cannot connect to Supabase**
✅ Check that your project URL and anon key are correct in `/utils/supabase/info.tsx`

### **Issue: RLS prevents data access**
✅ Make sure you're authenticated and have the correct role in the `users` table

### **Issue: Migrations fail**
✅ Run migrations in order (001, 002, 003)
✅ Check for syntax errors in SQL Editor
✅ View error details in Supabase logs

### **Issue: No data returned**
✅ Verify seed data was inserted with verification query
✅ Check RLS policies allow your user role to access data
✅ Ensure you're filtering correctly (e.g., is_active = true)

---

## 📚 Additional Resources

- 📖 [Supabase Documentation](https://supabase.com/docs)
- 🔐 [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- 🎓 [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- 💬 [Supabase Discord Community](https://discord.supabase.com/)

---

## ✅ Setup Checklist

- [ ] Accessed Supabase Dashboard
- [ ] Enabled Email Authentication
- [ ] Ran Migration 001 (Initial Schema)
- [ ] Ran Migration 002 (Row Level Security)
- [ ] Ran Migration 003 (Seed Data)
- [ ] Verified database setup with test query
- [ ] Created first admin user
- [ ] Tested database connection
- [ ] Configured storage buckets (optional)
- [ ] Updated frontend components to use Supabase
- [ ] Implemented authentication flow

---

**🎉 Congratulations!** Your YKK AP CRM Portal backend is now fully set up and ready to use!

For questions or issues, check the troubleshooting section or refer to `/supabase/README.md` for detailed documentation.

---

**Last Updated:** January 2024  
**Database Version:** 1.0  
**Supabase Project ID:** cuiaostlgsragtsyspml
