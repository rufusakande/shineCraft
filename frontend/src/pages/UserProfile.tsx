import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  memberSince: string;
}

export function UserProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    memberSince: '',
  });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <h1 className="text-3xl font-bold mb-4">Accès non autorisé</h1>
            <p className="text-gray-500 mb-8">Vous devez être connecté pour accéder à cette page</p>
            <Button onClick={() => navigate('/login')}>Se connecter</Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    // Reset form data to user state
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    });
    setIsEditing(false);
  };

  const fetchUserStats = async () => {
    setIsLoadingStats(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques');
      }

      const data = await response.json();
      
      // Update form data with fetched data
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        name: data.name || '',
      });

      setStats({
        totalOrders: data.totalOrders || 0,
        totalSpent: data.totalSpent || 0,
        memberSince: data.memberSince ? new Date(data.memberSince).toLocaleDateString('fr-FR') : 'N/A',
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des statistiques');
      setStats({
        totalOrders: 0,
        totalSpent: 0,
        memberSince: 'N/A',
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.firstName || !formData.lastName) {
      toast.error('Veuillez remplir le prénom et le nom');
      return;
    }

    if (!formData.name) {
      toast.error('Veuillez remplir le nom d\'affichage');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour');
      }

      const data = await response.json();
      
      // Update form data with response
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
      });

      // Update stats
      setStats({
        totalOrders: data.totalOrders || 0,
        totalSpent: data.totalSpent || 0,
        memberSince: data.memberSince ? new Date(data.memberSince).toLocaleDateString('fr-FR') : 'N/A',
      });

      toast.success('Profil mis à jour avec succès!');
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Mon Profil</h1>
              <p className="text-gray-600">Gérez vos informations personnelles</p>
            </div>

            {/* Profil Card */}
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between flex-wrap">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations Personnelles
                </CardTitle>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Votre prénom"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="name">Nom d'affichage</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nom d'affichage"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        disabled
                        className="bg-gray-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                    </div>

                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Votre numéro de téléphone"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Prénom</p>
                        <p className="font-semibold text-xs text-wrap">{formData.firstName || 'Non renseigné'}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Nom</p>
                        <p className="font-semibold text-xs">{formData.lastName || 'Non renseigné'}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Nom d'affichage</p>
                      <p className="font-semibold text-xs">{formData.name}</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Email</p>
                      <p className="font-semibold text-xs ">{formData.email}</p>
                    </div>

                    {formData.phone && (
                      <div className="p-3 bg-gray-50 rounded-lg flex items-start gap-3">
                        <Phone className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Téléphone</p>
                          <p className="font-semibold text-lg">{formData.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{stats.totalOrders}</p>
                    <p className="text-sm text-gray-600 mt-2">Commandes passées</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{Number(stats.totalSpent).toFixed(0)} XOF</p>
                    <p className="text-sm text-gray-600 mt-2">Total dépensé</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">Membre</p>
                    <p className="text-sm text-gray-600 mt-2">Depuis {stats.memberSince}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
