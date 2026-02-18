const express = require('express');
const path = require('path');
const cors = require('cors');
const sequelize = require('./src/config/database');
const productRoutes = require('./src/routes/productRoutes');

const app = express();
const PORT = 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/api-status', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; padding: 2rem; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px; margin-top: 4rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
            <h1 style="color: #A82323;">🕸️ OmniScrape API</h1>
            <p>The backend server is running successfully!</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 1.5rem 0;">
            <p><strong>Database Access:</strong></p>
            <div style="display: flex; gap: 10px; margin-top: 1rem;">
                <a href="/database" style="background: #A82323; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">Explore Database</a>
                <a href="/api/history" style="background: #eee; color: #333; padding: 10px 20px; border-radius: 6px; text-decoration: none;">Raw JSON API</a>
            </div>
            <p style="color: #666; font-size: 0.9rem; margin-top: 2rem;">Server Port: 5000</p>
        </div>
    `);
});

app.get('/database', async (req, res) => {
    try {
        const Product = require('./src/models/Product');
        const products = await Product.findAll({ order: [['createdAt', 'DESC']] });

        let rows = products.map(p => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${p.id}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.name || 'N/A'}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${p.price || 'N/A'}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${p.source}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 0.8rem; color: #666;">${new Date(p.createdAt).toLocaleString()}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    <button onclick="alert(\`${JSON.stringify(p.metadata, null, 2)}\`)" style="cursor: pointer; padding: 4px 8px; border: 1px solid #ccc; border-radius: 4px; background: white;">View Meta</button>
                </td>
            </tr>
        `).join('');

        res.send(`
            <div style="font-family: sans-serif; padding: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h1 style="margin: 0; color: #A82323;">📊 Database Explorer</h1>
                    <a href="/" style="text-decoration: none; color: #666;">&larr; Back to API Home</a>
                </div>
                <div style="background: white; border-radius: 12px; border: 1px solid #eee; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <thead style="background: #f8f9fa;">
                            <tr>
                                <th style="padding: 12px; border-bottom: 2px solid #eee;">ID</th>
                                <th style="padding: 12px; border-bottom: 2px solid #eee;">Product Name</th>
                                <th style="padding: 12px; border-bottom: 2px solid #eee;">Price</th>
                                <th style="padding: 12px; border-bottom: 2px solid #eee;">Source</th>
                                <th style="padding: 12px; border-bottom: 2px solid #eee;">Timestamp</th>
                                <th style="padding: 12px; border-bottom: 2px solid #eee;">Metadata</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows || '<tr><td colspan="6" style="padding: 2rem; text-align: center; color: #888;">No data found in database.</td></tr>'}
                        </tbody>
                    </table>
                </div>
                <div style="margin-top: 2rem; text-align: center; color: #666; font-size: 0.9rem;">
                    Database File: <code>database.sqlite</code> | Total Records: ${products.length}
                </div>
            </div>
        `);
    } catch (error) {
        res.status(500).send("Error loading database: " + error.message);
    }
});

// Routes
app.use('/api', productRoutes);

// Serve Frontend (Vite Build)
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Sync Database and Start Server
sequelize.sync().then(() => {
    console.log('Database synced (SQLite)');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to sync database:', err);
});
