import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { MdFileUpload, MdPictureAsPdf } from 'react-icons/md';
import { extractPDFText } from '../../utils/pdfExtractor';
import { setDocument, setSentences, setError } from '../../store/slices/readerSlice';
import { startLoading, stopLoading } from '../../store/slices/loaderSlice';
import useAlert from '../../hooks/useAlert';

const UploadArea = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = async (file) => {
        if (file.type !== 'application/pdf') {
            alert.error('Please upload a valid PDF file.');
            return;
        }

        dispatch(startLoading('Extracting text from PDF...'));
        try {
            const { metadata, sentences } = await extractPDFText(file);
            dispatch(setDocument(metadata));
            dispatch(setSentences(sentences));
            alert.success(`Successfully loaded: ${file.name}`);
        } catch (err) {
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
                className={`upload-zone p-5 text-center border-2 border-dashed rounded-5 transition-all ${isDragging ? 'border-primary bg-primary-bg-subtle' : 'border-secondary-subtle bg-white'
                    }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                style={{ cursor: 'pointer', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
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
                    <h2 className="fw-bold tracking-tight">Upload your PDF</h2>
                    <p className="text-secondary mb-0">Drag and drop your file here, or click to browse</p>
                    <small className="text-muted mt-2 d-block">Maximum size: 25MB (Local processing)</small>
                </div>

                <div className="d-flex flex-wrap justify-content-center gap-2">
                    <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">Text Extraction</span>
                    <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">Sentence Highlighting</span>
                    <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">Voice Controls</span>
                </div>
            </motion.div>
        </div>
    );
};

export default UploadArea;
