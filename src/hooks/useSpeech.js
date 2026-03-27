import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectReader,
    setCurrentSentenceIndex,
    setStatus
} from '../store/slices/readerSlice';

/**
 * Hook to manage Web Speech API synthesis with Redux integration.
 */
const useSpeech = () => {
    const dispatch = useDispatch();
    const { sentences, currentSentenceIndex, status, settings } = useSelector(selectReader);
    const synth = window.speechSynthesis;
    const utteranceRef = useRef(null);

    /**
     * Returns the list of available system voices.
     */
    const getVoices = useCallback(() => {
        return synth.getVoices();
    }, [synth]);

    /**
     * Main speech function.
     */
    const speak = useCallback((index) => {
        if (!sentences || sentences.length === 0) return;

        // Cancel any ongoing speech
        synth.cancel();

        const text = sentences[index];
        if (!text) return;

        const utterance = new SpeechSynthesisUtterance(text);

        // Apply Settings from Redux
        utterance.rate = settings.rate || 1.0;
        utterance.pitch = settings.pitch || 1.0;

        if (settings.voiceURI) {
            const voices = getVoices();
            const voice = voices.find(v => v.voiceURI === settings.voiceURI);
            if (voice) utterance.voice = voice;
        }

        // Handlers
        utterance.onstart = () => {
            dispatch(setStatus('playing'));
        };

        utterance.onend = () => {
            if (index < sentences.length - 1) {
                dispatch(setCurrentSentenceIndex(index + 1));
            } else {
                dispatch(setStatus('ready'));
                dispatch(setCurrentSentenceIndex(0)); // Reset to start
            }
        };

        utterance.onerror = (event) => {
            // Ignore 'interrupted' as it's triggered by synth.cancel()
            if (event.error !== 'interrupted') {
                console.error("SpeechSynthesis Error:", event);
                dispatch(setStatus('ready'));
            }
        };

        utteranceRef.current = utterance;
        synth.speak(utterance);
    }, [sentences, settings, dispatch, synth, getVoices]);

    const play = useCallback(() => {
        if (status === 'paused') {
            synth.resume();
            dispatch(setStatus('playing'));
        } else {
            speak(currentSentenceIndex);
        }
    }, [status, currentSentenceIndex, speak, synth, dispatch]);

    const pause = useCallback(() => {
        synth.pause();
        dispatch(setStatus('paused'));
    }, [synth, dispatch]);

    const stop = useCallback(() => {
        synth.cancel();
        dispatch(setStatus('ready'));
        dispatch(setCurrentSentenceIndex(0));
    }, [synth, dispatch]);

    // Handle automatic transition to next sentence
    useEffect(() => {
        if (status === 'playing' && !synth.speaking) {
            speak(currentSentenceIndex);
        }
    }, [currentSentenceIndex, status, speak, synth.speaking]);

    return { play, pause, stop, getVoices, currentSentenceIndex };
};

export default useSpeech;
