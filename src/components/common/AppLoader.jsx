import React from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { selectLoader } from '../../store/slices/loaderSlice';

const AppLoader = () => {
    const { isLoading, message } = useSelector(selectLoader);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                    style={{
                        zIndex: 9990, // Just below alerts (9999)
                        backgroundColor: 'rgba(255, 255, 255, 0.75)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        pointerEvents: 'auto', // 100% click blocking
                    }}
                >
                    {/* Modern Premium Spinner */}
                    <div className="position-relative d-flex align-items-center justify-content-center">
                        {/* Outer Ring */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                border: '3px solid transparent',
                                borderTop: '3px solid var(--bs-primary)',
                                borderRight: '3px solid var(--bs-primary)',
                                opacity: 0.4,
                            }}
                        />
                        {/* Inner Ring */}
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            className="position-absolute"
                            style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                border: '3px solid transparent',
                                borderBottom: '3px solid var(--bs-primary)',
                                borderLeft: '3px solid var(--bs-primary)',
                            }}
                        />
                        {/* Center Pulse */}
                        <motion.div
                            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.7, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="position-absolute"
                            style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--bs-primary)',
                            }}
                        />
                    </div>

                    {/* Loading Message */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mt-4 text-center"
                    >
                        <h5 className="fw-semibold tracking-tight text-primary mb-1">
                            {message}
                        </h5>
                        <motion.p
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="text-muted fs-sm uppercase tracking-wide"
                        >
                            Please wait a moment
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AppLoader;
