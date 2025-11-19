import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Bell, Lock, Palette, Globe, Database, LogOut, Save, AlertCircle, Check
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Settings {
  notifications: {
    orders: boolean;
    users: boolean;
    products: boolean;
    email: boolean;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: 'fr' | 'en';
  };
}

export function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      orders: true,
      users: true,
      products: true,
      email: true,
    },
    security: {
      twoFactor: false,
      sessionTimeout: 60,
    },
    preferences: {
      theme: 'light',
      language: 'fr',
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) throw new Error('Failed to save settings');
      
      setMessage({ type: 'success', text: 'Paramètres sauvegardés avec succès' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Paramètres
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Configurez votre expérience d'administration</p>
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

        {/* Notifications Settings */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <Bell size={20} className="text-blue-600" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-4">
              {/* Orders Notifications */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Notifications de commandes</h3>
                  <p className="text-sm text-gray-500 mt-1">Recevez une alerte quand une commande est placée</p>
                </div>
                <Switch
                  checked={settings.notifications.orders}
                  onCheckedChange={(value) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, orders: value }
                    })
                  }
                />
              </div>

              {/* Users Notifications */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Notifications d'utilisateurs</h3>
                  <p className="text-sm text-gray-500 mt-1">Recevez une alerte quand un nouvel utilisateur s'inscrit</p>
                </div>
                <Switch
                  checked={settings.notifications.users}
                  onCheckedChange={(value) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, users: value }
                    })
                  }
                />
              </div>

              {/* Products Notifications */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Notifications de produits</h3>
                  <p className="text-sm text-gray-500 mt-1">Recevez une alerte quand les stocks sont faibles</p>
                </div>
                <Switch
                  checked={settings.notifications.products}
                  onCheckedChange={(value) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, products: value }
                    })
                  }
                />
              </div>

              {/* Email Notifications */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Notifications par email</h3>
                  <p className="text-sm text-gray-500 mt-1">Recevoir un email pour chaque notification</p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(value) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, email: value }
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <Lock size={20} className="text-amber-600" />
              Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Two Factor */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Authentification à deux facteurs</h3>
                <p className="text-sm text-gray-500 mt-1">Sécurisez votre compte avec 2FA</p>
              </div>
              <Switch
                checked={settings.security.twoFactor}
                onCheckedChange={(value) =>
                  setSettings({
                    ...settings,
                    security: { ...settings.security, twoFactor: value }
                  })
                }
              />
            </div>

            {/* Session Timeout */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <label className="block">
                <h3 className="font-medium text-gray-900">Délai d'inactivité de session</h3>
                <p className="text-sm text-gray-500 mt-1">Déconnecter après inactivité (minutes)</p>
              </label>
              <Select
                value={settings.security.sessionTimeout.toString()}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    security: { ...settings.security, sessionTimeout: parseInt(value) }
                  })
                }
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                  <SelectItem value="120">2 heures</SelectItem>
                  <SelectItem value="480">8 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <Palette size={20} className="text-purple-600" />
              Préférences
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Theme */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <label className="block">
                <h3 className="font-medium text-gray-900">Thème</h3>
                <p className="text-sm text-gray-500 mt-1">Choisissez votre thème d'interface</p>
              </label>
              <Select
                value={settings.preferences.theme}
                onValueChange={(value: any) =>
                  setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, theme: value }
                  })
                }
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">☀️ Clair</SelectItem>
                  <SelectItem value="dark">🌙 Sombre</SelectItem>
                  <SelectItem value="auto">🔄 Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <label className="block">
                <h3 className="font-medium text-gray-900">Langue</h3>
                <p className="text-sm text-gray-500 mt-1">Sélectionnez votre langue préférée</p>
              </label>
              <Select
                value={settings.preferences.language}
                onValueChange={(value: any) =>
                  setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, language: value }
                  })
                }
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">🇫🇷 Français</SelectItem>
                  <SelectItem value="en">🇬🇧 English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Data & Storage */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <Database size={20} className="text-green-600" />
              Données
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                <span className="font-medium text-gray-900">Espace disque utilisé</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">4.2 GB sur 10 GB</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600">Images</p>
                <p className="text-lg font-bold text-blue-600">2.1 GB</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-lg font-bold text-green-600">1.5 GB</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600">Cache</p>
                <p className="text-lg font-bold text-purple-600">0.6 GB</p>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4">
              Vider le cache
            </Button>
          </CardContent>
        </Card>

        {/* Save & Logout */}
        <div className="flex flex-col sm:flex-row gap-3 sticky bottom-4 sm:bottom-6 bg-white/95 backdrop-blur p-4 rounded-lg border shadow-lg">
          <Button
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 gap-2 flex-1"
          >
            <Save size={18} />
            {saving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2 flex-1"
          >
            <LogOut size={18} />
            Déconnexion
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
