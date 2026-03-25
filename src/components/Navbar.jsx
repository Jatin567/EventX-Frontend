import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Navbar = ({ onOpenAuth }) => {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const linkStyle = {
        color: '#d1d5db',
        textDecoration: 'none',
        fontWeight: '500',
        fontSize: '15px',
        transition: 'color 0.3s ease',
        letterSpacing: '0.5px'
    };

    return (
        <nav 
            className="fixed top-0 w-full z-50 transition-all duration-500" 
            style={{ 
                padding: scrolled ? '15px 8%' : '30px 8%',
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                backgroundColor: scrolled ? 'rgba(0,0,0,0.85)' : 'transparent',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none'
            }}
        >
            {/* Logo area */}
            <Link to="/" className="flex items-center gap-2 no-underline" style={{ color: '#fff', fontSize: '24px', fontWeight: '900', letterSpacing: '1px' }}>
                <img src={logo} alt="EventX Logo" style={{ height: '32px', width: 'auto', marginRight: '8px' }} />
                <span>EventX</span>
            </Link>

            {/* Center Navigation Links */}
            <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }} className="hidden-mobile">
                <Link to="/" style={linkStyle} className="nav-link">Home</Link>
                <Link to="/events" style={linkStyle} className="nav-link">Events</Link>
                {user && <Link to="/bookings" style={linkStyle} className="nav-link">Bookings</Link>}
                <Link to="/admin" style={linkStyle} className="nav-link">Admin</Link>
            </div>

            {/* Right side area (Search & Membership) */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }} className="hidden-mobile">
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px', 
                    padding: '8px 16px',
                    width: '200px'
                }}>
                    <Search size={14} color="#94a3b8" />
                    <input 
                        type="text" 
                        placeholder="Search events..." 
                        style={{ 
                            background: 'transparent', 
                            border: 'none', 
                            outline: 'none', 
                            color: '#fff', 
                            fontSize: '13px',
                            marginLeft: '8px',
                            width: '100%'
                        }} 
                    />
                </div>

                {user ? (
                    <button onClick={logout} style={{ background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '15px' }}>Logout</button>
                ) : (
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => onOpenAuth('login')} 
                            style={{ background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}
                        >
                            Sign In
                        </button>
                        <button 
                            onClick={() => onOpenAuth('register')} 
                            style={{ 
                                padding: '10px 24px', 
                                borderRadius: '20px', 
                                backgroundColor: '#FFD700',
                                color: '#000',
                                fontWeight: '700',
                                fontSize: '14px',
                                border: 'none',
                                cursor: 'pointer',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Join Now
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
                className="show-mobile"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{ background: 'transparent', border: 'none', color: '#FFD700', cursor: 'pointer', display: 'none' }}
            >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <style>{`
                .nav-link:hover { color: #FFD700 !important; }
                @media (max-width: 960px) {
                    .hidden-mobile { display: none !important; }
                    .show-mobile { display: block !important; }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
