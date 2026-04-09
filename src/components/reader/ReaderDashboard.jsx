import React from 'react';
import { useSelector } from 'react-redux';
import { selectReader } from '../../store/slices/readerSlice';
import { selectAuth } from '../../store/slices/authSlice';
import UploadArea from './UploadArea';
import TextDisplay from './TextDisplay';
import ReaderControls from './ReaderControls';
import Navbar from '../landing/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCloudDone, MdHistoryToggleOff } from 'react-icons/md';
import { useProgressSync } from '../../hooks/useProgressSync';

const ReaderDashboard = () => {
    // Activate Laboratory Progress Sync
    useProgressSync();

    const { sentences } = useSelector(selectReader);
    const { isAuthenticated } = useSelector(selectAuth);
    const hasContent = sentences && sentences.length > 0;

    return (
        <div className="reader-dashboard min-vh-100 vibe-bg">
            <Navbar minimal={true} />

            <main className="py-4">
                <AnimatePresence mode="wait">
                    {!hasContent ? (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="container text-center mb-5">
                                <h1 className="display-4 fw-bold tracking-tight mb-3">Reader <span className="text-primary">Dashboard</span></h1>
                                <p className="lead text-secondary mx-auto" style={{ maxWidth: '600px' }}>
                                    Upload your PDF document below to begin your high-fidelity listening experience.
                                </p>
                            </div>
                            <UploadArea />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="display"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Persistence Indicator Badge */}
                            <div className="container mb-4 d-flex justify-content-center">
                                {isAuthenticated ? (
                                    <div className="glass-panel border-success border-opacity-25 py-2 px-4 rounded-pill d-flex align-items-center gap-2 shadow-sm animate-pulse-subtle">
                                        <MdCloudDone className="text-success" size={18} />
                                        <span className="smaller fw-bold text-success uppercase tracking-wider">Secure Cloud Saving Active: Documents &lt; 50MB are saved to your library.</span>
                                    </div>
                                ) : (
                                    <div className="glass-panel border-warning border-opacity-25 py-2 px-4 rounded-pill d-flex align-items-center gap-2 shadow-sm">
                                        <MdHistoryToggleOff className="text-warning" size={18} />
                                        <span className="smaller fw-bold text-warning uppercase tracking-wider">Volatile Session: Log in to save document permanently.</span>
                                    </div>
                                )}
                            </div>

                            <TextDisplay />
                            <ReaderControls />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default ReaderDashboard;
