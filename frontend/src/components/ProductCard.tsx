import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const ProductCard = ({ id, name, price, image, category }: ProductCardProps) => {
  const handleAddToCart = () => {
    toast.success("Ajouté au panier", {
      description: `${name} a été ajouté à votre panier`,
      duration: 3000,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group glass-card rounded-2xl overflow-hidden transition-smooth cursor-pointer"
    >
      <div className="relative overflow-hidden aspect-square">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <Button 
            onClick={handleAddToCart}
            className="w-full glass-card border-white/20 text-white hover:bg-white/20"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Ajouter au panier
          </Button>
        </motion.div>
      </div>
      
      <div className="p-6">
        <p className="text-sm text-muted-foreground mb-2">{category}</p>
        <h3 className="text-xl font-serif font-semibold mb-3">{name}</h3>
        <p className="text-2xl font-bold text-primary">{price.toFixed(2)} €</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
