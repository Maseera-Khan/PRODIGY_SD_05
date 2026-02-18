import React, { useEffect, useState } from 'react';
import { BarChart2, Clock, Activity, Loader2, CheckCircle, Zap } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalScrapes: 0, lastActive: null, successRate: '100%' });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/history')
            .then(res => {
                const data = res.data;
                setStats({
                    totalScrapes: data.length,
                    lastActive: data.length > 0 ? data[0].date : new Date(),
                    successRate: '98%' // Placeholder for now
                });
                setRecentActivity(data.slice(0, 5));
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `5px solid ${color}` }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: `${color}20`, color: color }}>
                <Icon size={24} />
            </div>
            <div>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{label}</p>
                <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{value}</h3>
            </div>
        </div>
    );

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><Loader2 className="spin" size={40} color="var(--primary-color)" /></div>;

    return (
        <div>
            <div className="page-header">
                <h1>Dashboard Overview</h1>
                <p style={{ color: '#666' }}>Welcome back! Here's your scraping activity.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard icon={BarChart2} label="Total Scrapes" value={stats.totalScrapes} color="#A82323" />
                <StatCard icon={CheckCircle} label="Success Rate" value="98%" color="#2ecc71" />
                <StatCard icon={Clock} label="Last Active" value={new Date(stats.lastActive).toLocaleDateString()} color="#f39c12" />
            </div>

            <div className="card">
                <h3><Zap size={20} style={{ verticalAlign: 'bottom', marginRight: '8px', color: '#f39c12' }} /> Quick Actions</h3>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button className="primary" onClick={() => window.location.href = '/scrape'}>
                        Start New Scrape
                    </button>
                    <button style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }} onClick={() => window.location.href = '/history'}>
                        View History
                    </button>
                </div>
            </div>

            <h3 style={{ marginTop: '2rem' }}>Recent Activity</h3>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8f9fa' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Item Name</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentActivity.map((item, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {item.image && <img src={item.image} alt="" style={{ width: '30px', height: '30px', borderRadius: '4px', objectFit: 'cover' }} />}
                                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                                            {item.name || item.url}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>{new Date(item.date).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ padding: '4px 8px', borderRadius: '12px', background: '#d1fae5', color: '#065f46', fontSize: '0.85rem' }}>Completed</span>
                                </td>
                            </tr>
                        ))}
                        {recentActivity.length === 0 && (
                            <tr><td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No recent activity</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
