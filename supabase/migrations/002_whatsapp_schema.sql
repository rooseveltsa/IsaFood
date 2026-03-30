-- ============================================================================
-- IsaFood - WhatsApp Automation Schema
-- Migration 002
-- ============================================================================

-- =========================
-- TABLES
-- =========================

-- Conversations: tracks the state machine for each WhatsApp phone session
CREATE TABLE whatsapp_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  phone TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'idle',
  state_data JSONB NOT NULL DEFAULT '{}',
  is_human_handoff BOOLEAN NOT NULL DEFAULT false,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_whatsapp_conversations_phone ON whatsapp_conversations(phone);

-- Messages: full log of inbound and outbound WhatsApp messages
CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES whatsapp_conversations(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  message_type TEXT NOT NULL DEFAULT 'text',
  content TEXT,
  media_url TEXT,
  evolution_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_whatsapp_messages_conversation ON whatsapp_messages(conversation_id);
CREATE INDEX idx_whatsapp_messages_phone ON whatsapp_messages(phone);

-- Templates: reusable message templates for campaigns and notifications
CREATE TABLE whatsapp_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'marketing',
  content TEXT NOT NULL,
  media_url TEXT,
  variables TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_whatsapp_templates_name ON whatsapp_templates(name);

-- Campaigns: bulk message sends to filtered audiences
CREATE TABLE whatsapp_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES whatsapp_templates(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  audience_filter JSONB NOT NULL DEFAULT '{}',
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  total_recipients INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'scheduled', 'sending', 'completed', 'cancelled')),
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notification queue: lightweight internal queue for async notifications
CREATE TABLE notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  processed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notification_queue_pending ON notification_queue(processed, created_at)
  WHERE processed = false;

-- =========================
-- ROW LEVEL SECURITY
-- =========================

ALTER TABLE whatsapp_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users full access on whatsapp_conversations"
  ON whatsapp_conversations FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access on whatsapp_messages"
  ON whatsapp_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access on whatsapp_templates"
  ON whatsapp_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access on whatsapp_campaigns"
  ON whatsapp_campaigns FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access on notification_queue"
  ON notification_queue FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Service role needs direct access to notification_queue (webhook server)
CREATE POLICY "Service role full access on notification_queue"
  ON notification_queue FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =========================
-- REALTIME
-- =========================

ALTER PUBLICATION supabase_realtime ADD TABLE whatsapp_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE whatsapp_conversations;

-- =========================
-- TRIGGER: Order Status -> Notification Queue
-- =========================

CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order RECORD;
  v_customer_phone TEXT;
BEGIN
  -- Fetch the order and customer phone for the notification payload
  SELECT
    o.id AS order_id,
    o.order_number,
    o.customer_id,
    o.total,
    c.name AS customer_name,
    c.phone AS customer_phone
  INTO v_order
  FROM orders o
  JOIN customers c ON c.id = o.customer_id
  WHERE o.id = NEW.order_id;

  -- Only enqueue if we found the order
  IF FOUND THEN
    INSERT INTO notification_queue (type, payload)
    VALUES (
      'order_status_change',
      jsonb_build_object(
        'order_id',        v_order.order_id,
        'order_number',    v_order.order_number,
        'customer_id',     v_order.customer_id,
        'customer_name',   v_order.customer_name,
        'customer_phone',  v_order.customer_phone,
        'from_status',     NEW.from_status,
        'to_status',       NEW.to_status,
        'total',           v_order.total,
        'changed_at',      NEW.created_at
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_order_status_notify
  AFTER INSERT ON order_status_history
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_status_change();
