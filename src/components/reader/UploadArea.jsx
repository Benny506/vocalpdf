import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MdFileUpload, MdPictureAsPdf, MdCloudDone, MdHistoryToggleOff } from 'react-icons/md';
import { extractPDFText } from '../../utils/pdfExtractor';
import { setDocument, setSentences, setError } from '../../store/slices/readerSlice';
import { startLoading, stopLoading } from '../../store/slices/loaderSlice';
import { selectAuth } from '../../store/slices/authSlice';
import { supabase } from '../../../supabase/supabaseClient';
import useAlert from '../../hooks/useAlert';

const UploadArea = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const { isAuthenticated, user } = useSelector(selectAuth);
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = async (file) => {
        if (file.type !== 'application/pdf') {
            alert.error('Please upload a valid PDF file.');
            return;
        }

        dispatch(startLoading('Analyzing PDF structure...'));
        try {
            // 1. Core Text Extraction (Local)
            const { metadata, sentences } = await extractPDFText(file);
            dispatch(setDocument(metadata));
            dispatch(setSentences(sentences));

            // 2. Cloud Persistence Logic (Conditional)
            if (isAuthenticated && user) {
                const fileSizeMB = file.size / (1024 * 1024);
                
                if (fileSizeMB < 50) {
                    dispatch(startLoading('Archiving to your secure laboratory...'));
                    const filePath = `${user.id}/${Date.now()}_${file.name}`;
                    
                    // Upload to vp_storage
                    const { error: storageError } = await supabase.storage
                        .from('vp_storage')
                        .upload(filePath, file);

                    if (storageError) throw storageError;

                    // Sync to vp_documents metadata
                    const { error: dbError } = await supabase
                    .from('vp_documents')
                    .insert({
                        user_id: user.id,
                        name: file.name,
                        file_path: filePath,
                        size: file.size,
                        total_sentences: sentences.length, // Primary tracking column
                        metadata: {
                            total_pages: metadata.pageCount,
                            sentences_count: sentences.length // Redundant for safety
                        }
                    });

                    if (dbError) throw dbError;
                    alert.success(`Document archived: ${file.name}`);
                } else {
                    alert.warning('File exceeds 50MB persistence limit. Local-only mode active.');
                }
            } else {
                alert.success(`Loaded locally: ${file.name}`);
            }
        } catch (err) {
            console.error("Persistence/Extraction Error:", err);
            dispatch(setError(err.message));
            alert.error('Failed to process PDF.');
        } finally {
            dispatch(stopLoading());
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    return (
        <div className="container py-5">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`upload-zone p-5 text-center border-2 border-dashed rounded-5 transition-all shadow-lg animate-float ${isDragging ? 'border-primary bg-primary-bg-subtle' : 'glass-panel'
                    }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                style={{ cursor: 'pointer', minHeight: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                onClick={() => document.getElementById('fileInput').click()}
            >
                <input
                    id="fileInput"
                    type="file"
                    accept=".pdf"
                    className="d-none"
                    onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
                />
                
                <div className="mb-4">
                    <div className="bg-primary text-white d-inline-flex p-4 rounded-circle shadow-lg mb-3">
                        <MdPictureAsPdf size={48} />
                    </div>
                    <h2 className="fw-bold tracking-tight">Vocal Laboratory</h2>
                    <p className="text-secondary mb-0">Drag and drop your document here, or click to browse</p>
                </div>

                {/* Sovereignty Indicator */}
                <div className="mb-4 d-flex justify-content-center">
                    {isAuthenticated ? (
                        <div className="alert glass-panel border-success border-opacity-25 py-2 px-4 rounded-pill d-flex align-items-center gap-2 shadow-sm">
                            <MdCloudDone className="text-success" size={20} />
                            <span className="small fw-bold text-success">Secure Cloud Saving Active: Documents under 50MB are saved to your library for future reading.</span>
                        </div>
                    ) : (
                        <div className="alert glass-panel border-warning border-opacity-25 py-2 px-4 rounded-pill d-flex align-items-center gap-2 shadow-sm">
                            <MdHistoryToggleOff className="text-warning" size={20} />
                            <span className="small fw-bold text-warning">Volatile Session: Document is local-only. Log in to save it to your cloud library permanently.</span>
                        </div>
                    )}
                </div>

                <div className="d-flex flex-wrap justify-content-center gap-2 opacity-75">
                    <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">Cloud Persistence</span>
                    <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">Text Extraction</span>
                    <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">Audio Playback</span>
                </div>
            </motion.div>
        </div>
    );
};

export default UploadArea;
