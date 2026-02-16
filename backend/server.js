const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const { Parser } = require('json2csv');

const app = express();
const PORT = 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Scrape endpoint
app.get('/api/scrape', async (req, res) => {
    try {
        const url = 'https://books.toscrape.com/';
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const books = [];

        $('.product_pod').each((index, element) => {
            const title = $(element).find('h3 a').attr('title');
            const price = $(element).find('.price_color').text();
            const ratingClass = $(element).find('.star-rating').attr('class');
            const rating = ratingClass ? ratingClass.split(' ')[1] : 'Unknown';
            const imageUrl = url + $(element).find('img').attr('src');

            books.push({ title, price, rating, imageUrl });
        });

        res.json(books);
    } catch (error) {
        console.error('Error scraping:', error);
        res.status(500).json({ error: 'Failed to scrape data' });
    }
});

// Download CSV endpoint
app.post('/api/download-csv', (req, res) => {
    try {
        const { data } = req.body;
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        const fields = ['title', 'price', 'rating', 'imageUrl'];
        const opts = { fields };
        const parser = new Parser(opts);
        const csv = parser.parse(data);

        res.header('Content-Type', 'text/csv');
        res.attachment('books.csv');
        return res.send(csv);
    } catch (error) {
        console.error('Error creating CSV:', error);
        res.status(500).json({ error: 'Failed to generate CSV' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
