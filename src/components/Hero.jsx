import React, { useCallback } from 'react';
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import heroImg from '../assets/hero_bg.jpg';

const Hero = () => {
    const particlesInit = useCallback(async engine => {
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async () => {
        console.log("Gold Particles Loaded");
    }, []);

    return (
        <section className="relative h-screen flex flex-col items-center justify-center px-[8%] text-center" style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(10, 10, 10, 0.7) 0%, rgba(10, 10, 10, 1) 100%), url(${heroImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#0a0a0a',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        }}>
            {/* Interactive 3D/Floating Gold Shapes */}
            <Particles
                id="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded}
                options={{
                    background: {
                        color: { value: "transparent" },
                    },
                    fpsLimit: 60,
                    interactivity: {
                        events: {
                            onHover: {
                                enable: true,
                                mode: "slow",
                            },
                        },
                        modes: {
                            slow: {
                                factor: 3,
                                radius: 200,
                            },
                        },
                    },
                    particles: {
                        color: {
                            value: ["#FFD700", "#b8860b", "#ffffff"], // Gold, Dark Gold, Glass White
                        },
                        links: {
                            enable: false,
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outModes: {
                                default: "bounce",
                            },
                            random: true,
                            speed: 0.8,
                            straight: false,
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 800,
                            },
                            value: 30,
                        },
                        opacity: {
                            value: 0.7,
                        },
                        shape: {
                            type: ["circle", "polygon"],
                            polygon: {
                                sides: 6, // Hexagon/Diamond illusion
                            }
                        },
                        size: {
                            value: { min: 4, max: 20 },
                        },
                        rotate: {
                            value: 0,
                            random: true,
                            direction: "random",
                            animation: {
                                enable: true,
                                speed: 2
                            }
                        }
                    },
                    detectRetina: true,
                }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0
                }}
            />

            <div className="max-w-[900px] animate-slide-up" style={{ zIndex: 10, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    marginBottom: '32px',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#FFD700', transform: 'rotate(45deg)' }}></div>
                    <span style={{ 
                        color: '#FFD700', 
                        textTransform: 'uppercase', 
                        letterSpacing: '2px', 
                        fontSize: '10px', 
                        fontWeight: '800'
                    }}>
                        INVITATIONS ONLY - SEASON 2024
                    </span>
                </div>
                
                <h1 style={{ 
                    fontSize: 'clamp(56px, 8vw, 96px)', 
                    fontWeight: '900', 
                    lineHeight: '1.05', 
                    marginBottom: '24px',
                    letterSpacing: '-2px',
                    color: '#ffffff'
                }}>
                    Experience the <br />
                    <span style={{ color: '#FFD700' }}>Extraordinary</span>
                </h1>
                
                <p style={{ 
                    fontSize: '16px', 
                    color: '#94a3b8', 
                    marginBottom: '48px', 
                    maxWidth: '560px',
                    lineHeight: '1.6',
                    fontWeight: '400'
                }}>
                    Access the world's most exclusive gatherings, from private symphonies 
                    to high-altitude galas. Redefining the standard of luxury events.
                </p>
                
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '14px 32px', 
                        borderRadius: '30px', 
                        fontSize: '14px',
                        backgroundColor: '#FFD700',
                        color: '#000000',
                        fontWeight: '700',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Explore Experiences 
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </button>
                    
                    <button style={{ 
                        padding: '14px 32px', 
                        borderRadius: '30px', 
                        fontSize: '14px',
                        backgroundColor: 'rgba(20, 20, 20, 0.8)',
                        backdropFilter: 'blur(10px)',
                        color: '#ffffff',
                        fontWeight: '600',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                        transition: 'background 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.1)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(20, 20, 20, 0.8)'}
                    >
                        View Portfolio
                    </button>
                </div>

                <div style={{ marginTop: '80px', fontSize: '10px', color: '#64748b', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: '700' }}>
                    SCROLL TO DISCOVER
                </div>
            </div>
            
            <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '1px',
                height: '60px',
                background: 'linear-gradient(to bottom, #FFD700, transparent)',
                opacity: 0.5,
                zIndex: 10
            }}></div>
        </section>
    );
};

export default Hero;
