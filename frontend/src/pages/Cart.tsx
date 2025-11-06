import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  // Panier vide pour l'instant (sera connecté au state management plus tard)
  const cartItems: any[] = [];
  const total = 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartItems.length} />
      
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-12">
              Votre Panier
            </h1>

            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-6">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-serif font-semibold mb-4">
                  Votre panier est vide
                </h2>
                <p className="text-muted-foreground mb-8">
                  Découvrez nos créations uniques et ajoutez-les à votre panier
                </p>
                <Link to="/shop">
                  <Button size="lg" className="rounded-full px-8">
                    Découvrir la boutique
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <>
                <div className="space-y-6 mb-8">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card p-6 rounded-2xl flex items-center gap-6"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-serif font-semibold mb-2">{item.name}</h3>
                        <p className="text-muted-foreground">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary mb-4">{item.price.toFixed(2)} €</p>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card p-8 rounded-2xl"
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-2xl font-serif font-semibold">Total</span>
                    <span className="text-3xl font-bold text-primary">{total.toFixed(2)} €</span>
                  </div>
                  <Button size="lg" className="w-full rounded-full text-lg py-6">
                    Procéder au paiement
                  </Button>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
