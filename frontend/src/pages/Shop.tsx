import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { productService } from "@/lib/api";
import type { Product } from "@/lib/api";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tout");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    scrollTo(0, 0);
  }, []);
  
  const categories = ["Tout"];

  // Charger les produits depuis la base de données
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const products = await productService.getProducts();
        setAllProducts(Array.isArray(products) ? products : []);
      } catch (err) {
        console.error("Erreur lors du chargement des produits:", err);
        setError("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Construire la liste des catégories dynamiquement
  const dynamicCategories = ["Tout"];
  const uniqueCategories = new Set<string>();
  allProducts.forEach(product => {
    if (product.category?.name) {
      uniqueCategories.add(product.category.name);
    }
  });
  dynamicCategories.push(...Array.from(uniqueCategories).sort());

  const filteredProducts = selectedCategory === "Tout" 
    ? allProducts 
    : allProducts.filter(p => p.category?.name === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
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
            {dynamicCategories.map((category) => (
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
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Chargement des produits...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <ProductCard 
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    images={product.images}
                    category={product.category?.name}
                    slug={product.slug}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Aucun produit dans cette catégorie</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
