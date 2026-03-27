import React from 'react';
import Logo from '../common/Logo';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-2">
            <div className="container">
                <a className="navbar-brand d-flex align-items-center" href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    <Logo size={36} className="me-2" />
                    <span className="fw-bold tracking-tight fs-4 text-primary">VocalPDF</span>
                </a>

                <button
                    className="navbar-toggler border-0 shadow-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto fw-medium align-items-center">
                        <li className="nav-item">
                            <a className="nav-link px-3 text-secondary" href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link px-3 text-secondary" href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>How it Works</a>
                        </li>
                        <li className="nav-item ms-lg-4 mt-3 mt-lg-0">
                            <button
                                className="btn btn-primary px-4 py-2 fw-semibold rounded-pill shadow-sm transition-all hover-up"
                                onClick={() => navigate('/reader')}
                            >
                                Open Reader
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
