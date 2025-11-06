import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import productRing from "@/assets/product-ring.jpg";
import productNecklace from "@/assets/product-necklace.jpg";
import productBracelet from "@/assets/product-bracelet.jpg";
import productEarrings from "@/assets/product-earrings.jpg";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tout");

  const categories = ["Tout", "Bagues", "Colliers", "Bracelets", "Boucles d'oreilles"];

  const products = [
    { id: "1", name: "Bague Florale Or", price: 289.00, image: productRing, category: "Bagues" },
    { id: "2", name: "Collier Pendentif Rose", price: 349.00, image: productNecklace, category: "Colliers" },
    { id: "3", name: "Bracelet Artisanal", price: 199.00, image: productBracelet, category: "Bracelets" },
    { id: "4", name: "Boucles d'Oreilles Élégantes", price: 159.00, image: productEarrings, category: "Boucles d'oreilles" },
    { id: "5", name: "Bague Solitaire", price: 399.00, image: productRing, category: "Bagues" },
    { id: "6", name: "Collier Perles", price: 279.00, image: productNecklace, category: "Colliers" },
    { id: "7", name: "Bracelet Charm", price: 229.00, image: productBracelet, category: "Bracelets" },
    { id: "8", name: "Créoles Or Rose", price: 189.00, image: productEarrings, category: "Boucles d'oreilles" },
  ];

  const filteredProducts = selectedCategory === "Tout" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={0} />
      
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl sm:text-6xl font-serif font-bold mb-6">
              Notre Boutique
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explorez notre collection de bijoux artisanaux faits main avec passion
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full px-6 py-2 transition-smooth"
              >
                {category}
              </Button>
            ))}
          </motion.div>

          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
