import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectReader } from '../store/slices/readerSlice';
import { supabase } from '../../supabase/supabaseClient';

/**
 * useProgressSync: The debounced heartbeat of laboratory persistence.
 * Transmits the student's reading coordinate to Supabase for cloud archival.
 */
export const useProgressSync = () => {
    const { document, currentSentenceIndex, status } = useSelector(selectReader);
    const debounceTimer = useRef(null);

    useEffect(() => {
        // We only sync if we have a valid archived document ID
        if (!document.id || status === 'idle' || status === 'extracting') return;

        // Debounce Strategy: Wait 3 seconds of inactivity before pulsing to the cloud
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(async () => {
            try {
                const { error } = await supabase
                    .from('vp_documents')
                    .update({ 
                        current_sentence_index: currentSentenceIndex,
                        last_read_at: new Date().toISOString()
                    })
                    .eq('id', document.id);

                if (error) throw error;
                
                // Optional: We could dispatch a 'syncSuccess' action here for UI feedback
                console.log(`[Pulse] Progress archived for ${document.name}: Sentence ${currentSentenceIndex}`);
            } catch (err) {
                console.error("Progress Sync Pulse Failed:", err);
            }
        }, 3000);

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [currentSentenceIndex, document.id, status]);
};

export default useProgressSync;
