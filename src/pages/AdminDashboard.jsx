import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    Plus, Edit2, Trash2, Upload, X, CheckCircle2, 
    Calendar, MapPin, Globe, Users, DollarSign,
    AlertTriangle, Image as ImageIcon
} from 'lucide-react';

// ─── Event Form Modal ─────────────────────────────────────────────────────────
const EventFormModal = ({ event, token, onClose, onSaved }) => {
    const isEdit = !!event;
    const fileInputRef = useRef();
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(event?.imageUrl || '');

    const [form, setForm] = useState({
        title: event?.title || '',
        description: event?.description || '',
        location: event?.location || '',
        state: event?.state || '',
        country: event?.country || '',
        eventDate: event?.eventDate ? event.eventDate.slice(0, 16) : '',
        totalSeats: event?.totalSeats || '',
        availableSeats: event?.availableSeats || '',
        price: event?.price || '',
        imageUrl: event?.imageUrl || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Client-side preview
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);

        setUploading(true);
        setError('');
        try {
            const data = new FormData();
            data.append('file', file);
            // DO NOT set Content-Type manually - browser must set it with the correct multipart boundary
            const res = await axios.post('https://eventx-backend.onrender.com/api/upload', data, {
                headers: { 
                    Authorization: `Bearer ${token}`
                }
            });
            const imageUrl = res.data.imageUrl.startsWith('http') 
                ? res.data.imageUrl 
                : `https://eventx-backend.onrender.com${res.data.imageUrl}`;
            setForm(prev => ({ ...prev, imageUrl }));
            setImagePreview(imageUrl);
        } catch (err) {
            console.error('Upload error:', err.response?.status, err.response?.data);
            const msg = err.response?.status === 403 
                ? 'Unauthorized. Make sure your account has ADMIN role.'
                : err.response?.status === 401
                ? 'Session expired. Please log in again.'
                : `Upload failed: ${err.response?.data?.error || err.message}`;
            setError(msg);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const payload = {
                ...form,
                totalSeats: parseInt(form.totalSeats),
                availableSeats: parseInt(form.availableSeats || form.totalSeats),
                price: parseFloat(form.price),
                eventDate: new Date(form.eventDate).toISOString().slice(0, 19)
            };
            if (isEdit) {
                await axios.put(`https://eventx-backend.onrender.com/api/events/${event.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('https://eventx-backend.onrender.com/api/events', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            onSaved();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save event.');
        } finally {
            setSaving(false);
        }
    };

    const inputStyle = {
        width: '100%',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '14px 16px',
        color: '#fff',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '12px',
        fontWeight: '700',
        color: '#94a3b8',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        marginBottom: '8px'
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px', overflowY: 'auto'
        }}>
            <div className="glass" style={{
                borderRadius: '28px',
                padding: '48px',
                width: '100%',
                maxWidth: '780px',
                border: '1px solid rgba(255,215,0,0.2)',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
                    <div>
                        <h2 style={{ fontSize: '28px', fontWeight: '800' }}>{isEdit ? 'Edit Event' : 'Create New Event'}</h2>
                        <p style={{ color: '#94a3b8', marginTop: '4px' }}>Fill in the details to {isEdit ? 'update' : 'publish'} an elite experience</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px', cursor: 'pointer', color: '#fff' }}>
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div style={{ background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.3)', borderRadius: '12px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: '#ff3b30' }}>
                        <AlertTriangle size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Image Upload */}
                    <div>
                        <label style={labelStyle}>Event Image</label>
                        <div
                            onClick={() => fileInputRef.current.click()}
                            style={{
                                width: '100%',
                                height: '220px',
                                borderRadius: '16px',
                                border: '2px dashed rgba(255,215,0,0.3)',
                                background: 'rgba(255,215,0,0.02)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                position: 'relative',
                                transition: 'border-color 0.3s'
                            }}
                        >
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.3s' }}
                                        onMouseOver={e => e.currentTarget.style.opacity = 1}
                                        onMouseOut={e => e.currentTarget.style.opacity = 0}>
                                        <Upload size={32} color="#FFD700" />
                                    </div>
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#4b5563' }}>
                                    {uploading ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '36px', height: '36px', border: '3px solid rgba(255,215,0,0.2)', borderTop: '3px solid #FFD700', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                            <span style={{ color: '#FFD700' }}>Uploading...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon size={48} style={{ marginBottom: '12px' }} />
                                            <p style={{ fontWeight: '600', color: '#fff' }}>Click to upload event image</p>
                                            <p style={{ fontSize: '13px', marginTop: '4px' }}>PNG, JPG, WEBP — up to 10MB</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </div>

                    {/* Title */}
                    <div>
                        <label style={labelStyle}>Event Title *</label>
                        <input required name="title" value={form.title} onChange={handleChange} placeholder="Summer Jazz Festival" style={inputStyle} />
                    </div>

                    {/* Description */}
                    <div>
                        <label style={labelStyle}>Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Describe the premium experience..." style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }} />
                    </div>

                    {/* Location Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}><MapPin size={11} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Venue / City *</label>
                            <input required name="location" value={form.location} onChange={handleChange} placeholder="Madison Square Garden" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>State / Region</label>
                            <input name="state" value={form.state} onChange={handleChange} placeholder="New York" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}><Globe size={11} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Country</label>
                            <input name="country" value={form.country} onChange={handleChange} placeholder="USA" style={inputStyle} />
                        </div>
                    </div>

                    {/* Date & Seats & Price */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}><Calendar size={11} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Event Date *</label>
                            <input required type="datetime-local" name="eventDate" value={form.eventDate} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}><Users size={11} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Total Seats *</label>
                            <input required type="number" min="1" name="totalSeats" value={form.totalSeats} onChange={handleChange} placeholder="500" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Available Seats</label>
                            <input type="number" min="0" name="availableSeats" value={form.availableSeats} onChange={handleChange} placeholder="500" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}><DollarSign size={11} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Price (INR) *</label>
                            <input required type="number" min="0" step="0.01" name="price" value={form.price} onChange={handleChange} placeholder="99.99" style={inputStyle} />
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={saving || uploading} className="btn-primary" style={{ flex: 2, padding: '16px', borderRadius: '14px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            {saving ? 'Saving...' : isEdit ? 'Update Event' : 'Publish Event'}
                        </button>
                    </div>
                </form>

                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );
};

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
const AdminDashboard = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [toast, setToast] = useState('');

    useEffect(() => {
        if (!user || user.role !== 'ROLE_ADMIN') {
            navigate('/');
            return;
        }
        fetchEvents();
    }, [user]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://eventx-backend.onrender.com/api/events');
            setEvents(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://eventx-backend.onrender.com/api/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showToast('Event deleted successfully!');
            fetchEvents();
        } catch (e) {
            showToast('Failed to delete event.');
        } finally {
            setDeleteConfirm(null);
        }
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const handleSaved = () => {
        setShowForm(false);
        setEditingEvent(null);
        showToast(editingEvent ? 'Event updated!' : 'New event published!');
        fetchEvents();
    };

    const rowStyle = {
        display: 'grid',
        gridTemplateColumns: '80px 1fr 140px 120px 100px 130px',
        gap: '16px',
        alignItems: 'center',
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        transition: 'background 0.2s'
    };

    return (
        <div style={{ paddingTop: '120px', paddingLeft: '8%', paddingRight: '8%', minHeight: '100vh', paddingBottom: '100px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <span style={{ color: '#FFD700', fontSize: '12px', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase' }}>Admin Console</span>
                    <h1 style={{ fontSize: '52px', fontWeight: '800', marginTop: '8px' }}>
                        Event <span style={{ color: '#FFD700' }}>Management</span>
                    </h1>
                    <p style={{ color: '#94a3b8', marginTop: '8px' }}>{events.length} events in your catalog</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => { setEditingEvent(null); setShowForm(true); }}
                    style={{ padding: '16px 32px', borderRadius: '14px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                    <Plus size={20} /> Add New Event
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>
                {[
                    { label: 'Total Events', value: events.length, icon: <Calendar size={24} color="#FFD700" /> },
                    { label: 'Total Seats', value: events.reduce((s, e) => s + (e.totalSeats || 0), 0).toLocaleString(), icon: <Users size={24} color="#FFD700" /> },
                    { label: 'Countries', value: [...new Set(events.filter(e => e.country).map(e => e.country))].length, icon: <Globe size={24} color="#FFD700" /> },
                ].map(stat => (
                    <div key={stat.label} className="glass" style={{ padding: '28px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ padding: '16px', background: 'rgba(255,215,0,0.1)', borderRadius: '16px' }}>{stat.icon}</div>
                        <div>
                            <div style={{ fontSize: '32px', fontWeight: '800' }}>{stat.value}</div>
                            <div style={{ color: '#94a3b8', fontSize: '14px', marginTop: '2px' }}>{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Events Table */}
            <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                <div style={{ ...rowStyle, background: 'rgba(255,215,0,0.03)', borderBottom: '1px solid rgba(255,215,0,0.1)' }}>
                    <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Image</span>
                    <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Event</span>
                    <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Date</span>
                    <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Location</span>
                    <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Price</span>
                    <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Actions</span>
                </div>

                {loading ? (
                    <div style={{ padding: '80px', textAlign: 'center' }}>
                        <div style={{ width: '40px', height: '40px', border: '4px solid rgba(255,215,0,0.1)', borderTop: '4px solid #FFD700', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                    </div>
                ) : events.length === 0 ? (
                    <div style={{ padding: '80px', textAlign: 'center', color: '#4b5563' }}>
                        <Calendar size={60} style={{ margin: '0 auto 20px' }} />
                        <p>No events yet. Create your first one!</p>
                    </div>
                ) : (
                    events.map(event => (
                        <div
                            key={event.id}
                            style={rowStyle}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <div style={{ width: '68px', height: '52px', borderRadius: '10px', overflow: 'hidden', background: '#111' }}>
                                {event.imageUrl ? (
                                    <img src={event.imageUrl} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>
                                        <ImageIcon size={20} />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', marginBottom: '4px' }}>{event.title}</div>
                                <div style={{ fontSize: '13px', color: '#94a3b8' }}>{event.availableSeats} / {event.totalSeats} seats available</div>
                            </div>
                            <div style={{ fontSize: '14px', color: '#94a3b8' }}>{new Date(event.eventDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</div>
                            <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                                {[event.location, event.country].filter(Boolean).join(', ')}
                            </div>
                            <div style={{ fontWeight: '700', color: '#FFD700' }}>₹{event.price}</div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => { setEditingEvent(event); setShowForm(true); }}
                                    style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '13px' }}
                                >
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(event)}
                                    style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', color: '#ff3b30', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '13px' }}
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 998, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="glass" style={{ borderRadius: '24px', padding: '48px', maxWidth: '440px', width: '100%', textAlign: 'center', border: '1px solid rgba(255,59,48,0.2)' }}>
                        <AlertTriangle size={56} color="#ff3b30" style={{ margin: '0 auto 24px' }} />
                        <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Delete Event?</h3>
                        <p style={{ color: '#94a3b8', marginBottom: '36px' }}>
                            Are you sure you want to permanently delete <strong style={{ color: '#fff' }}>{deleteConfirm.title}</strong>? This cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', fontWeight: '700' }}>
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteConfirm.id)} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'rgba(255,59,48,0.2)', border: '1px solid rgba(255,59,48,0.4)', color: '#ff3b30', cursor: 'pointer', fontWeight: '700' }}>
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Event Form Modal */}
            {showForm && (
                <EventFormModal
                    event={editingEvent}
                    token={token}
                    onClose={() => { setShowForm(false); setEditingEvent(null); }}
                    onSaved={handleSaved}
                />
            )}

            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '40px', right: '40px', zIndex: 9999,
                    background: '#FFD700', color: '#000',
                    padding: '16px 28px', borderRadius: '14px',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    fontWeight: '700', fontSize: '15px',
                    boxShadow: '0 8px 32px rgba(255,215,0,0.3)'
                }}>
                    <CheckCircle2 size={20} /> {toast}
                </div>
            )}

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default AdminDashboard;
