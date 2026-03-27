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
        <div className="container py-5" style={{ marginBottom: '140px' }}>
            <div className="row justify-content-center">
                <div className="col-lg-10 col-xl-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-5 text-center border-bottom pb-4"
                    >
                        <h1 className="fw-bold tracking-tight text-primary mb-1">{doc.name}</h1>
                        <p className="text-muted small uppercase tracking-widest">{doc.totalPages} Pages Detected</p>
                    </motion.div>

                    <div className="content-area position-relative">
                        {sentences.map((sentence, index) => {
                            const isActive = index === currentSentenceIndex;
                            return (
                                <span
                                    key={index}
                                    ref={isActive ? activeRef : null}
                                    onClick={() => dispatch(setCurrentSentenceIndex(index))}
                                    style={{ cursor: 'pointer' }}
                                    className={`sentence-item transition-all d-inline-block px-1 rounded ${isActive
                                            ? 'bg-primary text-white shadow-lg fw-medium'
                                            : 'text-secondary opacity-75'
                                        }`}
                                >
                                    {sentence}{' '}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextDisplay;
