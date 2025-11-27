import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
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

export function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { items, getTotalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Bénin',
    shippingMethod: 'standard'
  });

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

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
            <h1 className="text-3xl font-bold mb-4">Connexion requise</h1>
            <p className="text-gray-500 mb-8">Vous devez être connecté pour passer commande</p>
            <Link 
              to="/login"
              state={{ from: location }}
            >
              <Button>Se connecter</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation simple
      if (!formData.street || !formData.city || !formData.postalCode) {
        toast.error('Veuillez remplir tous les champs');
        return;
      }

      // Rediriger vers le paiement
      sessionStorage.setItem('checkout', JSON.stringify(formData));
      navigate('/payment');
    } catch (error) {
      toast.error('Erreur lors de la validation du formulaire');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/cart" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft className="h-4 w-4" />
            Retour au panier
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulaire */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h1 className="text-3xl font-bold mb-8">Informations de livraison</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nom */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">Prénom</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                  {/* Adresse et téléphone */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">Téléphone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder='01 ** ** ** **'
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    {/* Adresse */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Rue</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Ville, CP, Pays */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">Ville</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Code postal</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Pays</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        placeholder='Bénin'
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                  </div>

                  {/* Méthode de livraison */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Méthode de livraison</label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="standard"
                          checked={formData.shippingMethod === 'standard'}
                          onChange={handleInputChange}
                        />
                        <div>
                          <p className="font-medium">Livraison standard (5-7 jours)</p>
                          <p className="text-sm text-gray-500">Gratuit</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="express"
                          checked={formData.shippingMethod === 'express'}
                          onChange={handleInputChange}
                        />
                        <div>
                          <p className="font-medium">Livraison express (2-3 jours)</p>
                          <p className="text-sm text-gray-500">{import.meta.env.VITE_SHIPPING_EXPRESS_PRICE} XOF</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-6 text-lg"
                  >
                    {loading ? 'Traitement...' : 'Procéder au paiement'}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Résumé commande */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24 h-fit">
                <h2 className="text-2xl font-bold mb-6">Résumé</h2>

                <div className="space-y-4 mb-6 pb-6 border-b max-h-64 overflow-y-auto">
                  {items.map((item) => {
                    const productImage = item.product.images && item.product.images.length > 0
                      ? getImageUrl(item.product.images[0])
                      : '';

                    const numericPrice = typeof item.product.price === 'string'
                      ? parseFloat(item.product.price)
                      : item.product.price;

                    return (
                      <div key={item.product.id} className="flex gap-3">
                        {productImage && (
                          <img
                            src={productImage}
                            alt={item.product.title}
                            className="w-12 h-12 rounded object-cover"
                            crossOrigin="anonymous"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.product.title}</p>
                          <p className="text-xs text-gray-500">{item.quantity}x {formatPrice(numericPrice)}</p>
                        </div>
                        <p className="font-medium text-sm">
                          {formatPrice(numericPrice * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-semibold">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Livraison</span>
                    <span className="font-semibold">
                      {formatPrice(formData.shippingMethod === 'express' ? parseInt(import.meta.env.VITE_SHIPPING_EXPRESS_PRICE) : 0)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-4 border-t">
                    <span className="font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(totalPrice + (formData.shippingMethod === 'express' ? parseInt(import.meta.env.VITE_SHIPPING_EXPRESS_PRICE) : 0))}
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

export default Checkout;
