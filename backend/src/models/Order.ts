import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { OrderInstance } from './types';

const Order = sequelize.define<OrderInstance>(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    items: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'shipped', 'cancelled', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'kkiapay',
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      unique: true,
    },
    shippingAddress: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },
    address: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },
    shippingMethod: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'standard',
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    customerPhone: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    tableName: 'orders',
  }
);

export default Order;