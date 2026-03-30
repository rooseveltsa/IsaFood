import { useState } from "react";
import {
  Plus,
  Send,
  Clock,
  CheckCircle2,
  FileEdit,
  Loader2,
  ArrowLeft,
  Image,
  Calendar,
  Users,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

// ---------------------------------------------------------------------------
// TODO: Replace mock data with Supabase queries via @tanstack/react-query.
// Example:
//   const { data: campaigns } = useQuery({
//     queryKey: ["admin", "campaigns"],
//     queryFn: () => supabase.from("campaigns").select("*").order("created_at", { ascending: false }),
//   });
//
// TODO: Integrate with WhatsApp Business API for actual message dispatch.
// TODO: Implement real audience filtering via Supabase RPC or Edge Function.
// ---------------------------------------------------------------------------

type CampaignStatus = "rascunho" | "agendada" | "enviando" | "concluida";

interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  sentCount: number;
  totalCount: number;
  failedCount: number;
  scheduledAt: string | null;
  createdAt: string;
  message: string;
  mediaUrl?: string;
}

const statusConfig: Record<CampaignStatus, { label: string; color: string; icon: React.ElementType }> = {
  rascunho: { label: "Rascunho", color: "bg-gray-100 text-gray-600", icon: FileEdit },
  agendada: { label: "Agendada", color: "bg-blue-100 text-blue-700", icon: Clock },
  enviando: { label: "Enviando", color: "bg-amber-100 text-amber-700", icon: Loader2 },
  concluida: { label: "Concluida", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
};

// -- Mock campaigns ----------------------------------------------------------
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Promo Verao Fitness",
    status: "concluida",
    sentCount: 342,
    totalCount: 350,
    failedCount: 8,
    scheduledAt: null,
    createdAt: "2026-03-25",
    message: "Oi {nome}! Aproveite nossa promo de verao: 20% OFF em todas as marmitas fitness ate sexta! Use o codigo VERAO20. Peca ja!",
  },
  {
    id: "2",
    name: "Novo Cardapio Semanal",
    status: "enviando",
    sentCount: 189,
    totalCount: 420,
    failedCount: 3,
    scheduledAt: null,
    createdAt: "2026-03-28",
    message: "Ola {nome}! Novidades no cardapio desta semana: Bowl de Quinoa, Salmao Grelhado e Wrap Proteico. Confira!",
    mediaUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
  },
  {
    id: "3",
    name: "Fidelidade - 5 pedidos",
    status: "agendada",
    sentCount: 0,
    totalCount: 156,
    failedCount: 0,
    scheduledAt: "2026-03-30 10:00",
    createdAt: "2026-03-28",
    message: "Parabens {nome}! Voce ja fez 5 pedidos conosco! Como agradecimento, seu proximo pedido tem FRETE GRATIS. Aproveite!",
  },
  {
    id: "4",
    name: "Reativacao Clientes",
    status: "rascunho",
    sentCount: 0,
    totalCount: 89,
    failedCount: 0,
    scheduledAt: null,
    createdAt: "2026-03-29",
    message: "Oi {nome}, sentimos sua falta! Faz tempo que voce nao pede. Que tal experimentar nosso novo cardapio? Temos opcoes incriveis!",
  },
  {
    id: "5",
    name: "Pascoa Saudavel",
    status: "agendada",
    sentCount: 0,
    totalCount: 420,
    failedCount: 0,
    scheduledAt: "2026-04-05 09:00",
    createdAt: "2026-03-29",
    message: "Feliz Pascoa, {nome}! Encomende nosso Kit Pascoa Fitness: Ovo de Chocolate Proteico + Marmita Especial por apenas R$59,90!",
    mediaUrl: "https://images.unsplash.com/photo-1457301547464-55b3e66be5be?w=400",
  },
];

const neighborhoods = [
  "Todos",
  "Vila Mariana",
  "Moema",
  "Itaim Bibi",
  "Pinheiros",
  "Jardins",
  "Brooklin",
  "Saude",
  "Ipiranga",
];

type View = "list" | "detail";

export default function Campaigns() {
  const [campaigns] = useState(mockCampaigns);
  const [view, setView] = useState<View>("list");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formMediaUrl, setFormMediaUrl] = useState("");
  const [formNeighborhood, setFormNeighborhood] = useState("Todos");
  const [formMinOrders, setFormMinOrders] = useState("");
  const [formScheduleType, setFormScheduleType] = useState<"now" | "schedule">("now");
  const [formScheduleDate, setFormScheduleDate] = useState("");

  // TODO: Compute estimated reach from Supabase based on audience filters
  const estimatedReach = formNeighborhood === "Todos" ? 420 : Math.floor(Math.random() * 100 + 30);

  function openDetail(campaign: Campaign) {
    setSelectedCampaign(campaign);
    setView("detail");
  }

  function resetForm() {
    setFormName("");
    setFormMessage("");
    setFormMediaUrl("");
    setFormNeighborhood("Todos");
    setFormMinOrders("");
    setFormScheduleType("now");
    setFormScheduleDate("");
  }

  function handleCreate() {
    // TODO: Save campaign to Supabase
    resetForm();
    setDrawerOpen(false);
  }

  // ---- Detail View ----
  if (view === "detail" && selectedCampaign) {
    const c = selectedCampaign;
    const st = statusConfig[c.status];
    const deliveryRate = c.totalCount > 0 ? Math.round(((c.sentCount - c.failedCount) / c.totalCount) * 100) : 0;
    const progressPercent = c.totalCount > 0 ? Math.round((c.sentCount / c.totalCount) * 100) : 0;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setView("list")} className="p-1.5 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold font-['Sora'] text-gray-800">{c.name}</h1>
            <p className="text-sm text-gray-500 font-['Plus_Jakarta_Sans']">
              Criada em {new Date(c.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <Badge className={`ml-auto ${st.color} border-0`}>
            <st.icon className={`h-3.5 w-3.5 mr-1 ${c.status === "enviando" ? "animate-spin" : ""}`} />
            {st.label}
          </Badge>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 font-['Sora']">Progresso de Envio</h2>
          <Progress value={progressPercent} className="h-3" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800 font-['Sora']">{c.totalCount}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600 font-['Sora']">{c.sentCount}</p>
              <p className="text-xs text-gray-500">Enviadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500 font-['Sora']">{c.failedCount}</p>
              <p className="text-xs text-gray-500">Falhas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 font-['Sora']">{deliveryRate}%</p>
              <p className="text-xs text-gray-500">Taxa de Entrega</p>
            </div>
          </div>
        </div>

        {/* Message preview */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700 font-['Sora']">Mensagem</h2>
          {c.mediaUrl && (
            <img src={c.mediaUrl} alt="Media" className="w-full max-w-xs rounded-lg" />
          )}
          <div className="bg-[#dcf8c6] rounded-lg p-3 max-w-sm">
            <p className="text-sm text-gray-800 whitespace-pre-wrap font-['Plus_Jakarta_Sans']">
              {c.message}
            </p>
          </div>
        </div>

        {c.scheduledAt && (
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 font-['Sora'] mb-2">Agendamento</h2>
            <p className="text-sm text-gray-600 flex items-center gap-2 font-['Plus_Jakarta_Sans']">
              <Calendar className="h-4 w-4 text-blue-500" />
              {new Date(c.scheduledAt).toLocaleString("pt-BR")}
            </p>
          </div>
        )}
      </div>
    );
  }

  // ---- List View ----
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-['Sora'] text-gray-800">Campanhas</h1>
          <p className="text-sm text-gray-500 font-['Plus_Jakarta_Sans']">
            Envio de mensagens em massa via WhatsApp
          </p>
        </div>
      </div>

      {/* Campaign cards */}
      <div className="space-y-3">
        {campaigns.map((c) => {
          const st = statusConfig[c.status];
          return (
            <button
              key={c.id}
              onClick={() => openDetail(c)}
              className="w-full bg-white rounded-xl border border-gray-100 p-4 text-left hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-800 truncate font-['Sora']">
                      {c.name}
                    </h3>
                    <Badge className={`${st.color} border-0 text-[10px] px-2 py-0`}>
                      <st.icon className={`h-3 w-3 mr-1 ${c.status === "enviando" ? "animate-spin" : ""}`} />
                      {st.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 truncate font-['Plus_Jakarta_Sans']">
                    {c.message}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Send className="h-3 w-3" />
                      {c.sentCount}/{c.totalCount}
                    </span>
                    <span>
                      {c.scheduledAt
                        ? `Agendada: ${new Date(c.scheduledAt).toLocaleDateString("pt-BR")}`
                        : new Date(c.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 flex-shrink-0 mt-1" />
              </div>
            </button>
          );
        })}
      </div>

      {/* FAB */}
      <Button
        onClick={() => {
          resetForm();
          setDrawerOpen(true);
        }}
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-8 h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg z-40"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Campaign creation drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="bottom" className="h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-2xl p-0 sm:side-right">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              <SheetHeader className="text-left">
                <SheetTitle className="font-['Sora']">Nova Campanha</SheetTitle>
                <SheetDescription className="font-['Plus_Jakarta_Sans']">
                  Crie uma campanha de mensagens para seus clientes
                </SheetDescription>
              </SheetHeader>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="campaign-name" className="text-sm font-medium">
                  Nome da campanha
                </Label>
                <Input
                  id="campaign-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Promo de Verao"
                  className="h-10"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="campaign-message" className="text-sm font-medium">
                  Mensagem
                </Label>
                <Textarea
                  id="campaign-message"
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Ola {nome}! Sua mensagem aqui..."
                  rows={4}
                  className="text-sm"
                />
                <p className="text-[11px] text-gray-400">
                  Use {"{nome}"} para personalizar. Emojis sao suportados.
                </p>
              </div>

              {/* Media */}
              <div className="space-y-2">
                <Label htmlFor="campaign-media" className="text-sm font-medium flex items-center gap-1">
                  <Image className="h-4 w-4" /> Midia (opcional)
                </Label>
                <Input
                  id="campaign-media"
                  value={formMediaUrl}
                  onChange={(e) => setFormMediaUrl(e.target.value)}
                  placeholder="URL da imagem"
                  className="h-10"
                />
              </div>

              {/* Audience filters */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 font-['Sora'] flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> Audiencia
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">Bairro</Label>
                    <Select value={formNeighborhood} onValueChange={setFormNeighborhood}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {neighborhoods.map((n) => (
                          <SelectItem key={n} value={n}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">Minimo de pedidos</Label>
                    <Input
                      type="number"
                      value={formMinOrders}
                      onChange={(e) => setFormMinOrders(e.target.value)}
                      placeholder="Ex: 3"
                      className="h-10"
                      min={0}
                    />
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-lg px-3 py-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">
                    Alcance estimado: {estimatedReach} clientes
                  </span>
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 font-['Sora'] flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Agendamento
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormScheduleType("now")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      formScheduleType === "now"
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-gray-50 text-gray-500 border border-gray-200"
                    }`}
                  >
                    Enviar agora
                  </button>
                  <button
                    onClick={() => setFormScheduleType("schedule")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      formScheduleType === "schedule"
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-gray-50 text-gray-500 border border-gray-200"
                    }`}
                  >
                    Agendar
                  </button>
                </div>
                {formScheduleType === "schedule" && (
                  <Input
                    type="datetime-local"
                    value={formScheduleDate}
                    onChange={(e) => setFormScheduleDate(e.target.value)}
                    className="h-10"
                  />
                )}
              </div>

              {/* Preview */}
              {formMessage && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 font-['Sora']">Preview</h3>
                  <div className="bg-[#e5ddd5] rounded-xl p-4">
                    <div className="bg-[#dcf8c6] rounded-lg p-3 max-w-[85%] ml-auto shadow-sm">
                      {formMediaUrl && (
                        <img
                          src={formMediaUrl}
                          alt="Preview"
                          className="w-full rounded-md mb-2"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      )}
                      <p className="text-sm text-gray-800 whitespace-pre-wrap font-['Plus_Jakarta_Sans']">
                        {formMessage.replace("{nome}", "Maria")}
                      </p>
                      <p className="text-[10px] text-gray-500 text-right mt-1">
                        {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2 pb-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDrawerOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleCreate}
                  disabled={!formName.trim() || !formMessage.trim()}
                >
                  {formScheduleType === "now" ? (
                    <>
                      <Send className="h-4 w-4 mr-1.5" /> Enviar
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 mr-1.5" /> Agendar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
