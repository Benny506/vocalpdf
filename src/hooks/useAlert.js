import { useDispatch } from 'react-redux';
import { addAlert } from '../store/slices/alertSlice';

const useAlert = () => {
    const dispatch = useDispatch();

    const showAlert = (message, type = 'info', duration = 5000) => {
        dispatch(addAlert(message, type, duration));
    };

    return {
        success: (msg, dur) => showAlert(msg, 'success', dur),
        error: (msg, dur) => showAlert(msg, 'error', dur),
        warning: (msg, dur) => showAlert(msg, 'warning', dur),
        info: (msg, dur) => showAlert(msg, 'info', dur),
    };
};

export default useAlert;
