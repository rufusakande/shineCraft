import axios from 'axios';
import { toast } from '../hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.error || 'An error occurred';
    toast({
      variant: 'destructive',
      title: 'Error',
      description: message,
    });
    
    return Promise.reject(error);
  }
);

// Types
export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: {
    id: number;
    name: string;
    slug: string;
  };
  featured: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface Order {
  id: number;
  userId: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: Array<{
    id: number;
    productId: number;
    quantity: number;
    price: number;
    product: Product;
  }>;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Order[];
  topProducts: Array<{
    id: number;
    name: string;
    sales: number;
    revenue: number;
  }>;
}

// Auth service
export const authService = {
  async login(credentials: LoginCredentials) {
    const { data } = await api.post('/api/auth/login', credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async register(userData: {
    email: string;
    password: string;
    username: string;
  }) {
    const { data } = await api.post('/api/auth/register', userData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// Products service
export const productService = {
  async getProducts(params?: {
    page?: number;
    limit?: number;
    categoryId?: number;
    search?: string;
    sort?: string;
  }) {
    const { data } = await api.get('/api/products', { params });
    // La réponse a la structure: { success, data: { items: [...], meta: {...} } }
    return data.data?.items || [];
  },

  async getProductBySlug(slug: string) {
    const { data } = await api.get(`/api/products/${slug}`);
    return data.data;
  },

  // Admin methods
  async getAdminProducts(params?: {
    page?: number;
    limit?: number;
    categoryId?: number;
    search?: string;
  }) {
    const { data } = await api.get('/api/admin/products', { params });
    // La réponse peut être paginée: { success, data: { items: [...], meta: {...} } }
    return data.data?.items || data.data || [];
  },

  async getAdminProduct(id: number) {
    const { data } = await api.get(`/api/admin/products/${id}`);
    return data.data;
  },

  async createProduct(formData: FormData) {
    const { data } = await api.post('/api/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  async updateProduct(id: number, formData: FormData) {
    const { data } = await api.put(`/api/admin/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  async deleteProduct(id: number) {
    await api.delete(`/api/admin/products/${id}`);
  }
};

// Cart service
export const cartService = {
  async checkout(cartData: {
    items: Array<{ productId: number; quantity: number }>;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  }) {
    const { data } = await api.post('/api/cart/checkout', cartData);
    return data.data;
  }
};

// Admin service
export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const { data } = await api.get('/api/admin/dashboard/stats');
    return data.data;
  },

  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const { data } = await api.get('/api/admin/orders', { params });
    return data.data;
  },

  async updateOrderStatus(orderId: number, status: Order['status']) {
    const { data } = await api.patch(`/api/admin/orders/${orderId}/status`, { status });
    return data.data;
  },

  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }) {
    const { data } = await api.get('/api/admin/users', { params });
    return data.data;
  },

  async updateUserRole(userId: number, role: User['role']) {
    const { data } = await api.patch(`/api/admin/users/${userId}/role`, { role });
    return data.data;
  },

  async deleteUser(userId: number) {
    await api.delete(`/api/admin/users/${userId}`);
  },

  async getCategories() {
    const { data } = await api.get('/api/admin/categories');
    return data.data;
  },

  async createCategory(categoryData: { name: string; slug: string }) {
    const { data } = await api.post('/api/admin/categories', categoryData);
    return data.data;
  },

  async updateCategory(categoryId: number, categoryData: { name: string; slug: string }) {
    const { data } = await api.put(`/api/admin/categories/${categoryId}`, categoryData);
    return data.data;
  },

  async deleteCategory(categoryId: number) {
    await api.delete(`/api/admin/categories/${categoryId}`);
  }
};

export default api;