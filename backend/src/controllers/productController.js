const axios = require('axios');
const cheerio = require('cheerio');
const { Parser } = require('json2csv');
const Product = require('../models/Product');

// Helper Scrape Function
const scrapeUrl = async (targetUrl) => {
    try {
        const { data } = await axios.get(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const $ = cheerio.load(data);

        let extractedData = {};
        let dynamicAttributes = {};

        // 1. Try Schema.org (JSON-LD)
        $('script[type="application/ld+json"]').each((i, el) => {
            try {
                const json = JSON.parse($(el).html());
                const findProduct = (obj) => {
                    if (obj['@type'] === 'Product') return obj;
                    if (Array.isArray(obj['@graph'])) return obj['@graph'].find(o => o['@type'] === 'Product');
                    return null;
                };
                const product = findProduct(json);
                if (product) {
                    extractedData = {
                        name: product.name,
                        price: product.offers ? (product.offers.price || product.offers[0]?.price) : '',
                        currency: product.offers ? (product.offers.priceCurrency || product.offers[0]?.priceCurrency) : '',
                        image: product.image ? (Array.isArray(product.image) ? product.image[0] : product.image) : '',
                        rating: product.aggregateRating?.ratingValue || '',
                        source: 'Schema.org'
                    };
                }
            } catch (e) { }
        });

        // 2. Fallback to Meta Tags / DOM
        if (!extractedData.name) {
            extractedData = {
                name: $('meta[property="og:title"]').attr('content') || $('title').text(),
                price: $('.price, [class*="price"], [id*="price"]').first().text().trim() || '',
                currency: '',
                image: $('meta[property="og:image"]').attr('content') || $('img').first().attr('src'),
                rating: '',
                source: 'Meta Tags / DOM'
            };
        }

        // 3. Dynamic Attribute Extraction
        $('table tr').each((i, row) => {
            const key = $(row).find('th').text().trim().replace(/:$/, '');
            const val = $(row).find('td').text().trim();
            if (key && val && key.length < 50) dynamicAttributes[key] = val;
        });

        $('ul li, dl div, p').each((i, el) => {
            const text = $(el).text().trim();
            if (text.includes(':') && text.length < 100) {
                const parts = text.split(':');
                if (parts.length === 2 && parts[0].trim().length > 2 && parts[0].trim().length < 30 && parts[1].trim().length > 0) {
                    dynamicAttributes[parts[0].trim()] = parts[1].trim();
                }
            }
        });

        return {
            url: targetUrl,
            ...extractedData,
            metadata: dynamicAttributes
        };

    } catch (error) {
        console.error(`Error scraping ${targetUrl}:`, error.message);
        return { url: targetUrl, error: 'Failed to scrape', name: 'Error accessing URL' };
    }
};

// --- Controllers ---

exports.scrape = async (req, res) => {
    try {
        const { url, urls } = req.body;
        const targetUrls = urls ? urls : (url ? [url] : []);

        if (targetUrls.length === 0) return res.status(400).json({ error: 'No URLs provided' });

        const results = [];

        for (const targetUrl of targetUrls) {
            if (!targetUrl.trim()) continue;
            // Polite delay
            await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000));

            const scrapedData = await scrapeUrl(targetUrl);

            // Save to DB
            if (!scrapedData.error) {
                await Product.create(scrapedData);
            }
            results.push(scrapedData);
        }

        res.json(results.length === 1 ? results[0] : results);
    } catch (error) {
        console.error('Error in scrape controller:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const history = await Product.findAll({
            order: [['createdAt', 'DESC']],
            limit: 100
        });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};

exports.downloadCsv = (req, res) => {
    try {
        const { data } = req.body;
        const items = Array.isArray(data) ? data : [data];

        if (items.length === 0) return res.status(400).json({ error: 'No data' });

        // Flatten metadata for CSV
        const flatItems = items.map(item => {
            const { metadata, ...rest } = item;
            return { ...rest, ...metadata }; // Merge metadata as columns
        });

        const allKeys = new Set();
        flatItems.forEach(item => Object.keys(item).forEach(key => allKeys.add(key)));
        const fields = Array.from(allKeys);

        const parser = new Parser({ fields });
        const csv = parser.parse(flatItems);

        res.header('Content-Type', 'text/csv');
        res.attachment('scrape_results.csv');
        return res.send(csv);
    } catch (error) {
        console.error('Error creating CSV:', error);
        res.status(500).json({ error: 'Failed to generate CSV' });
    }
};
