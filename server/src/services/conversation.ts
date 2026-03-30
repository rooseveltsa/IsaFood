import { sendText } from './evolution.js';
import {
  getOrCreateCustomer,
  updateCustomerActive,
  getMenuItems,
  getKits,
  createOrder,
  getCustomerOrders,
  updateConversationState,
  getConversation,
  logMessage,
  type MenuItem,
  type Kit,
} from './supabase.js';
import {
  getConversationState,
  setConversationState,
  deleteConversationState,
} from './redis.js';

// --- Types ---

type State =
  | 'idle'
  | 'greeting'
  | 'browsing_menu'
  | 'selecting_kit'
  | 'selecting_items'
  | 'collecting_address'
  | 'collecting_date'
  | 'confirming_order'
  | 'awaiting_payment'
  | 'human_handoff';

interface StateData {
  name?: string;
  customerId?: string;
  selectedKit?: { id: string; name: string; quantity: number; priceCents: number };
  selectedItems?: Array<{ menuItemId: string; name: string; quantity: number }>;
  itemsRemaining?: number;
  address?: string;
  deliveryDate?: string;
  unrecognizedCount?: number;
  menuItems?: Array<{ id: string; name: string; category: string; index: number }>;
}

const PIX_KEY = process.env.PIX_KEY || '37152661120';

// --- Main Entry Point ---

export async function processMessage(
  phone: string,
  text: string,
  pushName: string,
): Promise<void> {
  // Get or create customer
  const customer = await getOrCreateCustomer(phone, pushName);

  // Check for opt-out
  if (text.toUpperCase() === 'SAIR') {
    await handleOptOut(phone, customer.id);
    return;
  }

  // Get current state from Redis (fast) or Supabase (fallback)
  let currentState: State = 'idle';
  let stateData: StateData = {};

  const redisState = await getConversationState(phone);
  if (redisState) {
    currentState = redisState.state as State;
    stateData = redisState.data as StateData;
  } else {
    const dbConv = await getConversation(phone);
    if (dbConv && dbConv.state !== 'idle') {
      currentState = dbConv.state as State;
      stateData = (dbConv.state_data || {}) as StateData;
    }
  }

  // If in human handoff, don't process (let admin handle)
  if (currentState === 'human_handoff') {
    return;
  }

  // Store customer info in state
  stateData.name = pushName;
  stateData.customerId = customer.id;

  // Log inbound message
  const conv = await updateConversationState(phone, currentState, stateData as Record<string, unknown>);
  await logMessage(conv.id, phone, 'inbound', text);

  // Route to state handler
  const handler = stateHandlers[currentState] || handleIdle;
  await handler(phone, text, stateData);
}

// --- State Handlers ---

const stateHandlers: Record<State, (phone: string, text: string, data: StateData) => Promise<void>> = {
  idle: handleIdle,
  greeting: handleGreeting,
  browsing_menu: handleBrowsingMenu,
  selecting_kit: handleSelectingKit,
  selecting_items: handleSelectingItems,
  collecting_address: handleCollectingAddress,
  collecting_date: handleCollectingDate,
  confirming_order: handleConfirmingOrder,
  awaiting_payment: handleAwaitingPayment,
  human_handoff: handleHumanHandoff,
};

async function handleIdle(phone: string, _text: string, data: StateData): Promise<void> {
  const name = data.name || 'Cliente';

  const greeting = [
    `Ola ${name}! Bem-vindo(a) a *Isa Fitness* - Marmitas Fitness em Brasilia!`,
    '',
    'Como posso ajudar?',
    '1\u20E3 Ver cardapio',
    '2\u20E3 Fazer pedido',
    '3\u20E3 Status do meu pedido',
    '4\u20E3 Falar com a Isa',
  ].join('\n');

  await reply(phone, greeting, 'greeting', data);
}

async function handleGreeting(phone: string, text: string, data: StateData): Promise<void> {
  const input = text.trim();

  if (input === '1') {
    await showMenu(phone, data);
  } else if (input === '2' || input.toUpperCase() === 'PEDIR') {
    await showKitOptions(phone, data);
  } else if (input === '3') {
    await showOrderStatus(phone, data);
  } else if (input === '4') {
    await startHumanHandoff(phone, data);
  } else {
    await handleUnrecognized(phone, text, data, 'greeting');
  }
}

async function handleBrowsingMenu(phone: string, text: string, data: StateData): Promise<void> {
  const input = text.trim().toUpperCase();

  if (input === 'PEDIR' || input === '2') {
    await showKitOptions(phone, data);
  } else if (input === '4') {
    await startHumanHandoff(phone, data);
  } else {
    await handleUnrecognized(phone, text, data, 'browsing_menu');
  }
}

async function handleSelectingKit(phone: string, text: string, data: StateData): Promise<void> {
  const input = text.trim();

  const kits = await getKits();
  const kitIndex = parseInt(input, 10) - 1;

  if (isNaN(kitIndex) || kitIndex < 0 || kitIndex >= kits.length) {
    await reply(
      phone,
      `Por favor, escolha um kit valido (1 a ${kits.length}).`,
      'selecting_kit',
      data,
    );
    return;
  }

  const selectedKit = kits[kitIndex];
  data.selectedKit = {
    id: selectedKit.id,
    name: selectedKit.name,
    quantity: selectedKit.quantity,
    priceCents: selectedKit.price_cents,
  };
  data.selectedItems = [];
  data.itemsRemaining = selectedKit.quantity;

  // Load menu items for selection
  const menuItems = await getMenuItems();
  const indexedItems = menuItems.map((item, i) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    index: i + 1,
  }));
  data.menuItems = indexedItems;

  const menuText = formatMenuForSelection(menuItems);

  const message = [
    `Voce escolheu *${selectedKit.name}* (${selectedKit.quantity} marmitas).`,
    '',
    'Agora escolha suas marmitas pelo numero:',
    '',
    menuText,
    '',
    `Envie os numeros das marmitas que deseja (${selectedKit.quantity} no total).`,
    'Exemplo: 1, 3, 5, 7',
    'Ou envie um numero por vez.',
  ].join('\n');

  await reply(phone, message, 'selecting_items', data);
}

async function handleSelectingItems(phone: string, text: string, data: StateData): Promise<void> {
  const input = text.trim();
  const menuItems = data.menuItems || [];

  if (!data.selectedItems) data.selectedItems = [];
  if (data.itemsRemaining === undefined) data.itemsRemaining = data.selectedKit?.quantity || 0;

  // Parse numbers from input (supports "1, 3, 5" or "1 3 5" or single "1")
  const numbers = input
    .split(/[\s,]+/)
    .map((n) => parseInt(n.trim(), 10))
    .filter((n) => !isNaN(n));

  if (numbers.length === 0) {
    if (input.toUpperCase() === 'PRONTO' && data.selectedItems.length > 0) {
      // Fill remaining with last selected item or ask again
      await askForAddress(phone, data);
      return;
    }
    await reply(
      phone,
      'Por favor, envie os numeros das marmitas que deseja.',
      'selecting_items',
      data,
    );
    return;
  }

  // Validate and add items
  const invalidNumbers: number[] = [];

  for (const num of numbers) {
    if (data.itemsRemaining! <= 0) break;

    const menuItem = menuItems.find((m) => m.index === num);
    if (!menuItem) {
      invalidNumbers.push(num);
      continue;
    }

    // Check if already selected, increment quantity
    const existing = data.selectedItems.find((i) => i.menuItemId === menuItem.id);
    if (existing) {
      existing.quantity++;
    } else {
      data.selectedItems.push({
        menuItemId: menuItem.id,
        name: menuItem.name,
        quantity: 1,
      });
    }
    data.itemsRemaining!--;
  }

  if (invalidNumbers.length > 0) {
    await reply(
      phone,
      `Numeros invalidos: ${invalidNumbers.join(', ')}. Confira o cardapio e tente novamente.`,
      'selecting_items',
      data,
    );
    return;
  }

  if (data.itemsRemaining! > 0) {
    const selectedSummary = data.selectedItems
      .map((i) => `  ${i.name} x${i.quantity}`)
      .join('\n');

    await reply(
      phone,
      [
        `Selecionadas ate agora:\n${selectedSummary}`,
        '',
        `Faltam *${data.itemsRemaining}* marmitas. Continue enviando os numeros.`,
        'Ou envie *PRONTO* para preencher as restantes com a ultima escolha.',
      ].join('\n'),
      'selecting_items',
      data,
    );
    return;
  }

  // All items selected
  await askForAddress(phone, data);
}

async function handleCollectingAddress(phone: string, text: string, data: StateData): Promise<void> {
  const address = text.trim();

  if (address.length < 10) {
    await reply(
      phone,
      'Por favor, informe seu endereco completo (rua, numero, bairro, complemento).',
      'collecting_address',
      data,
    );
    return;
  }

  data.address = address;

  await reply(
    phone,
    'Para quando gostaria da entrega? (ex: amanha, segunda, proxima quarta)',
    'collecting_date',
    data,
  );
}

async function handleCollectingDate(phone: string, text: string, data: StateData): Promise<void> {
  const deliveryDate = text.trim();

  if (deliveryDate.length < 3) {
    await reply(
      phone,
      'Por favor, informe uma data de entrega valida. (ex: amanha, segunda)',
      'collecting_date',
      data,
    );
    return;
  }

  data.deliveryDate = deliveryDate;

  // Build order summary
  const kit = data.selectedKit!;
  const priceFormatted = formatCurrency(kit.priceCents);
  const itemsList = (data.selectedItems || [])
    .map((i) => `  - ${i.name} x${i.quantity}`)
    .join('\n');

  const summary = [
    '*RESUMO DO PEDIDO*',
    `Kit: ${kit.name}`,
    `Itens: ${kit.quantity} marmitas`,
    itemsList,
    `Endereco: ${data.address}`,
    `Entrega: ${data.deliveryDate}`,
    `Total: *${priceFormatted}*`,
    '',
    'Confirma? Responda *SIM*',
  ].join('\n');

  await reply(phone, summary, 'confirming_order', data);
}

async function handleConfirmingOrder(phone: string, text: string, data: StateData): Promise<void> {
  const input = text.trim().toUpperCase();

  if (input === 'SIM' || input === 'S' || input === 'CONFIRMO') {
    try {
      const items = (data.selectedItems || []).map((i) => ({
        menuItemId: i.menuItemId,
        quantity: i.quantity,
      }));

      const order = await createOrder(
        data.customerId!,
        data.selectedKit!.id,
        items,
        data.address!,
        data.deliveryDate,
        data.selectedKit!.priceCents,
      );

      const priceFormatted = formatCurrency(data.selectedKit!.priceCents);
      const orderNumber = order.order_number || order.id.slice(0, 6).toUpperCase();

      const confirmation = [
        `Pedido #${orderNumber} criado!`,
        '',
        '*Pix para pagamento:*',
        `Chave: ${PIX_KEY}`,
        `Valor: ${priceFormatted}`,
        '',
        'Apos pagar, envie o comprovante aqui!',
        'Obrigada pela preferencia!',
      ].join('\n');

      await reply(phone, confirmation, 'awaiting_payment', {});
    } catch (error) {
      console.error('Error creating order:', error);
      await reply(
        phone,
        'Desculpe, houve um erro ao criar seu pedido. Vou transferir para a Isa.',
        'human_handoff',
        data,
        true,
      );
    }
  } else if (input === 'NAO' || input === 'N' || input === 'CANCELAR') {
    await reply(
      phone,
      'Pedido cancelado. Se quiser recomecar, e so me chamar!',
      'idle',
      {},
    );
    await deleteConversationState(phone);
  } else {
    await reply(
      phone,
      'Por favor, responda *SIM* para confirmar ou *NAO* para cancelar.',
      'confirming_order',
      data,
    );
  }
}

async function handleAwaitingPayment(phone: string, _text: string, data: StateData): Promise<void> {
  // Any message while awaiting payment -> forward to human
  await reply(
    phone,
    'Recebemos sua mensagem! A Isa vai confirmar seu pagamento em breve.',
    'human_handoff',
    data,
    true,
  );
}

async function handleHumanHandoff(_phone: string, _text: string, _data: StateData): Promise<void> {
  // Do nothing - human is handling
}

// --- Helper Functions ---

async function showMenu(phone: string, data: StateData): Promise<void> {
  const menuItems = await getMenuItems();

  if (menuItems.length === 0) {
    await reply(phone, 'O cardapio esta sendo atualizado. Tente novamente em breve!', 'greeting', data);
    return;
  }

  const menuText = formatMenuDisplay(menuItems);

  const message = [
    '*CARDAPIO ISA FITNESS*',
    '',
    menuText,
    '',
    'Todas as marmitas: 300-340g | 120g proteina',
    '',
    'Quer fazer um pedido? Responda *PEDIR*',
  ].join('\n');

  await reply(phone, message, 'browsing_menu', data);
}

async function showKitOptions(phone: string, data: StateData): Promise<void> {
  const kits = await getKits();

  if (kits.length === 0) {
    await reply(phone, 'Os kits estao sendo atualizados. Tente novamente em breve!', 'greeting', data);
    return;
  }

  const kitLines = kits.map((kit, i) => {
    const price = formatCurrency(kit.price_cents);
    const unitPrice = formatCurrency(Math.round(kit.price_cents / kit.quantity));
    let line = `${i + 1}\u20E3 ${kit.name} - ${price} (${unitPrice}/un)`;

    // Add badges for specific kits
    if (kit.quantity === 20) line += ' \u2B50 MAIS VENDIDO';
    if (kit.quantity === 40) line += ' \uD83D\uDD25 PROMOCAO';

    return line;
  });

  const message = [
    'Escolha seu kit:',
    ...kitLines,
  ].join('\n');

  await reply(phone, message, 'selecting_kit', data);
}

async function showOrderStatus(phone: string, data: StateData): Promise<void> {
  const orders = await getCustomerOrders(phone);

  if (orders.length === 0) {
    await reply(
      phone,
      'Voce ainda nao tem pedidos. Quer fazer um? Responda *PEDIR*',
      'greeting',
      data,
    );
    return;
  }

  const latest = orders[0];
  const statusMap: Record<string, string> = {
    pending_payment: 'Aguardando pagamento',
    confirmed: 'Confirmado',
    preparing: 'Em preparo',
    ready: 'Pronto para entrega',
    delivering: 'Saiu para entrega',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };

  const statusText = statusMap[latest.status] || latest.status;
  const orderNumber = latest.order_number || latest.id.slice(0, 6).toUpperCase();
  const total = formatCurrency(latest.total_cents);

  const message = [
    '*STATUS DO PEDIDO*',
    `Pedido: #${orderNumber}`,
    `Status: ${statusText}`,
    `Total: ${total}`,
    latest.delivery_date ? `Entrega: ${latest.delivery_date}` : '',
    '',
    'Precisa de algo mais? Responda com o numero da opcao.',
  ]
    .filter(Boolean)
    .join('\n');

  await reply(phone, message, 'greeting', data);
}

async function startHumanHandoff(phone: string, data: StateData): Promise<void> {
  await reply(
    phone,
    'Vou transferir voce para a Isa. Aguarde um momento!',
    'human_handoff',
    data,
    true,
  );
}

async function handleOptOut(phone: string, _customerId: string): Promise<void> {
  await updateCustomerActive(phone, false);
  await sendText(phone, 'Voce foi removido da nossa lista. Para voltar, e so nos chamar! Ate mais!');
  await updateConversationState(phone, 'idle', {});
  await deleteConversationState(phone);
}

async function handleUnrecognized(
  phone: string,
  _text: string,
  data: StateData,
  currentState: State,
): Promise<void> {
  const count = (data.unrecognizedCount || 0) + 1;
  data.unrecognizedCount = count;

  if (count >= 2) {
    // After 2 unrecognized attempts, hand off to human
    await startHumanHandoff(phone, data);
    return;
  }

  await reply(
    phone,
    'Desculpe, nao entendi. Por favor, responda com o numero da opcao desejada.',
    currentState,
    data,
  );
}

async function askForAddress(phone: string, data: StateData): Promise<void> {
  const selectedSummary = (data.selectedItems || [])
    .map((i) => `  - ${i.name} x${i.quantity}`)
    .join('\n');

  await reply(
    phone,
    [
      'Otimo! Suas marmitas:',
      selectedSummary,
      '',
      'Qual seu endereco completo para entrega?',
    ].join('\n'),
    'collecting_address',
    data,
  );
}

// --- Utilities ---

async function reply(
  phone: string,
  message: string,
  newState: State,
  data: StateData,
  isHumanHandoff = false,
): Promise<void> {
  // Send the message
  await sendText(phone, message);

  // Update state in Redis (fast)
  await setConversationState(phone, newState, data as Record<string, unknown>);

  // Update state in Supabase (persistent)
  const conv = await updateConversationState(
    phone,
    newState,
    data as Record<string, unknown>,
    isHumanHandoff,
  );

  // Log outbound message
  await logMessage(conv.id, phone, 'outbound', message);
}

function formatCurrency(cents: number): string {
  const reais = (cents / 100).toFixed(2).replace('.', ',');
  return `R$ ${reais}`;
}

function formatMenuDisplay(items: MenuItem[]): string {
  const grouped: Record<string, MenuItem[]> = {};

  for (const item of items) {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  }

  const lines: string[] = [];
  let index = 1;

  for (const [category, categoryItems] of Object.entries(grouped)) {
    lines.push(`*${category.toUpperCase()}*`);
    for (const item of categoryItems) {
      lines.push(`${index}. ${item.name}`);
      index++;
    }
    lines.push('');
  }

  return lines.join('\n').trim();
}

function formatMenuForSelection(items: MenuItem[]): string {
  const grouped: Record<string, Array<MenuItem & { index: number }>> = {};

  items.forEach((item, i) => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push({ ...item, index: i + 1 });
  });

  const lines: string[] = [];

  for (const [category, categoryItems] of Object.entries(grouped)) {
    lines.push(`*${category.toUpperCase()}*`);
    for (const item of categoryItems) {
      lines.push(`${item.index}. ${item.name}`);
    }
    lines.push('');
  }

  return lines.join('\n').trim();
}
