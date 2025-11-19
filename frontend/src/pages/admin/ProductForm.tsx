import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { productService, adminService } from "@/lib/api";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Le titre doit contenir au moins 2 caractères.",
  }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères.",
  }),
  sku: z.string().min(1, {
    message: "Le SKU est requis.",
  }),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().min(0),
  categoryId: z.coerce.number().min(1, {
    message: "Veuillez sélectionner une catégorie",
  }),
  featured: z.boolean(),
  images: z.any(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);

  const loadCategories = async () => {
    try {
      const response = await adminService.getCategories();
      // Le backend renvoie les données dans response.data
      setCategories(response || []);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les catégories",
      });
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      sku: "",
      price: 0,
      stock: 0,
      categoryId: 0,
      featured: false,
      images: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const formData = new FormData();
    
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'images') {
        if (value) {
          Array.from(value).forEach((file: File) => {
            formData.append('images', file);
          });
        }
      } else {
        formData.append(key, String(value));
      }
    });

    try {
      if (id) {
        await productService.updateProduct(Number(id), formData);
        toast({
          title: "Produit mis à jour",
          description: "Le produit a été mis à jour avec succès",
        });
      } else {
        await productService.createProduct(formData);
        toast({
          title: "Produit créé",
          description: "Le produit a été créé avec succès",
        });
      }
      navigate("/admin/products");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde du produit",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      console.log('Chargement du produit...');
      const product = await productService.getAdminProduct(Number(id));
      console.log('Produit reçu:', product);
      
      if (product) {
        form.reset({
          title: product.title || "",
          description: product.description || "",
          sku: product.sku || "",
          price: product.price || 0,
          stock: product.stock || 0,
          categoryId: product.categoryId || 0,
          featured: product.featured || false,
          images: undefined,
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger le produit",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/admin/products')}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {id ? "Modifier le produit" : "Créer un produit"}
              </h1>
              <p className="text-gray-600 mt-1">{id ? "Mettez à jour les détails du produit" : "Ajoutez un nouveau produit à votre catalogue"}</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input placeholder="Titre du produit" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description du produit" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="SKU du produit" {...field} />
                </FormControl>
                <FormDescription>
                  Code unique d'identification du produit
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? field.value.toString() : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Mise en avant</FormLabel>
                  <FormDescription>
                    Afficher ce produit dans la section "Produits en vedette"
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files)}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Sélectionnez une ou plusieurs images pour le produit
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Buttons */}
          <div className="border-t border-gray-200 pt-8 flex gap-3">
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white h-11 text-base font-semibold border-0"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Enregistrement..." : "Enregistrer le produit"}
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/products')}
              className="px-6"
            >
              Annuler
            </Button>
          </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}