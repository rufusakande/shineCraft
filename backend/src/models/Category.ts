import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { CategoryInstance } from './types';

const Category = sequelize.define<CategoryInstance>(
  'Category',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'categories',
  }
);

export default Category;