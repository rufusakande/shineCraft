import { useState, useEffect } from "react";
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
import { Shield, User, Trash2, RefreshCw, ChevronLeft, ChevronRight, X, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const ITEMS_PER_PAGE = 10;

type UserType = {
  id: number;
  email: string;
  name?: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt?: string;
};

export function UsersList() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const toastHook = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      toastHook.toast({
        title: 'Erreur',
        description: 'Erreur lors du chargement des utilisateurs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleChangeRole = (user: UserType) => {
    setSelectedUser(user);
    setNewRole(user.role === 'admin' ? 'user' : 'admin');
    setShowRoleModal(true);
  };

  const updateUserRole = async () => {
    if (!selectedUser || newRole === selectedUser.role) {
      setShowRoleModal(false);
      return;
    }

    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUsers(users.map(u => 
          u.id === selectedUser.id ? { ...u, role: newRole } : u
        ));
        toastHook.toast({
          title: 'Succès',
          description: `Rôle changé en ${newRole === 'admin' ? 'Admin' : 'Client'}`,
        });
        setShowRoleModal(false);
      } else {
        const error = await response.json();
        toastHook.toast({
          title: 'Erreur',
          description: error.error || 'Impossible de changer le rôle',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toastHook.toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = (user: UserType) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setUsers(users.filter(u => u.id !== selectedUser.id));
        toastHook.toast({
          title: 'Succès',
          description: 'Utilisateur supprimé avec succès',
        });
        setShowDeleteModal(false);
      } else {
        const error = await response.json();
        toastHook.toast({
          title: 'Erreur',
          description: error.error || 'Erreur lors de la suppression',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toastHook.toast({
        title: 'Erreur',
        description: 'Erreur lors de la suppression',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' 
      ? 'bg-red-50 text-red-700 border border-red-200' 
      : 'bg-blue-50 text-blue-700 border border-blue-200';
  };

  const getRoleIcon = (role: string) => {
    return role === 'admin' ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />;
  };

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Chargement des utilisateurs...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Utilisateurs</h1>
              <p className="text-sm sm:text-base text-gray-600">{filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} au total</p>
            </div>
            <Button 
              onClick={fetchUsers} 
              disabled={refreshing}
              className="mt-4 sm:mt-0 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white border-0"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 bg-white text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 bg-white text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">Tous les rôles</option>
              <option value="user">Client</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-25">
                    <TableHead className="text-gray-900 font-semibold text-xs sm:text-sm">Email</TableHead>
                    <TableHead className="text-gray-900 font-semibold text-xs sm:text-sm hidden sm:table-cell">Nom</TableHead>
                    <TableHead className="text-gray-900 font-semibold text-xs sm:text-sm">Rôle</TableHead>
                    <TableHead className="text-gray-900 font-semibold text-xs sm:text-sm hidden md:table-cell">Inscrit le</TableHead>
                    <TableHead className="text-gray-900 font-semibold text-xs sm:text-sm hidden lg:table-cell">Modifié le</TableHead>
                    <TableHead className="text-gray-900 font-semibold text-xs sm:text-sm text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user, idx) => (
                      <TableRow 
                        key={user.id}
                        className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50 transition-colors duration-200 text-xs sm:text-sm ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                      >
                        <TableCell className="font-semibold text-gray-900 p-3 sm:p-4">{user.email}</TableCell>
                        <TableCell className="text-gray-700 p-3 sm:p-4 hidden sm:table-cell">{user.name || '-'}</TableCell>
                        <TableCell className="p-3 sm:p-4">
                          <div className={`flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full w-fit text-xs sm:text-sm font-semibold ${getRoleColor(user.role)}`}>
                            {getRoleIcon(user.role)}
                            <span className="hidden sm:inline">{user.role === 'admin' ? 'Admin' : 'Client'}</span>
                            <span className="sm:hidden">{user.role === 'admin' ? 'A' : 'C'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 p-3 sm:p-4 hidden md:table-cell text-xs sm:text-sm">
                          {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell className="text-gray-600 p-3 sm:p-4 hidden lg:table-cell text-xs sm:text-sm">
                          {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('fr-FR') : '-'}
                        </TableCell>
                        <TableCell className="p-3 sm:p-4">
                          <div className="flex gap-1 sm:gap-2 justify-center">
                            <Button 
                              size="sm"
                              variant="ghost"
                              onClick={() => handleChangeRole(user)}
                              className="hover:bg-blue-100 hover:text-blue-600 h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3"
                            >
                              <Edit2 className="h-4 w-4" />
                              <span className="hidden sm:inline ml-1">Rôle</span>
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteClick(user)}
                              className="hover:bg-red-700 h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="hidden sm:inline ml-1">Supprimer</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
                        <div className="flex flex-col items-center gap-2">
                          <p className="font-medium">Aucun utilisateur trouvé</p>
                          <p className="text-xs sm:text-sm">Essayez de modifier vos critères de recherche</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50">
                <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                  Affichage {startIdx + 1} à {Math.min(startIdx + ITEMS_PER_PAGE, filteredUsers.length)} sur {filteredUsers.length}
                </p>
                <div className="flex gap-1 sm:gap-2 justify-center sm:justify-end overflow-x-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 text-xs sm:text-sm h-8 sm:h-9"
                  >
                    <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Précédent</span>
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return page <= totalPages && page > 0 ? (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`text-xs sm:text-sm h-8 sm:h-9 w-8 sm:w-9 p-0 ${currentPage === page ? "bg-blue-600 text-white" : ""}`}
                        >
                          {page}
                        </Button>
                      ) : null;
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 text-xs sm:text-sm h-8 sm:h-9"
                  >
                    <span className="hidden sm:inline">Suivant</span>
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Change Role */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Changer le rôle</h2>
              <button
                onClick={() => setShowRoleModal(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Utilisateur</p>
                <p className="font-semibold text-gray-900">{selectedUser.email}</p>
                <p className="text-sm text-gray-600">{selectedUser.name || '-'}</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Rôle actuel:</span> {selectedUser.role === 'admin' ? 'Admin' : 'Client'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">Nouveau rôle</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'admin' | 'user')}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="user">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className={`border-l-4 p-3 rounded ${newRole === 'admin' ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-300'}`}>
                <p className={`text-sm ${newRole === 'admin' ? 'text-red-800' : 'text-blue-800'}`}>
                  {newRole === 'admin' 
                    ? '⚠️ Cet utilisateur aura accès aux fonctions administrateur'
                    : '✓ Cet utilisateur aura accès uniquement aux fonctions client'
                  }
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
              <Button
                onClick={() => setShowRoleModal(false)}
                variant="outline"
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={updateUserRole}
                disabled={updating}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {updating ? 'Mise à jour...' : 'Changer le rôle'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete User */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Supprimer l'utilisateur</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  ⚠️ <span className="font-semibold">Cette action est irréversible.</span> Êtes-vous vraiment sûr ?
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Utilisateur à supprimer:</p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="font-semibold text-gray-900">{selectedUser.email}</p>
                  <p className="text-sm text-gray-600">{selectedUser.name || '-'}</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  ℹ️ Toutes les commandes de cet utilisateur seront également supprimées.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="outline"
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {deleting ? 'Suppression...' : 'Supprimer définitivement'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}