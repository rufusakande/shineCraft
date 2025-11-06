import { Model } from 'sequelize';

export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'customer';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryAttributes {
  id?: number;
  name: string;
  slug: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductAttributes {
  id?: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  categoryId: number;
  images: string[];
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  productId: number;
  qty: number;
  price: number;
}

export interface OrderAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderAttributes {
  id?: number;
  userId: number;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  address: OrderAddress;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NotificationAttributes {
  id?: number;
  type: string;
  message: string;
  read: boolean;
  meta: any;
  userId?: number;
  createdAt?: Date;
}

export interface UserInstance extends Model<UserAttributes>, UserAttributes {}
export interface CategoryInstance extends Model<CategoryAttributes>, CategoryAttributes {}
export interface ProductInstance extends Model<ProductAttributes>, ProductAttributes {}
export interface OrderInstance extends Model<OrderAttributes>, OrderAttributes {}
export interface NotificationInstance extends Model<NotificationAttributes>, NotificationAttributes {}