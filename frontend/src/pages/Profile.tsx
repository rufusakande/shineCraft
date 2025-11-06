import { useAuthContext } from "@/providers/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Profile() {
  const { user } = useAuthContext();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Mon Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Nom d'utilisateur</h3>
            <p>{user.username}</p>
          </div>
          <div>
            <h3 className="font-semibold">Email</h3>
            <p>{user.email}</p>
          </div>
          <div>
            <h3 className="font-semibold">Rôle</h3>
            <p>{user.role === 'admin' ? 'Administrateur' : 'Client'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}