import { useState, useEffect } from 'react';
import { Product, cartService } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface CartItem {
  product: Product;
  quantity: number;
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems(current => {
      const existingItem = current.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Check stock
        if (existingItem.quantity + quantity > product.stock) {
          toast({
            title: "Stock insuffisant",
            description: `Il ne reste que ${product.stock} exemplaires de ce produit`,
            variant: "destructive",
          });
          return current;
        }
        
        return current.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...current, { product, quantity }];
    });

    toast({
      title: "Produit ajouté",
      description: `${product.title} a été ajouté à votre panier`,
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(current => current.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setItems(current =>
      current.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const checkout = async (address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }) => {
    try {
      setLoading(true);
      await cartService.checkout({
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        address,
      });
      
      clearCart();
      toast({
        title: "Commande confirmée",
        description: "Votre commande a été passée avec succès",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de finaliser votre commande",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return {
    items,
    loading,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    itemCount: items.length,
  };
};

export default useCart;