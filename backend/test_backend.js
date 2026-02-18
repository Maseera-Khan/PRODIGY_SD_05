const axios = require('axios');

const testBackend = async () => {
    try {
        console.log('Testing History Endpoint...');
        const historyRes = await axios.get('http://localhost:5000/api/history');
        console.log(`History Count: ${historyRes.data.length}`);
        if (historyRes.data.length > 0) console.log('First Item:', historyRes.data[0].name);

        console.log('\nTesting Scrape Endpoint (Simulated)...');
        // We won't actually bomb a URL, just check if it accepts the request
        // or we can scrape a simple example.com
        const scrapeRes = await axios.post('http://localhost:5000/api/scrape', {
            url: 'https://example.com'
        });
        console.log('Scrape Result:', scrapeRes.data.name);

    } catch (error) {
        console.error('Test Failed:', error.message);
        if (error.response) console.error('Response:', error.response.data);
    }
};

testBackend();
