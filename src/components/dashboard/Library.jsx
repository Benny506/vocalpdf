import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdMenuBook, MdCloudDone, MdNavigateNext, MdFileUpload, MdPlayArrow, MdDeleteOutline } from 'react-icons/md';
import { supabase } from '../../../supabase/supabaseClient';
import { selectAuth } from '../../store/slices/authSlice';
import { startLoading, stopLoading } from '../../store/slices/loaderSlice';
import { extractPDFText } from '../../utils/pdfExtractor';
import { setDocument, setSentences, setCurrentSentenceIndex } from '../../store/slices/readerSlice';
import useAlert from '../../hooks/useAlert';

export const Library = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();
    const { user } = useSelector(selectAuth);
    const [documents, setDocuments] = useState([]);
    const [isFetching, setIsFetching] = useState(true);

    const fetchDocuments = async () => {
        if (!user) return;
        
        try {
            const { data, error } = await supabase
                .from('vp_documents')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDocuments(data || []);
        } catch (err) {
            console.error("Fetch Library Error:", err);
            alert.error("The Archive Gatekeeper could not retrieve your documents.");
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [user]);

    const handleContinueReading = async (doc) => {
        dispatch(startLoading(`Resuming session: ${doc.name}...`));
        try {
            // 1. Download file from storage
            const { data, error } = await supabase.storage
                .from('vp_storage')
                .download(doc.file_path);

            if (error) throw error;

            // 2. Re-extract
            const { metadata, sentences } = await extractPDFText(data);
            
            // 3. Sync Redux & Navigate
            dispatch(setDocument({
                id: doc.id,
                name: doc.name,
                size: doc.size,
                totalPages: metadata.pageCount,
                totalSentences: doc.total_sentences || sentences.length
            }));
            
            dispatch(setSentences(sentences));
            
            // 4. Seek to saved coordinate
            if (doc.current_sentence_index > 0) {
                dispatch(setCurrentSentenceIndex(doc.current_sentence_index));
            }
            
            navigate('/reader');
            alert.success(`Laboratory Session Resumed at sentence ${doc.current_sentence_index + 1}`);
        } catch (err) {
            console.error("Resume Error:", err);
            alert.error("Could not establish retrieval handshake.");
        } finally {
            dispatch(stopLoading());
        }
    };

    return (
        <div className="library-module animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="display-6 fw-bold text-dark mb-1 tracking-tighter">Laboratory <span className="text-primary">Library</span></h2>
                    <p className="text-secondary fw-medium mb-0">Manage your persistent archives</p>
                </div>
                <button 
                    onClick={() => navigate('/reader')}
                    className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-lg d-flex align-items-center gap-2 hover-up"
                >
                    <MdFileUpload size={20} /> Upload New
                </button>
            </div>

            <AnimatePresence mode="wait">
                {isFetching ? (
                    <motion.div 
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-5 glass-panel rounded-5"
                    >
                        <div className="spinner-border text-primary mb-3" role="status"></div>
                        <p className="text-secondary small mono uppercase tracking-widest">Querying Cloud Archive...</p>
                    </motion.div>
                ) : documents.length === 0 ? (
                    <motion.div 
                        key="empty"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-5 glass-panel rounded-5 d-flex flex-column align-items-center"
                    >
                        <div className="bg-light p-4 rounded-circle mb-4">
                            <MdMenuBook size={64} className="text-secondary opacity-25" />
                        </div>
                        <h4 className="fw-bold text-dark mb-2">No Archived Documents Found</h4>
                        <p className="text-secondary mb-4 small fw-medium" style={{ maxWidth: '320px' }}>
                            Your digital library is currently empty. Upload your first PDF to begin building your archive.
                        </p>
                    </motion.div>
                ) : (
                    <div className="row g-4">
                        {documents.map((doc) => {
                            const progress = doc.total_sentences > 0 
                                ? Math.round((doc.current_sentence_index / doc.total_sentences) * 100)
                                : 0;
                            
                            return (
                                <motion.div 
                                    key={doc.id}
                                    className="col-12 col-xl-6"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <div className="glass-panel p-4 rounded-5 shadow-sm d-flex align-items-center gap-4 transition-all hover-shadow overflow-hidden">
                                        <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-4 d-none d-sm-block">
                                            <MdMenuBook size={32} />
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h5 className="fw-bold text-dark mb-1 text-truncate">{doc.name}</h5>
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                                <span className="smaller text-secondary fw-medium d-flex align-items-center gap-1">
                                                    <MdCloudDone className="text-success" /> {progress}% Done
                                                </span>
                                                <span className="smaller text-secondary fw-medium">
                                                    {new Date(doc.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            
                                            {/* Mastery Progress Bar */}
                                            <div className="progress rounded-pill bg-light" style={{ height: '6px' }}>
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                    className="progress-bar bg-primary rounded-pill"
                                                />
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleContinueReading(doc)}
                                            className="btn btn-primary rounded-circle p-3 shadow-sm hover-up border-0 flex-shrink-0"
                                            title="Continue Reading"
                                        >
                                            <MdPlayArrow size={24} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Library;
