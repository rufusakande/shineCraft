import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Eye, Edit2, RefreshCw, ChevronLeft, ChevronRight, X } from "lucide-react";
import { formatPrice } from "@/lib/priceFormatter";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

type Order = {
  id: number;
  reference: string;
  customerName: string;
  customerEmail: string;
  total: number;
  amount: number;
  status: string;
  paymentMethod: string;
  shippingMethod: string;
  createdAt: string;
  items: any[];
  shippingAddress?: any;
};

const ITEMS_PER_PAGE = 10;

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les commandes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleEditStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowEditModal(true);
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder || newStatus === selectedOrder.status) {
      setShowEditModal(false);
      return;
    }

    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: 'Succès',
          description: 'Statut de la commande mis à jour',
        });
        await fetchOrders();
        setShowEditModal(false);
      } else {
        const error = await response.json();
        toast({
          title: 'Erreur',
          description: error.error || 'Impossible de mettre à jour le statut',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'delivered':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'paid':
        return 'Payée';
      case 'pending':
        return 'En attente';
      case 'shipped':
        return 'Expédiée';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Chargement des commandes...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Commandes</h1>
              <p className="text-sm sm:text-base text-gray-600">{filteredOrders.length} commande{filteredOrders.length !== 1 ? 's' : ''} au total</p>
            </div>
            <Button 
              onClick={fetchOrders} 
              disabled={refreshing}
              className="mt-4 sm:mt-0 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white border-0"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 bg-white text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 bg-white text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="paid">Payée</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-25">
                    <TableHead className="text-gray-900 font-semibold text-xs sm:text-sm">Référence</TableHead>
                    <TableHead className="text-gray-900 font-semibold text-xs sm:text-sm hidden sm:table-cell">Client</TableHead>
                    <TableHead className="text-gray-900 font-semibold text-xs sm:text-sm hidden md:table-cell">Email</TableHead>
                    <TableHead className="text-gray-900 font-semibold text-xs sm:text-sm text-right">Montant</TableHead>
                    <TableHead className="text-gray-900 font-semibold text-xs sm:text-sm">Statut</TableHead>
                    <TableHead className="text-gray-900 font-semibold text-xs sm:text-sm hidden lg:table-cell">Paiement</TableHead>
                    <TableHead className="text-gray-900 font-semibold text-xs sm:text-sm hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-gray-900 font-semibold text-xs sm:text-sm text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.length > 0 ? (
                    paginatedOrders.map((order, idx) => (
                      <TableRow 
                        key={order.id} 
                        className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50 transition-colors duration-200 text-xs sm:text-sm ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                      >
                        <TableCell className="font-semibold text-gray-900 p-3 sm:p-4">{order.reference}</TableCell>
                        <TableCell className="text-gray-700 p-3 sm:p-4 hidden sm:table-cell truncate">{order.customerName}</TableCell>
                        <TableCell className="text-gray-600 p-3 sm:p-4 hidden md:table-cell truncate max-w-xs">{order.customerEmail}</TableCell>
                        <TableCell className="font-bold text-gray-900 text-right p-3 sm:p-4">{formatPrice(order.total)}</TableCell>
                        <TableCell className="p-3 sm:p-4">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-700 capitalize p-3 sm:p-4 hidden lg:table-cell text-xs sm:text-sm">{order.paymentMethod || 'N/A'}</TableCell>
                        <TableCell className="text-gray-600 p-3 sm:p-4 hidden md:table-cell text-xs sm:text-sm">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell className="p-3 sm:p-4">
                          <div className="flex gap-1 sm:gap-2 justify-center">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="hover:bg-blue-100 hover:text-blue-600 h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-2"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="hover:bg-amber-100 hover:text-amber-600 h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-2"
                              onClick={() => handleEditStatus(order)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
                        <div className="flex flex-col items-center gap-2">
                          <p className="font-medium">Aucune commande trouvée</p>
                          <p className="text-xs sm:text-sm">Essayez de modifier vos critères de recherche</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50">
                <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                  Affichage {startIdx + 1} à {Math.min(startIdx + ITEMS_PER_PAGE, filteredOrders.length)} sur {filteredOrders.length}
                </p>
                <div className="flex gap-1 sm:gap-2 justify-center sm:justify-end overflow-x-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 text-xs sm:text-sm h-8 sm:h-9"
                  >
                    <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Précédent</span>
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return page <= totalPages && page > 0 ? (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`text-xs sm:text-sm h-8 sm:h-9 w-8 sm:w-9 p-0 ${currentPage === page ? "bg-blue-600 text-white" : ""}`}
                        >
                          {page}
                        </Button>
                      ) : null;
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 text-xs sm:text-sm h-8 sm:h-9"
                  >
                    <span className="hidden sm:inline">Suivant</span>
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal View Order */}
      {showViewModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Détails de la commande</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Référence</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedOrder.reference}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Statut</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Montant</p>
                  <p className="text-lg font-semibold text-gray-900">{formatPrice(selectedOrder.total)}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Informations client</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nom</p>
                    <p className="text-gray-900">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="text-gray-900">{selectedOrder.customerEmail}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Adresse de livraison</h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-1">
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city} {selectedOrder.shippingAddress.postalCode || selectedOrder.shippingAddress.zipCode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              )}

              {/* Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Articles commandés</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.title || item.name || 'Produit'}</p>
                          <p className="text-sm text-gray-600">Quantité: {item.quantity || 1}</p>
                        </div>
                        <p className="font-semibold text-gray-900">{formatPrice(item.price * (item.quantity || 1))}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment & Shipping */}
              <div className="border-t border-gray-200 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Méthode de paiement</p>
                  <p className="font-semibold text-gray-900 capitalize">{selectedOrder.paymentMethod || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Méthode de livraison</p>
                  <p className="font-semibold text-gray-900 capitalize">{selectedOrder.shippingMethod || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
              <Button
                onClick={() => setShowViewModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Status */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Modifier le statut</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Commande</p>
                <p className="font-semibold text-gray-900">{selectedOrder.reference}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">Nouveau statut</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">En attente</option>
                  <option value="paid">Payée</option>
                  <option value="shipped">Expédiée</option>
                  <option value="delivered">Livrée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Statut actuel:</span> {getStatusLabel(selectedOrder.status)}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
              <Button
                onClick={() => setShowEditModal(false)}
                variant="outline"
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={updateOrderStatus}
                disabled={updating}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {updating ? 'Mise à jour...' : 'Mettre à jour'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}