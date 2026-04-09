import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AuthShell, PasswordInput } from './AuthComponents';
import { MdEmail } from 'react-icons/md';
import { setRegistrationData, setFlowType, setAuth } from '../../store/slices/authSlice';
import { startLoading, stopLoading } from '../../store/slices/loaderSlice';
import { supabase } from '../../../supabase/supabaseClient';
import useAlert from '../../hooks/useAlert';

/**
 * Register Page
 */
export const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();

    const formik = useFormik({
        initialValues: { email: '', password: '', confirmPassword: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().min(8, 'Must be at least 8 characters').required('Required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Required'),
        }),
        onSubmit: async (values) => {
            dispatch(startLoading('Checking credentials...'));
            try {
                // Call Supabase RPC to check if email exists
                const { data: emailExists, error: rpcError } = await supabase.rpc('email_exists', { 
                    email_input: values.email 
                });

                if (rpcError) throw rpcError;

                if (emailExists) {
                    alert.error("Can't use an existing email. Please try a different one or login.");
                    return;
                }

                // If email is unique, proceed to OTP verification
                dispatch(setRegistrationData({ email: values.email, password: values.password }));
                dispatch(setFlowType('register'));
                navigate('/verify-otp');
            } catch (err) {
                console.error("RPC Error:", err);
                alert.error("Communication error with the security layer. Please try again.");
            } finally {
                dispatch(stopLoading());
            }
        },
    });

    return (
        <AuthShell title="Create Account" subtitle="Join the high-fidelity listening lab">
            <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary uppercase tracking-wider">Email Address</label>
                    <div className="position-relative">
                        <input
                            type="email"
                            name="email"
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

                <PasswordInput
                    label="Password"
                    name="password"
                    placeholder="Create a strong password"
                    {...formik.getFieldProps('password')}
                    error={formik.errors.password}
                    touched={formik.touched.password}
                />

                <PasswordInput
                    label="Confirm Password"
                    name="confirmPassword"
                    placeholder="Repeat your password"
                    {...formik.getFieldProps('confirmPassword')}
                    error={formik.errors.confirmPassword}
                    touched={formik.touched.confirmPassword}
                />

                <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow-lg py-3 mt-3 hover-up">
                    Sign Up
                </button>

                <div className="text-center mt-4 pt-2 border-top border-white border-opacity-10">
                    <p className="small text-secondary fw-medium">
                        Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Log In</Link>
                    </p>
                </div>
            </form>
        </AuthShell>
    );
};

/**
 * Login Page
 */
export const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email').required('Required'),
            password: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            dispatch(startLoading('Establishing secure session...'));
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: values.email,
                    password: values.password
                });

                if (error) throw error;

                dispatch(setAuth({ user: data.user, session: data.session }));
                alert.success("Welcome Back: Session established successfully.");
                navigate('/dashboard');
            } catch (err) {
                console.error("Login Error:", err);
                alert.error(err.message || "Failed to establish session. Please check your credentials.");
            } finally {
                dispatch(stopLoading());
            }
        },
    });

    return (
        <AuthShell title="Welcome Back" subtitle="Retrieve your digital library">
            <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary uppercase tracking-wider">Email Address</label>
                    <div className="position-relative">
                        <input
                            type="email"
                            name="email"
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

                <PasswordInput
                    label="Password"
                    name="password"
                    placeholder="Enter your security phrase"
                    {...formik.getFieldProps('password')}
                    error={formik.errors.password}
                    touched={formik.touched.password}
                />

                <div className="text-end mb-4">
                    <Link to="/forgot-password" size="sm" className="small text-secondary text-decoration-none fw-bold hover-text-primary">
                        Forgot Password?
                    </Link>
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow-lg py-3 hover-up">
                    Log In
                </button>

                <div className="text-center mt-4 pt-2 border-top border-white border-opacity-10">
                    <p className="small text-secondary fw-medium">
                        New to VocalPDF? <Link to="/register" className="text-primary fw-bold text-decoration-none">Create Account</Link>
                    </p>
                </div>
            </form>
        </AuthShell>
    );
};
