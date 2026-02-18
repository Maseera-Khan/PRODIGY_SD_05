import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Download, ExternalLink } from 'lucide-react';

const History = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        axios.get('/api/history')
            .then(res => setHistory(res.data))
            .catch(err => console.error(err));
    }, []);

    const downloadItem = async (item) => {
        try {
            const response = await axios.post('/api/download-csv', { data: item }, {
                responseType: 'blob',
            });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(new Blob([response.data]));
            link.setAttribute('download', `scrape_${item.id}.csv`);
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
                <h1>Scrape History</h1>
            </div>

            <div className="card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Item Name</th>
                            <th>Price</th>
                            <th>Source</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                                    No history available.
                                </td>
                            </tr>
                        ) : (
                            history.map(item => (
                                <tr key={item.id}>
                                    <td>{new Date(item.date).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {item.image && <img src={item.image} alt="" style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '4px' }} />}
                                            {item.name}
                                        </div>
                                    </td>
                                    <td>{item.price} {item.currency}</td>
                                    <td><span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '10px', background: '#eee' }}>{item.source}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => downloadItem(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }} title="Download CSV">
                                                <Download size={18} />
                                            </button>
                                            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: '#666' }} title="Visit Link">
                                                <ExternalLink size={18} />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default History;
