import React, { useState } from 'react';

const EventCard = ({ event, onBook }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className="animate-slide-up" 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
                borderRadius: '16px', 
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                overflow: 'hidden',
                height: '420px',
                width: '100%',
                border: isHovered ? '2px solid rgba(255, 215, 0, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
                boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(255, 215, 0, 0.1)' : '0 10px 30px rgba(0,0,0,0.8)',
                backgroundColor: '#050505'
            }}
        >
            {/* Background Image Layer */}
            {event.imageUrl ? (
                <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                        zIndex: 0,
                        opacity: 0.8
                    }}
                />
            ) : (
                <div style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%', 
                    height: '100%', 
                    background: `linear-gradient(135deg, #111, #222)`, 
                    zIndex: 0
                }}>
                </div>
            )}
            
            {/* Gradient Overlay for Text Readability */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.2) 100%)',
                zIndex: 1
            }}></div>

            {/* Content Section (Bottom Aligned) */}
            <div style={{ 
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                padding: '24px', 
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                height: '100%'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ 
                        color: '#FFD700', 
                        fontSize: '10px', 
                        fontWeight: '800', 
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 215, 0, 0.2)'
                    }}>
                        INVEST ONLY
                    </span>
                    <span style={{ color: '#fff', fontSize: '11px', fontWeight: '500', letterSpacing: '0.5px' }}>
                        Oct 24, 2026
                    </span>
                </div>
                
                <h3 style={{ 
                    fontSize: '20px', 
                    marginBottom: '8px', 
                    fontWeight: '800',
                    lineHeight: '1.3',
                    color: '#fff',
                    fontFamily: '"Space Grotesk", sans-serif'
                }}>
                    {event.title}
                </h3>
                
                <p style={{
                    color: '#cbd5e1',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    marginBottom: '24px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {event.description || "An exclusive luxury experience curated for discerning individuals looking for the extraordinary."}
                </p>
                
                <button 
                    onClick={() => onBook(event)}
                    style={{ 
                        width: '100%', 
                        padding: '14px', 
                        borderRadius: '12px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '13px',
                        backgroundColor: 'rgba(25, 25, 25, 0.8)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        color: '#fff',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = 'rgba(40, 40, 40, 0.9)';
                        e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = 'rgba(25, 25, 25, 0.8)';
                        e.target.style.borderColor = 'rgba(255,255,255,0.05)';
                    }}
                >
                    Request Invite
                </button>
            </div>
        </div>
    );
};

export default EventCard;
