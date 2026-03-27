import * as pdfjs from 'pdfjs-dist';

// Configure the worker for Vite (Version 5.x)
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Extracts text from a PDF file using pdfjs-dist.
 * @param {File} file - The PDF file object from an input element.
 * @returns {Promise<Object>} - Metadata and an array of sentences.
 */
export const extractPDFText = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + " ";
        }

        const sentences = chunkTextIntoSentences(fullText);

        return {
            metadata: {
                name: file.name,
                size: file.size,
                totalPages: pdf.numPages
            },
            sentences
        };
    } catch (error) {
        console.error("PDF Extraction Error:", error);
        throw new Error("Failed to extract text from PDF. Ensure the file is valid and not password-protected.");
    }
};

/**
 * Splits text into an array of sentences for the chunking engine.
 * @param {string} text - The raw text to split.
 * @returns {Array<string>} - Array of cleaned sentences.
 */
const chunkTextIntoSentences = (text) => {
    if (!text) return [];

    // Clean text: remove excessive whitespaces and newlines
    const cleanedText = text.replace(/\s+/g, ' ').trim();

    // Tokenize into sentences using regex
    // Looks for common sentence terminators followed by a space or end of string
    const sentences = cleanedText.match(/[^.!?]+[.!?]+(?=\s+|$)/g) || [cleanedText];

    return sentences
        .map(s => s.trim())
        .filter(s => s.length > 2); // Filter out extremely short artifacts
};
