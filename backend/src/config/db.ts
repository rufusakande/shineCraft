import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'shinecraft_db',
  logging: isDevelopment ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export const syncDb = async () => {
  try {
    if (isDevelopment) {
      console.log('Synchronizing database...');
    }
    
    await sequelize.sync({ alter: true });
    
    if (isDevelopment) {
      console.log('Database synchronized successfully');
      
      // Execute seeds in development
      const { seedAdmin } = require('../seed/adminSeed');
      await seedAdmin();
    }
  } catch (error) {
    console.error('Failed to sync database:', error);
    throw error;
  }
};

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    if (isDevelopment) {
      console.log('Database connection established successfully.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

// Handle unexpected errors and connection losses
sequelize.addHook('beforeConnect', async () => {
  if (isDevelopment) {
    console.log('Attempting to connect to database...');
  }
});

sequelize.addHook('afterDisconnect', async () => {
  if (isDevelopment) {
    console.log('Database connection lost. Attempting to reconnect...');
  }
});

export { sequelize, DataTypes };
export default sequelize;