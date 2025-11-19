import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface PaymentAttributes {
  id?: number;
  orderId: number;
  reference: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  paymentMethod: string;
  transactionId?: string;
  customerPhone?: string;
  customerEmail?: string;
  items?: any[];
  paidAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentInstance extends Model<PaymentAttributes>, PaymentAttributes {}

const Payment = sequelize.define<PaymentInstance>(
  'Payment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
    },
    reference: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      defaultValue: 'kkiapay',
    },
    transactionId: {
      type: DataTypes.STRING,
    },
    customerPhone: {
      type: DataTypes.STRING,
    },
    customerEmail: {
      type: DataTypes.STRING,
    },
    items: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    paidAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'payments',
    timestamps: true,
  }
);

export default Payment;
export { Payment };

