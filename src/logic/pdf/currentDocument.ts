import type * as PDFJS from 'pdfjs-dist';

let currentDocument: PDFJS.PDFDocumentProxy | undefined;

let currentDocumentHash: string | undefined;

let currentFile: File | undefined;

export const setCurrentPDFDocument = (documentToSet: PDFJS.PDFDocumentProxy | undefined) => {
  currentDocument = documentToSet;
};

export const getCurrentPDFDocument = (): PDFJS.PDFDocumentProxy | undefined => {
  return currentDocument;
};

export const setCurrentPDFFile = (file: File | undefined) => {
  currentFile = file;
};

export const getCurrentPDFFile = (): File | undefined => {
  return currentFile;
};

export const setCurrentPDFDocumentHash = (hash: string | undefined) => {
  currentDocumentHash = hash;
};

export const getCurrentPDFDocumentHash = (): string | undefined => {
  return currentDocumentHash;
};
