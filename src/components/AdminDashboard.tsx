
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  Package
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  timestamp: string;
  items: Array<{
    id: number;
    name: string;
    category: string;
    quantity: number;
  }>;
  status: 'carrinho' | 'whatsapp_enviado' | 'confirmado' | 'producao' | 'entregue';
  customerInfo?: {
    name: string;
    address: string;
    phone: string;
  };
  total: number;
  whatsappSentAt?: string;
  confirmedAt?: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status'], customerInfo?: Order['customerInfo']) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updated = { 
          ...order, 
          status: newStatus,
          ...(customerInfo && { customerInfo }),
          ...(newStatus === 'confirmado' && { confirmedAt: new Date().toISOString() })
        };
        return updated;
      }
      return order;
    });
    
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    toast({
      title: "Status atualizado!",
      description: `Pedido ${orderId} atualizado para ${newStatus}.`,
    });
  };

  const getFilteredOrders = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return orders.filter(order => {
      const orderDate = new Date(order.timestamp);
      switch (selectedPeriod) {
        case 'today':
          return orderDate >= today;
        case 'week':
          return orderDate >= thisWeek;
        case 'month':
          return orderDate >= thisMonth;
        default:
          return true;
      }
    });
  };

  const filteredOrders = getFilteredOrders();
  const totalSales = filteredOrders.filter(o => o.status === 'entregue').reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = filteredOrders.filter(o => ['whatsapp_enviado', 'confirmado'].includes(o.status));
  const productionOrders = filteredOrders.filter(o => o.status === 'producao');

  // Análise de itens mais pedidos
  const itemStats = filteredOrders.reduce((acc, order) => {
    order.items.forEach(item => {
      if (!acc[item.name]) {
        acc[item.name] = { count: 0, category: item.category };
      }
      acc[item.name].count += item.quantity;
    });
    return acc;
  }, {} as Record<string, { count: number; category: string }>);

  const topItems = Object.entries(itemStats)
    .sort(([,a], [,b]) => b.count - a.count)
    .slice(0, 5);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    onLogout();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'carrinho': return 'bg-gray-500';
      case 'whatsapp_enviado': return 'bg-blue-500';
      case 'confirmado': return 'bg-yellow-500';
      case 'producao': return 'bg-orange-500';
      case 'entregue': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'carrinho': return 'Carrinho';
      case 'whatsapp_enviado': return 'WhatsApp Enviado';
      case 'confirmado': return 'Confirmado';
      case 'producao': return 'Em Produção';
      case 'entregue': return 'Entregue';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
            Dashboard Administrativo
          </h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'today', label: 'Hoje' },
            { key: 'week', label: 'Esta Semana' },
            { key: 'month', label: 'Este Mês' },
            { key: 'all', label: 'Todos' }
          ].map(period => (
            <Button
              key={period.key}
              variant={selectedPeriod === period.key ? "default" : "outline"}
              onClick={() => setSelectedPeriod(period.key)}
              size="sm"
            >
              {period.label}
            </Button>
          ))}
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSales} marmitas</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Produção</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productionOrders.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredOrders.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Orders Management */}
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Pedidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {filteredOrders.map(order => (
                <div key={order.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Pedido #{order.id.slice(-6)}</span>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {new Date(order.timestamp).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>

                  <div className="text-sm">
                    <strong>Itens:</strong>
                    <ul className="list-disc list-inside ml-2">
                      {order.items.map((item, idx) => (
                        <li key={idx}>{item.quantity}x {item.name}</li>
                      ))}
                    </ul>
                  </div>

                  {order.customerInfo && (
                    <div className="text-sm">
                      <strong>Cliente:</strong> {order.customerInfo.name}<br />
                      <strong>Endereço:</strong> {order.customerInfo.address}
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    {order.status === 'whatsapp_enviado' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus(order.id, 'confirmado')}
                        className="bg-yellow-500 hover:bg-yellow-600"
                      >
                        Confirmar
                      </Button>
                    )}
                    {order.status === 'confirmado' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus(order.id, 'producao')}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Iniciar Produção
                      </Button>
                    )}
                    {order.status === 'producao' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus(order.id, 'entregue')}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Marcar como Entregue
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Items */}
          <Card>
            <CardHeader>
              <CardTitle>Itens Mais Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topItems.map(([itemName, stats], index) => (
                  <div key={itemName} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{itemName}</div>
                      <div className="text-sm text-gray-600">{stats.category}</div>
                    </div>
                    <Badge variant="secondary">{stats.count} pedidos</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
