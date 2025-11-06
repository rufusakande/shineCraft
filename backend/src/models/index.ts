import { sequelize } from '../config/database';
import User from './User';
import Category from './Category';
import Product from './Product';
import Order from './Order';
import Notification from './Notification';

// Associations
Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

Category.hasMany(Product, {
  foreignKey: 'categoryId',
  as: 'products',
});

Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders',
});

Notification.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Notification, {
  foreignKey: 'userId',
  as: 'notifications',
});

export {
  User,
  Category,
  Product,
  Order,
  Notification,
};

export default {
  User,
  Category,
  Product,
  Order,
  Notification,
};

export { sequelize };