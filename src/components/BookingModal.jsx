import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BookingModal = ({ event, isOpen, onClose }) => {
    const navigate = useNavigate();
    const [numTickets, setNumTickets] = useState(1);
    const { user } = useAuth();

    if (!isOpen || !event) return null;

    const handleBooking = () => {
        if (!user) {
            alert('Please login to book tickets!');
            return;
        }
        onClose();
        navigate('/checkout', { state: { event, numTickets } });
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass animate-fade" style={{ width: '1000px', maxWidth: '100%', background: '#111', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 40px 100px rgba(0,0,0,0.8)', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '30px', right: '30px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', transition: '0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}>
                    <X size={24} />
                </button>

                <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#fff', marginBottom: '8px', letterSpacing: '0.5px' }}>
                    Book <span style={{ color: '#FFD700' }}>Tickets</span>
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '40px' }}>{event.title}</p>

                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Number of Tickets</label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', padding: '12px 24px' }}>
                        <button onClick={() => setNumTickets(Math.max(1, numTickets - 1))} style={{ background: 'transparent', border: 'none', color: '#FFD700', fontSize: '24px', cursor: 'pointer', fontWeight: '700' }}>-</button>
                        <span style={{ color: '#fff', fontSize: '18px', fontWeight: '700' }}>{numTickets}</span>
                        <button onClick={() => setNumTickets(numTickets + 1)} style={{ background: 'transparent', border: 'none', color: '#FFD700', fontSize: '24px', cursor: 'pointer', fontWeight: '700' }}>+</button>
                    </div>
                </div>

                <div style={{ marginTop: '24px', background: 'rgba(40, 35, 10, 0.4)', border: '1px solid rgba(255,215,0,0.05)', borderRadius: '12px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <span style={{ color: '#64748b', fontSize: '15px' }}>Total Price</span>
                    <span style={{ color: '#FFD700', fontSize: '24px', fontWeight: '900' }}>₹{(event.price * numTickets).toFixed(2)}</span>
                </div>

                <button 
                    onClick={handleBooking}
                    style={{ width: '100%', background: '#FFD700', color: '#000', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: '0.3s' }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e6c200'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#FFD700'; }}
                >
                    <CreditCard size={18} color="#000" /> Checkout Now
                </button>
            </div>
        </div>
    );
};

export default BookingModal;
