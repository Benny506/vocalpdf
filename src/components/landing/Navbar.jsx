import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navbar as RBNavbar, Nav, Container, Offcanvas } from 'react-bootstrap';
import { selectAuth } from '../../store/slices/authSlice';
import { selectAdmin } from '../../store/slices/adminSlice';
import Logo from '../common/Logo';

const Navbar = ({ minimal = false }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector(selectAuth);
    const { isAdminAuthenticated } = useSelector(selectAdmin);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const scrollToSection = (id) => {
        handleClose();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <RBNavbar expand="lg" className="bg-white sticky-top shadow-sm py-2" onSelect={handleClose}>
            <Container>
                <RBNavbar.Brand 
                    as={Link} 
                    to="/" 
                    className="d-flex align-items-center"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <Logo size={36} className="me-2" />
                    <span className="fw-bold tracking-tight fs-4 text-primary">VocalPDF</span>
                </RBNavbar.Brand>

                <RBNavbar.Toggle 
                    aria-controls="vocal-offcanvas" 
                    className="border-0 shadow-none"
                    onClick={handleShow}
                />

                <RBNavbar.Offcanvas
                    id="vocal-offcanvas"
                    aria-labelledby="vocal-offcanvas-label"
                    placement="end"
                    show={show}
                    onHide={handleClose}
                    className="glass-panel"
                >
                    <Offcanvas.Header closeButton className="border-bottom border-dark border-opacity-5">
                        <Offcanvas.Title id="vocal-offcanvas-label">
                            <Logo size={32} className="me-2" />
                            <span className="fw-bold text-primary">VocalPDF</span>
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    
                    <Offcanvas.Body>
                        <Nav className="justify-content-end flex-grow-1 pe-3 align-items-lg-center gap-2 gap-lg-0">
                            {/* Standard Landing Links (Hidden in minimal/reader mode) */}
                            {!minimal && (
                                <>
                                    <Nav.Link onClick={() => scrollToSection('features')} className="px-3 text-secondary fw-medium">Features</Nav.Link>
                                    <Nav.Link onClick={() => scrollToSection('how-it-works')} className="px-3 text-secondary fw-medium">How it Works</Nav.Link>
                                </>
                            )}

                            <div className="vr d-none d-lg-block mx-3 opacity-10"></div>

                            {/* UNIVERSAL ROLE SELECTOR (Only shown if unauthenticated) */}
                            {!isAuthenticated && !isAdminAuthenticated ? (
                                <div className="d-flex align-items-center gap-2 flex-column flex-lg-row mt-3 mt-lg-0">
                                    <Nav.Link 
                                        as={Link}
                                        to="/admin/login" 
                                        className="btn btn-dark btn-sm rounded-pill px-3 fw-bold text-primary border-primary border-opacity-25 shadow-sm nav-link"
                                        onClick={handleClose}
                                    >
                                        Citadel Access
                                    </Nav.Link>
                                    <Nav.Link 
                                        as={Link}
                                        to="/login" 
                                        className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold nav-link"
                                        onClick={handleClose}
                                    >
                                        Student Login
                                    </Nav.Link>
                                    <button
                                        onClick={() => { handleClose(); navigate('/register'); }}
                                        className="btn btn-primary btn-sm rounded-pill px-4 fw-bold shadow-sm"
                                    >
                                        Get Started
                                    </button>
                                </div>
                            ) : (
                                /* ACTIVE SESSION BRIDGES */
                                <div className="ms-lg-3 mt-3 mt-lg-0">
                                    {isAdminAuthenticated ? (
                                        <button
                                            className="btn btn-dark px-4 py-2 fw-semibold rounded-pill shadow-lg transition-all hover-up d-flex align-items-center gap-2 text-primary border-primary border-opacity-25 w-100"
                                            onClick={() => { handleClose(); navigate('/admin/dashboard'); }}
                                        >
                                            Command Citadel
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-primary px-4 py-2 fw-semibold rounded-pill shadow-lg transition-all hover-up d-flex align-items-center gap-2 w-100"
                                            onClick={() => { handleClose(); navigate('/dashboard'); }}
                                        >
                                            Go to Dashboard
                                        </button>
                                    )}
                                </div>
                            )}
                        </Nav>
                    </Offcanvas.Body>
                </RBNavbar.Offcanvas>
            </Container>
        </RBNavbar>
    );
};

export default Navbar;
