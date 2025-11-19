import { sequelize } from '../config/database';
import User from './User';
import Category from './Category';
import Product from './Product';
import Order from './Order';
import Payment from './Payment';
import Notification from './Notification';
import AdminSettings from './AdminSettings';

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

Payment.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order',
});

Order.hasOne(Payment, {
  foreignKey: 'orderId',
  as: 'payment',
});

Notification.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Notification, {
  foreignKey: 'userId',
  as: 'notifications',
});

AdminSettings.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasOne(AdminSettings, {
  foreignKey: 'userId',
  as: 'settings',
});

export {
  User,
  Category,
  Product,
  Order,
  Payment,
  Notification,
  AdminSettings,
};

export default {
  User,
  Category,
  Product,
  Order,
  Payment,
  Notification,
  AdminSettings,
};

export { sequelize };