import React, { useState } from 'react';
import { Search, Loader2, Download, AlertCircle, CheckCircle, List, FileText } from 'lucide-react';
import axios from 'axios';

const NewScrape = () => {
    const [mode, setMode] = useState('single'); // 'single' or 'bulk'
    const [url, setUrl] = useState('');
    const [bulkUrls, setBulkUrls] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    const handleScrape = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const payload = mode === 'single'
                ? { url }
                : { urls: bulkUrls.split('\n').map(u => u.trim()).filter(u => u) };

            const response = await axios.post('/api/scrape', payload);

            // Normalize result to array
            const data = Array.isArray(response.data) ? response.data : [response.data];
            setResults(data);

        } catch (err) {
            setError(err.response?.data?.error || 'Failed to scrape URL. Check if the server is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (results.length === 0) return;
        try {
            const response = await axios.post('/api/download-csv', { data: results }, {
                responseType: 'blob',
            });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(new Blob([response.data]));
            link.setAttribute('download', 'bulk_scrape_results.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Download error', err);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>New Scrape</h1>
            </div>

            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                    <button
                        onClick={() => setMode('single')}
                        style={{
                            padding: '8px 16px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer',
                            background: mode === 'single' ? 'var(--primary-color)' : 'white',
                            color: mode === 'single' ? 'white' : '#333'
                        }}
                    >
                        Single URL
                    </button>
                    <button
                        onClick={() => setMode('bulk')}
                        style={{
                            padding: '8px 16px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer',
                            background: mode === 'bulk' ? 'var(--primary-color)' : 'white',
                            color: mode === 'bulk' ? 'white' : '#333'
                        }}
                    >
                        Bulk Mode (100+)
                    </button>
                </div>

                <h3>{mode === 'single' ? 'Target Website' : 'Paste URLs (One per line)'}</h3>

                <form onSubmit={handleScrape} style={{ marginTop: '1rem' }}>
                    {mode === 'single' ? (
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="https://example.com/product/123..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                            />
                            <button type="submit" className="primary" disabled={loading}>
                                {loading ? <Loader2 className="spin" size={18} /> : <Search size={18} style={{ marginRight: '8px' }} />}
                                {loading ? ' Scouting...' : 'Start'}
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <textarea
                                placeholder={"https://example.com/item1\nhttps://example.com/item2\n..."}
                                value={bulkUrls}
                                onChange={(e) => setBulkUrls(e.target.value)}
                                rows={10}
                                style={{
                                    width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #eee',
                                    fontFamily: 'monospace', resize: 'vertical'
                                }}
                                required
                            />
                            <button type="submit" className="primary" disabled={loading} style={{ alignSelf: 'flex-end' }}>
                                {loading ? <Loader2 className="spin" size={18} /> : <List size={18} style={{ marginRight: '8px' }} />}
                                {loading ? ' Processing Bulk List...' : 'Start Bulk Scrape'}
                            </button>
                        </div>
                    )}
                </form>

                {error && (
                    <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {results.length > 0 && (
                    <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--primary-color)' }}>
                                <CheckCircle size={20} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'text-bottom' }} />
                                {results.length} Result{results.length !== 1 ? 's' : ''} Found
                            </h3>
                            <button onClick={handleDownload} style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Download size={16} /> CSV
                            </button>
                        </div>

                        <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {results.map((item, idx) => (
                                <div key={idx} style={{ padding: '10px', border: '1px solid #eee', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center', background: '#f9f9f9' }}>
                                    {item.image ? (
                                        <img src={item.image} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                    ) : (
                                        <div style={{ width: '50px', height: '50px', background: '#ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FileText size={20} color="#666" />
                                        </div>
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.name || 'Unknown Item'}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{item.url}</div>
                                    </div>
                                    <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>{item.price}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewScrape;
