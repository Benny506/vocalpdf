import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MdFileUpload, MdAutoFixHigh, MdPlayCircleOutline } from 'react-icons/md';

const steps = [
    {
        icon: <MdFileUpload size={40} className="text-white" />,
        title: "Upload Document",
        text: "Simply drag and drop your PDF file into our secure, local reader. No accounts or complex setups required."
    },
    {
        icon: <MdAutoFixHigh size={40} className="text-white" />,
        title: "AI Analysis",
        text: "Our processing engine instantly scans your document, extracting text and optimizing it for high-quality speech."
    },
    {
        icon: <MdPlayCircleOutline size={40} className="text-white" />,
        title: "Start Listening",
        text: "Control playback, adjust reading speed, and switch between natural voices to suit your listening style."
    }
];

const HowItWorks = () => {
    const navigate = useNavigate();
    return (
        <div className="container py-lg-5">
            <div className="text-center mb-5 pb-lg-5">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="display-5 fw-bold tracking-tight mb-4"
                >
                    Seamlessly transition from <span className="text-primary italic">Reading</span> to <span className="text-primary">Listening</span>
                </motion.h2>
                <div className="mx-auto bg-primary rounded-pill" style={{ width: '60px', height: '4px' }}></div>
            </div>

            <div className="row g-5 align-items-stretch">
                {steps.map((step, i) => (
                    <div key={i} className="col-lg-4">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.2 }}
                            className="h-100 position-relative ps-lg-5"
                        >
                            {/* Step Number Backdrop */}
                            <span className="position-absolute start-0 top-0 display-1 fw-bold text-light opacity-50" style={{ zIndex: -1, transform: 'translateY(-20px)' }}>
                                {i + 1}
                            </span>

                            <div className="d-flex flex-column align-items-start">
                                <div className="mb-4 d-flex align-items-center justify-content-center bg-primary rounded-circle shadow-lg" style={{ width: '70px', height: '70px' }}>
                                    {step.icon}
                                </div>
                                <h3 className="fw-bold mb-3">{step.title}</h3>
                                <p className="text-secondary fw-medium lead fs-base">
                                    {step.text}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>

            {/* Call to Action after steps */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-5 pt-lg-5 text-center"
            >
                <div className="p-5 bg-primary rounded-5 text-white shadow-2xl position-relative overflow-hidden">
                    <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" style={{ background: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
                    <h2 className="display-6 fw-bold mb-4 position-relative z-1">Ready to start listening?</h2>
                    <p className="lead mb-4 position-relative z-1 opacity-75">Join thousands of users transforming their daily reading into audio experiences.</p>
                    <button
                        className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold text-primary shadow-sm hover-up position-relative z-1"
                        onClick={() => navigate('/reader')}
                    >
                        Go to Reader Dashboard
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default HowItWorks;
