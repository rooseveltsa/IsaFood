-- ============================================================================
-- IsaFood - Initial Database Schema
-- ============================================================================

-- =========================
-- ENUMS
-- =========================

CREATE TYPE order_status AS ENUM (
  'novo',
  'confirmado',
  'em_producao',
  'pronto',
  'entregue',
  'cancelado'
);

CREATE TYPE payment_status AS ENUM (
  'pendente',
  'confirmado',
  'reembolsado'
);

CREATE TYPE payment_method AS ENUM (
  'pix',
  'dinheiro',
  'cartao',
  'transferencia'
);

-- =========================
-- TABLES
-- =========================

-- Profiles (linked to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  neighborhood TEXT,
  city TEXT NOT NULL DEFAULT 'Brasilia',
  notes TEXT,
  dietary_restrictions TEXT[],
  preferences TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_spent NUMERIC(10,2) NOT NULL DEFAULT 0,
  last_order_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_customers_phone ON customers(phone);

-- Menu Items
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('Low Carb', 'Fit')),
  image_url TEXT,
  weight_grams INTEGER NOT NULL DEFAULT 320,
  protein_grams INTEGER NOT NULL DEFAULT 120,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ingredients
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  unit TEXT NOT NULL DEFAULT 'g',
  category TEXT,
  avg_price_per_unit NUMERIC(10,4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Menu Item Ingredients (junction)
CREATE TABLE menu_item_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity_per_unit NUMERIC(10,2) NOT NULL,
  UNIQUE (menu_item_id, ingredient_id)
);

-- Kits
CREATE TABLE kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders
CREATE SEQUENCE order_number_seq;

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number INTEGER NOT NULL DEFAULT nextval('order_number_seq'),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  kit_id UUID REFERENCES kits(id) ON DELETE SET NULL,
  status order_status NOT NULL DEFAULT 'novo',
  payment_status payment_status NOT NULL DEFAULT 'pendente',
  payment_method payment_method,
  delivery_address TEXT,
  delivery_neighborhood TEXT,
  delivery_date DATE,
  total NUMERIC(10,2),
  notes TEXT,
  source TEXT CHECK (source IN ('whatsapp', 'manual', 'site')),
  confirmed_at TIMESTAMPTZ,
  production_started_at TIMESTAMPTZ,
  ready_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order Status History
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status order_status,
  to_status order_status NOT NULL,
  changed_by UUID,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Shopping Lists
CREATE TABLE shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  target_date DATE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_compras', 'concluido')),
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Shopping List Items
CREATE TABLE shopping_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopping_list_id UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
  required_quantity NUMERIC(10,2) NOT NULL,
  purchased_quantity NUMERIC(10,2),
  is_checked BOOLEAN NOT NULL DEFAULT false,
  estimated_cost NUMERIC(10,2),
  actual_cost NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- ROW LEVEL SECURITY
-- =========================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;

-- Authenticated users: full access on all tables
CREATE POLICY "Authenticated users full access on profiles"
  ON profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access on customers"
  ON customers FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access on menu_items"
  ON menu_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access on ingredients"
  ON ingredients FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access on menu_item_ingredients"
  ON menu_item_ingredients FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access on kits"
  ON kits FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access on orders"
  ON orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access on order_items"
  ON order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access on order_status_history"
  ON order_status_history FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access on shopping_lists"
  ON shopping_lists FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access on shopping_list_items"
  ON shopping_list_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Anonymous users: SELECT on active menu_items and kits
CREATE POLICY "Anon select active menu_items"
  ON menu_items FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Anon select active kits"
  ON kits FOR SELECT TO anon USING (is_active = true);

-- =========================
-- FUNCTIONS
-- =========================

-- Update order status with history logging and customer stats
CREATE OR REPLACE FUNCTION update_order_status(
  p_order_id UUID,
  p_new_status TEXT,
  p_user_id UUID DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_status order_status;
  v_customer_id UUID;
  v_total NUMERIC(10,2);
BEGIN
  -- Get current order info
  SELECT status, customer_id, total
  INTO v_current_status, v_customer_id, v_total
  FROM orders
  WHERE id = p_order_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order % not found', p_order_id;
  END IF;

  -- Update the order status
  UPDATE orders
  SET
    status = p_new_status::order_status,
    updated_at = now(),
    confirmed_at = CASE WHEN p_new_status = 'confirmado' THEN now() ELSE confirmed_at END,
    production_started_at = CASE WHEN p_new_status = 'em_producao' THEN now() ELSE production_started_at END,
    ready_at = CASE WHEN p_new_status = 'pronto' THEN now() ELSE ready_at END,
    delivered_at = CASE WHEN p_new_status = 'entregue' THEN now() ELSE delivered_at END,
    cancelled_at = CASE WHEN p_new_status = 'cancelado' THEN now() ELSE cancelled_at END
  WHERE id = p_order_id;

  -- Log status change in history
  INSERT INTO order_status_history (order_id, from_status, to_status, changed_by, notes)
  VALUES (p_order_id, v_current_status, p_new_status::order_status, p_user_id, p_notes);

  -- Update customer stats when delivered
  IF p_new_status = 'entregue' THEN
    UPDATE customers
    SET
      total_orders = total_orders + 1,
      total_spent = total_spent + COALESCE(v_total, 0),
      last_order_at = now(),
      updated_at = now()
    WHERE id = v_customer_id;
  END IF;
END;
$$;

-- Generate shopping list from pending orders for a target date
CREATE OR REPLACE FUNCTION generate_shopping_list(
  p_target_date DATE,
  p_list_name TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_list_id UUID;
  v_list_name TEXT;
BEGIN
  v_list_name := COALESCE(p_list_name, 'Lista de Compras - ' || p_target_date::TEXT);

  -- Create the shopping list
  INSERT INTO shopping_lists (name, target_date, status)
  VALUES (v_list_name, p_target_date, 'pendente')
  RETURNING id INTO v_list_id;

  -- Aggregate ingredients from pending orders for the target date
  INSERT INTO shopping_list_items (shopping_list_id, ingredient_id, required_quantity, estimated_cost)
  SELECT
    v_list_id,
    mii.ingredient_id,
    SUM(mii.quantity_per_unit * oi.quantity),
    SUM(mii.quantity_per_unit * oi.quantity * COALESCE(ing.avg_price_per_unit, 0))
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  JOIN menu_item_ingredients mii ON mii.menu_item_id = oi.menu_item_id
  JOIN ingredients ing ON ing.id = mii.ingredient_id
  WHERE o.delivery_date = p_target_date
    AND o.status IN ('novo', 'confirmado')
  GROUP BY mii.ingredient_id;

  RETURN v_list_id;
END;
$$;

-- =========================
-- REALTIME
-- =========================

ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- =========================
-- SEED DATA
-- =========================

-- Kits
INSERT INTO kits (name, quantity, price, original_price, is_active, sort_order) VALUES
  ('Kit 10 Refeicoes', 10, 169.00, NULL, true, 1),
  ('Kit 20 Refeicoes', 20, 299.00, NULL, true, 2),
  ('Kit 40 Refeicoes', 40, 449.00, NULL, true, 3);

-- Menu Items (16 items from MenuDigital)
INSERT INTO menu_items (name, description, category, weight_grams, protein_grams, is_active, sort_order) VALUES
  -- Low Carb
  ('Frango Grelhado com Legumes', 'Peito de frango grelhado acompanhado de legumes salteados', 'Low Carb', 320, 120, true, 1),
  ('Carne com Brocolis', 'Tiras de carne bovina com brocolis refogado', 'Low Carb', 320, 120, true, 2),
  ('Salmao com Aspargos', 'File de salmao grelhado com aspargos', 'Low Carb', 320, 120, true, 3),
  ('Frango com Couve-Flor', 'Frango desfiado com pure de couve-flor', 'Low Carb', 320, 120, true, 4),
  ('Carne Moida com Abobrinha', 'Carne moida refogada com abobrinha grelhada', 'Low Carb', 320, 120, true, 5),
  ('Tilapia com Legumes', 'File de tilapia assado com mix de legumes', 'Low Carb', 320, 120, true, 6),
  ('Frango com Espinafre', 'Peito de frango recheado com espinafre e cream cheese', 'Low Carb', 320, 120, true, 7),
  ('Carne com Berinjela', 'Medalhoes de carne com berinjela grelhada', 'Low Carb', 320, 120, true, 8),
  -- Fit
  ('Frango com Batata Doce', 'Peito de frango grelhado com batata doce e salada', 'Fit', 320, 120, true, 9),
  ('Carne com Arroz Integral', 'Patinho grelhado com arroz integral e legumes', 'Fit', 320, 120, true, 10),
  ('Frango com Quinoa', 'Frango desfiado com quinoa e legumes salteados', 'Fit', 320, 120, true, 11),
  ('Tilapia com Arroz Integral', 'File de tilapia com arroz integral e brocolis', 'Fit', 320, 120, true, 12),
  ('Frango com Mandioquinha', 'Sobrecoxa de frango com pure de mandioquinha', 'Fit', 320, 120, true, 13),
  ('Carne com Grao de Bico', 'Carne bovina com grao de bico e legumes', 'Fit', 320, 120, true, 14),
  ('Frango Teriyaki com Arroz', 'Frango ao molho teriyaki com arroz integral', 'Fit', 320, 120, true, 15),
  ('Salmao com Batata Doce', 'Salmao grelhado com batata doce rostizada', 'Fit', 320, 120, true, 16);
