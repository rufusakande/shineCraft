import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
};

export function CheckoutGuest() {
  const navigate = useNavigate();
  const { items, getTotalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'auth' | 'shipping'>('auth');
  const [isNewCustomer, setIsNewCustomer] = useState(true);
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
    shippingMethod: 'standard'
  });

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthData(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isNewCustomer) {
        if (!authData.password || authData.password !== authData.confirmPassword) {
          toast.error('Les mots de passe ne correspondent pas');
          return;
        }
        if (authData.password.length < 6) {
          toast.error('Le mot de passe doit contenir au moins 6 caractères');
          return;
        }
      }

      // Stocker les données d'authentification
      sessionStorage.setItem('guestAuth', JSON.stringify({
        email: authData.email,
        isNewCustomer
      }));

      // Passer à l'étape suivante
      setFormData(prev => ({ ...prev, email: authData.email }));
      setStep('shipping');
    } catch (error) {
      toast.error('Erreur lors de la validation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation simple
      if (!formData.street || !formData.city || !formData.postalCode) {
        toast.error('Veuillez remplir tous les champs');
        return;
      }

      // Stocker les données de checkout
      sessionStorage.setItem('checkout', JSON.stringify({
        ...formData,
        isGuest: true,
        email: authData.email,
        isNewCustomer
      }));

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
            {/* Formulaires */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                {step === 'auth' ? (
                  <>
                    <h1 className="text-3xl font-bold mb-8">Finaliser votre commande</h1>

                    {/* Toggle nouveau/existant */}
                    <div className="flex gap-4 mb-8">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsNewCustomer(true)}
                        className={`flex-1 py-3 rounded-lg font-medium transition-smooth ${
                          isNewCustomer
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Nouveau client
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsNewCustomer(false)}
                        className={`flex-1 py-3 rounded-lg font-medium transition-smooth ${
                          !isNewCustomer
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Client existant
                      </motion.button>
                    </div>

                    <form onSubmit={handleAuthSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={authData.email}
                          onChange={handleAuthChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {isNewCustomer ? 'Créer un mot de passe' : 'Mot de passe'}
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={authData.password}
                          onChange={handleAuthChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      {isNewCustomer && (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Confirmer le mot de passe
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={authData.confirmPassword}
                            onChange={handleAuthChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      )}

                      {!isNewCustomer && (
                        <p className="text-sm text-gray-500">
                          Vous recevrez un email de confirmation après votre commande
                        </p>
                      )}

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-6 text-lg"
                      >
                        {loading ? 'Traitement...' : 'Continuer'}
                      </Button>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Ou</span>
                        <Link to="/login" className="text-primary hover:underline">
                          se connecter avec un compte existant
                        </Link>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold mb-8">Informations de livraison</h1>

                    <form onSubmit={handleShippingSubmit} className="space-y-6">
                      {/* Nom */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Prénom</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleShippingChange}
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
                            onChange={handleShippingChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Téléphone */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Téléphone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleShippingChange}
                          required
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
                          onChange={handleShippingChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      {/* Ville, CP, Pays */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Ville</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleShippingChange}
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
                            onChange={handleShippingChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Pays</label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleShippingChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option>France</option>
                          <option>Belgique</option>
                          <option>Luxembourg</option>
                          <option>Suisse</option>
                          <option>Allemagne</option>
                        </select>
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
                              onChange={handleShippingChange}
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
                              onChange={handleShippingChange}
                            />
                            <div>
                              <p className="font-medium">Livraison express (2-3 jours)</p>
                              <p className="text-sm text-gray-500">15,00 €</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep('auth')}
                          className="flex-1 py-6"
                        >
                          Retour
                        </Button>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="flex-1 py-6 text-lg"
                        >
                          {loading ? 'Traitement...' : 'Procéder au paiement'}
                        </Button>
                      </div>
                    </form>
                  </>
                )}
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
                    const numericPrice = typeof item.product.price === 'string'
                      ? parseFloat(item.product.price)
                      : item.product.price;

                    return (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span>{item.product.title} x{item.quantity}</span>
                        <span className="font-medium">
                          {(numericPrice * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-semibold">{totalPrice.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Livraison</span>
                    <span className="font-semibold">
                      {step === 'shipping' && formData.shippingMethod === 'express' ? '15,00' : '0,00'} €
                    </span>
                  </div>
                  <div className="flex justify-between pt-4 border-t">
                    <span className="font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {(totalPrice + (step === 'shipping' && formData.shippingMethod === 'express' ? 15 : 0)).toFixed(2)} €
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

export default CheckoutGuest;
