import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    document: {
        id: null, // Database UUID for persistence
        name: '',
        size: 0,
        totalPages: 0,
        totalSentences: 0,
    },
    pagesSource: [], // Raw text per page
    sentences: [], // Cleaned chunks for speech
    currentSentenceIndex: 0,
    status: 'idle', // idle, extracting, ready, playing, paused, error
    error: null,
    settings: {
        rate: 1.0,
        pitch: 1.0,
        voiceURI: null,
    },
};

const readerSlice = createSlice({
    name: 'reader',
    initialState,
    reducers: {
        setDocument: (state, action) => {
            state.document = action.payload;
            state.status = 'extracting';
            state.pagesSource = [];
            state.sentences = [];
            state.currentSentenceIndex = 0;
        },
        setPagesSource: (state, action) => {
            state.pagesSource = action.payload;
        },
        setSentences: (state, action) => {
            state.sentences = action.payload;
            state.status = 'ready';
        },
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        setCurrentSentenceIndex: (state, action) => {
            state.currentSentenceIndex = action.payload;
        },
        updateSettings: (state, action) => {
            state.settings = { ...state.settings, ...action.payload };
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.status = 'error';
        },
        resetReader: (state) => {
            return initialState;
        },
    },
});

export const {
    setDocument,
    setPagesSource,
    setSentences,
    setStatus,
    setCurrentSentenceIndex,
    updateSettings,
    setError,
    resetReader,
} = readerSlice.actions;

export const selectReader = (state) => state.reader;
export const selectCurrentSentence = (state) =>
    state.reader.sentences[state.reader.currentSentenceIndex] || '';

export default readerSlice.reducer;
