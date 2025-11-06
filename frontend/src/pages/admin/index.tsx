import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminDashboard } from './AdminDashboard';
import { ProductsList } from './ProductsList';
import { ProductForm } from './ProductForm';
import { OrdersList } from './OrdersList';
import { UsersList } from './UsersList';
import Categories from './Categories';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="products" element={<ProductsList />} />
      <Route path="products/new" element={<ProductForm />} />
      <Route path="products/:id/edit" element={<ProductForm />} />
      <Route path="categories" element={<Categories />} />
      <Route path="orders" element={<OrdersList />} />
      <Route path="users" element={<UsersList />} />
    </Routes>
  );
}