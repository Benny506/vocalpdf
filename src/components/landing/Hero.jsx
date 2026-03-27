import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import heroImg from '../../assets/hero-main.png';

const Hero = () => {
    const navigate = useNavigate();
    return (
        <section className="hero-section py-5 px-3 bg-white">
            <div className="container py-lg-5">
                <div className="row align-items-center g-5">
                    <div className="col-lg-6 text-center text-lg-start">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="d-flex justify-content-center justify-content-lg-start mb-4">
                                <span className="badge bg-primary-bg-subtle text-primary px-3 py-2 rounded-pill fw-bold fs-xs uppercase tracking-wide">
                                    New: Advanced Voice Synthesis
                                </span>
                            </div>
                            <h1 className="display-3 fw-bold tracking-tight mb-4" style={{ lineHeight: 1.1 }}>
                                Experience Your Documents in a <span className="text-primary">New Dimension</span>
                            </h1>
                            <p className="lead text-secondary mb-5 fs-lg fw-medium">
                                Effortlessly transform any PDF into a natural, spoken narrative.
                                Listen anywhere, learn faster, and stay productive on the move.
                            </p>
                            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                                <button
                                    className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg transition-all hover-up"
                                    onClick={() => navigate('/reader')}
                                >
                                    Open Reader
                                </button>
                                <button
                                    className="btn btn-outline-secondary btn-lg px-5 py-3 rounded-pill fw-bold transition-all"
                                    onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                                >
                                    How it Works
                                </button>
                            </div>

                            {/* Social Proof Placeholder */}
                            <div className="mt-5 d-flex align-items-center justify-content-center justify-content-lg-start gap-4 text-muted border-top pt-4">
                                <div className="small fw-semibold uppercase tracking-wider">Trusted by enthusiasts</div>
                                <div className="d-flex gap-3 opacity-50 fw-bold fs-xl">
                                    <span className="tracking-tighter">STUDENTS</span>
                                    <span className="tracking-tighter">READERS</span>
                                    <span className="tracking-tighter">DEV CO.</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                    <div className="col-lg-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="position-relative"
                        >
                            <div className="hero-blob position-absolute top-50 start-50 translate-middle" style={{ zIndex: -1 }}>
                                <div style={{ width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, rgba(255,255,255,0) 70%)' }}></div>
                            </div>
                            <img
                                src={heroImg}
                                alt="VocalPDF Dashboard Preview"
                                className="img-fluid rounded-4 shadow-lg"
                                style={{ maxHeight: '550px', transform: 'perspective(1000px) rotateY(-5deg)' }}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
