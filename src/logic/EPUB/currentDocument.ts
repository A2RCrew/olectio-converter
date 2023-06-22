import { type Book } from 'epubjs';

let currentDocument: Book | undefined;

let currentDocumentHash: string | undefined;

let currentFile: File | undefined;

export const setCurrentEPUBDocument = (documentToSet: Book | undefined) => {
  currentDocument = documentToSet;
};

export const getCurrentEPUBDocument = (): Book | undefined => {
  return currentDocument;
};

export const setCurrentEPUBFile = (file: File | undefined) => {
  currentFile = file;
};

export const getCurrentEPUBFile = (): File | undefined => {
  return currentFile;
};

export const setCurrentEPUBDocumentHash = (hash: string | undefined) => {
  currentDocumentHash = hash;
};

export const getCurrentEPUBDocumentHash = (): string | undefined=> {
  return currentDocumentHash;
};
