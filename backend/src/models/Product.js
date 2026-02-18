const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    url: {
        type: DataTypes.TEXT, // URLs can be long
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.STRING,
        allowNull: true
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rating: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    source: {
        type: DataTypes.STRING,
        allowNull: true
    },
    metadata: {
        type: DataTypes.JSON, // Store dynamic attributes as JSON
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Product;
