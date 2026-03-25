import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Ticket, Calendar, Hash } from 'lucide-react';

const BookingsPage = () => {
    const { user, token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && token) {
            axios.get(`http://localhost:8080/api/bookings/user/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                setBookings(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [user, token]);

    if (!user) return <div style={{ paddingTop: '150px', textAlign: 'center' }}>Please sign in to view your bookings.</div>;

    return (
        <div style={{ paddingTop: '120px', paddingLeft: '8%', paddingRight: '8%', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>My <span style={{ color: '#FFD700' }}>Bookings</span></h1>
            <p style={{ color: '#94a3b8', marginBottom: '50px' }}>Manage your tickets and upcoming event schedules.</p>

            {loading ? (
                <p>Loading your bookings...</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {bookings.map(booking => (
                        <div key={booking.id} className="glass" style={{ display: 'flex', padding: '24px', borderRadius: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div style={{ background: 'rgba(255,215,0,0.1)', padding: '15px', borderRadius: '12px' }}>
                                    <Ticket color="#FFD700" size={32} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>Event ID: #{booking.eventId}</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Calendar size={14} /> {new Date(booking.bookingDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '4px' }}>Tickets</p>
                                <p style={{ fontSize: '24px', fontWeight: '800', color: '#FFD700' }}>{booking.numberOfTickets}</p>
                            </div>

                            <div>
                                <span style={{ 
                                    background: booking.bookingStatus === 'CONFIRMED' ? 'rgba(34,197,94,0.1)' : 'rgba(255,215,0,0.1)', 
                                    color: booking.bookingStatus === 'CONFIRMED' ? '#22c55e' : '#FFD700',
                                    fontSize: '12px', fontWeight: '700', padding: '6px 16px', borderRadius: '50px'
                                }}>
                                    {booking.bookingStatus}
                                </span>
                            </div>
                        </div>
                    ))}
                    {bookings.length === 0 && (
                        <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '20px' }}>
                            <p style={{ color: '#94a3b8' }}>You haven't booked any events yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookingsPage;
