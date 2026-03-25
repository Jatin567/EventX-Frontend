import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import EventCard from '../components/EventCard';
import axios from 'axios';
import { Globe, Shield, Star, Crown, Quote, Menu, ArrowRight } from 'lucide-react';

const LandingPage = ({ onBook }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get('https://eventx-backend-3.onrender.com/api/events')
            .then(res => setEvents(res.data.slice(0, 3)))
            .catch(err => console.error(err));
    }, []);

    const getCardTransform = (index) => {
        if (index === 0) return 'rotate(-4deg) translateY(10px)';
        if (index === 1) return 'scale(1.05) translateY(-5px) zIndex(10)';
        if (index === 2) return 'rotate(4deg) translateY(10px)';
        return 'none';
    };

    return (
        <main style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#ecedf6', fontFamily: '"Inter", sans-serif' }}>
            <Hero />
            
            {/* Masterpieces Section */}
            <section className="py-24 px-[8%]" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                    <div>
                        <h2 style={{ fontSize: '36px', fontWeight: '900', fontFamily: '"Space Grotesk", sans-serif', color: '#fff' }}>
                            Upcoming curated <span style={{ color: '#FFD700' }}>Masterpieces</span>
                        </h2>
                        <p style={{ color: '#94a3b8', marginTop: '12px', fontSize: '15px' }}>
                            Hand-selected venues and performers that meet our rigorous standards for<br />excellence.
                        </p>
                    </div>
                    
                    <button style={{ 
                        color: '#FFD700', 
                        background: 'transparent', 
                        border: 'none', 
                        cursor: 'pointer', 
                        fontWeight: '800', 
                        letterSpacing: '1px',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        borderBottom: '1px solid #FFD700',
                        paddingBottom: '4px'
                    }}>
                        View All Events
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', padding: '20px 0' }}>
                    {events.map((event, index) => (
                        <div key={event.id} style={{ 
                            flex: 1, 
                            maxWidth: '350px', 
                            transform: getCardTransform(index),
                            transition: 'transform 0.5s ease',
                            zIndex: index === 1 ? 10 : 1
                        }}>
                            <EventCard event={event} onBook={onBook} />
                        </div>
                    ))}
                    {events.length === 0 && (
                        <p style={{ color: '#a9abb3' }}>Loading curated masterpieces...</p>
                    )}
                </div>
            </section>

            {/* Platinum Standard Section */}
            <section className="py-24 px-[8%]" style={{ backgroundColor: '#0a0a09' }}>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '60px', alignItems: 'center' }}>
                    
                    {/* Left Details */}
                    <div style={{ flex: '1 1 500px' }}>
                        <h2 style={{ fontSize: '48px', fontWeight: '900', fontFamily: '"Space Grotesk", sans-serif', color: '#fff', marginBottom: '48px' }}>
                            The Platinum <span style={{ color: '#FFD700', fontStyle: 'italic' }}>Standard</span>
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                            <div style={{ display: 'flex', gap: '24px' }}>
                                <div style={{ minWidth: '40px', height: '40px', backgroundColor: '#111', border: '1px solid #FFD700', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(45deg)' }}>
                                    <Shield color="#FFD700" size={18} style={{ transform: 'rotate(-45deg)' }} />
                                </div>
                                <div>
                                    <h4 style={{ color: '#fff', fontWeight: '800', fontSize: '18px', marginBottom: '8px' }}>Global Access Concierge</h4>
                                    <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6' }}>Personal access to sold-out venues and front-row seats<br />globally through our established partner networks.</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '24px' }}>
                                <div style={{ minWidth: '40px', height: '40px', backgroundColor: '#111', border: '1px solid #FFD700', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(45deg)' }}>
                                    <Crown color="#FFD700" size={18} style={{ transform: 'rotate(-45deg)' }} />
                                </div>
                                <div>
                                    <h4 style={{ color: '#fff', fontWeight: '800', fontSize: '18px', marginBottom: '8px' }}>Chauffeur & Logistics</h4>
                                    <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6' }}>Door-to-door luxury transport included with every<br />booking. From jets to Maybachs, we handle your arrival.</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '24px' }}>
                                <div style={{ minWidth: '40px', height: '40px', backgroundColor: '#111', border: '1px solid #FFD700', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(45deg)' }}>
                                    <Star color="#FFD700" size={18} style={{ transform: 'rotate(-45deg)' }} />
                                </div>
                                <div>
                                    <h4 style={{ color: '#fff', fontWeight: '800', fontSize: '18px', marginBottom: '8px' }}>Bespoke Catering</h4>
                                    <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6' }}>Michelin-star culinary experiences tailored to your dietary<br />preferences at every event location.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Image Placeholder */}
                    <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
                        <div style={{ 
                            width: '450px', 
                            height: '450px', 
                            borderRadius: '24px', 
                            background: 'linear-gradient(135deg, #1f1a0e, #111)', 
                            border: '1px solid rgba(255, 215, 0, 0.2)',
                            boxShadow: '0 40px 80px rgba(0,0,0,0.6)'
                        }}>
                             {/* Mocking the glassware representation with gradients representing the tray */}
                            <div style={{ width: '100%', height: '100%', borderRadius: '24px', background: 'radial-gradient(circle at center, rgba(255,215,0,0.1) 0%, transparent 60%)' }}></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Join the Circle Section */}
            <section className="py-24 px-[8%]" style={{ display: 'flex', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ 
                    background: 'rgba(15, 15, 15, 0.8)', 
                    backdropFilter: 'blur(20px)', 
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '24px',
                    padding: '60px',
                    maxWidth: '700px',
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                    position: 'relative',
                    zIndex: 2
                }}>
                    <div style={{ position: 'absolute', top: '30px', right: '40px' }}>
                        <Quote size={40} color="#FFD700" fill="#FFD700" opacity={0.8} style={{ transform: 'rotateX(180deg) rotateY(180deg)' }} />
                    </div>

                    <h2 style={{ fontSize: '32px', fontWeight: '900', fontFamily: '"Space Grotesk", sans-serif', color: '#fff', marginBottom: '16px' }}>
                        Join the Circle
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '400px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
                        Our membership is by application only to ensure the highest quality of environment and networking for all attendees.
                    </p>

                    <div style={{ display: 'flex', gap: '16px', maxWidth: '450px', margin: '0 auto' }}>
                        <input 
                            type="email" 
                            placeholder="Your executive email" 
                            style={{ 
                                flex: 1, 
                                padding: '16px 20px', 
                                borderRadius: '8px', 
                                border: '1px solid rgba(255, 255, 255, 0.1)', 
                                background: '#0a0a0a', 
                                color: '#fff',
                                outline: 'none',
                                fontSize: '14px'
                            }} 
                        />
                        <button style={{ 
                            padding: '16px 36px', 
                            borderRadius: '8px', 
                            backgroundColor: '#FFD700', 
                            color: '#000', 
                            fontWeight: '800', 
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}>
                            Apply Now
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ backgroundColor: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '60px 8% 30px 8%' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '40px', marginBottom: '80px' }}>
                    <div style={{ flex: '1 1 250px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', background: 'linear-gradient(135deg, #FFD700, #b8860b)', borderRadius: '4px', transform: 'rotate(45deg)' }}>
                                <Shield size={10} color="#000" style={{ transform: 'rotate(-45deg)' }} />
                            </div>
                            <span style={{ color: '#fff', fontSize: '18px', fontWeight: '900', letterSpacing: '1px' }}>ELITEEVENTS</span>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6', maxWidth: '280px' }}>
                            Crafting moments of absolute exclusivity for the world's most discerning individuals since 2012.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '80px', flexWrap: 'wrap' }}>
                        <div>
                            <h5 style={{ color: '#fff', fontSize: '12px', fontWeight: '800', letterSpacing: '1px', marginBottom: '24px' }}>EXPERIENCES</h5>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px' }}>Private Concerts</a></li>
                                <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px' }}>Art Expeditions</a></li>
                                <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px' }}>Luxury Travel</a></li>
                                <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px' }}>Gala Invitations</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 style={{ color: '#fff', fontSize: '12px', fontWeight: '800', letterSpacing: '1px', marginBottom: '24px' }}>COMPANY</h5>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px' }}>Our Philosophy</a></li>
                                <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px' }}>Membership Tiers</a></li>
                                <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px' }}>Partnerships</a></li>
                                <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px' }}>Contact Support</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 style={{ color: '#fff', fontSize: '12px', fontWeight: '800', letterSpacing: '1px', marginBottom: '24px' }}>GLOBAL OFFICES</h5>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <li style={{ color: '#94a3b8', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '4px', height: '4px', backgroundColor: '#64748b', borderRadius: '50%' }}></div>New York</li>
                                <li style={{ color: '#94a3b8', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '4px', height: '4px', backgroundColor: '#64748b', borderRadius: '50%' }}></div>London</li>
                                <li style={{ color: '#94a3b8', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '4px', height: '4px', backgroundColor: '#64748b', borderRadius: '50%' }}></div>Dubai</li>
                                <li style={{ color: '#94a3b8', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '4px', height: '4px', backgroundColor: '#64748b', borderRadius: '50%' }}></div>Tokyo</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '30px' }}>
                    <p style={{ color: '#475569', fontSize: '11px', letterSpacing: '0.5px' }}>© 2026 ELITE EVENTS GLOBAL LTD. ALL RIGHTS RESERVED.</p>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <a href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: '11px', letterSpacing: '0.5px' }}>PRIVACY</a>
                        <a href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: '11px', letterSpacing: '0.5px' }}>TERMS</a>
                        <a href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: '11px', letterSpacing: '0.5px' }}>COOKIES</a>
                    </div>
                </div>
            </footer>
        </main>
    );
};

export default LandingPage;
