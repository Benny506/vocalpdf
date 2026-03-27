import React from 'react';
import { useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import AlertItem from './AlertItem';
import { selectAlerts } from '../../store/slices/alertSlice';

const AlertContainer = () => {
    const alerts = useSelector(selectAlerts);

    return (
        <div
            className="alert-container position-fixed top-0 end-0 p-3"
            style={{
                zIndex: 9999,
                pointerEvents: 'none', // Allow clicks to pass through the container
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
            }}
        >
            <AnimatePresence>
                {[...alerts].reverse().map((alert) => (
                    <AlertItem key={alert.id} alert={alert} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default AlertContainer;
