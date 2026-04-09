import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MdSecurity, MdHistory, MdVpnKey, MdOutlineLightbulb, MdInfoOutline, MdWarning } from 'react-icons/md';
import { selectAdmin } from '../../store/slices/adminSlice';

const ProtocolItem = ({ icon, title, desc, color = "primary" }) => (
    <div className="d-flex align-items-start gap-3 mb-4">
        <div className={`p-2 rounded-3 bg-${color} bg-opacity-10 text-${color} mt-1`}>
            {icon}
        </div>
        <div>
            <h6 className="fw-bold text-dark mb-1">{title}</h6>
            <p className="small text-secondary mb-0 fw-medium">{desc}</p>
        </div>
    </div>
);

export const AdminSettings = () => {
    const { adminProfile, lastRefresh } = useSelector(selectAdmin);

    return (
        <div className="admin-settings animate-fade-in">
            <h2 className="display-6 fw-bold text-dark mb-5 tracking-tighter">Citadel <span className="text-primary">Settings</span></h2>

            <div className="row g-5">
                {/* Authority Profile Pillar */}
                <div className="col-12 col-lg-5">
                    <div className="glass-panel p-5 rounded-5 shadow-sm mb-4 border border-white border-opacity-20 shadow-2xl">
                        <div className="text-center mb-5">
                            <div className="bg-dark d-inline-flex p-4 rounded-circle shadow-lg text-primary mb-4 border border-primary border-opacity-20">
                                <MdSecurity size={64} />
                            </div>
                            <h4 className="fw-bold text-dark mb-1">Citadel Administrator</h4>
                            <p className="text-secondary small fw-medium uppercase tracking-widest">Universal Authority Level</p>
                        </div>

                        <div className="mb-4">
                            <label className="small fw-bold text-secondary uppercase tracking-widest mb-2 d-block">Authorization Status</label>
                            <div className="form-control form-control-lg rounded-pill border-0 bg-white shadow-sm px-4 fw-bold text-success text-center">
                                ACTIVE Command Session
                            </div>
                        </div>

                        <div className="alert glass-panel border-warning border-opacity-25 p-3 rounded-4 d-flex align-items-start gap-3 mb-0 shadow-sm bg-warning bg-opacity-5">
                            <MdWarning className="text-warning mt-1" size={20} />
                            <div>
                                <h6 className="fw-bold text-warning small mb-1">Mutual Exclusion Active</h6>
                                <p className="smaller text-secondary mb-0 fw-medium">
                                    Administrative presence in the current environment has purged all active student sessions. Resume student activities only after Citadel logout.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Laboratory Protocols Pillar */}
                <div className="col-12 col-lg-7">
                    <div className="glass-panel p-5 rounded-5 shadow-sm h-100 border border-white border-opacity-20">
                        <h4 className="fw-bold text-dark mb-5 d-flex align-items-center gap-3">
                            <MdOutlineLightbulb className="text-primary" /> Citadel Sovereignty Protocols
                        </h4>

                        <ProtocolItem 
                            icon={<MdVpnKey />} 
                            title="Transient Auth-Keys"
                            desc="Command center credentials rotate every 10 minutes based on a synchronous laboratory pulse. Stale keys are immediately invalidated by the Citadel Gatekeeper."
                        />

                        <ProtocolItem 
                            icon={<MdHistory />} 
                            title="Viewer-Only Mirroring"
                            desc="The Universal Files Directory provides read-only access to all student archives. Administrative profiles are restricted from laboratory uploads to prevent experiment contamination."
                            color="success"
                        />

                        <ProtocolItem 
                            icon={<MdInfoOutline />} 
                            title="Holographic Identity"
                            desc="Citadel profiles are non-persistent and exist only as long as the local laboratory environment preserves the 'vocal_admin_session' token."
                            color="info"
                        />

                        <div className="mt-5 p-4 border-dashed border-2 rounded-5 text-center bg-light bg-opacity-25 border-dark border-opacity-10">
                            <p className="text-secondary small fw-medium mb-0">
                                Citadel Authorization Protocol v4.5.1 | High-Security Oversight Grid
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
