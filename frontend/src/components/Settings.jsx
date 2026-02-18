import React, { useState, useEffect } from 'react';
import { Moon, Bell, Database, Sun } from 'lucide-react';

const Settings = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const isDark = document.body.classList.contains('dark-mode');
        setDarkMode(isDark);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        if (newMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Settings</h1>
            </div>

            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ padding: '8px', background: 'var(--bg-color)', borderRadius: '8px' }}>
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </div>
                        <div>
                            <h4 style={{ margin: 0 }}>{darkMode ? 'Light Mode' : 'Dark Mode'}</h4>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>
                                {darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                            </p>
                        </div>
                    </div>
                    <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={toggleDarkMode}
                            style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                            position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: darkMode ? '#A82323' : '#ccc', transition: '.4s', borderRadius: '34px'
                        }}></span>
                        <span style={{
                            position: 'absolute', content: '""', height: '18px', width: '18px', left: darkMode ? '26px' : '4px', bottom: '4px',
                            backgroundColor: 'white', transition: '.4s', borderRadius: '50%'
                        }}></span>
                    </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ padding: '8px', background: 'var(--bg-color)', borderRadius: '8px' }}><Bell size={20} /></div>
                        <div>
                            <h4 style={{ margin: 0 }}>Notifications</h4>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>Email alerts for completed scrapes</p>
                        </div>
                    </div>
                    <div style={{ width: '40px', height: '20px', background: '#ccc', borderRadius: '10px', position: 'relative', opacity: 0.5 }}>
                        <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ padding: '8px', background: 'var(--bg-color)', borderRadius: '8px' }}><Database size={20} /></div>
                        <div>
                            <h4 style={{ margin: 0 }}>Clear History</h4>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>Remove all local data</p>
                        </div>
                    </div>
                    <button style={{ color: 'red', background: 'transparent', border: '1px solid red', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Clear</button>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem', opacity: 0.5 }}>
                <p>OmniScrape v2.3</p>
            </div>
        </div>
    );
};

export default Settings;
