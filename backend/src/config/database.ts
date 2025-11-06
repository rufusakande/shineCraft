import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Configuration de la base de données
const sequelize = new Sequelize(
  process.env.DB_NAME || 'shinecraft',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Désactive les logs SQL en production
  }
);

// Test de la connexion
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('📦 Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
}

export { sequelize, testConnection };