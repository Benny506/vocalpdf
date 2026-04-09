import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Outlet } from 'react-router-dom';

/**
 * DashboardLayout: The master shell for all laboratory-grade interfaces.
 */
export const DashboardLayout = () => {
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    return (
        <div className="dashboard-wrapper vibe-bg d-flex">
            {/* 1. Side Panel (Persistent Desktop / Offcanvas Mobile) */}
            <Sidebar 
                showMobile={showMobileSidebar} 
                onHide={() => setShowMobileSidebar(false)} 
            />

            {/* 2. Main Content Stack */}
            <div className="main-content-column">
                {/* 3. Non-Scrollable Topbar */}
                {/* Note: In a fully dynamic setup, titles would come from a context or route data */}
                <Topbar 
                    title="Laboratory" 
                    subtitle="Management Console" 
                    onToggleSidebar={() => setShowMobileSidebar(true)}
                />

                {/* 4. Scrollable Content Canvas */}
                <main className="content-viewport custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
