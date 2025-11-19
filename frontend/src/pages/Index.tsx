import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import { Sparkles, Heart, Shield } from "lucide-react";
import { productService, Product } from "@/lib/api";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
};

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      // Récupérer les produits
      const products = await productService.getProducts();
      console.log('Produits reçus:', products);
      
      if (Array.isArray(products)) {
        // Filtrer les produits en vedette et limiter à 4
        const featured = products.filter(p => p.featured).slice(0, 4);
        setFeaturedProducts(featured.length > 0 ? featured : products.slice(0, 4));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Fait main",
      description: "Chaque pièce est unique, façonnée avec soin par nos artisans"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Matériaux nobles",
      description: "Or, argent et pierres précieuses sélectionnés avec attention"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Garantie à vie",
      description: "Nous garantissons la qualité de nos créations pour toujours"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <HeroSection />

      {/* Featured Products Section */}
      <section className="py-24 bg-gradient-to-b from-background to-accent/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-primary font-medium mb-4 tracking-wide">NOUVEAUTÉS</p>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-6">
              Nos Créations Phares
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre sélection de bijoux artisanaux, chacun racontant une histoire unique
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Chargement des produits...</p>
              </div>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
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
                <p className="text-gray-500">Aucun produit disponible</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-serif font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-6">
              Prêt à trouver votre bijou unique ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Explorez notre collection complète et laissez-vous séduire par l'art de l'artisanat
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-primary text-primary-foreground rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-smooth"
            >
              Voir toute la boutique
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
