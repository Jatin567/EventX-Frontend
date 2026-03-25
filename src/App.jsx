import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import EventsPage from './pages/EventsPage';
import BookingsPage from './pages/BookingsPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './pages/AdminDashboard';
import AuthModal from './components/AuthModal';
import BookingModal from './components/BookingModal';
import { AuthProvider } from './context/AuthContext';
import './index.css';

const App = () => {
    const [authModal, setAuthModal] = useState({ isOpen: false, type: 'login' });
    const [bookingModal, setBookingModal] = useState({ isOpen: false, event: null });

    const openAuth = (type) => setAuthModal({ isOpen: true, type });
    const closeAuth = () => setAuthModal({ isOpen: false, type: 'login' });

    const openBooking = (event) => setBookingModal({ isOpen: true, event });
    const closeBooking = () => setBookingModal({ isOpen: false, event: null });

    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-black text-white">
                    <Navbar onOpenAuth={openAuth} />
                    
                    <Routes>
                        <Route path="/" element={<LandingPage onBook={openBooking} />} />
                        <Route path="/events" element={<EventsPage onBook={openBooking} />} />
                        <Route path="/bookings" element={<BookingsPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Routes>

                    <AuthModal 
                        isOpen={authModal.isOpen} 
                        onClose={closeAuth} 
                        initialType={authModal.type} 
                    />

                    <BookingModal 
                        isOpen={bookingModal.isOpen} 
                        event={bookingModal.event} 
                        onClose={closeBooking} 
                    />
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
