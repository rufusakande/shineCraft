import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/providers/AuthProvider';
import { formatPrice } from '@/lib/priceFormatter';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
};

export function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { user } = useAuth();
  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartCount={getTotalItems()} />

        <div className="flex flex-col items-center justify-center h-96 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-2xl font-semibold mb-4">Votre panier est vide</p>
            <p className="text-gray-500 mb-8">Découvrez notre collection de bijoux</p>
            <Link to="/shop">
              <Button>Continuer vos achats</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={getTotalItems()} />

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-serif font-bold mb-2">Votre Panier</h1>
            <p className="text-muted-foreground">
              {getTotalItems()} article{getTotalItems() > 1 ? 's' : ''} dans votre panier
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Articles du panier */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                {items.map((item, index) => {
                  const productImage = item.product.images && item.product.images.length > 0
                    ? getImageUrl(item.product.images[0])
                    : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3C/svg%3E';

                  const numericPrice = typeof item.product.price === 'string'
                    ? parseFloat(item.product.price)
                    : item.product.price;

                  return (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex gap-6 py-6 ${index !== items.length - 1 ? 'border-b' : ''}`}
                    >
                      {/* Image */}
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden"
                      >
                        <img
                          src={productImage}
                          alt={item.product.title}
                          className="w-full h-full object-cover hover:scale-105 transition-smooth"
                          crossOrigin="anonymous"
                        />
                      </Link>

                      {/* Infos */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <Link
                            to={`/product/${item.product.slug}`}
                            className="font-semibold text-lg hover:text-primary transition-smooth"
                          >
                            {item.product.title}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.product.category?.name}
                          </p>
                        </div>
                        <p className="font-bold text-primary">
                          {formatPrice(numericPrice)} × {item.quantity} = {formatPrice(numericPrice * item.quantity)}
                        </p>
                      </div>

                      {/* Quantité et suppression */}
                      <div className="flex flex-col gap-4 items-end">
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-500 hover:text-red-700 transition-smooth"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Continuer shopping */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6"
              >
                <Link to="/shop" className="text-primary hover:underline flex items-center gap-2">
                  ← Continuer vos achats
                </Link>
              </motion.div>
            </div>

            {/* Résumé commande */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-2xl font-serif font-bold mb-6">Résumé</h2>

                {/* Détails */}
                <div className="space-y-4 mb-6 pb-6 border-b">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-semibold">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="font-semibold">Gratuite</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes</span>
                    <span className="font-semibold">À calculer</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                {/* Bouton checkout */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/checkout-guest" className="block">
                    <Button className="w-full py-6 text-lg">
                      Passer la commande
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </motion.div>

                {/* Info */}
                <p className="text-xs text-muted-foreground text-center mt-4">
                  {user ? (
                    `Connecté en tant que ${user.email}`
                  ) : (
                    'Vous pouvez continuer sans compte ou vous connecter lors de la commande'
                  )}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
