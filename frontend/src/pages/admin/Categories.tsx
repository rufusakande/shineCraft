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
import { Pencil, Plus, Trash2 } from "lucide-react";

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
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={loading}>
          {loading ? "En cours..." : "Enregistrer"}
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
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les catégories",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCategory) {
        await adminService.updateCategory(editingCategory.id, formData);
        toast({
          title: "Succès",
          description: "Catégorie mise à jour avec succès",
        });
        setIsEditDialogOpen(false);
      } else {
        await adminService.createCategory(formData);
        toast({
          title: "Succès",
          description: "Catégorie créée avec succès",
        });
        setIsAddDialogOpen(false);
      }
      loadCategories();
      setFormData({ name: "", slug: "" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue",
      });
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

  const handleDelete = async (categoryId: number) => {
    try {
      await adminService.deleteCategory(categoryId);
      toast({
        title: "Succès",
        description: "Catégorie supprimée avec succès",
      });
      loadCategories();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Catégories</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle catégorie
              </Button>
            </DialogTrigger>
            <DialogContent>
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

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
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
    </AdminLayout>
  );
}