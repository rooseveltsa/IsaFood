import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabase: SupabaseClient;

function getClient(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });
  }
  return supabase;
}

// --- Customers ---

export interface Customer {
  id: string;
  phone: string;
  name: string;
  address?: string;
  is_active: boolean;
  created_at: string;
}

export async function getOrCreateCustomer(phone: string, name: string): Promise<Customer> {
  const db = getClient();

  // Try to find existing customer
  const { data: existing, error: findError } = await db
    .from('customers')
    .select('*')
    .eq('phone', phone)
    .maybeSingle();

  if (findError) {
    throw new Error(`Failed to lookup customer: ${findError.message}`);
  }

  if (existing) {
    return existing as Customer;
  }

  // Create new customer
  const { data: created, error: createError } = await db
    .from('customers')
    .insert({ phone, name, is_active: true })
    .select()
    .single();

  if (createError) {
    throw new Error(`Failed to create customer: ${createError.message}`);
  }

  return created as Customer;
}

export async function updateCustomerActive(phone: string, isActive: boolean): Promise<void> {
  const db = getClient();

  const { error } = await db
    .from('customers')
    .update({ is_active: isActive })
    .eq('phone', phone);

  if (error) {
    throw new Error(`Failed to update customer active status: ${error.message}`);
  }
}

// --- Menu Items ---

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  price_cents: number;
  is_active: boolean;
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const db = getClient();

  const { data, error } = await db
    .from('menu_items')
    .select('*')
    .eq('is_active', true)
    .order('category')
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch menu items: ${error.message}`);
  }

  return (data || []) as MenuItem[];
}

// --- Kits ---

export interface Kit {
  id: string;
  name: string;
  quantity: number;
  price_cents: number;
  is_active: boolean;
}

export async function getKits(): Promise<Kit[]> {
  const db = getClient();

  const { data, error } = await db
    .from('kits')
    .select('*')
    .eq('is_active', true)
    .order('quantity');

  if (error) {
    throw new Error(`Failed to fetch kits: ${error.message}`);
  }

  return (data || []) as Kit[];
}

// --- Orders ---

export interface Order {
  id: string;
  order_number: number;
  customer_id: string;
  kit_id: string;
  status: string;
  total_cents: number;
  delivery_address?: string;
  delivery_date?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
}

export async function createOrder(
  customerId: string,
  kitId: string,
  items: Array<{ menuItemId: string; quantity: number }>,
  address: string,
  deliveryDate?: string,
  totalCents?: number,
): Promise<Order> {
  const db = getClient();

  // Create order
  const { data: order, error: orderError } = await db
    .from('orders')
    .insert({
      customer_id: customerId,
      kit_id: kitId,
      status: 'pending_payment',
      total_cents: totalCents || 0,
      delivery_address: address,
      delivery_date: deliveryDate,
    })
    .select()
    .single();

  if (orderError) {
    throw new Error(`Failed to create order: ${orderError.message}`);
  }

  // Create order items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    menu_item_id: item.menuItemId,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await db.from('order_items').insert(orderItems);

  if (itemsError) {
    throw new Error(`Failed to create order items: ${itemsError.message}`);
  }

  return order as Order;
}

export async function getCustomerOrders(phone: string): Promise<Order[]> {
  const db = getClient();

  // Get customer first
  const { data: customer, error: custError } = await db
    .from('customers')
    .select('id')
    .eq('phone', phone)
    .maybeSingle();

  if (custError || !customer) {
    return [];
  }

  const { data, error } = await db
    .from('orders')
    .select('*')
    .eq('customer_id', customer.id)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(`Failed to fetch customer orders: ${error.message}`);
  }

  return (data || []) as Order[];
}

// --- Conversations ---

export interface Conversation {
  id: string;
  phone: string;
  state: string;
  state_data?: Record<string, unknown>;
  is_human_handoff: boolean;
  updated_at: string;
}

export async function getConversation(phone: string): Promise<Conversation | null> {
  const db = getClient();

  const { data, error } = await db
    .from('conversations')
    .select('*')
    .eq('phone', phone)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to get conversation: ${error.message}`);
  }

  return data as Conversation | null;
}

export async function updateConversationState(
  phone: string,
  state: string,
  stateData?: Record<string, unknown>,
  isHumanHandoff?: boolean,
): Promise<Conversation> {
  const db = getClient();

  const updatePayload: Record<string, unknown> = {
    state,
    state_data: stateData || {},
    updated_at: new Date().toISOString(),
  };

  if (isHumanHandoff !== undefined) {
    updatePayload.is_human_handoff = isHumanHandoff;
  }

  // Upsert conversation
  const { data, error } = await db
    .from('conversations')
    .upsert(
      { phone, ...updatePayload },
      { onConflict: 'phone' },
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update conversation state: ${error.message}`);
  }

  return data as Conversation;
}

export async function getActiveConversations(): Promise<Conversation[]> {
  const db = getClient();

  const { data, error } = await db
    .from('conversations')
    .select('*')
    .neq('state', 'idle')
    .order('updated_at', { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(`Failed to fetch active conversations: ${error.message}`);
  }

  return (data || []) as Conversation[];
}

// --- Message Logging ---

export async function logMessage(
  conversationId: string,
  phone: string,
  direction: 'inbound' | 'outbound',
  content: string,
): Promise<void> {
  const db = getClient();

  const { error } = await db.from('messages').insert({
    conversation_id: conversationId,
    phone,
    direction,
    content,
  });

  if (error) {
    // Log but don't throw - message logging should not block the flow
    console.error(`Failed to log message: ${error.message}`);
  }
}
