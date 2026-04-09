import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
    MdPlayArrow,
    MdPause,
    MdStop,
    MdSkipNext,
    MdSkipPrevious,
    MdSpeed,
    MdRecordVoiceOver
} from 'react-icons/md';
import { selectReader, updateSettings, setCurrentSentenceIndex } from '../../store/slices/readerSlice';
import useSpeech from '../../hooks/useSpeech';

const ReaderControls = () => {
    const dispatch = useDispatch();
    const { status, settings, sentences, currentSentenceIndex } = useSelector(selectReader);
    const { play, pause, stop, getVoices } = useSpeech();
    const [voices, setVoices] = useState([]);

    useEffect(() => {
        const handleVoices = () => {
            setVoices(getVoices());
        };
        handleVoices();
        window.speechSynthesis.onvoiceschanged = handleVoices;
    }, [getVoices]);

    if (!sentences || sentences.length === 0) return null;

    const navigateSentence = (direction) => {
        const newIndex = direction === 'next'
            ? Math.min(currentSentenceIndex + 1, sentences.length - 1)
            : Math.max(currentSentenceIndex - 1, 0);
        dispatch(setCurrentSentenceIndex(newIndex));
    };

    return (
        <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="reader-controls fixed-bottom mx-auto mb-4 glass-panel rounded-5 shadow-2xl p-3 py-lg-4" 
            style={{ zIndex: 1000, maxWidth: '900px', width: '95%' }}
        >
            <div className="container">
                <div className="row align-items-center g-3">
                    {/* Progress Indicator */}
                    <div className="col-12 mb-2 p-0">
                        <div className="progress rounded-0" style={{ height: '4px', backgroundColor: '#eef2ff' }}>
                            <motion.div
                                className="progress-bar bg-primary"
                                initial={false}
                                animate={{ width: `${((currentSentenceIndex + 1) / sentences.length) * 100}%` }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            />
                        </div>
                        <div className="d-flex justify-content-between mt-2 small text-muted fw-bold font-monospace">
                            <span>SENTENCE {currentSentenceIndex + 1} / {sentences.length}</span>
                            <span>{Math.round(((currentSentenceIndex + 1) / sentences.length) * 100)}%</span>
                        </div>
                    </div>

                    {/* Voice Selection */}
                    <div className="col-md-4 order-2 order-md-1">
                        <div className="d-flex align-items-center gap-2">
                            <MdRecordVoiceOver className="text-primary fs-4" />
                            <select
                                className="form-select form-select-sm border-0 bg-light rounded-pill px-3 shadow-none fw-bold"
                                value={settings.voiceURI || ''}
                                onChange={(e) => dispatch(updateSettings({ voiceURI: e.target.value }))}
                            >
                                <option value="">Default System Voice</option>
                                {voices.map(v => (
                                    <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Playback Controls */}
                    <div className="col-md-4 order-1 order-md-2 text-center">
                        <div className="d-flex justify-content-center align-items-center gap-2 gap-md-4">
                            <button
                                className="btn btn-outline-light text-dark rounded-circle shadow-sm border-0"
                                style={{ width: 44, height: 44 }}
                                onClick={() => navigateSentence('prev')}
                            >
                                <MdSkipPrevious size={24} />
                            </button>

                            {status === 'playing' ? (
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                                    style={{ width: 56, height: 56 }}
                                    onClick={pause}
                                >
                                    <MdPause size={32} />
                                </motion.button>
                            ) : (
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                                    style={{ width: 56, height: 56 }}
                                    onClick={play}
                                >
                                    <MdPlayArrow size={32} />
                                </motion.button>
                            )}

                            <button
                                className="btn btn-outline-light text-dark rounded-circle shadow-sm border-0"
                                style={{ width: 44, height: 44 }}
                                onClick={stop}
                            >
                                <MdStop size={24} />
                            </button>

                            <button
                                className="btn btn-outline-light text-dark rounded-circle shadow-sm border-0"
                                style={{ width: 44, height: 44 }}
                                onClick={() => navigateSentence('next')}
                            >
                                <MdSkipNext size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Speed Controls */}
                    <div className="col-md-4 order-3 text-end d-none d-md-block">
                        <div className="d-flex align-items-center justify-content-end gap-3">
                            <div className="d-flex align-items-center gap-2 bg-light px-3 py-1 rounded-pill">
                                <MdSpeed className="text-primary" />
                                <input
                                    type="range"
                                    className="form-range"
                                    min="0.5" max="2" step="0.1"
                                    value={settings.rate}
                                    onChange={(e) => dispatch(updateSettings({ rate: parseFloat(e.target.value) }))}
                                    style={{ width: '80px' }}
                                />
                                <span className="small font-monospace fw-bold" style={{ minWidth: '35px' }}>{settings.rate}x</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ReaderControls;
