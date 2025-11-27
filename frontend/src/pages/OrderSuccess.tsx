import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/priceFormatter';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
};

const toNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  return 0;
};

export function OrderSuccess() {
  const [order, setOrder] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const orderData = sessionStorage.getItem('orderData');
    const paymentData = sessionStorage.getItem('paymentData');
    
    if (orderData) {
      try {
        setOrder(JSON.parse(orderData));
      } catch (error) {
        console.error('Erreur lors du chargement de la commande:', error);
      }
    }
    
    if (paymentData) {
      try {
        setPayment(JSON.parse(paymentData));
      } catch (error) {
        console.error('Erreur lors du chargement du paiement:', error);
      }
    }
    
    setLoading(false);
    
    // Nettoyer la session
    sessionStorage.removeItem('orderData');
    sessionStorage.removeItem('paymentData');
    sessionStorage.removeItem('checkout');
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96 pt-20">
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  const orderNumber = order?.reference || order?.id || '#' + Math.floor(Math.random() * 1000000);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            {/* Succès */}
            <div className="text-center mb-12">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </motion.div>
              <h1 className="text-4xl font-bold mb-4">Commande confirmée!</h1>
              <p className="text-xl text-gray-600 mb-2">
                Merci pour votre achat. Votre commande a été reçue.
              </p>
              <p className="text-lg font-semibold text-primary">
                Numéro de commande: {orderNumber}
              </p>
            </div>

            {/* Détails commande */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-sm mb-8"
            >
              <h2 className="text-2xl font-bold mb-6">Détails de la commande</h2>

              {/* Informations générales */}
              <div className="mb-6 pb-6 border-b">
                <div className="grid lg:grid-cols-2 gap-4 sm:grid-cols-1">
                  <div>
                    <p className="text-gray-600 text-sm">Numéro de commande</p>
                    <p className="font-semibold">{order?.reference || '#' + order?.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">ID de transaction</p>
                    <p className="font-semibold">{payment?.id || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Nom client</p>
                    <p className="font-semibold">{order?.customerName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="font-semibold text-sm">{order?.customerEmail || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Téléphone</p>
                    <p className="font-semibold">{order?.customerPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Statut</p>
                    <p className="font-semibold text-green-600 capitalize">{order?.status || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Articles */}
              {order?.items && order.items.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold mb-4">Articles commandés</h3>
                  <div className="space-y-3 border-b pb-6 mb-6">
                    {order.items.map((item: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded"
                      >
                        <div>
                          <span className="text-gray-700 font-medium">
                            {item.quantity}x Article #{item.productId}
                          </span>
                          <p className="text-sm text-gray-500">Prix unitaire: {formatPrice(item.price)}</p>
                        </div>
                        <span className="font-semibold">
                          {formatPrice(toNumber(item.price) * item.quantity)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Résumé prix */}
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant</span>
                  <span className="font-semibold">{formatPrice(order?.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison ({order?.shippingMethod || 'standard'})</span>
                  <span className="font-semibold">
                    {order?.shippingMethod === 'express' ? formatPrice(import.meta.env.VITE_SHIPPING_EXPRESS_PRICE) : formatPrice(0)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-300">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(order?.total)}</span>
                </div>
              </div>
            </motion.div>

            {/* Étapes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-sm mb-8"
            >
              <h2 className="text-2xl font-bold mb-8">Prochaines étapes</h2>

              <div className="space-y-6">
                {/* Confirmation email */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Vérifiez votre email</h3>
                    <p className="text-gray-600">
                      Un email de confirmation a été envoyé à votre adresse email avec tous les détails de votre commande.
                    </p>
                  </div>
                </div>

                {/* Préparation */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-yellow-100">
                      <Package className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Préparation en cours</h3>
                    <p className="text-gray-600">
                      Votre commande est en cours de préparation. Elle sera expédiée dans les 2-3 jours ouvrables.
                    </p>
                  </div>
                </div>

                {/* Livraison */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-100">
                      <Truck className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">En route vers vous</h3>
                    <p className="text-gray-600">
                      Vous recevrez un numéro de suivi par email pour suivre votre colis en temps réel.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Informations adresse */}
            {order?.shippingAddress && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-8 shadow-sm mb-8"
              >
                <h2 className="text-2xl font-bold mb-4">Adresse de livraison</h2>
                <p className="text-gray-700">
                  {order.shippingAddress.street}<br />
                  {order.shippingAddress.zipCode} {order.shippingAddress.city}<br />
                  {order.shippingAddress.country}
                </p>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            >
              <Link to="/shop" className="flex-1">
                <Button variant="outline" className="w-full">
                  Continuer vos achats
                </Button>
              </Link>
              <Link to="/" className="flex-1">
                <Button className="w-full">
                  Retour à l'accueil
                </Button>
              </Link>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-12 text-center text-gray-600"
            >
              <p className="mb-4">Des questions?</p>
              <Link to="/contact" className="text-primary hover:underline">
                Contactez notre service client
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
