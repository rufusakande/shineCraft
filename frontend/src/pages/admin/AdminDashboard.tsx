import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { formatPrice } from "@/lib/priceFormatter";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Package, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

type StatCard = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color: string;
  bgColor: string;
};

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    orderStatus: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/admin/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/admin/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      let products = [];
      let orders = [];
      let users = [];

      if (productsRes.ok) {
        const data = await productsRes.json();
        products = Array.isArray(data) ? data : data.products || [];
      }

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        orders = Array.isArray(data) ? data : data.orders || [];
      }

      if (usersRes.ok) {
        const data = await usersRes.json();
        users = Array.isArray(data) ? data : data.users || [];
      }

      const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
      
      const statusCounts = orders.reduce((acc, order) => {
        const status = order.status || 'pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const orderStatus = Object.entries(statusCounts).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
        status
      }));

      const recentOrders = orders.slice(-10).reverse().map(order => ({
        id: order.id,
        reference: order.reference,
        customerName: order.customerName,
        amount: parseFloat(order.amount) || 0,
        status: order.status,
        createdAt: new Date(order.createdAt).toLocaleDateString('fr-FR')
      }));

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue,
        recentOrders,
        orderStatus,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const statCards: StatCard[] = [
    {
      label: 'Total Produits',
      value: stats.totalProducts,
      icon: <Package className="h-6 w-6" />,
      trend: 12,
      color: 'from-blue-600 to-blue-400',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Total Commandes',
      value: stats.totalOrders,
      icon: <ShoppingCart className="h-6 w-6" />,
      trend: 8,
      color: 'from-emerald-600 to-emerald-400',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Total Clients',
      value: stats.totalUsers,
      icon: <Users className="h-6 w-6" />,
      trend: 5,
      color: 'from-purple-600 to-purple-400',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Revenu Total',
      value: formatPrice(stats.totalRevenue),
      icon: <TrendingUp className="h-6 w-6" />,
      trend: 15,
      color: 'from-amber-600 to-amber-400',
      bgColor: 'bg-amber-50',
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gradient-to-r from-blue-600 to-emerald-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Chargement des statistiques...</p>
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
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600">Bienvenue sur votre tableau de bord</p>
            </div>
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing}
              className="mt-4 sm:mt-0 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white border-0"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-6 sm:mb-8">
            {statCards.map((stat, idx) => (
              <div 
                key={idx}
                className="group relative bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative p-4 sm:p-6">
                  {/* Icon Background */}
                  <div className={`${stat.bgColor} w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                      {stat.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <div className="flex items-end justify-between gap-2">
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{stat.value}</p>
                      {stat.trend && (
                        <div className="flex items-center text-xs sm:text-sm font-semibold text-emerald-600 shrink-0">
                          <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {stat.trend}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Border Accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Order Status Distribution */}
            <div className="lg:col-span-1 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Distribution</h2>
                <p className="text-xs sm:text-sm text-gray-600">Statut des commandes</p>
              </div>
              
              {stats.orderStatus.length > 0 ? (
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.orderStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ value }) => `${value}`}
                        outerRadius={window.innerWidth < 640 ? 60 : 100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.orderStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-12">Aucune donnée disponible</p>
              )}

              {/* Legend */}
              <div className="mt-4 sm:mt-6 space-y-2">
                {stats.orderStatus.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      ></div>
                      <span className="text-xs sm:text-sm text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Commandes Récentes</h2>
                <p className="text-xs sm:text-sm text-gray-600">{stats.recentOrders.length} dernières commandes</p>
              </div>

              {stats.recentOrders.length > 0 ? (
                <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
                  {stats.recentOrders.map((order, idx) => {
                    const statusConfig = {
                      paid: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', label: 'Payée' },
                      pending: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'En attente' },
                      shipped: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: 'Expédiée' },
                      delivered: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: 'Livrée' },
                      cancelled: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'Annulée' },
                    };
                    
                    const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;

                    return (
                      <div 
                        key={order.id}
                        className={`${config.bg} border ${config.border} rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-300`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{order.reference}</p>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">{order.customerName}</p>
                            <p className="text-xs text-gray-500 mt-1">{order.createdAt}</p>
                          </div>
                          <div className="flex flex-col sm:items-end gap-1 sm:gap-2">
                            <p className="font-bold text-sm sm:text-base text-gray-900">{formatPrice(order.amount)}</p>
                            <span className={`${config.text} text-xs font-semibold px-2 sm:px-3 py-1 rounded-full bg-white whitespace-nowrap`}>
                              {config.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-12">Aucune commande</p>
              )}
            </div>
          </div>

          {/* Bottom Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="text-center py-2 sm:py-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">Taux de conversion</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {stats.totalOrders > 0 ? ((stats.totalOrders / stats.totalUsers) * 100).toFixed(1) : '0'}%
              </p>
            </div>
            <div className="text-center py-2 sm:py-0 border-t sm:border-t-0 sm:border-l sm:border-r border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">Commande moyenne</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {formatPrice(stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0)}
              </p>
            </div>
            <div className="text-center py-2 sm:py-0 border-t sm:border-t-0 border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">Dernière mise à jour</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}