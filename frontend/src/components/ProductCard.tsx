import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Product } from "@/lib/api";
import { formatPrice } from "@/lib/priceFormatter";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
};

interface ProductCardProps {
  id?: number | string;
  title?: string;
  name?: string;
  price: number | string;
  image?: string;
  images?: string[];
  category?: string;
  slug?: string;
  description?: string;
}

const ProductCard = ({ 
  id, 
  title, 
  name, 
  price, 
  image,
  images,
  category,
  slug
}: ProductCardProps) => {
  const productName = title || name || 'Produit';
  const productImage = image || (images && images.length > 0 ? images[0] : '');
  const displayImage = getImageUrl(productImage);
  // Convertir le prix en nombre (au cas où il viendrait en string de l'API)
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  const displayPrice = isNaN(numericPrice) ? 0 : numericPrice;

  const handleAddToCart = () => {
    toast.success("Ajouté au panier", {
      description: `${productName} a été ajouté à votre panier`,
      duration: 3000,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group glass-card rounded-2xl overflow-hidden transition-smooth cursor-pointer"
    >
      <Link to={`/product/${slug || id}`} className="block relative overflow-hidden aspect-square">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
          src={displayImage}
          alt={productName}
          className="w-full h-full object-cover bg-gray-100"
          crossOrigin="anonymous"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3C/svg%3E';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <Button 
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
            className="w-full glass-card border-white/20 text-white hover:bg-white/20"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Ajouter au panier
          </Button>
        </motion.div>
      </Link>
      
      <Link to={`/product/${slug || id}`} className="block p-6">
        {category && <p className="text-sm text-muted-foreground mb-2">{category}</p>}
        <h3 className="text-xl font-serif font-semibold mb-3">{productName}</h3>
        <p className="text-2xl font-bold text-primary">{formatPrice(displayPrice)}</p>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
