const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let sequelize;

// Only use MySQL if DB_HOST is explicitly provided
if (process.env.DB_HOST) {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'aerofetch_prod',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      logging: false,
    }
  );
} else {
  // Use SQLite for everything else (dev + Render free tier)
  const dbPath = process.platform === 'win32'
    ? path.join(__dirname, '..', 'aerofetch.sqlite')
    : '/tmp/aerofetch.sqlite';
    
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false
  });
}

module.exports = sequelize;
