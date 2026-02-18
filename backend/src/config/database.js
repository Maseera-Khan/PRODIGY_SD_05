const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize SQLite Database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database.sqlite'),
    logging: false // Disable logging for cleaner console
});

module.exports = sequelize;
