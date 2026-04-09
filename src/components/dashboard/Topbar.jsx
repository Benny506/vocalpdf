import React from 'react';
import { MdMenu, MdNotificationsNone, MdSearch } from 'react-icons/md';

export const Topbar = ({ title, subtitle, onToggleSidebar }) => {
    return (
        <header className="topbar-container justify-content-between">
            <div className="d-flex align-items-center gap-3">
                <button
                    className="btn btn-link link-dark p-0 d-lg-none"
                    onClick={onToggleSidebar}
                >
                    <MdMenu size={28} />
                </button>

                <div className="d-none d-md-block ms-lg-2">
                    <h1 className="h4 fw-bold text-dark mb-0 tracking-tighter">{title}</h1>
                    {subtitle && <p className="text-secondary smaller mb-0 fw-medium">{subtitle}</p>}
                </div>
            </div>

            {/* <div className="d-flex align-items-center gap-2 gap-md-3">
                <div className="position-relative d-none d-sm-block">
                    <input
                        type="text"
                        placeholder="Search Laboratory..."
                        className="form-control form-control-sm rounded-pill border-0 bg-white-subtle px-4 py-2 fw-medium shadow-sm"
                        style={{ width: '220px', fontSize: '0.85rem' }}
                    />
                    <MdSearch className="position-absolute top-50 end-0 translate-middle-y me-3 text-secondary" size={18} />
                </div>

                <div className="d-flex gap-2">
                    <button className="btn btn-white-subtle rounded-circle p-2 shadow-sm hover-up border-0">
                        <MdNotificationsNone size={20} className="text-secondary" />
                    </button>
                    <div className="vr d-none d-md-block mx-2 opacity-10"></div>
                </div>
            </div> */}

            {/* Mobile Title View */}
            <div className="d-md-none position-absolute start-50 translate-middle-x text-center w-50">
                <div className="fw-bold text-dark small text-truncate">{title}</div>
            </div>
        </header>
    );
};

export default Topbar;
