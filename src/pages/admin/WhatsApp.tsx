import { useState, useRef, useEffect } from "react";
import {
  Search,
  Phone,
  ArrowLeft,
  Send,
  Bot,
  UserRound,
  Check,
  CheckCheck,
  Wifi,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// ---------------------------------------------------------------------------
// TODO: Replace mock data with Supabase Realtime subscriptions.
// Example:
//   const channel = supabase.channel("whatsapp-messages")
//     .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, handler)
//     .subscribe();
//
// TODO: Integrate with WhatsApp Business API (Evolution API / Z-API) for
//   real message send/receive.
// ---------------------------------------------------------------------------

type ConversationFilter = "todos" | "bot" | "humano";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  direction: "inbound" | "outbound";
  status?: "sent" | "delivered" | "read";
}

interface Conversation {
  id: string;
  customerName: string;
  phone: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  mode: "bot" | "humano";
  messages: Message[];
  avatarInitials: string;
}

// -- Mock conversations -----------------------------------------------------
const mockConversations: Conversation[] = [
  {
    id: "1",
    customerName: "Maria Silva",
    phone: "(11) 99876-5432",
    lastMessage: "Quero fazer um pedido de marmita fitness",
    lastMessageTime: "14:32",
    unreadCount: 3,
    mode: "bot",
    avatarInitials: "MS",
    messages: [
      { id: "1a", text: "Oi! Boa tarde!", timestamp: "14:28", direction: "inbound" },
      { id: "1b", text: "Ola Maria! Bem-vinda a IsaFood! Como posso ajudar?", timestamp: "14:28", direction: "outbound", status: "read" },
      { id: "1c", text: "Quero ver o cardapio de hoje", timestamp: "14:30", direction: "inbound" },
      { id: "1d", text: "Claro! Hoje temos: Frango Grelhado com Batata Doce (R$28), Salmao com Legumes (R$38), Bowl Proteico (R$32). Qual te interessa?", timestamp: "14:30", direction: "outbound", status: "read" },
      { id: "1e", text: "Quero fazer um pedido de marmita fitness", timestamp: "14:32", direction: "inbound" },
    ],
  },
  {
    id: "2",
    customerName: "Joao Santos",
    phone: "(11) 98765-1234",
    lastMessage: "Meu pedido ainda nao chegou",
    lastMessageTime: "14:15",
    unreadCount: 1,
    mode: "humano",
    avatarInitials: "JS",
    messages: [
      { id: "2a", text: "Oi, fiz um pedido ha 1 hora e ainda nao chegou", timestamp: "14:00", direction: "inbound" },
      { id: "2b", text: "Ola Joao! Vou verificar o status do seu pedido. Um momento, por favor.", timestamp: "14:01", direction: "outbound", status: "read" },
      { id: "2c", text: "Seu pedido #1847 esta com o entregador e deve chegar em 15 minutos.", timestamp: "14:02", direction: "outbound", status: "read" },
      { id: "2d", text: "Ja passaram 15 minutos...", timestamp: "14:10", direction: "inbound" },
      { id: "2e", text: "Meu pedido ainda nao chegou", timestamp: "14:15", direction: "inbound" },
    ],
  },
  {
    id: "3",
    customerName: "Ana Oliveira",
    phone: "(11) 97654-3210",
    lastMessage: "Obrigada! Vou pedir amanha tambem",
    lastMessageTime: "13:45",
    unreadCount: 0,
    mode: "bot",
    avatarInitials: "AO",
    messages: [
      { id: "3a", text: "Oi! Quais opcoes low carb voces tem?", timestamp: "13:30", direction: "inbound" },
      { id: "3b", text: "Ola Ana! Nossas opcoes low carb sao: Frango com Brocolis (R$26), Carne com Abobrinha (R$30), Omelete Proteica (R$22). Todas com menos de 15g de carboidrato!", timestamp: "13:31", direction: "outbound", status: "read" },
      { id: "3c", text: "Quero o Frango com Brocolis por favor!", timestamp: "13:35", direction: "inbound" },
      { id: "3d", text: "Anotado! Frango com Brocolis - R$26. Entrega para o mesmo endereco de sempre?", timestamp: "13:35", direction: "outbound", status: "read" },
      { id: "3e", text: "Sim, mesmo endereco!", timestamp: "13:40", direction: "inbound" },
      { id: "3f", text: "Pedido confirmado! Previsao de entrega: 45 minutos. Obrigada pela preferencia!", timestamp: "13:40", direction: "outbound", status: "read" },
      { id: "3g", text: "Obrigada! Vou pedir amanha tambem", timestamp: "13:45", direction: "inbound" },
    ],
  },
  {
    id: "4",
    customerName: "Carlos Mendes",
    phone: "(11) 96543-2109",
    lastMessage: "Tem opcao sem gluten?",
    lastMessageTime: "13:20",
    unreadCount: 1,
    mode: "bot",
    avatarInitials: "CM",
    messages: [
      { id: "4a", text: "Boa tarde! Tem opcao sem gluten?", timestamp: "13:20", direction: "inbound" },
    ],
  },
  {
    id: "5",
    customerName: "Patricia Lima",
    phone: "(11) 95432-1098",
    lastMessage: "Quero cancelar meu pedido",
    lastMessageTime: "12:50",
    unreadCount: 2,
    mode: "humano",
    avatarInitials: "PL",
    messages: [
      { id: "5a", text: "Preciso cancelar meu pedido #1842", timestamp: "12:40", direction: "inbound" },
      { id: "5b", text: "Ola Patricia! Vou verificar se ainda e possivel cancelar. Aguarde um instante.", timestamp: "12:41", direction: "outbound", status: "read" },
      { id: "5c", text: "Patricia, infelizmente o pedido ja esta em preparo. Posso ajudar de outra forma?", timestamp: "12:45", direction: "outbound", status: "delivered" },
      { id: "5d", text: "Quero cancelar meu pedido", timestamp: "12:50", direction: "inbound" },
    ],
  },
  {
    id: "6",
    customerName: "Roberto Alves",
    phone: "(11) 94321-0987",
    lastMessage: "Perfeito, obrigado!",
    lastMessageTime: "12:30",
    unreadCount: 0,
    mode: "bot",
    avatarInitials: "RA",
    messages: [
      { id: "6a", text: "Qual o horario de entrega?", timestamp: "12:20", direction: "inbound" },
      { id: "6b", text: "Nosso horario de entrega e das 11h as 14h e das 18h as 21h, de segunda a sabado!", timestamp: "12:20", direction: "outbound", status: "read" },
      { id: "6c", text: "Perfeito, obrigado!", timestamp: "12:30", direction: "inbound" },
    ],
  },
  {
    id: "7",
    customerName: "Fernanda Costa",
    phone: "(11) 93210-9876",
    lastMessage: "Quero 2 marmitas de frango e 1 de carne",
    lastMessageTime: "12:10",
    unreadCount: 1,
    mode: "bot",
    avatarInitials: "FC",
    messages: [
      { id: "7a", text: "Oi! Quero fazer pedido para escritorio", timestamp: "12:00", direction: "inbound" },
      { id: "7b", text: "Ola Fernanda! Claro, quantas marmitas voce gostaria?", timestamp: "12:01", direction: "outbound", status: "read" },
      { id: "7c", text: "Quero 2 marmitas de frango e 1 de carne", timestamp: "12:10", direction: "inbound" },
    ],
  },
  {
    id: "8",
    customerName: "Lucas Ferreira",
    phone: "(11) 92109-8765",
    lastMessage: "Voces aceitam PIX?",
    lastMessageTime: "11:55",
    unreadCount: 1,
    mode: "bot",
    avatarInitials: "LF",
    messages: [
      { id: "8a", text: "Voces aceitam PIX?", timestamp: "11:55", direction: "inbound" },
    ],
  },
  {
    id: "9",
    customerName: "Beatriz Rocha",
    phone: "(11) 91098-7654",
    lastMessage: "Adorei a marmita de ontem!",
    lastMessageTime: "11:30",
    unreadCount: 0,
    mode: "bot",
    avatarInitials: "BR",
    messages: [
      { id: "9a", text: "Adorei a marmita de ontem!", timestamp: "11:30", direction: "inbound" },
      { id: "9b", text: "Que bom que gostou, Beatriz! Ficamos muito felizes! Hoje temos novidades no cardapio, quer ver?", timestamp: "11:31", direction: "outbound", status: "read" },
    ],
  },
  {
    id: "10",
    customerName: "Diego Nunes",
    phone: "(11) 90987-6543",
    lastMessage: "Entregam na Vila Mariana?",
    lastMessageTime: "11:00",
    unreadCount: 1,
    mode: "bot",
    avatarInitials: "DN",
    messages: [
      { id: "10a", text: "Boa tarde! Entregam na Vila Mariana?", timestamp: "11:00", direction: "inbound" },
    ],
  },
];

function StatusIcon({ status }: { status?: string }) {
  if (status === "read") return <CheckCheck className="h-3.5 w-3.5 text-blue-500" />;
  if (status === "delivered") return <CheckCheck className="h-3.5 w-3.5 text-gray-400" />;
  return <Check className="h-3.5 w-3.5 text-gray-400" />;
}

export default function WhatsApp() {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ConversationFilter>("todos");
  const [search, setSearch] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  // TODO: Replace with Supabase Realtime connection status
  const isConnected = true;

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const filtered = conversations
    .filter((c) => {
      if (filter === "bot") return c.mode === "bot";
      if (filter === "humano") return c.mode === "humano";
      return true;
    })
    .filter((c) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.customerName.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
      );
    });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages.length]);

  function handleTakeOver() {
    if (!selected) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === selected.id ? { ...c, mode: "humano" } : c))
    );
  }

  function handleReturnToBot() {
    if (!selected) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === selected.id ? { ...c, mode: "bot" } : c))
    );
  }

  function handleSend() {
    if (!selected || !inputMessage.trim() || selected.mode !== "humano") return;
    const newMsg: Message = {
      id: `${selected.id}-${Date.now()}`,
      text: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      direction: "outbound",
      status: "sent",
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? {
              ...c,
              messages: [...c.messages, newMsg],
              lastMessage: newMsg.text,
              lastMessageTime: newMsg.timestamp,
            }
          : c
      )
    );
    setInputMessage("");
  }

  function handleSelectConversation(id: string) {
    setSelectedId(id);
    // Mark as read
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  }

  // ---- Conversation list panel ----
  const listPanel = (
    <div className={`flex flex-col h-full bg-white ${selectedId ? "hidden lg:flex" : "flex"} lg:w-[380px] lg:border-r border-gray-200`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold font-['Sora'] text-gray-800">WhatsApp</h1>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-red-500"}`} />
            {isConnected ? "Conectado" : "Desconectado"}
          </span>
        </div>
        {totalUnread > 0 && (
          <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white text-xs">
            {totalUnread}
          </Badge>
        )}
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar conversa..."
            className="pl-9 h-9 text-sm bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 px-3 pb-2">
        {(["todos", "bot", "humano"] as ConversationFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
              filter === f
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {f === "todos" ? "Todos" : f === "bot" ? "Bot" : "Humano"}
          </button>
        ))}
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-gray-50">
          {filtered.map((conv) => (
            <button
              key={conv.id}
              onClick={() => handleSelectConversation(conv.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                selectedId === conv.id ? "bg-emerald-50" : ""
              }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0 h-11 w-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold font-['Sora']">
                {conv.avatarInitials}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800 truncate font-['Plus_Jakarta_Sans']">
                    {conv.customerName}
                  </span>
                  <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">
                    {conv.lastMessageTime}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-gray-500 truncate pr-2">{conv.lastMessage}</p>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {conv.mode === "humano" && (
                      <UserRound className="h-3.5 w-3.5 text-amber-500" />
                    )}
                    {conv.mode === "bot" && (
                      <Bot className="h-3.5 w-3.5 text-blue-400" />
                    )}
                    {conv.unreadCount > 0 && (
                      <span className="flex items-center justify-center h-5 min-w-[20px] rounded-full bg-emerald-600 text-white text-[10px] font-bold px-1">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-400">
              Nenhuma conversa encontrada
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  // ---- Chat panel ----
  const chatPanel = selected ? (
    <div className={`flex flex-col h-full bg-[#e5ddd5] ${!selectedId ? "hidden lg:flex" : "flex"} flex-1`}>
      {/* Chat header */}
      <div className="flex items-center gap-3 px-3 py-2.5 bg-emerald-700 text-white">
        <button
          onClick={() => setSelectedId(null)}
          className="lg:hidden p-1 -ml-1"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-semibold font-['Sora']">
          {selected.avatarInitials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate font-['Plus_Jakarta_Sans']">
            {selected.customerName}
          </p>
          <p className="text-[11px] text-emerald-200 flex items-center gap-1">
            <Phone className="h-3 w-3" /> {selected.phone}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {selected.mode === "bot" ? (
            <Button
              size="sm"
              variant="secondary"
              className="h-8 text-xs bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={handleTakeOver}
            >
              <UserRound className="h-3.5 w-3.5 mr-1" />
              Assumir
            </Button>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              className="h-8 text-xs bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={handleReturnToBot}
            >
              <Bot className="h-3.5 w-3.5 mr-1" />
              Devolver ao bot
            </Button>
          )}
        </div>
      </div>

      {/* Mode indicator */}
      <div className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium ${
        selected.mode === "humano"
          ? "bg-amber-100 text-amber-700"
          : "bg-blue-50 text-blue-600"
      }`}>
        {selected.mode === "humano" ? (
          <>
            <UserRound className="h-3.5 w-3.5" />
            Atendimento humano ativo
          </>
        ) : (
          <>
            <Bot className="h-3.5 w-3.5" />
            Bot respondendo automaticamente
          </>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="max-w-2xl mx-auto space-y-2">
          {selected.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-[80%] px-3 py-2 rounded-lg text-sm shadow-sm ${
                  msg.direction === "outbound"
                    ? "bg-[#dcf8c6] text-gray-800 rounded-tr-none"
                    : "bg-white text-gray-800 rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap break-words font-['Plus_Jakarta_Sans']">
                  {msg.text}
                </p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                  {msg.direction === "outbound" && <StatusIcon status={msg.status} />}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 px-3 py-2.5">
        {selected.mode === "humano" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Digite uma mensagem..."
              className="flex-1 h-10 text-sm"
              autoFocus
            />
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 rounded-full bg-emerald-600 hover:bg-emerald-700"
              disabled={!inputMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        ) : (
          <div className="text-center py-2 text-sm text-gray-400 font-['Plus_Jakarta_Sans']">
            Bot esta respondendo. Clique em "Assumir" para enviar mensagens.
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="hidden lg:flex flex-1 items-center justify-center bg-[#f0ebe3]">
      <div className="text-center">
        <Wifi className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-400 font-['Sora']">
          IsaFood WhatsApp
        </h2>
        <p className="text-sm text-gray-400 mt-1 font-['Plus_Jakarta_Sans']">
          Selecione uma conversa para comecar
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-56px)] lg:h-[calc(100vh-0px)] -m-4 lg:-m-6 overflow-hidden">
      {listPanel}
      {chatPanel}
    </div>
  );
}
