import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { productService, Product } from "@/lib/api";
import { ArrowLeft, ImageIcon } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Fonction pour construire l'URL complète de l'image
const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
};

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      console.log('Chargement du produit...');
      const data = await productService.getAdminProduct(Number(id));
      console.log('Produit reçu:', data);
      setProduct(data);
      // Définir l'image principale
      if (data.images && data.images.length > 0) {
        setMainImage(data.images[0]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les détails du produit",
      });
      // Rediriger vers la liste des produits en cas d'erreur
      setTimeout(() => navigate('/admin/products'), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Chargement du produit...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-red-500">Produit non trouvé</p>
          <Button asChild>
            <Link to="/admin/products">Retour aux produits</Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/admin/products')}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{product.title}</h1>
              <p className="text-gray-600 mt-1">Détails complets du produit</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Images */}
            {product.images && product.images.length > 0 ? (
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Images du produit</h2>
                  <div className="space-y-4">
                    {/* Image principale */}
                    <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      {mainImage ? (
                        <img
                          src={getImageUrl(mainImage)}
                          alt={product.title}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log('Erreur de chargement image:', mainImage);
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="12" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3EImage non disponible%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                          <p className="text-gray-500">Aucune image</p>
                        </div>
                      )}
                    </div>

                    {/* Miniatures */}
                    {product.images.length > 1 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Images supplémentaires</p>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {product.images.map((image, index) => (
                            <div
                              key={index}
                              className={`aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer border-2 transition-all hover:border-blue-300 ${
                                mainImage === image ? 'border-blue-500 ring-2 ring-blue-300' : 'border-transparent'
                              }`}
                              onClick={() => setMainImage(image)}
                            >
                              <img
                                src={getImageUrl(image)}
                                alt={`${product.title} - ${index + 1}`}
                                crossOrigin="anonymous"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center gap-4">
                  <ImageIcon className="w-16 h-16 text-gray-300" />
                  <p className="text-gray-500 font-medium">Aucune image pour ce produit</p>
                </div>
              </div>
            )}

            {/* Détails du produit */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Informations</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">SKU</p>
                    <p className="text-lg font-semibold text-gray-900">{product.slug || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Catégorie</p>
                    <Badge className="bg-blue-100 text-blue-800 border-0">{product.category?.name || 'N/A'}</Badge>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <p className="text-sm font-medium text-gray-600 mb-2">Prix</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">{product.price} XOF</p>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <p className="text-sm font-medium text-gray-600 mb-2">Stock</p>
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-bold text-gray-900">{product.stock}</p>
                      <Badge 
                        variant={product.stock > 0 ? "default" : "destructive"}
                        className={product.stock > 0 ? "bg-emerald-100 text-emerald-800 border-0" : ""}
                      >
                        {product.stock > 0 ? "En stock" : "Rupture"}
                      </Badge>
                    </div>
                  </div>

                  {product.featured && (
                    <div className="border-t border-gray-200 pt-6">
                      <Badge className="bg-amber-100 text-amber-800 border-0 text-base py-2 px-3">
                        ⭐ Produit en vedette
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white border-0 h-11"
                  asChild
                >
                  <Link to={`/admin/products/${product.id}/edit`}>
                    Modifier ce produit
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  className="w-full h-11"
                  asChild
                >
                  <Link to="/admin/products">
                    Retour à la liste
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
