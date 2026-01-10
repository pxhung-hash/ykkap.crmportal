import { supabase } from './supabaseClient';
import type { Database } from '../types/database.types';

// Type helpers
type Tables = Database['public']['Tables'];
type User = Tables['users']['Row'];
type Material = Tables['materials']['Row'];
type Dealer = Tables['dealers']['Row'];
type Quotation = Tables['quotations']['Row'];
type Order = Tables['orders']['Row'];

/**
 * Authentication Helpers
 */
export const auth = {
  /**
   * Sign up a new user
   */
  signUp: async (email: string, password: string, userData: Partial<User>) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned from signup');

    // Create user profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        ...userData,
      })
      .select()
      .single();

    if (profileError) throw profileError;

    return { user: authData.user, profile: profileData };
  },

  /**
   * Sign in existing user
   */
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign out current user
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  /**
   * Get current user profile with role
   */
  getCurrentUserProfile: async () => {
    const user = await auth.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },
};

/**
 * User Management
 */
export const users = {
  /**
   * Get all users (Admin only)
   */
  getAll: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get user by ID
   */
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update user profile
   */
  update: async (id: string, updates: Partial<User>) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete user (Admin only)
   */
  delete: async (id: string) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

/**
 * Dealer Management
 */
export const dealers = {
  /**
   * Get all dealers
   */
  getAll: async () => {
    const { data, error } = await supabase
      .from('dealers')
      .select('*, users(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get dealer by ID
   */
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('dealers')
      .select('*, users(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create dealer
   */
  create: async (dealer: Tables['dealers']['Insert']) => {
    const { data, error } = await supabase
      .from('dealers')
      .insert(dealer)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update dealer
   */
  update: async (id: string, updates: Partial<Dealer>) => {
    const { data, error } = await supabase
      .from('dealers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get dealer by user ID
   */
  getByUserId: async (userId: string) => {
    const { data, error } = await supabase
      .from('dealers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = No rows found
    return data;
  },
};

/**
 * Materials Management
 */
export const materials = {
  /**
   * Get all materials
   */
  getAll: async (activeOnly = true) => {
    let query = supabase
      .from('materials')
      .select('*, product_categories(*)');

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query.order('name');

    if (error) throw error;
    return data;
  },

  /**
   * Get material by ID
   */
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('materials')
      .select('*, product_categories(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get materials by category
   */
  getByCategory: async (categoryId: string) => {
    const { data, error } = await supabase
      .from('materials')
      .select('*, product_categories(*)')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data;
  },

  /**
   * Search materials
   */
  search: async (searchTerm: string) => {
    const { data, error } = await supabase
      .from('materials')
      .select('*, product_categories(*)')
      .or(`name.ilike.%${searchTerm}%,material_code.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .eq('is_active', true)
      .limit(50);

    if (error) throw error;
    return data;
  },

  /**
   * Create material
   */
  create: async (material: Tables['materials']['Insert']) => {
    const { data, error } = await supabase
      .from('materials')
      .insert(material)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update material
   */
  update: async (id: string, updates: Partial<Material>) => {
    const { data, error } = await supabase
      .from('materials')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get low stock materials
   */
  getLowStock: async () => {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .lte('stock_quantity', supabase.raw('min_stock_level'))
      .eq('is_active', true);

    if (error) throw error;
    return data;
  },
};

/**
 * Quotations Management
 */
export const quotations = {
  /**
   * Get all quotations
   */
  getAll: async () => {
    const { data, error } = await supabase
      .from('quotations')
      .select('*, dealers(*), users(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get quotation by ID with items
   */
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('quotations')
      .select(`
        *,
        dealers(*),
        users(*),
        quotation_items(*, materials(*), bom_templates(*))
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create quotation
   */
  create: async (quotation: Tables['quotations']['Insert']) => {
    const { data, error } = await supabase
      .from('quotations')
      .insert(quotation)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update quotation
   */
  update: async (id: string, updates: Partial<Quotation>) => {
    const { data, error } = await supabase
      .from('quotations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Add item to quotation
   */
  addItem: async (item: Tables['quotation_items']['Insert']) => {
    const { data, error } = await supabase
      .from('quotation_items')
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get quotations by status
   */
  getByStatus: async (status: string) => {
    const { data, error } = await supabase
      .from('quotations')
      .select('*, dealers(*), users(*)')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};

/**
 * Orders Management
 */
export const orders = {
  /**
   * Get all orders
   */
  getAll: async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, dealers(*), users(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get order by ID with items
   */
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        dealers(*),
        users(*),
        order_items(*, materials(*), bom_templates(*))
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create order
   */
  create: async (order: Tables['orders']['Insert']) => {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update order
   */
  update: async (id: string, updates: Partial<Order>) => {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get orders by status
   */
  getByStatus: async (status: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, dealers(*), users(*)')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Convert quotation to order
   */
  createFromQuotation: async (quotationId: string) => {
    // Get quotation with items
    const quotation = await quotations.getById(quotationId);
    
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        quotation_id: quotationId,
        dealer_id: quotation.dealer_id,
        created_by: quotation.created_by,
        customer_name: quotation.customer_name || '',
        customer_email: quotation.customer_email,
        customer_phone: quotation.customer_phone,
        project_name: quotation.project_name,
        project_address: quotation.project_address,
        subtotal: quotation.subtotal,
        discount_amount: quotation.discount_amount,
        tax_amount: quotation.tax_amount,
        shipping_cost: quotation.shipping_cost,
        total_amount: quotation.total_amount,
        currency: quotation.currency,
        payment_terms: quotation.payment_terms,
        notes: quotation.notes,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items from quotation items
    const orderItems = quotation.quotation_items.map((item: any) => ({
      order_id: order.id,
      quotation_item_id: item.id,
      material_id: item.material_id,
      bom_template_id: item.bom_template_id,
      description: item.description,
      specifications: item.specifications,
      quantity: item.quantity,
      unit: item.unit,
      unit_price: item.unit_price,
      discount_amount: item.discount_amount,
      tax_amount: item.tax_amount,
      total_amount: item.total_amount,
      notes: item.notes,
      display_order: item.display_order,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Update quotation status
    await quotations.update(quotationId, { status: 'converted' });

    return order;
  },
};

/**
 * BOM Templates Management
 */
export const bomTemplates = {
  /**
   * Get all BOM templates
   */
  getAll: async (activeOnly = true) => {
    let query = supabase
      .from('bom_templates')
      .select('*, bom_items(*, materials(*))');

    if (activeOnly) {
      query = query.eq('status', 'active');
    }

    const { data, error } = await query.order('name');

    if (error) throw error;
    return data;
  },

  /**
   * Get BOM template by ID
   */
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('bom_templates')
      .select('*, bom_items(*, materials(*))')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },
};

/**
 * Dashboard Statistics
 */
export const dashboard = {
  /**
   * Get dashboard statistics
   */
  getStats: async () => {
    const [
      { count: quotationsCount },
      { count: ordersCount },
      { count: materialsCount },
      { count: dealersCount },
    ] = await Promise.all([
      supabase.from('quotations').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('materials').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('dealers').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    ]);

    return {
      quotations: quotationsCount || 0,
      orders: ordersCount || 0,
      materials: materialsCount || 0,
      dealers: dealersCount || 0,
    };
  },

  /**
   * Get recent activity
   */
  getRecentActivity: async (limit = 10) => {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*, users(*)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },
};
