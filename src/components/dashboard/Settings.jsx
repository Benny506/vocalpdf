import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MdPerson, MdInfoOutline, MdVpnKey, MdOutlineLightbulb, MdHistory } from 'react-icons/md';
import { selectAuth } from '../../store/slices/authSlice';

const TipItem = ({ icon, title, desc }) => (
    <div className="d-flex align-items-start gap-3 mb-4">
        <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary mt-1">
            {icon}
        </div>
        <div>
            <h6 className="fw-bold text-dark mb-1">{title}</h6>
            <p className="small text-secondary mb-0 fw-medium">{desc}</p>
        </div>
    </div>
);

export const Settings = () => {
    const { user } = useSelector(selectAuth);

    return (
        <div className="settings-module animate-fade-in">
            <h2 className="display-6 fw-bold text-dark mb-5 tracking-tighter">Laboratory <span className="text-primary">Settings</span></h2>

            <div className="row g-5">
                {/* Profile Pillar */}
                <div className="col-12 col-lg-5">
                    <div className="glass-panel p-5 rounded-5 shadow-sm mb-4">
                        <div className="text-center mb-5">
                            <div className="bg-primary d-inline-flex p-4 rounded-circle shadow-lg text-white mb-4">
                                <MdPerson size={64} />
                            </div>
                            <h4 className="fw-bold text-dark mb-1">Laboratory Profile</h4>
                            <p className="text-secondary small fw-medium uppercase tracking-widest">Authorized Identity</p>
                        </div>

                        <div className="mb-4">
                            <label className="small fw-bold text-secondary uppercase tracking-widest mb-2 d-block">Authorized Email</label>
                            <div className="form-control form-control-lg rounded-pill border-0 bg-white-subtle shadow-sm px-4 fw-medium text-dark text-opacity-50">
                                {user?.email}
                            </div>
                        </div>

                        <div className="alert glass-panel border-info border-opacity-25 p-3 rounded-4 d-flex align-items-start gap-3 mb-0 shadow-sm">
                            <MdVpnKey className="text-info mt-1" size={20} />
                            <div>
                                <h6 className="fw-bold text-info small mb-1">Immutable Identity</h6>
                                <p className="smaller text-secondary mb-0 fw-medium">
                                    For security integrity within the VocalPDF Laboratory, registered emails are currently immutable. Contact the system administrator for account transitions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Laboratory Tips Pillar */}
                <div className="col-12 col-lg-7">
                    <div className="glass-panel p-5 rounded-5 shadow-sm h-100">
                        <h4 className="fw-bold text-dark mb-5 d-flex align-items-center gap-3">
                            <MdOutlineLightbulb className="text-primary" /> Laboratory Mastery Tips
                        </h4>

                        <TipItem 
                            icon={<MdHistory />} 
                            title="Reading Persistence"
                            desc="Any document under 50MB is automatically archived to your Library, allowing you to resume your laboratory sessions from any device."
                        />

                        <TipItem 
                            icon={<MdOutlineLightbulb />} 
                            title="Global Voice Control"
                            desc="Use the floating HUD controls to adjust playback speed and sentence navigation while engaged in deep reading."
                        />

                        <TipItem 
                            icon={<MdInfoOutline />} 
                            title="Metadata Synchronization"
                            desc="The laboratory intelligently tracks your document metadata during upload to ensure high-fidelity text extraction."
                        />

                        <div className="mt-5 p-4 border-dashed border-2 rounded-5 text-center bg-light bg-opacity-25">
                            <p className="text-secondary small fw-medium mb-0">
                                Version 1.2.0 | High-Fidelity Laboratory Edition
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
