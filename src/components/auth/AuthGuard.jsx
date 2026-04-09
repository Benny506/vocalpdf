import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdLockPerson, MdArrowBack, MdLogin } from 'react-icons/md';
import { selectAuth } from '../../store/slices/authSlice';

/**
 * AccessDenied: A high-fidelity glass HUD for unauthorized access attempts.
 */
export const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <div className="min-vh-100 vibe-bg d-flex align-items-center justify-content-center p-3">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-5 rounded-5 shadow-2xl text-center"
                style={{ maxWidth: '480px' }}
            >
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4 text-primary"
                >
                    <MdLockPerson size={80} />
                </motion.div>

                <h2 className="display-6 fw-bold tracking-tighter text-dark mb-3">Sovereignty Warning</h2>
                <p className="text-secondary fw-medium mb-5">
                    This sector of the laboratory is restricted to authenticated members. 
                    Please establish a secure session to continue.
                </p>

                <div className="d-grid gap-3">
                    <Link to="/login" className="btn btn-primary btn-lg rounded-pill fw-bold shadow-lg py-3 d-flex align-items-center justify-content-center gap-2 hover-up">
                        <MdLogin size={22} /> Establish Session
                    </Link>
                    
                    <button 
                        onClick={() => navigate('/')} 
                        className="btn btn-white shadow-sm rounded-pill fw-bold py-3 d-flex align-items-center justify-content-center gap-2 hover-up border-0"
                    >
                        <MdArrowBack size={22} /> Return to Landing
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

/**
 * AuthGuard: An authorization bridge for protected routes.
 */
export const AuthGuard = ({ children }) => {
    const { isAuthenticated, isInitializing } = useSelector(selectAuth);

    // During initialization, the App.jsx handles the 'cloak'
    // This guard only acts once initializing is done.
    if (!isInitializing && !isAuthenticated) {
        return <AccessDenied />;
    }

    return children;
};

export default AuthGuard;
