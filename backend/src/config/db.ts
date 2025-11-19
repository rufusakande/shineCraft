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

/**
 * Ajouter les colonnes manquantes à la table orders et fixer les DEFAULT
 * Exécuté au démarrage pour synchroniser le schéma avec le modèle Sequelize
 */
export const addMissingColumnsToOrders = async () => {
  try {
    // Étape 1: Ajouter les colonnes manquantes
    const addColumnsSQL = [
      "ALTER TABLE `orders` ADD COLUMN `reference` VARCHAR(255) NOT NULL UNIQUE AFTER `userId`;",
      "ALTER TABLE `orders` ADD COLUMN `amount` DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER `total`;",
      "ALTER TABLE `orders` ADD COLUMN `paymentMethod` VARCHAR(255) DEFAULT 'kkiapay' AFTER `status`;",
      "ALTER TABLE `orders` ADD COLUMN `transactionId` VARCHAR(255) UNIQUE DEFAULT NULL AFTER `paymentMethod`;",
      "ALTER TABLE `orders` ADD COLUMN `shippingAddress` JSON DEFAULT NULL AFTER `address`;",
      "ALTER TABLE `orders` ADD COLUMN `shippingMethod` VARCHAR(255) DEFAULT 'standard' AFTER `shippingAddress`;",
      "ALTER TABLE `orders` ADD COLUMN `customerName` VARCHAR(255) DEFAULT NULL AFTER `shippingMethod`;",
      "ALTER TABLE `orders` ADD COLUMN `customerEmail` VARCHAR(255) DEFAULT NULL AFTER `customerName`;",
      "ALTER TABLE `orders` ADD COLUMN `customerPhone` VARCHAR(255) DEFAULT NULL AFTER `customerEmail`;",
      "ALTER TABLE `orders` ADD COLUMN `notes` TEXT DEFAULT NULL AFTER `customerPhone`;",
    ];

    for (const sql of addColumnsSQL) {
      try {
        await sequelize.query(sql);
        const columnName = sql.match(/ADD COLUMN `([^`]+)`/)?.[1];
        console.log(`✓ Colonne '${columnName}' ajoutée/existante`);
      } catch (error: any) {
        // Ignorer les erreurs si la colonne existe déjà
        if (error.original?.errno === 1060) {
          const columnName = sql.match(/ADD COLUMN `([^`]+)`/)?.[1];
          console.log(`ℹ Colonne '${columnName}' existe déjà`);
        } else if (isDevelopment) {
          console.warn('⚠ Erreur SQL (ignorée):', error.original?.message || error.message);
        }
      }
    }

    // Étape 2: Fixer les DEFAULT sur les colonnes existantes
    const fixDefaultsSQL = [
      "ALTER TABLE `orders` MODIFY COLUMN `items` JSON DEFAULT NULL;",
      "ALTER TABLE `orders` MODIFY COLUMN `total` DECIMAL(10,2) DEFAULT 0.00;",
      "ALTER TABLE `orders` MODIFY COLUMN `address` JSON DEFAULT NULL;",
      "ALTER TABLE `orders` MODIFY COLUMN `amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00;",
      "ALTER TABLE `orders` MODIFY COLUMN `status` VARCHAR(255) DEFAULT 'pending';",
      "ALTER TABLE `orders` MODIFY COLUMN `paymentMethod` VARCHAR(255) DEFAULT 'kkiapay';",
      "ALTER TABLE `orders` MODIFY COLUMN `shippingMethod` VARCHAR(255) DEFAULT 'standard';",
      "ALTER TABLE `orders` MODIFY COLUMN `customerName` VARCHAR(255) DEFAULT NULL;",
      "ALTER TABLE `orders` MODIFY COLUMN `customerEmail` VARCHAR(255) DEFAULT NULL;",
      "ALTER TABLE `orders` MODIFY COLUMN `customerPhone` VARCHAR(255) DEFAULT NULL;",
      "ALTER TABLE `orders` MODIFY COLUMN `transactionId` VARCHAR(255) DEFAULT NULL;",
      "ALTER TABLE `orders` MODIFY COLUMN `shippingAddress` JSON DEFAULT NULL;",
      "ALTER TABLE `orders` MODIFY COLUMN `notes` TEXT DEFAULT NULL;",
    ];

    for (const sql of fixDefaultsSQL) {
      try {
        await sequelize.query(sql);
        const columnName = sql.match(/MODIFY COLUMN `([^`]+)`/)?.[1];
        console.log(`✓ DEFAULT fixé pour '${columnName}'`);
      } catch (error: any) {
        if (isDevelopment) {
          console.warn(`⚠ Impossible de modifier '${sql.match(/MODIFY COLUMN `([^`]+)`/)?.[1]}'`, error.original?.message || error.message);
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout des colonnes à orders:', error);
  }
};

export const syncDb = async () => {
  try {
    if (isDevelopment) {
      console.log('🔄 Synchronizing database...');
    }
    
    await sequelize.sync({ alter: true });
    
    if (isDevelopment) {
      console.log('✓ Database synchronized successfully');
      
      // Ajouter les colonnes manquantes à la table orders
      await addMissingColumnsToOrders();
      
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