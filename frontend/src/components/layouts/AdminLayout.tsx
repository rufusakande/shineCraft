import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  Tags,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/providers/AuthProvider";
import { useState, useEffect } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Fermé par défaut sur mobile
  const [isMobile, setIsMobile] = useState(false);
  const [notificationsCount] = useState(3);

  // Déterminer si c'est mobile et fermer le sidebar au changement de route
  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth < 1024;
      setIsMobile(isSmallScreen);
      if (!isSmallScreen) {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fermer le sidebar lors du changement de route sur mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Produits",
      href: "/admin/products",
      icon: ShoppingBag,
    },
    {
      name: "Catégories",
      href: "/admin/categories",
      icon: ClipboardList,
    },
    {
      name: "Commandes",
      href: "/admin/orders",
      icon: ClipboardList,
    },
    {
      name: "Utilisateurs",
      href: "/admin/users",
      icon: Users,
    },
  ];

  return (
    <div className="flex h-screen flex-col w-full bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Overlay mobile */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-30  bg-gradient-to-br from-slate-50 via-white to-slate-100 transition-opacity duration-300 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex h-16 items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Left: Menu button + Logo */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-gray-100"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <span className="text-lg sm:text-xl md:text-2xl font-bold whitespace-nowrap">
                Shine<span className="text-yellow-500">Craft</span>
              </span>
            </Link>
          </div>

          {/* Right: Notifications + User Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                  <Bell className="h-5 w-5" />
                  {notificationsCount > 0 && (
                    <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                      {notificationsCount < 10 ? notificationsCount : "9+"}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 sm:w-80">
                <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="py-2 px-3 hover:bg-gray-50">
                  <div className="flex flex-col gap-1 w-full">
                    <p className="text-sm font-medium">Nouvelle commande #123</p>
                    <p className="text-xs text-gray-500">Il y a 2 minutes</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2 px-3 hover:bg-gray-50">
                  <div className="flex flex-col gap-1 w-full">
                    <p className="text-sm font-medium">Stock faible : "Collier en or"</p>
                    <p className="text-xs text-gray-500">Il y a 1 heure</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2 px-3 hover:bg-gray-50">
                  <div className="flex flex-col gap-1 w-full">
                    <p className="text-sm font-medium">Nouveau message de support</p>
                    <p className="text-xs text-gray-500">Il y a 3 heures</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100">
                  <span className="hidden sm:block text-sm font-medium truncate max-w-[100px]">
                    {user?.name || "Admin"}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-semibold">Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Link to="/admin/profile" className="w-full">
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Link to="/admin/settings" className="w-full">
                    Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => logout()}
                  className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main container with sidebar and content */}
      <div className="flex flex-1 pt-16  bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-16 left-0 z-40 w-64 sm:w-72 flex-col transition-transform duration-300 ease-in-out lg:static lg:inset-auto lg:z-auto",
            sidebarOpen ? "translate-x-0 flex" : "-translate-x-full hidden lg:flex"
          )}
        >
          <div className="flex h-[calc(100vh-64px)] flex-col overflow-y-auto border-r border-gray-200 bg-white">
            <nav className="flex flex-1 flex-col px-3 sm:px-4 py-4">
              <ul role="list" className="flex flex-1 flex-col gap-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-r from-blue-50 to-emerald-50 text-blue-600 border border-blue-100 shadow-sm"
                            : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        )}
                        onClick={() => {
                          if (isMobile) {
                            setSidebarOpen(false);
                          }
                        }}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer info */}
            <div className="border-t border-gray-200 px-3 sm:px-4 py-4">
              <p className="text-xs text-gray-500">shineCraft © 2025</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}