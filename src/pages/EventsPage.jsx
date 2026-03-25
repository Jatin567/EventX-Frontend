import React, { useState, useEffect, useCallback } from 'react';
import EventCard from '../components/EventCard';
import axios from 'axios';
import { Search, Globe, LogIn, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EventsPage = ({ onBook }) => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCountry, setActiveCountry] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loginWarning, setLoginWarning] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8080/api/events')
            .then(res => {
                setEvents(res.data);
                setFilteredEvents(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let result = events;

        if (activeCountry !== 'All') {
            result = result.filter(e => e.country === activeCountry);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(e =>
                e.title.toLowerCase().includes(query) ||
                e.location.toLowerCase().includes(query) ||
                (e.state && e.state.toLowerCase().includes(query)) ||
                (e.country && e.country.toLowerCase().includes(query))
            );
        }

        setFilteredEvents(result);
    }, [activeCountry, searchQuery, events]);

    // Auto-dismiss warning after 4 seconds
    useEffect(() => {
        if (!loginWarning) return;
        const timer = setTimeout(() => setLoginWarning(false), 4000);
        return () => clearTimeout(timer);
    }, [loginWarning]);

    const handleBook = useCallback((event) => {
        if (!user) {
            setLoginWarning(true);
            return;
        }
        onBook(event);
    }, [user, onBook]);

    const countries = ['All', ...new Set(events.filter(e => e.country).map(e => e.country))];

    return (
        <div style={{ paddingTop: '120px', paddingLeft: '8%', paddingRight: '8%', minHeight: '100vh', paddingBottom: '100px' }}>

            {/* ── Login Required Popup ── */}
            {loginWarning && (
                <div
                    onClick={() => setLoginWarning(false)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(0,0,0,0.75)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: '#111',
                            border: '1px solid rgba(255,215,0,0.25)',
                            borderRadius: '24px',
                            padding: '40px 36px',
                            width: '420px',
                            maxWidth: 'calc(100vw - 48px)',
                            boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
                            animation: 'popIn 0.3s cubic-bezier(0.16,1,0.3,1)',
                            position: 'relative',
                            textAlign: 'center',
                        }}
                    >
                        {/* Close */}
                        <button
                            onClick={() => setLoginWarning(false)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#4b5563', cursor: 'pointer' }}
                        >
                            <X size={20} />
                        </button>

                        {/* Icon */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShieldAlert size={30} color="#FFD700" />
                            </div>
                        </div>

                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px' }}>Login Required</h2>
                        <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '32px', lineHeight: '1.6' }}>
                            You need to be signed in to book tickets for this event.
                        </p>

                        <button
                            onClick={() => {
                                setLoginWarning(false);
                                document.getElementById('navbar-login-btn')?.click();
                            }}
                            style={{
                                width: '100%', padding: '16px', borderRadius: '14px',
                                background: '#FFD700', color: '#000', border: 'none',
                                fontWeight: '800', fontSize: '16px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                transition: '0.2s', marginBottom: '12px',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            <LogIn size={18} /> Sign In to Continue
                        </button>

                        <p style={{ color: '#4b5563', fontSize: '13px' }}>
                            Click anywhere outside to dismiss
                        </p>
                    </div>
                </div>
            )}


            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.1' }}>
                        Global <span style={{ color: '#FFD700' }}>Catalog</span>
                    </h1>
                    <p style={{ color: '#94a3b8', marginTop: '10px', maxWidth: '500px' }}>
                        Premium experiences curated from the world's most iconic destinations.
                    </p>
                </div>

                <div className="glass" style={{ display: 'flex', padding: '10px 20px', borderRadius: '16px', alignItems: 'center', minWidth: '320px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Search size={18} color="#FFD700" style={{ marginRight: '12px' }} />
                    <input
                        type="text"
                        placeholder="Search location, artist, or event..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '15px' }}
                    />
                </div>
            </div>

            {/* Country Tabs */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '60px', overflowX: 'auto', paddingBottom: '10px' }} className="no-scrollbar">
                {countries.map(country => (
                    <button
                        key={country}
                        onClick={() => setActiveCountry(country)}
                        style={{
                            padding: '12px 28px',
                            borderRadius: '12px',
                            background: activeCountry === country ? '#FFD700' : 'rgba(255,255,255,0.03)',
                            color: activeCountry === country ? '#000' : '#94a3b8',
                            border: activeCountry === country ? 'none' : '1px solid rgba(255,255,255,0.05)',
                            fontWeight: '700',
                            fontSize: '14px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: '0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                        onMouseOver={(e) => {
                            if (activeCountry !== country) {
                                e.currentTarget.style.color = '#fff';
                                e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (activeCountry !== country) {
                                e.currentTarget.style.color = '#94a3b8';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                            }
                        }}
                    >
                        {country}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid rgba(255,215,0,0.1)', borderTop: '4px solid #FFD700', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
                        {filteredEvents.map(event => (
                            <EventCard key={event.id} event={event} onBook={handleBook} />
                        ))}
                    </div>
                    {filteredEvents.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '100px 0' }}>
                            <Globe size={64} color="#1e293b" style={{ marginBottom: '20px' }} />
                            <h3 style={{ fontSize: '24px', color: '#fff', marginBottom: '10px' }}>No events found</h3>
                            <p style={{ color: '#94a3b8' }}>We couldn't find any events matching your current filters.</p>
                        </div>
                    )}
                </>
            )}

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.92); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default EventsPage;

