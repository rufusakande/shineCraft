import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AdminLayout } from "@/components/layouts/AdminLayout";

export function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Produits</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Total des produits : 0</p>
            </CardContent>
          </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total des commandes : 0</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total des utilisateurs : 0</p>
          </CardContent>
        </Card>
      </div>
    </div>
    </AdminLayout>
  );
}