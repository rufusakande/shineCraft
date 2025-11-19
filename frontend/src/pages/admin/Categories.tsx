import { useState, useEffect } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { adminService } from "@/lib/api";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Pencil, Plus, Trash2, RefreshCw, FolderOpen } from "lucide-react";
import { toast as sonnerToast } from "sonner";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CategoryFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: {
    name: string;
    slug: string;
  };
  setFormData: (data: { name: string; slug: string; }) => void;
  loading: boolean;
}

function CategoryForm({ onSubmit, formData, setFormData, loading }: CategoryFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid w-full gap-2">
        <Label htmlFor="name" className="text-sm font-semibold">Nom de la catégorie</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: Électronique"
          className="h-11 border-gray-200 focus:ring-blue-500"
          required
        />
      </div>
      <div className="grid w-full gap-2">
        <Label htmlFor="slug" className="text-sm font-semibold">Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="Ex: electronique"
          className="h-11 border-gray-200 focus:ring-blue-500"
          required
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white border-0">
          {loading ? "En cours..." : "Enregistrer la catégorie"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setRefreshing(true);
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les catégories",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCategory) {
        await adminService.updateCategory(editingCategory.id, formData);
        sonnerToast.success("Catégorie mise à jour avec succès");
        setIsEditDialogOpen(false);
      } else {
        await adminService.createCategory(formData);
        sonnerToast.success("Catégorie créée avec succès");
        setIsAddDialogOpen(false);
      }
      loadCategories();
      setFormData({ name: "", slug: "" });
    } catch (error) {
      sonnerToast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (categoryId: number, categoryName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${categoryName}" ?`)) {
      return;
    }

    try {
      await adminService.deleteCategory(categoryId);
      sonnerToast.success("Catégorie supprimée avec succès");
      loadCategories();
    } catch (error) {
      sonnerToast.error("Impossible de supprimer la catégorie");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Catégories</h1>
              <p className="text-gray-600">{categories.length} catégorie{categories.length !== 1 ? 's' : ''} au total</p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button 
                onClick={loadCategories}
                disabled={refreshing}
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white border-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle catégorie
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Ajouter une catégorie</DialogTitle>
                    <DialogDescription>
                      Créez une nouvelle catégorie de produits
                    </DialogDescription>
                  </DialogHeader>
                  <CategoryForm
                    onSubmit={handleSubmit}
                    formData={formData}
                    setFormData={setFormData}
                    loading={loading}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-25">
                    <TableHead className="text-gray-900 font-semibold">Catégorie</TableHead>
                    <TableHead className="text-gray-900 font-semibold">Slug</TableHead>
                    <TableHead className="text-gray-900 font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length > 0 ? (
                    categories.map((category, idx) => (
                      <TableRow 
                        key={category.id}
                        className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50 transition-colors duration-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                      >
                        <TableCell className="font-semibold text-gray-900">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-lg flex items-center justify-center">
                              <FolderOpen className="h-4 w-4 text-blue-600" />
                            </div>
                            {category.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 font-mono text-sm">{category.slug}</TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(category)}
                              className="hover:bg-amber-100 hover:text-amber-600"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(category.id, category.name)}
                              className="hover:bg-red-100 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <FolderOpen className="h-12 w-12 text-gray-300" />
                          <p className="text-lg font-medium">Aucune catégorie trouvée</p>
                          <p className="text-sm">Créez votre première catégorie</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Modifier la catégorie</DialogTitle>
                <DialogDescription>
                  Modifiez les informations de la catégorie
                </DialogDescription>
              </DialogHeader>
              <CategoryForm
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                loading={loading}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AdminLayout>
  );
}