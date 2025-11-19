import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, Edit2, Trash2, Plus, RefreshCw, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { productService, Product } from "@/lib/api";

const ITEMS_PER_PAGE = 10;

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm]);

  const loadProducts = async () => {
    try {
      setRefreshing(true);
      const products = await productService.getAdminProducts();
      if (Array.isArray(products)) {
        setProducts(products);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les produits",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleDelete = async (id: number) => {
    try {
      await productService.deleteProduct(id);
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès",
      });
      loadProducts();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du produit",
      });
    }
  };

  const getStockColor = (stock: number) => {
    if (stock > 10) return 'bg-emerald-100 text-emerald-800';
    if (stock > 0) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Chargement des produits...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Produits</h1>
              <p className="text-gray-600">{filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} au total</p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button 
                onClick={loadProducts} 
                disabled={refreshing}
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button 
                asChild
                className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white border-0"
              >
                <Link to="/admin/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Link>
              </Button>
            </div>
          </div>

          {/* Search Filter */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Rechercher par nom ou catégorie..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-25">
                    <TableHead className="text-gray-900 font-semibold">Produit</TableHead>
                    <TableHead className="text-gray-900 font-semibold text-right">Prix</TableHead>
                    <TableHead className="text-gray-900 font-semibold">Stock</TableHead>
                    <TableHead className="text-gray-900 font-semibold">Catégorie</TableHead>
                    <TableHead className="text-gray-900 font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product, idx) => (
                      <TableRow 
                        key={product.id}
                        className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50 transition-colors duration-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                      >
                        <TableCell className="font-semibold text-gray-900">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-lg flex items-center justify-center">
                              <Package className="h-4 w-4 text-blue-600" />
                            </div>
                            {product.title}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold text-gray-900">{product.price} XOF</TableCell>
                        <TableCell>
                          <Badge className={`${getStockColor(product.stock)} border-0`}>
                            {product.stock} unités
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">{product.category?.name || '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-center">
                            <Link to={`/admin/products/${product.id}`}>
                              <Button size="sm" variant="ghost" className="hover:bg-blue-100 hover:text-blue-600">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link to={`/admin/products/${product.id}/edit`}>
                              <Button size="sm" variant="ghost" className="hover:bg-amber-100 hover:text-amber-600">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </Link>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="hover:bg-red-100 hover:text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Cette action est irréversible. Le produit sera définitivement supprimé.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(product.id)}>
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <Package className="h-12 w-12 text-gray-300" />
                          <p className="text-lg font-medium">Aucun produit trouvé</p>
                          <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                <p className="text-sm text-gray-600">
                  Affichage {startIdx + 1} à {Math.min(startIdx + ITEMS_PER_PAGE, filteredProducts.length)} sur {filteredProducts.length}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Précédent
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-blue-600 text-white" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}