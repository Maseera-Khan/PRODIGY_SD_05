import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Globe, History, Settings, Menu, X } from 'lucide-react';

const Layout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="app-container">
            {/* Mobile Hamburger Button */}
            <button className="mobile-toggle" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="logo">
                    <h2>🕸️ OmniScrape</h2>
                </div>
                <nav>
                    <NavLink to="/" onClick={closeMenu} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/scrape" onClick={closeMenu} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                        <Globe size={20} />
                        <span>New Scrape</span>
                    </NavLink>
                    <NavLink to="/history" onClick={closeMenu} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                        <History size={20} />
                        <span>History</span>
                    </NavLink>
                    <NavLink to="/settings" onClick={closeMenu} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                        <Settings size={20} />
                        <span>Settings</span>
                    </NavLink>
                </nav>
            </aside>
            <main className="content">
                <Outlet />
            </main>

            {/* Backdrop for mobile */}
            {isMobileMenuOpen && <div className="mobile-backdrop" onClick={closeMenu}></div>}
        </div>
    );
};

export default Layout;
