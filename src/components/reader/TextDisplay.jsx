import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { selectReader, setCurrentSentenceIndex } from '../../store/slices/readerSlice';

const TextDisplay = () => {
    const dispatch = useDispatch();
    const { sentences, currentSentenceIndex, document: doc } = useSelector(selectReader);
    const activeRef = useRef(null);

    useEffect(() => {
        if (activeRef.current) {
            activeRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [currentSentenceIndex]);

    if (!sentences || sentences.length === 0) return null;

    return (
        <div className="container py-5" style={{ marginBottom: '160px' }}>
            <div className="row justify-content-center">
                <div className="col-lg-10 col-xl-9">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel paper-vibe p-4 p-md-5 rounded-5 shadow-2xl position-relative mb-5"
                        style={{ minHeight: '600px' }}
                    >
                        <div className="text-center border-bottom border-secondary-subtle pb-4 mb-5">
                            <h1 className="display-6 fw-bold tracking-tighter text-primary mb-1">{doc.name}</h1>
                            <div className="d-flex justify-content-center gap-3 align-items-center">
                                <span className="badge bg-primary-bg-subtle text-primary rounded-pill px-3">{doc.totalPages} Pages</span>
                                <span className="text-muted small uppercase tracking-widest mono">{sentences.length} Chunks</span>
                            </div>
                        </div>

                        <div className="content-area position-relative" style={{ lineHeight: '1.8', fontSize: '1.15rem' }}>
                            {sentences.map((sentence, index) => {
                                const isActive = index === currentSentenceIndex;
                                return (
                                    <span
                                        key={index}
                                        ref={isActive ? activeRef : null}
                                        onClick={() => dispatch(setCurrentSentenceIndex(index))}
                                        className={`sentence-item transition-all d-inline px-1 rounded-2 ${isActive
                                                ? 'bg-primary text-white shadow-lg fw-medium scale-105'
                                                : 'text-secondary opacity-75 hover-opacity-100'
                                            }`}
                                        style={{ 
                                            cursor: 'pointer', 
                                            display: 'inline',
                                            marginRight: '0.25rem'
                                        }}
                                    >
                                        {sentence}{' '}
                                    </span>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default TextDisplay;
