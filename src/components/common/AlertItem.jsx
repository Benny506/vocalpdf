import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    MdCheckCircle,
    MdError,
    MdWarning,
    MdInfo,
    MdClose
} from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { removeAlert } from '../../store/slices/alertSlice';

const icons = {
    success: <MdCheckCircle size={24} className="me-2 text-success" />,
    error: <MdError size={24} className="me-2 text-danger" />,
    warning: <MdWarning size={24} className="me-2 text-warning" />,
    info: <MdInfo size={24} className="me-2 text-info" />,
};

const AlertItem = ({ alert }) => {
    const dispatch = useDispatch();
    const { id, type, message, duration } = alert;

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(removeAlert(id));
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, dispatch]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8, transition: { duration: 0.2 } }}
            className={`alert alert-${type} d-flex align-items-center shadow-lg mb-2 p-3`}
            role="alert"
            style={{
                minWidth: '320px',
                maxWidth: '450px',
                border: 'none',
                borderLeft: `5px solid var(--bs-${type})`,
                backgroundColor: '#fff',
                color: '#1e293b',
                pointerEvents: 'auto', // Alerts themselves are clickable
            }}
        >
            <div className="d-flex align-items-center w-100">
                <div className="flex-shrink-0">
                    {icons[type] || icons.info}
                </div>
                <div className="flex-grow-1 mx-2 fw-medium">
                    {message}
                </div>
                <button
                    type="button"
                    className="btn-close ms-2"
                    onClick={() => dispatch(removeAlert(id))}
                    aria-label="Close"
                    style={{ width: '0.5em', height: '0.5em' }}
                ></button>
            </div>
        </motion.div>
    );
};

export default AlertItem;
