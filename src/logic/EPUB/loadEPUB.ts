import { type Book } from 'epubjs';

import {
  setCurrentEPUBDocument,
  setCurrentEPUBDocumentHash,
  setCurrentEPUBFile,
} from './currentDocument';
import {
  setCurrentPDFDocument,
  setCurrentPDFDocumentHash,
  setCurrentPDFFile,
} from '../pdf/currentDocument';

import getEPUBDocumentProxyFromFile from './getEPUBDocumentProxyFromFile';

const loadEPUB = async (file: File): Promise<Book> => {
  setCurrentPDFDocument(undefined);
  setCurrentPDFDocumentHash(undefined);
  setCurrentPDFFile(undefined);
  const epubDocumentProxy = await getEPUBDocumentProxyFromFile(file);
  setCurrentEPUBDocument(epubDocumentProxy);
  setCurrentEPUBFile(file);
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  setCurrentEPUBDocumentHash(hashHex);
  return epubDocumentProxy;
};

export default loadEPUB;
