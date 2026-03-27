import React from 'react';
import Logo from '../common/Logo';

const Footer = () => {
    return (
        <footer className="footer bg-dark text-white pt-5 pb-4 mt-5">
            <div className="container text-center text-lg-start">
                <div className="row g-4 mb-5 justify-content-between">
                    <div className="col-lg-5">
                        <div className="d-flex align-items-center mb-4 justify-content-center justify-content-lg-start">
                            <Logo size={40} className="me-2" />
                            <h3 className="fw-bold tracking-tight mb-0">VocalPDF</h3>
                        </div>
                        <p className="text-secondary mb-4">
                            VocalPDF is a modern web-based document reader designed to enhance productivity and accessibility.
                            By leveraging advanced Text-to-Speech (TTS) technology, we transform static PDF documents into dynamic audio experiences.
                        </p>
                    </div>

                    <div className="col-lg-5">
                        <h6 className="fw-bold mb-4 uppercase tracking-widest text-primary">Mission & Privacy</h6>
                        <p className="text-secondary small mb-3">
                            Our mission is to make information more accessible for everyone—from busy professionals multitasking
                            on the go to students with reading differences.
                        </p>
                        <p className="text-secondary small">
                            <strong>Note on Privacy:</strong> All document processing happens locally within your browser sessions.
                            We do not store your PDFs or extracted text on any database, ensuring your data remains private and secure.
                        </p>
                    </div>
                </div>

                <div className="border-top border-secondary pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <p className="text-secondary small mb-0">
                        &copy; 2026 VocalPDF. Built with React, Vite & Redux.
                    </p>
                    <div className="d-flex gap-4 text-secondary small">
                        <span>Local Web Deployment</span>
                        <span className="opacity-50">|</span>
                        <span>V 1.0.0 Alpha</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
