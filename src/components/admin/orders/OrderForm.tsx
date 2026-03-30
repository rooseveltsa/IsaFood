import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

// ---------------------------------------------------------------------------
// TODO: Replace mock kit options with Supabase query
// Example:
//   const { data: kits } = useQuery({
//     queryKey: ["kits"],
//     queryFn: () => supabase.from("kits").select("id, name, price"),
//   });
// ---------------------------------------------------------------------------

const mockKitOptions = [
  { id: "kit-1", name: "Kit Fit Basico", price: 29.9 },
  { id: "kit-2", name: "Kit Fit Premium", price: 49.9 },
  { id: "kit-3", name: "Kit Low Carb", price: 39.9 },
  { id: "kit-4", name: "Kit Vegano", price: 44.9 },
  { id: "kit-5", name: "Kit Proteico", price: 54.9 },
];

interface OrderFormProps {
  open: boolean;
  onClose: () => void;
}

export function OrderForm({ open, onClose }: OrderFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [kitId, setKitId] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setCustomerName("");
    setPhone("");
    setKitId("");
    setNotes("");
  };

  // TODO: Replace with Supabase insert mutation
  // Example:
  //   const mutation = useMutation({
  //     mutationFn: (newOrder) => supabase.from("orders").insert(newOrder),
  //     onSuccess: () => { queryClient.invalidateQueries(["orders"]); onClose(); },
  //   });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !kitId) return;

    setIsSubmitting(true);

    // Simulate API call
    console.log("[TODO] Create order via Supabase:", {
      customerName,
      phone,
      kitId,
      notes,
    });

    await new Promise((r) => setTimeout(r, 500));

    setIsSubmitting(false);
    resetForm();
    onClose();
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          resetForm();
          onClose();
        }
      }}
    >
      <DrawerContent className="max-h-[92vh]">
        <div className="overflow-y-auto px-4 pb-6">
          <DrawerHeader className="px-0 pt-2 pb-4">
            <DrawerTitle className="font-heading text-xl">
              Novo Pedido
            </DrawerTitle>
            <DrawerDescription className="text-sm">
              Crie um pedido manualmente para um cliente
            </DrawerDescription>
          </DrawerHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Customer name */}
            <div className="space-y-2">
              <Label htmlFor="customer-name" className="text-sm font-medium">
                Nome do cliente
              </Label>
              <Input
                id="customer-name"
                placeholder="Ex: Maria Silva"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="h-11 rounded-xl"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Telefone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 rounded-xl"
                required
              />
            </div>

            {/* Kit selection */}
            <div className="space-y-2">
              <Label htmlFor="kit" className="text-sm font-medium">
                Kit
              </Label>
              <Select value={kitId} onValueChange={setKitId} required>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Selecione o kit" />
                </SelectTrigger>
                <SelectContent>
                  {mockKitOptions.map((kit) => (
                    <SelectItem key={kit.id} value={kit.id}>
                      {kit.name} — R$ {kit.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Observacoes
              </Label>
              <Textarea
                id="notes"
                placeholder="Alguma observacao sobre o pedido..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px] rounded-xl resize-none"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting || !customerName.trim() || !phone.trim() || !kitId}
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base mt-4"
            >
              {isSubmitting ? "Criando..." : "Criar Pedido"}
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
