import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdVpnKey, MdSecurity, MdRefresh, MdLogin, MdInfoOutline } from 'react-icons/md';
import { selectAdmin, refreshCredentials, loginAdmin } from '../../store/slices/adminSlice';
import { logout } from '../../store/slices/authSlice';
import { supabase } from '../../../supabase/supabaseClient';
import useAlert from '../../hooks/useAlert';
import Logo from '../common/Logo';

export const AdminLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const alert = useAlert();
    const { credentials, lastRefresh } = useSelector(selectAdmin);

    const [keyInput, setKeyInput] = useState('');
    const [secretInput, setSecretInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(600); // 10 mins in seconds

    useEffect(() => {
        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - lastRefresh) / 1000);
            const remaining = 600 - (elapsed % 600);
            setTimeLeft(remaining);

            if (remaining === 600) {
                dispatch(refreshCredentials());
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [lastRefresh, dispatch]);

    const handleCitadelLogin = async (e) => {
        e.preventDefault();

        if (keyInput === credentials.key && secretInput === credentials.secret) {
            // 1. Mutual Exclusion: Wipe student session
            await supabase.auth.signOut();
            dispatch(logout()); // Clear Redux student state

            // 2. Establish Citadel Authority
            dispatch(loginAdmin());
            alert.success("Citadel Authority Established. Welcome, Administrator.");
            navigate('/admin/dashboard');
        } else {
            alert.error("Access Denied: Transient credentials do not match current Citadel pulse.");
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vibe-bg">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-5 rounded-5 shadow-2xl border border-white border-opacity-20"
                style={{ maxWidth: '450px', width: '90%' }}
            >
                <div className="text-center mb-5">
                    <Logo size={48} className="mb-4 d-inline-block" />
                    <h2 className="fw-bold text-dark mb-1 tracking-tighter">Admin <span className="text-primary">Citadel</span></h2>
                    <p className="text-secondary small fw-medium">Universal Command & Oversight</p>
                </div>

                <div className="alert bg-primary bg-opacity-5 border-primary border-opacity-10 p-4 rounded-4 mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-3 text-primary">
                        <span className="small fw-bold uppercase tracking-widest d-flex align-items-center gap-2">
                            <MdSecurity /> Transient Keys
                        </span>
                        <span className="smaller fw-bold mono">Rotating in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <div className="d-flex gap-2">
                        <div className="flex-grow-1 bg-white bg-opacity-50 p-2 rounded-3 text-center">
                            <label className="smaller text-secondary d-block uppercase tracking-tighter">Admin Key</label>
                            <span className="fw-bold text-dark mono">{credentials.key}</span>
                        </div>
                        <div className="flex-grow-1 bg-white bg-opacity-50 p-2 rounded-3 text-center">
                            <label className="smaller text-secondary d-block uppercase tracking-tighter">Secret Pass</label>
                            <span className="fw-bold text-dark mono">{credentials.secret}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleCitadelLogin} className="d-flex flex-column gap-3">
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Enter Admin Key"
                            className="form-control form-control-lg rounded-4 border-0 bg-white shadow-sm px-4 fw-medium"
                            value={keyInput}
                            onChange={(e) => setKeyInput(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Enter Secret Pass"
                            className="form-control form-control-lg rounded-4 border-0 bg-white shadow-sm px-4 fw-medium"
                            value={secretInput}
                            onChange={(e) => setSecretInput(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg rounded-4 py-3 fw-bold shadow-lg d-flex align-items-center justify-content-center gap-3 mt-2"
                    >
                        <MdLogin size={24} /> Authorize Access
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="btn btn-link link-secondary text-decoration-none small fw-medium mt-2"
                    >
                        Return to Laboratory Landing
                    </button>
                </form>

                <div className="mt-5 pt-4 border-top border-dark border-opacity-5 d-flex align-items-start gap-3 opacity-50">
                    <MdInfoOutline className="text-secondary mt-1 flex-shrink-0" size={20} />
                    <p className="smaller text-secondary mb-0 fw-medium">
                        Administrative access terminates all active student sessions in the current environment to ensure security isolation.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
