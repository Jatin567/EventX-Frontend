import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ShieldCheck, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// ---------------------------------------------------------------------------
// Google Pay configuration
// ---------------------------------------------------------------------------
const GOOGLE_PAY_ENV = 'TEST'; // Switch to 'PRODUCTION' when going live

const BASE_REQUEST = {
    apiVersion: 2,
    apiVersionMinor: 0,
};

const ALLOWED_CARD_NETWORKS = ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'];
const ALLOWED_CARD_AUTH_METHODS = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

// In production replace 'example' with your actual payment gateway id
const TOKENIZATION_SPEC = {
    type: 'PAYMENT_GATEWAY',
    parameters: {
        gateway: 'example',
        gatewayMerchantId: 'exampleGatewayMerchantId',
    },
};

const BASE_CARD_PAYMENT_METHOD = {
    type: 'CARD',
    parameters: {
        allowedAuthMethods: ALLOWED_CARD_AUTH_METHODS,
        allowedCardNetworks: ALLOWED_CARD_NETWORKS,
    },
};

const CARD_PAYMENT_METHOD = {
    ...BASE_CARD_PAYMENT_METHOD,
    tokenizationSpecification: TOKENIZATION_SPEC,
};

// ---------------------------------------------------------------------------
// Hook: loads the Google Pay script once and resolves a client
// ---------------------------------------------------------------------------
function useGooglePay() {
    const [paymentsClient, setPaymentsClient] = useState(null);
    const [supported, setSupported] = useState(null); // null = loading, true/false

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://pay.google.com/gp/p/js/pay.js';
        script.async = true;
        script.onload = () => {
            const client = new window.google.payments.api.PaymentsClient({
                environment: GOOGLE_PAY_ENV,
            });

            client.isReadyToPay({
                ...BASE_REQUEST,
                allowedPaymentMethods: [BASE_CARD_PAYMENT_METHOD],
            }).then(response => {
                setPaymentsClient(client);
                setSupported(response.result);
            }).catch(() => setSupported(false));
        };
        script.onerror = () => setSupported(false);
        document.head.appendChild(script);
        return () => { if (document.head.contains(script)) document.head.removeChild(script); };
    }, []);

    return { paymentsClient, supported };
}

// ---------------------------------------------------------------------------
// Main CheckoutPage component
// ---------------------------------------------------------------------------
const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const { event, numTickets } = location.state || {};
    const btnRef = useRef(null);

    const { paymentsClient, supported } = useGooglePay();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const totalPrice = event ? event.price * numTickets : 0;

    // Render Google Pay button once client is ready
    useEffect(() => {
        if (!paymentsClient || !supported || !btnRef.current) return;
        btnRef.current.innerHTML = ''; // clear any previous button

        const button = paymentsClient.createButton({
            buttonColor: 'white',
            buttonType: 'pay',
            buttonRadius: 8,
            buttonSizeMode: 'fill',
            onClick: handleGooglePay,
        });
        btnRef.current.appendChild(button);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentsClient, supported, event, numTickets]);

    const handleGooglePay = async () => {
        if (!paymentsClient || !event) return;
        setLoading(true);
        setErrorMsg('');

        const paymentDataRequest = {
            ...BASE_REQUEST,
            allowedPaymentMethods: [CARD_PAYMENT_METHOD],
            transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPrice: totalPrice.toFixed(2),
                currencyCode: 'INR',
                countryCode: 'IN',
            },
            merchantInfo: {
                merchantName: 'EventX',
                merchantId: '01234567890123456789', // replace with real ID in production
            },
        };

        try {
            // Opens the Google Pay sheet — user picks a card
            await paymentsClient.loadPaymentData(paymentDataRequest);
            // If we reach here, payment was authorized by the user in the sheet

            // Step 1: Create the booking
            const bookingRes = await axios.post('http://localhost:8080/api/bookings', {
                userId: user.id,
                eventId: event.id,
                numberOfTickets: numTickets,
            }, { headers: { Authorization: `Bearer ${token}` } });

            // Step 2: Record the payment in our backend
            await axios.post('http://localhost:8080/api/payments', {
                bookingId: bookingRes.data.id,
                amount: totalPrice,
                paymentMethod: 'GOOGLE_PAY',
            }, { headers: { Authorization: `Bearer ${token}` } });

            setSuccess(true);
            setTimeout(() => navigate('/bookings'), 2500);
        } catch (err) {
            // Google Pay sheet dismissed = err.statusCode 'CANCELED'
            if (err?.statusCode === 'CANCELED') {
                setErrorMsg('Payment cancelled.');
            } else {
                setErrorMsg(err.response?.data?.message || 'Payment failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // ---- Guard: no booking data ----
    if (!event || !numTickets) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl mb-4">No booking data found.</h2>
                <button onClick={() => navigate('/events')} className="btn-primary" style={{ padding: '12px 24px', borderRadius: '12px' }}>
                    Return to Events
                </button>
            </div>
        );
    }

    // ---- Success screen ----
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-black">
                <div className="glass p-10 text-center animate-scale-in" style={{ borderRadius: '32px', maxWidth: '450px' }}>
                    <div className="flex justify-center mb-6">
                        <CheckCircle2 size={80} style={{ color: '#FFD700' }} />
                    </div>
                    <h2 className="text-4xl font-bold mb-3">Payment Confirmed!</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '12px' }}>
                        Your tickets for <span className="text-white">{event.title}</span> are confirmed.
                    </p>
                    <p style={{ color: '#4ade80', fontSize: '13px' }}>Redirecting to your bookings…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col lg:flex-row overflow-hidden">

            {/* ── Left Column: Event image + order summary ── */}
            <div className="hidden lg:flex lg:w-1/2 relative h-screen items-center justify-center p-12">
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.9)), url(${event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80'})`,
                    backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0,
                }} />

                <div className="glass p-10 animate-slide-up relative z-10 w-full max-w-lg" style={{ borderRadius: '40px', backdropFilter: 'blur(32px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                        <div>
                            <span style={{ color: '#FFD700', fontSize: '12px', fontWeight: '800', letterSpacing: '4px', textTransform: 'uppercase' }}>Your Selection</span>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '10px' }}>{event.title}</h2>
                            <p style={{ color: '#94a3b8', marginTop: '5px' }}>
                                <MapPin size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />{event.location}
                            </p>
                        </div>
                        <div className="glass" style={{ padding: '10px', borderRadius: '15px' }}>
                            <Calendar size={24} color="#FFD700" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                            <span>General Admission</span>
                            <span className="text-white">₹{event.price.toFixed(2)} × {numTickets}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                            <span>Concierge Service</span>
                            <span style={{ color: '#FFD700' }}>Included</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                            <span>Taxes &amp; Fees</span>
                            <span className="text-white">₹0.00</span>
                        </div>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <span style={{ color: '#94a3b8', fontSize: '14px' }}>Total Amount</span>
                                <div style={{ fontSize: '36px', fontWeight: '800', color: '#FFD700' }}>₹{totalPrice.toFixed(2)}</div>
                            </div>
                            <span style={{ color: '#4ade80', fontSize: '14px', fontWeight: '600' }}>
                                <ShieldCheck size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} /> Guaranteed
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right Column: Google Pay ── */}
            <div className="w-full lg:w-1/2 h-screen flex flex-col pt-32 pb-12 px-[8%] lg:px-[10%] relative animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontWeight: '600', transition: '0.3s' }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#FFD700'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
                >
                    <ArrowLeft size={18} /> BACK TO EVENT
                </button>

                <div className="max-w-lg">
                    <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '10px' }}>Checkout</h1>
                    <p style={{ color: '#94a3b8', marginBottom: '48px' }}>
                        Complete your reservation securely with Google Pay.
                    </p>

                    {/* Order total card */}
                    <div className="glass" style={{ borderRadius: '20px', padding: '28px', marginBottom: '36px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#94a3b8', fontSize: '14px' }}>
                            <span>{event.title}</span>
                            <span className="text-white">{numTickets} ticket{numTickets > 1 ? 's' : ''}</span>
                        </div>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Total</span>
                            <span style={{ fontSize: '28px', fontWeight: '800', color: '#FFD700' }}>₹{totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Google Pay button area */}
                    {supported === null && (
                        <div style={{ textAlign: 'center', color: '#4b5563', padding: '20px' }}>
                            Loading Google Pay…
                        </div>
                    )}

                    {supported === false && (
                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '20px', color: '#ef4444', textAlign: 'center' }}>
                            Google Pay is not available on this device or browser.
                        </div>
                    )}

                    {/* The actual Google Pay button gets injected here by the SDK */}
                    <div
                        ref={btnRef}
                        style={{ width: '100%', minHeight: supported ? '54px' : '0px', opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}
                    />

                    {/* Error message */}
                    {errorMsg && (
                        <div style={{ marginTop: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', color: '#ef4444', fontSize: '14px' }}>
                            ⚠️ {errorMsg}
                        </div>
                    )}

                    {loading && (
                        <div style={{ textAlign: 'center', marginTop: '16px', color: '#94a3b8', fontSize: '14px' }}>
                            Processing payment…
                        </div>
                    )}

                    {/* Security note */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '28px', color: '#4b5563', fontSize: '12px', letterSpacing: '1px' }}>
                        <Lock size={13} /> SECURED BY GOOGLE PAY · 256-BIT ENCRYPTION
                    </div>

                    {/* Google Pay accepted logos hint */}
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <p style={{ color: '#4b5563', fontSize: '11px', marginBottom: '8px', letterSpacing: '1px' }}>ACCEPTED CARDS VIA GOOGLE PAY</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            {['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER'].map(brand => (
                                <span key={brand} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px' }}>
                                    {brand}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
