import React, { useState } from 'react';
import { X, Shield, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import authBg from '../assets/auth_bg.png';

const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '14px 16px',
    color: '#fff',
    outline: 'none',
    fontSize: '15px',
    boxSizing: 'border-box',
    transition: '0.3s cubic-bezier(0.16, 1, 0.3, 1)',
};

const AuthModal = ({ isOpen, onClose, initialType = 'login' }) => {
    const [type, setType] = useState(initialType);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', adminPasscode: '' });
    const [showPasscode, setShowPasscode] = useState(false);
    const [showPin, setShowPin] = useState(false);
    const { login } = useAuth();
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (type === 'register' && showPasscode && formData.adminPasscode && formData.adminPasscode.length !== 6) {
            setError('Admin passcode must be exactly 6 digits.');
            return;
        }

        try {
            if (type === 'login') {
                const res = await axios.post('https://eventx-backend.onrender.com/api/auth/login', {
                    email: formData.email,
                    password: formData.password,
                });
                login(res.data, res.data.token);
                onClose();
            } else {
                const payload = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    adminPasscode: showPasscode ? formData.adminPasscode : '',
                };
                const res = await axios.post('https://eventx-backend.onrender.com/api/auth/register', payload);
                const msg = res.data?.message || 'Registration successful!';
                alert(msg + ' Please login.');
                setType('login');
                setShowPasscode(false);
                setFormData({ name: '', email: '', password: '', adminPasscode: '' });
            }
        } catch (err) {
            const data = err.response?.data;
            if (data?.message) {
                setError(data.message);
            } else if (data && typeof data === 'object') {
                const msgs = Object.entries(data).map(([field, msg]) => `${field}: ${msg}`);
                setError(msgs.join(' | '));
            } else {
                setError('Authentication failed. Please try again.');
            }
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}>
            <div className="glass" style={{ width: '1000px', maxWidth: '100%', display: 'flex', borderRadius: '32px', overflow: 'hidden', minHeight: '650px', background: 'rgba(20,20,20,0.6)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 40px 100px rgba(0,0,0,0.8)' }}>
                
                {/* Left Side: Visuals (Hidden on mobile) */}
                <div style={{ flex: 1.2, position: 'relative', overflow: 'hidden' }} className="hidden-mobile">
                    <img src={authBg} alt="Events" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), linear-gradient(to bottom, rgba(255,215,0,0.1), transparent)' }}></div>
                    <div style={{ position: 'absolute', bottom: '60px', left: '60px', right: '60px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FFD700', marginBottom: '15px' }}>
                            <Sparkles size={20} />
                            <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '4px', textTransform: 'uppercase' }}>Premium Access</span>
                        </div>
                        <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#fff', marginBottom: '20px', lineHeight: '1.1' }}>Experience the<br /><span style={{ color: '#FFD700' }}>Extraordinary</span></h1>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', lineHeight: '1.6', maxWidth: '400px' }}>
                            Join our elite community and unlock access to the world's most exclusive events and experiences.
                        </p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div style={{ flex: 1, padding: '60px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(10,10,10,0.4)' }}>
                    <button onClick={onClose} style={{ position: 'absolute', top: '30px', right: '30px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', height: '44px', width: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}>
                        <X size={20} />
                    </button>

                    <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#fff', marginBottom: '12px', letterSpacing: '-0.5px' }}>
                        {type === 'login' ? 'Sign In' : 'Join Us'}
                    </h2>
                    <p style={{ color: '#64748b', marginBottom: '40px', fontSize: '16px' }}>
                        {type === 'login' ? 'Proceed with your premium account credentials.' : 'Step into the world of luxury events.'}
                    </p>

                    {error && (
                        <div style={{ background: 'rgba(255,71,87,0.1)', borderLeft: '4px solid #ff4757', color: '#ff4757', padding: '16px', borderRadius: '12px', marginBottom: '30px', fontSize: '14px', fontWeight: '600' }}>
                           {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {type === 'register' && (
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Full Name</label>
                                <input type="text" required style={inputStyle} value={formData.name} onChange={handleChange('name')} placeholder="Enter your full name" onFocus={(e) => { e.target.style.borderColor = '#FFD700'; e.target.style.background = 'rgba(255,255,255,0.06)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }} />
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Email Address</label>
                            <input type="email" required style={inputStyle} value={formData.email} onChange={handleChange('email')} placeholder="name@luxury.com" onFocus={(e) => { e.target.style.borderColor = '#FFD700'; e.target.style.background = 'rgba(255,255,255,0.06)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>Password</label>
                            <input type="password" required style={inputStyle} value={formData.password} onChange={handleChange('password')} placeholder="••••••••" onFocus={(e) => { e.target.style.borderColor = '#FFD700'; e.target.style.background = 'rgba(255,255,255,0.06)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }} />
                        </div>

                        {type === 'register' && (
                            <div>
                                <button
                                    type="button"
                                    onClick={() => { setShowPasscode(!showPasscode); setFormData({ ...formData, adminPasscode: '' }); }}
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: showPasscode ? '#FFD700' : '#4b5563', fontSize: '14px', fontWeight: '700', padding: 0, marginBottom: showPasscode ? '16px' : '0' }}
                                >
                                    <Shield size={16} />
                                    {showPasscode ? 'Discard Admin Access' : 'Become an Administrator?'}
                                </button>

                                {showPasscode && (
                                    <div style={{ marginTop: '10px', padding: '24px', borderRadius: '18px', background: 'rgba(255,215,0,0.01)', border: '1px solid rgba(255,215,0,0.1)', animation: 'fadeIn 0.4s ease' }}>
                                        <label style={{ display: 'block', marginBottom: '12px', color: '#FFD700', fontSize: '12px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                            Security Passcode
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showPin ? 'text' : 'password'}
                                                maxLength={6}
                                                inputMode="numeric"
                                                pattern="[0-9]{6}"
                                                placeholder="••••••"
                                                value={formData.adminPasscode}
                                                onChange={handleChange('adminPasscode')}
                                                style={{ ...inputStyle, textAlign: 'center', fontSize: '24px', letterSpacing: '12px', border: '1px solid rgba(255,215,0,0.4)', background: 'rgba(255,215,0,0.03)' }}
                                            />
                                            <button type="button" onClick={() => setShowPin(!showPin)} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#4b5563', cursor: 'pointer' }}>
                                                {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{ width: '100%', background: '#FFD700', color: '#000', padding: '18px', borderRadius: '16px', fontWeight: '900', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', border: 'none', cursor: 'pointer', marginTop: '10px', boxShadow: '0 20px 40px rgba(255,215,0,0.15)', transition: '0.3s' }}
                            onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 25px 50px rgba(255,215,0,0.25)'; }}
                            onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 20px 40px rgba(255,215,0,0.15)'; }}
                        >
                            {type === 'login' ? 'Sign In Already' : 'Complete Registration'}
                        </button>
                    </form>

                    <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                        <p style={{ fontSize: '15px', color: '#64748b' }}>
                            {type === 'login' ? "New to the platform?" : 'Return to secure portal?'} {' '}
                            <button
                                onClick={() => { setType(type === 'login' ? 'register' : 'login'); setError(''); setShowPasscode(false); }}
                                style={{ color: '#FFD700', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '800', fontSize: '15px', marginLeft: '5px' }}
                            >
                                {type === 'login' ? 'Join Now' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .hidden-mobile { display: none !important; }
                    .glass { width: 500px !important; }
                }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fade { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
};

export default AuthModal;

