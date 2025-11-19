import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { productService, Product } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
};

export function PublicProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      if (!slug) return;
      const data = await productService.getProductBySlug(slug);
      setProduct(data);
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
      toast.error('Produit non trouvé');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (quantity > product.stock) {
      toast.error(`Stock insuffisant (${product.stock} disponible)`);
      return;
    }
    addItem(product, quantity);
    toast.success(`${quantity} ${product.title} ajouté au panier`);
    setQuantity(1);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Rediriger vers le checkout
    window.location.href = '/checkout';
  };

  const handleQuantityChange = (value: number) => {
    if (value > 0 && value <= (product?.stock || 0)) {
      setQuantity(value);
    }
  };

  const images = product?.images && product.images.length > 0
    ? product.images.map(img => getImageUrl(img))
    : ['data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500"%3E%3Crect fill="%23f3f4f6" width="500" height="500"/%3E%3Ctext x="50%" y="50%" font-size="24" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3EImage non disponible%3C/text%3E%3C/svg%3E'];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-gray-500 mb-4">Produit non trouvé</p>
          <Link to="/shop" className="text-primary hover:underline">
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  const numericPrice = typeof product.price === 'string'
    ? parseFloat(product.price)
    : product.price;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Link to="/" className="hover:text-foreground">Accueil</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-foreground">Boutique</Link>
            <span>/</span>
            <span className="text-foreground">{product.title}</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Galerie d'images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-4"
            >
              {/* Image principale */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={images[selectedImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500"%3E%3Crect fill="%23f3f4f6" width="500" height="500"/%3E%3C/svg%3E';
                  }}
                />

                {/* Boutons navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-smooth"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-smooth"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-smooth ${
                        selectedImageIndex === index
                          ? 'border-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Informations produit */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col justify-between"
            >
              {/* Header */}
              <div>
                {product.category && (
                  <p className="text-sm text-primary font-medium mb-2">{product.category.name}</p>
                )}
                <h1 className="text-4xl font-serif font-bold mb-4">{product.title}</h1>

                {/* Prix et stock */}
                <div className="mb-6">
                  <p className="text-3xl font-bold text-primary mb-2">
                    {numericPrice.toFixed(2)} €
                  </p>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.stock > 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                    </span>
                    {product.featured && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
                        ⭐ En vedette
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-3">Description</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Product ID */}
                {product.id && (
                  <p className="text-sm text-muted-foreground mb-8">
                    <span className="font-semibold">Product ID:</span> {product.id}
                  </p>
                )}
              </div>

              {/* Quantité et actions */}
              <div className="space-y-4">
                {/* Sélecteur de quantité */}
                <div className="flex items-center gap-4">
                  <label className="font-medium">Quantité:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-16 text-center border-0 focus:ring-0"
                      min="1"
                      max={product.stock}
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-4 pt-4">
                  <motion.div className="flex-1">
                    <Button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      variant="outline"
                      className="w-full py-6 text-lg"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Ajouter au panier
                    </Button>
                  </motion.div>
                  <motion.div className="flex-1">
                    <Button
                      onClick={handleBuyNow}
                      disabled={product.stock === 0}
                      className="w-full py-6 text-lg"
                    >
                      Acheter maintenant
                    </Button>
                  </motion.div>
                </div>

                {/* Boutons secondaires */}
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-smooth"
                  >
                    <Heart
                      className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                    />
                    Ajouter à mes favoris
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-smooth">
                    <Share2 className="h-5 w-5" />
                    Partager
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicProductDetail;
