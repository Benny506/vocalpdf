import { Offcanvas, Nav } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { MdClose, MdDashboard, MdMenuBook, MdSettings, MdPerson, MdAudiotrack, MdLogout, MdHome } from 'react-icons/md';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuth } from '../../store/slices/authSlice';
import { logoutAdmin, selectAdmin } from '../../store/slices/adminSlice';
import { startLoading, stopLoading } from '../../store/slices/loaderSlice';
import { supabase } from '../../../supabase/supabaseClient';
import Logo from '../common/Logo';

const SidebarContent = ({ onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(selectAuth);
    const { isAdminAuthenticated, adminProfile } = useSelector(selectAdmin);

    const studentItems = [
        { icon: <MdHome />, label: 'Home', path: '/' },
        { icon: <MdDashboard />, label: 'Overview', path: '/dashboard' },
        { icon: <MdMenuBook />, label: 'Library', path: '/dashboard/library' },
        { icon: <MdAudiotrack />, label: 'Reader', path: '/reader' },
        { icon: <MdSettings />, label: 'Settings', path: '/dashboard/settings' },
    ];

    const adminItems = [
        { icon: <MdHome />, label: 'Home', path: '/' },
        { icon: <MdDashboard />, label: 'Overview', path: '/admin/dashboard' },
        { icon: <MdMenuBook />, label: 'Files Directory', path: '/admin/dashboard/files' },
        { icon: <MdSettings />, label: 'Citadel Settings', path: '/admin/dashboard/settings' },
    ];

    const navItems = isAdminAuthenticated ? adminItems : studentItems;

    const handleLogout = async () => {
        dispatch(startLoading("De-authorizing session..."));
        try {
            if (isAdminAuthenticated) {
                // Navigate first to avoid AdminGuard redirection loop
                navigate('/', { replace: true });
                dispatch(logoutAdmin());
            } else {
                const { error } = await supabase.auth.signOut();
                if (!error) {
                    navigate('/', { replace: true });
                    dispatch(logout());
                }
            }
        } finally {
            dispatch(stopLoading());
        }
    };

    return (
        <div className="h-100 d-flex flex-column custom-scrollbar" style={{ overflowY: 'auto' }}>
            <div className="p-4 d-flex align-items-center justify-content-between">
                <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <Logo />
                </div>
                {onClose && (
                    <button className="btn btn-link link-dark p-0 d-lg-none" onClick={onClose}>
                        <MdClose size={24} />
                    </button>
                )}
            </div>

            <div className="flex-grow-1 px-3">
                <nav className="nav flex-column gap-2">
                    {navItems.map((item, idx) => (
                        <NavLink 
                            key={idx}
                            to={item.path}
                            end={item.path.endsWith('dashboard')}
                            className={({ isActive }) => 
                                `nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-4 transition-all border-0 text-start ${
                                    isActive 
                                    ? isAdminAuthenticated ? 'bg-dark text-primary shadow-lg fw-bold' : 'bg-primary text-white shadow-lg fw-bold' 
                                    : 'text-secondary hover-bg-light hover-text-primary fw-medium'
                                }`
                            }
                            onClick={onClose}
                        >
                            <span className="fs-5">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                    
                    <button 
                        onClick={handleLogout}
                        className="nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-4 transition-all border-0 text-start text-danger hover-bg-danger-subtle fw-medium mt-2"
                    >
                        <span className="fs-5"><MdLogout /></span>
                        <span>Sign Out</span>
                    </button>
                </nav>
            </div>

            <div className="p-4 border-top border-white border-opacity-10 mt-auto">
                <div className={`glass-panel p-3 rounded-4 d-flex align-items-center gap-3 ${isAdminAuthenticated ? 'border-primary border-opacity-10' : ''}`}>
                    <div className={`${isAdminAuthenticated ? 'bg-dark text-primary' : 'bg-primary text-white'} rounded-circle d-flex align-items-center justify-content-center fw-bold`} style={{ width: '40px', height: '40px' }}>
                        {isAdminAuthenticated ? 'A' : user?.email?.charAt(0).toUpperCase() || 'P'}
                    </div>
                    <div className="overflow-hidden">
                        <div className="fw-bold small text-dark text-truncate">
                            {isAdminAuthenticated ? 'Citadel Admin' : user?.email || 'Premium User'}
                        </div>
                        <div className="text-secondary smaller">
                            {isAdminAuthenticated ? 'Universal Oversight' : 'Platinum Lab'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Sidebar = ({ showMobile, onHide }) => {
    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="sidebar-column glass-sidebar d-none d-lg-block">
                <SidebarContent />
            </aside>

            {/* Mobile Offcanvas */}
            <Offcanvas 
                show={showMobile} 
                onHide={onHide} 
                className="glass-panel border-0"
                style={{ width: '280px' }}
            >
                <Offcanvas.Body className="p-0">
                    <SidebarContent onClose={onHide} />
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default Sidebar;
