import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, Mail, Phone, MapPin, Shield, Calendar, Eye, EyeOff, 
  Copy, Check, AlertCircle, Edit2, Save, X 
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'admin' | 'super_admin';
  createdAt: string;
  avatar?: string;
}

export function AdminProfile() {
  const [profile, setProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch profile');
      
      const data = await response.json();
      setProfile(data.data);
      setFormData({
        firstName: data.data.firstName || '',
        lastName: data.data.lastName || '',
        email: data.data.email,
        phone: data.data.phone || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement du profil' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = () => {
    if (!profile) return 'A';
    const firstName = profile.firstName || 'A';
    const lastName = profile.lastName || 'U';
    return (firstName[0] + lastName[0]).toUpperCase();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Mon Profil
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">Gérez vos informations personnelles</p>
          </div>
          {!editing && (
            <Button
              onClick={() => setEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 gap-2 w-full sm:w-auto"
            >
              <Edit2 size={16} />
              <span className="hidden sm:inline">Modifier</span>
              <span className="sm:hidden">Éditer</span>
            </Button>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'error' ? (
              <AlertCircle size={20} className="flex-shrink-0" />
            ) : (
              <Check size={20} className="flex-shrink-0" />
            )}
            <span className="text-sm sm:text-base">{message.text}</span>
          </div>
        )}

        {/* Profile Card */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
            <CardTitle className="text-xl sm:text-2xl">Informations Personnelles</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="h-24 w-24 ring-4 ring-blue-200">
                <AvatarImage src={profile?.avatar} />
                <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile?.firstName || 'Admin'} {profile?.lastName || 'User'}
                </h2>
                <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start flex-wrap">
                  <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600">
                    {profile?.role === 'super_admin' ? '👑 Super Admin' : '🛡️ Admin'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Depuis {formatDate(profile?.createdAt || new Date().toISOString())}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            {!editing ? (
              <div className="space-y-4 mt-6 pt-6 border-t">
                {/* Email */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={18} className="text-blue-600" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-2">
                    <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono break-all flex-1">
                      {profile?.email}
                    </code>
                    <button
                      onClick={() => copyToClipboard(profile?.email || '')}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      {copied ? (
                        <Check size={16} className="text-emerald-600" />
                      ) : (
                        <Copy size={16} className="text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={18} className="text-blue-600" />
                    <span className="text-sm font-medium">Téléphone</span>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-gray-800 text-sm">
                      {profile?.phone || '—'}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Shield size={18} className="text-blue-600" />
                    <span className="text-sm font-medium">Rôle</span>
                  </div>
                  <div className="sm:col-span-2">
                    <Badge className={
                      profile?.role === 'super_admin'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600'
                    }>
                      {profile?.role === 'super_admin' ? 'Super Administrateur' : 'Administrateur'}
                    </Badge>
                  </div>
                </div>

                {/* Joined */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={18} className="text-blue-600" />
                    <span className="text-sm font-medium">Inscrit</span>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-gray-800 text-sm">{formatDate(profile?.createdAt || '')}</p>
                  </div>
                </div>
              </div>
            ) : (
              // Edit Mode
              <div className="space-y-4 mt-6 pt-6 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="border-gray-300"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="border-gray-300"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-gray-300"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border-gray-300"
                    placeholder="Votre téléphone"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-700 gap-2 flex-1 sm:flex-none"
                  >
                    <Save size={16} />
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                  <Button
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        firstName: profile?.firstName || '',
                        lastName: profile?.lastName || '',
                        email: profile?.email || '',
                        phone: profile?.phone || '',
                      });
                    }}
                    variant="outline"
                    className="gap-2 flex-1 sm:flex-none"
                  >
                    <X size={16} />
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Info Card */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <Shield size={20} className="text-amber-600" />
              Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <Check size={16} className="text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Compte Sécurisé</h3>
                  <p className="text-sm text-gray-500 mt-1">Votre compte est protégé par authentification JWT</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full sm:w-auto mt-4"
              >
                Changer le mot de passe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
