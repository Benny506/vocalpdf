import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdMenuBook, MdNavigateNext, MdPlayArrow, MdVisibility, MdPerson, MdSearch } from 'react-icons/md';
import { supabase } from '../../../supabase/supabaseClient';
import { startLoading, stopLoading } from '../../store/slices/loaderSlice';
import { extractPDFText } from '../../utils/pdfExtractor';
import { setDocument, setSentences, setCurrentSentenceIndex } from '../../store/slices/readerSlice';
import useAlert from '../../hooks/useAlert';

export const AdminFiles = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();
    const [documents, setDocuments] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAllDocuments = async () => {
        try {
            const { data, error } = await supabase
                .from('vp_documents')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDocuments(data || []);
        } catch (err) {
            console.error("Citadel Universal Directory Error:", err);
            alert.error("The Citadel Gatekeeper could not retrieve the universal directory.");
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchAllDocuments();
    }, []);

    const handleAdminPreview = async (doc) => {
        dispatch(startLoading(`Establishing Viewer Mirror: ${doc.name}...`));
        try {
            const { data, error } = await supabase.storage
                .from('vp_storage')
                .download(doc.file_path);

            if (error) throw error;

            const { metadata, sentences } = await extractPDFText(data);
            
            // Mirror into reader but without doc ID tracking (Viewer Only)
            dispatch(setDocument({
                id: null, // Admin viewer doesn't sync progress back
                name: `[VIEWER] ${doc.name}`,
                size: doc.size,
                totalPages: metadata.pageCount,
                totalSentences: doc.total_sentences || sentences.length
            }));
            
            dispatch(setSentences(sentences));
            dispatch(setCurrentSentenceIndex(0));
            
            navigate('/reader');
            alert.success(`Universal Preview Established: ${doc.name}`);
        } catch (err) {
            console.error("Preview Error:", err);
            alert.error("Could not establish universal mirror handshake.");
        } finally {
            dispatch(stopLoading());
        }
    };

    const filteredDocs = documents.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-files animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="display-6 fw-bold text-dark mb-1 tracking-tighter">Universal <span className="text-primary">Directory</span></h2>
                    <p className="text-secondary fw-medium mb-0">Cross-Experiment Laboratory Oversight</p>
                </div>
                <div className="position-relative" style={{ minWidth: '300px' }}>
                    <MdSearch className="position-absolute ms-3 top-50 translate-middle-y text-secondary" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search all experiments..."
                        className="form-control rounded-pill ps-5 border-0 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {isFetching ? (
                    <motion.div 
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-5 glass-panel rounded-5 shadow-sm"
                    >
                        <div className="spinner-border text-primary mb-3" role="status"></div>
                        <p className="text-secondary small mono uppercase tracking-widest fw-bold">Querying Laboratory Grid...</p>
                    </motion.div>
                ) : filteredDocs.length === 0 ? (
                    <div className="text-center py-5 glass-panel rounded-5">
                        <MdMenuBook size={64} className="text-secondary opacity-10 mb-3" />
                        <h4 className="fw-bold text-dark opacity-50">Universal Directory Empty</h4>
                        <p className="small text-secondary fw-medium">No laboratory experiments found across standard student accounts.</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {filteredDocs.map((doc) => {
                            const progress = doc.total_sentences > 0 
                                ? Math.round((doc.current_sentence_index / doc.total_sentences) * 100)
                                : 0;
                            
                            return (
                                <motion.div 
                                    key={doc.id}
                                    className="col-12 col-xl-6"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <div className="glass-panel p-4 rounded-5 shadow-sm d-flex align-items-center gap-4 border border-white border-opacity-20 transition-all hover-shadow">
                                        <div className="bg-dark text-primary p-3 rounded-4 d-none d-sm-block bg-opacity-10">
                                            <MdVisibility size={32} />
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h5 className="fw-bold text-dark mb-1 text-truncate">{doc.name}</h5>
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                                <span className="smaller text-secondary fw-medium d-flex align-items-center gap-1">
                                                    <MdPerson size={14} /> ID: ...{doc.user_id.slice(-8)}
                                                </span>
                                                <span className="smaller text-secondary fw-medium">
                                                    {Math.round(doc.size / 1024)} KB
                                                </span>
                                                <span className="smaller text-secondary fw-medium text-primary fw-bold">
                                                    {progress}% Mastery
                                                </span>
                                            </div>
                                            <div className="progress rounded-pill bg-light" style={{ height: '4px' }}>
                                                <div className="progress-bar bg-primary rounded-pill" style={{ width: `${progress}%` }}></div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleAdminPreview(doc)}
                                            className="btn btn-dark rounded-circle p-3 shadow-lg border-0 hover-up"
                                            title="Universal Preview"
                                        >
                                            <MdPlayArrow size={24} className="text-primary" />
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

export default AdminFiles;
