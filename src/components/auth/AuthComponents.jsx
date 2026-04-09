import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

/**
 * AuthShell: A centered glassmorphic layout wrapper for all authentication pages.
 */
export const AuthShell = ({ children, title, subtitle }) => {
    return (
        <div className="min-vh-100 vibe-bg d-flex align-items-center justify-content-center py-5 px-3">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="glass-panel p-4 p-md-5 rounded-5 shadow-2xl w-100"
                style={{ maxWidth: '480px' }}
            >
                <div className="text-center mb-4">
                    <h2 className="display-6 fw-bold tracking-tighter text-dark mb-2">{title}</h2>
                    {subtitle && <p className="text-secondary fw-medium">{subtitle}</p>}
                </div>
                {children}
            </motion.div>
        </div>
    );
};

/**
 * PasswordInput: A hardened input component with visibility toggle.
 */
export const PasswordInput = ({ label, value, onChange, placeholder, name, onBlur, error, touched }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="mb-3">
            <label className="form-label small fw-bold text-secondary uppercase tracking-wider">{label}</label>
            <div className="position-relative">
                <input
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={`form-control form-control-lg rounded-pill border-0 bg-white-subtle shadow-sm px-4 fw-medium ${
                        touched && error ? 'is-invalid border-danger' : ''
                    }`}
                    style={{ paddingRight: '50px' }}
                />
                <button
                    type="button"
                    className="btn position-absolute top-50 end-0 translate-middle-y me-2 border-0 shadow-none text-secondary"
                    onClick={() => setShow(!show)}
                    style={{ padding: '8px' }}
                >
                    {show ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
                </button>
            </div>
            {touched && error && (
                <div className="invalid-feedback d-block ps-4 mt-1 small fw-bold">
                    {error}
                </div>
            )}
        </div>
    );
};
