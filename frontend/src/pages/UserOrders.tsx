import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronDown, TrendingUp, Calendar, DollarSign, Package } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: number;
  orderNumber: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  items: OrderItem[];
  shippingAddress?: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  processing: 'En cours de traitement',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export function UserOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <h1 className="text-3xl font-bold mb-4">Accès non autorisé</h1>
            <p className="text-gray-500 mb-8">Vous devez être connecté pour accéder à cette page</p>
            <Button onClick={() => navigate('/login')}>Se connecter</Button>
          </motion.div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/users/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes');
      }

      const data = await response.json();
      // Handle both array response and object with orders property
      const ordersData = Array.isArray(data) ? data : (data.orders || []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      toast.error('Erreur lors du chargement des commandes');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Mes Commandes</h1>
              <p className="text-gray-600">Historique et statut de vos commandes</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total commandes</p>
                      <p className="text-2xl font-bold">{orders.length}</p>
                    </div>
                    <ShoppingBag className="h-8 w-8 text-primary/30" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total dépensé</p>
                      <p className="text-2xl font-bold">
                        {((orders && orders.length > 0) ? orders.reduce((sum, order) => sum + (typeof order.total === 'number' ? order.total : 0), 0) : 0).toFixed(0)} XOF
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-primary/30" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">En cours</p>
                      <p className="text-2xl font-bold">
                        {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
                      </p>
                    </div>
                    <Package className="h-8 w-8 text-primary/30" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Chargement des commandes...</p>
                </div>
              ) : orders.length === 0 ? (
                <Card>
                  <CardContent className="pt-12 pb-12 text-center">
                    <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune commande</h3>
                    <p className="text-gray-500 mb-6">Vous n'avez pas encore passé de commande</p>
                    <Button onClick={() => navigate('/shop')}>Continuer le shopping</Button>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="p-4 sm:p-6">
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">Commande #{order.orderNumber}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                                {statusLabels[order.status]}
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {Number(order.total).toFixed(0)} XOF
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                            className="self-start"
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                expandedOrderId === order.id ? 'rotate-180' : ''
                              }`}
                            />
                          </Button>
                        </div>

                        {/* Order Items - Expanded */}
                        {expandedOrderId === order.id && (
                          <div className="mt-6 pt-6 border-t space-y-4">
                            <div>
                              <h4 className="font-semibold text-sm mb-3">Articles</h4>
                              <div className="space-y-3">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                                    {item.image && (
                                      <img
                                        src={item.image}
                                        alt={item.productName}
                                        className="h-16 w-16 object-cover rounded"
                                      />
                                    )}
                                    <div className="flex-1">
                                      <p className="font-semibold">{item.productName}</p>
                                      <p className="text-sm text-gray-600">
                                        Quantité: {item.quantity} × {Number(item.price).toFixed(0)} XOF
                                      </p>
                                    </div>
                                    <p className="font-semibold">
                                      {(Number(item.quantity) * Number(item.price)).toFixed(0)} XOF
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping Address */}
                            {order.shippingAddress && (
                              <div>
                                <h4 className="font-semibold text-sm mb-3">Adresse de livraison</h4>
                                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                                  <p className="font-semibold">{order.shippingAddress.fullName}</p>
                                  <p className="text-gray-600">{order.shippingAddress.street}</p>
                                  <p className="text-gray-600">
                                    {order.shippingAddress.postalCode} {order.shippingAddress.city}
                                  </p>
                                  <p className="text-gray-600">{order.shippingAddress.country}</p>
                                </div>
                              </div>
                            )}

                            {/* Order Summary */}
                            <div className="border-t pt-4">
                              <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Sous-total</span>
                                <span>
                                  {(Number(order.total) * 0.9).toFixed(0)} XOF
                                </span>
                              </div>
                              <div className="flex justify-between mb-3">
                                <span className="text-gray-600">Frais de port</span>
                                <span>{(Number(order.total) * 0.1).toFixed(0)} XOF</span>
                              </div>
                              <div className="flex justify-between font-semibold text-lg">
                                <span>Total</span>
                                <span>{Number(order.total).toFixed(0)} XOF</span>
                              </div>
                            </div>

                            {/* Payment Status */}
                            <div className="p-3 bg-blue-50 rounded-lg text-sm">
                              <p className="text-gray-700">
                                <strong>Statut de paiement:</strong>{' '}
                                <span className={order.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}>
                                  {order.paymentStatus === 'completed' ? 'Payé' : 'En attente'}
                                </span>
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4">
                              <Button variant="outline" className="flex-1" onClick={() => navigate('/shop')}>
                                Renouveler la commande
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default UserOrders;
