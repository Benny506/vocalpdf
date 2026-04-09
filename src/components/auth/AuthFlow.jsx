import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdSecurity, MdMarkEmailRead, MdEmail } from 'react-icons/md';
import { AuthShell, PasswordInput } from './AuthComponents';
import { setRegistrationData, setFlowType, clearAuthData, selectAuth } from '../../store/slices/authSlice';
import { startLoading, stopLoading } from '../../store/slices/loaderSlice';
import useAlert from '../../hooks/useAlert';
import { supabase, supabaseAnonKey } from '../../../supabase/supabaseClient';
import { useFormik } from 'formik';
import * as Yup from 'yup';

/**
 * Verify OTP Page: Featuring individual glass boxes for each digit.
 */
export const VerifyOtp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();
    const { registrationData, flowType } = useSelector(selectAuth);
    
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [mockOtp, setMockOtp] = useState(null);
    const [isSending, setIsSending] = useState(true);
    const inputs = useRef([]);

    // Mock Email Sending Effect
    useEffect(() => {
        // Only redirect on mount if no registration data is found
        if (!registrationData || !flowType) {
            navigate('/register');
            return;
        }

        const delay = Math.floor(Math.random() * (2000 - 500 + 1)) + 500;
        const timer = setTimeout(() => {
            const generated = Math.floor(100000 + Math.random() * 900000).toString();
            setMockOtp(generated);
            setIsSending(false);
        }, delay);

        return () => clearTimeout(timer);
    }, []); // Run only on mount to prevent redirects during state cleanup

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        const newOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
        setOtp(newOtp);

        // Focus next
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const enteredCode = otp.join("");
        
        if (enteredCode !== mockOtp) {
            alert.error("Invalid verification code. Please check the mock code provided.");
            return;
        }

        if (flowType === 'recovery') {
            // Recovery flow branches immediately to password reset
            navigate('/reset-password');
            return;
        }

        dispatch(startLoading('Finalizing account creation...'));
        try {
            const response = await fetch('https://tiwuhxljzjknkvplrxrg.supabase.co/functions/v1/create-only-user', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseAnonKey}`
                },
                body: JSON.stringify({
                    email: registrationData.email,
                    password: registrationData.password
                })
            });

            if (!response.ok) throw new Error('Account creation failed');

            alert.success("Sentinel Shield Active: Account Created Successfully!");
            dispatch(clearAuthData());
            navigate('/login');
        } catch (err) {
            console.error("Edge Func Error:", err);
            alert.error("The Edge Gatekeeper rejected the request.");
        } finally {
            dispatch(stopLoading());
        }
    };

    return (
        <AuthShell title="Verify Identity" subtitle={isSending ? "Initiating secure handshake..." : "Verification bridge established"}>
            <AnimatePresence mode="wait">
                {isSending ? (
                    <motion.div 
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-5"
                    >
                        <div className="spinner-border text-primary mb-3" role="status"></div>
                        <p className="text-secondary small mono uppercase tracking-widest">Encrypting OTP Tunnel...</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Mock OTP Display */}
                        <div className="alert glass-panel border-primary border-opacity-25 mb-4 text-center py-3">
                            <div className="small text-secondary uppercase tracking-widest mb-1">Mock Email Received</div>
                            <div className="h4 fw-bold text-primary mb-0 mono">{mockOtp}</div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="d-flex justify-content-between gap-1 gap-md-2 mb-5">
                                {otp.map((data, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        ref={(el) => (inputs.current[index] = el)}
                                        className="form-control form-control-lg glass-panel border-0 text-center fw-bold fs-3 p-0"
                                        style={{ width: '100%', maxWidth: '54px', height: '64px', color: 'var(--bs-primary)' }}
                                        value={data}
                                        onChange={(e) => handleChange(e.target, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow-lg py-3 hover-up">
                                {flowType === 'recovery' ? 'Verify & Reset Password' : 'Verify & Create Account'}
                            </button>

                            <div className="text-center mt-4 pt-2 border-top border-white border-opacity-10">
                                <p className="small text-secondary fw-medium mb-0">
                                    Didn't receive the code? <button type="button" className="btn btn-link text-primary fw-bold p-0 text-decoration-none small">Resend OTP</button>
                                </p>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthShell>
    );
};

/**
 * Forgot Password Page
 */
export const ForgotPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();

    const formik = useFormik({
        initialValues: { email: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
        }),
        onSubmit: async (values) => {
            dispatch(startLoading('Verifying account status...'));
            try {
                const { data: emailExists, error: rpcError } = await supabase.rpc('email_exists', { 
                    email_input: values.email 
                });

                if (rpcError) throw rpcError;

                if (!emailExists) {
                    alert.error("No account is tied to that email address. Please check and try again.");
                    return;
                }

                // If account found, proceed to OTP bridge
                dispatch(setRegistrationData({ email: values.email }));
                dispatch(setFlowType('recovery'));
                navigate('/verify-otp');
            } catch (err) {
                console.error("RPC Error:", err);
                alert.error("Communication error with the server.");
            } finally {
                dispatch(stopLoading());
            }
        },
    });

    return (
        <AuthShell title="Recover Access" subtitle="Enter your email to receive recovery instructions">
            <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                    <label className="form-label small fw-bold text-secondary uppercase tracking-wider">Email Address</label>
                    <div className="position-relative">
                        <input
                            type="email"
                            placeholder="name@example.com"
                            className={`form-control form-control-lg rounded-pill border-0 bg-white-subtle shadow-sm px-4 fw-medium ${
                                formik.touched.email && formik.errors.email ? 'is-invalid' : ''
                            }`}
                            {...formik.getFieldProps('email')}
                        />
                        <MdEmail className="position-absolute top-50 end-0 translate-middle-y me-4 text-secondary opacity-50" size={20} />
                    </div>
                    {formik.touched.email && formik.errors.email && (
                        <div className="invalid-feedback d-block ps-4 mt-1 small fw-bold">{formik.errors.email}</div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow-lg py-3 hover-up">
                    Verify Email
                </button>

                <div className="text-center mt-4">
                    <button 
                        type="button" 
                        onClick={() => navigate('/login')}
                        className="btn btn-link text-secondary fw-bold text-decoration-none small p-0 fw-bold"
                    >
                        Back to Login
                    </button>
                </div>
            </form>
        </AuthShell>
    );
};

/**
 * Reset Password Page
 */
export const ResetPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();
    const { registrationData } = useSelector(selectAuth);

    const formik = useFormik({
        initialValues: { password: '', confirmPassword: '' },
        validationSchema: Yup.object({
            password: Yup.string().min(8, 'Must be at least 8 characters').required('Required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Required'),
        }),
        onSubmit: async (values) => {
            if (!registrationData?.email) {
                alert.error("Security session expired. Please restart the recovery flow.");
                navigate('/forgot-password');
                return;
            }

            dispatch(startLoading('Finalizing security reset...'));
            try {
                const response = await fetch('https://tiwuhxljzjknkvplrxrg.supabase.co/functions/v1/reset-password', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${supabaseAnonKey}`
                    },
                    body: JSON.stringify({
                        email: registrationData.email,
                        new_password: values.password
                    })
                });

                if (!response.ok) throw new Error('Reset failed');

                alert.success("Sentinel Shield Updated: Password Reset Successfully!");
                dispatch(clearAuthData());
                navigate('/login');
            } catch (err) {
                console.error("Edge Reset Error:", err);
                alert.error("The security reset was rejected. Please try again.");
            } finally {
                dispatch(stopLoading());
            }
        },
    });

    return (
        <AuthShell title="New Credentials" subtitle="Ensure your new password is secure and unique">
            <form onSubmit={formik.handleSubmit}>
                <PasswordInput
                    label="New Password"
                    placeholder="Enter new password"
                    name="password"
                    {...formik.getFieldProps('password')}
                    error={formik.errors.password}
                    touched={formik.touched.password}
                />
                <PasswordInput
                    label="Confirm New Password"
                    placeholder="Repeat new password"
                    name="confirmPassword"
                    {...formik.getFieldProps('confirmPassword')}
                    error={formik.errors.confirmPassword}
                    touched={formik.touched.confirmPassword}
                />

                <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow-lg py-3 mt-3 hover-up">
                    Update Password
                </button>
            </form>
        </AuthShell>
    );
};
