import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db';

export interface AdminSettingsAttributes {
  id?: number;
  userId: number;
  notifications?: {
    orders?: boolean;
    users?: boolean;
    products?: boolean;
    email?: boolean;
  };
  security?: {
    twoFactor?: boolean;
    sessionTimeout?: number;
  };
  preferences?: {
    theme?: 'light' | 'dark' | 'auto';
    language?: 'fr' | 'en';
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminSettings = sequelize.define('AdminSettings', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  notifications: {
    type: DataTypes.JSON,
    defaultValue: {
      orders: true,
      users: true,
      products: true,
      email: true,
    },
  },
  security: {
    type: DataTypes.JSON,
    defaultValue: {
      twoFactor: false,
      sessionTimeout: 60,
    },
  },
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      theme: 'light',
      language: 'fr',
    },
  },
}, {
  timestamps: true,
  tableName: 'admin_settings',
});

export default AdminSettings;
