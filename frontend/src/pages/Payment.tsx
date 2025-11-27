import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import PaymentButton from '@/components/PaymentButton';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/priceFormatter';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
};

export function Payment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentInitialized, setPaymentInitialized] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    scrollTo(0, 0);
  }, []);
  
  const checkoutData = sessionStorage.getItem('checkout')
    ? JSON.parse(sessionStorage.getItem('checkout')!)
    : null;

  // Initialize payment on mount only once
  useEffect(() => {
    if (checkoutData && !paymentInitialized) {
      initializePayment();
    }
  }, []); // Empty dependency - run only once on mount

  const initializePayment = async () => {
    if (paymentInitialized) return; // Éviter les appels multiples
    
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentification requise pour le paiement');
        navigate('/checkout-guest');
        return;
      }

      if (!checkoutData) {
        toast.error('Données de commande manquantes');
        navigate('/checkout');
        return;
      }

      // Call backend to initialize payment
      const response = await fetch(`${API_URL}/api/payments/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: getTotalPrice() + (checkoutData.shippingMethod === 'express' ? parseInt(import.meta.env.VITE_SHIPPING_EXPRESS_PRICE) : 0),
          items: items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: typeof item.product.price === 'string' 
              ? parseFloat(item.product.price) 
              : item.product.price
          })),
          shippingAddress: {
            street: checkoutData.street,
            city: checkoutData.city,
            state: checkoutData.city,
            zipCode: checkoutData.postalCode,
            country: checkoutData.country
          },
          shippingMethod: checkoutData.shippingMethod,
          email: checkoutData.email || user?.email,
          phone: checkoutData.phone,
          firstName: checkoutData.firstName || user?.name?.split(' ')[0] || '',
          lastName: checkoutData.lastName || user?.name?.split(' ')[1] || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initialize payment');
      }

      const data = await response.json();
      setPaymentData(data);
      setPaymentInitialized(true);
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error('Erreur lors de l\'initialisation du paiement');
      navigate('/checkout');
    } finally {
      setLoading(false);
    }
  };

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <h1 className="text-3xl font-bold mb-4">Données de commande manquantes</h1>
            <p className="text-gray-500 mb-8">Veuillez d'abord remplir vos informations de livraison</p>
            <Link to="/checkout">
              <Button>Retour au checkout</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    // Formater le numéro de carte
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }

    // Limiter CVV à 3 chiffres
    if (name === 'cvv') {
      value = value.slice(0, 3);
    }
  };

  const handlePaymentSuccess = async (transactionId: string, orderId: number) => {
    try {
      // Clear cart and checkout data
      clearCart();
      sessionStorage.removeItem('checkout');
      
      // Redirect to order success
      navigate('/order-success');
    } catch (error) {
      console.error('Error after payment:', error);
      toast.error('Erreur après le paiement');
    }
  };

  const totalPrice = getTotalPrice();
  const shippingCost = checkoutData.shippingMethod === 'express' ? parseInt(import.meta.env.VITE_SHIPPING_EXPRESS_PRICE) : 0;
  const finalTotal = totalPrice + shippingCost;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/checkout" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulaire paiement */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h1 className="text-3xl font-bold mb-8">Paiement Sécurisé</h1>

                {paymentInitialized && paymentData ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">Information de paiement</h3>
                      <p className="text-sm text-blue-800">
                        Cliquez sur le bouton ci-dessous pour procéder au paiement via Kkiapay. 
                        Vous pouvez utiliser votre Mobile Money ou une carte bancaire.
                      </p>
                    </div>

                    <PaymentButton
                      amount={getTotalPrice() + (checkoutData.shippingMethod === 'express' ? parseInt(import.meta.env.VITE_SHIPPING_EXPRESS_PRICE) : 0)}
                      reference={paymentData.reference}
                      email={paymentData.email}
                      phone={paymentData.phone}
                      firstName={paymentData.name.split(' ')[0]}
                      lastName={paymentData.name.split(' ')[1] || ''}
                      items={items}
                      onPaymentSuccess={handlePaymentSuccess}
                      disabled={loading}
                    />

                    <p className="text-xs text-gray-500 text-center">
                      Vous recevrez un email de confirmation après votre paiement
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary mb-4"></div>
                    <p className="text-gray-600">Initialisation du paiement...</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Résumé */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24 h-fit">
                <h2 className="text-2xl font-bold mb-6">Résumé</h2>

                <div className="space-y-4 mb-6 pb-6 border-b max-h-64 overflow-y-auto">
                  {items.map((item) => {
                    const numericPrice = typeof item.product.price === 'string'
                      ? parseFloat(item.product.price)
                      : item.product.price;

                    return (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span>{item.product.title} x{item.quantity}</span>
                        <span className="font-medium">
                          {formatPrice(numericPrice * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-semibold">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Livraison</span>
                    <span className="font-semibold">{formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t">
                    <span className="font-bold">Total à payer</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
