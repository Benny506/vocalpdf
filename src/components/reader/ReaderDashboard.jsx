import React from 'react';
import { useSelector } from 'react-redux';
import { selectReader } from '../../store/slices/readerSlice';
import UploadArea from './UploadArea';
import TextDisplay from './TextDisplay';
import ReaderControls from './ReaderControls';
import Navbar from '../landing/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const ReaderDashboard = () => {
    const { sentences } = useSelector(selectReader);
    const hasContent = sentences && sentences.length > 0;

    return (
        <div className="reader-dashboard min-vh-100 bg-light">
            <Navbar />

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
