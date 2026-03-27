import React from 'react';
import { motion } from 'framer-motion';
import { MdAccessibility, MdSpeed, MdAudiotrack, MdCloudUpload } from 'react-icons/md';

const features = [
    {
        icon: <MdCloudUpload size={40} className="text-primary" />,
        title: "Instant Upload",
        description: "Standard PDF files processed in seconds with zero configuration required."
    },
    {
        icon: <MdAudiotrack size={40} className="text-primary" />,
        title: "Natural Voices",
        description: "Choose from a variety of human-like voices for a comfortable listening experience."
    },
    {
        icon: <MdSpeed size={40} className="text-primary" />,
        title: "Adjustable Speed",
        description: "Listen at your own pace with customizable playback speeds from 0.5x to 2x."
    },
    {
        icon: <MdAccessibility size={40} className="text-primary" />,
        title: "Accessibility First",
        description: "Designed to support users with visual impairments or reading difficulties."
    }
];

const Features = () => {
    return (
        <div className="container py-5">
            <div className="text-center mb-5 pb-lg-4">
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="badge bg-primary-bg-subtle text-primary px-3 py-2 rounded-pill fw-bold uppercase tracking-wider mb-3 fs-xs"
                >
                    Core Features
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="display-5 fw-bold tracking-tight"
                >
                    Everything you need to <span className="text-primary">Listen</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-muted mx-auto"
                    style={{ maxWidth: '600px' }}
                >
                    Powerful tools designed to simplify your reading experience and boost your productivity.
                </motion.p>
            </div>
            <div className="row g-4 pt-4">
                {features.map((f, i) => (
                    <div key={i} className="col-md-6 col-lg-3">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="card h-100 border-0 shadow-sm p-4 text-center rounded-4"
                        >
                            <div className="mb-4 d-inline-block p-3 bg-light rounded-4 mx-auto transition-all card-icon">
                                {f.icon}
                            </div>
                            <h4 className="fw-bold mb-3 fs-3">{f.title}</h4>
                            <p className="text-muted fs-sm mb-0">{f.description}</p>
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Features;
