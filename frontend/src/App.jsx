import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

function App() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleScrape = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:5000/api/scrape');
            setBooks(response.data);
        } catch (err) {
            setError('Failed to fetch data. Ensure backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (books.length === 0) return;
        try {
            const response = await axios.post('http://localhost:5000/api/download-csv', { data: books }, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'books.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Download failed', err);
            setError('Failed to download CSV.');
        }
    };

    return (
        <div className="App">
            <h1>📚 Book Scraper</h1>
            <p>Extracting data from books.toscrape.com</p>

            <div className="controls">
                <button onClick={handleScrape} disabled={loading}>
                    {loading ? 'Scraping...' : 'Start Scraping'}
                </button>
                {books.length > 0 && (
                    <button onClick={handleDownload} style={{ backgroundColor: '#2ecc71' }}>
                        Download CSV
                    </button>
                )}
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="card-grid">
                {books.map((book, index) => (
                    <div key={index} className="card">
                        <img src={book.imageUrl} alt={book.title} />
                        <h3 title={book.title}>{book.title}</h3>
                        <div className="price">{book.price}</div>
                        <div className="rating">Rating: {book.rating}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
