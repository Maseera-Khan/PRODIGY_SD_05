const fs = require('fs');
const path = require('path');
const sequelize = require('./src/config/database');
const Product = require('./src/models/Product');

const migrate = async () => {
    try {
        await sequelize.sync(); // Ensure table exists

        const historyPath = path.join(__dirname, 'history.json');
        if (!fs.existsSync(historyPath)) {
            console.log('No history.json found. Skipping migration.');
            return;
        }

        const rawData = fs.readFileSync(historyPath, 'utf-8');
        const history = JSON.parse(rawData);

        console.log(`Found ${history.length} items to migrate...`);

        for (const item of history) {
            // Map old fields to new model if necessary, or just spread
            await Product.create({
                url: item.url || '',
                name: item.name,
                price: item.price,
                currency: item.currency,
                image: item.image,
                rating: item.rating,
                source: item.source || 'Legacy',
                metadata: item.dynamicAttributes || {} // Map dynamicAttributes to metadata
            });
        }

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await sequelize.close();
    }
};

migrate();
