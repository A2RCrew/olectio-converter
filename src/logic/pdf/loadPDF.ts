import type * as PDFJS from 'pdfjs-dist';
import { setCurrentPDFDocument, setCurrentPDFDocumentHash, setCurrentPDFFile } from './currentDocument';
import getPdfDocumentProxyFromFile from './getPdfDocumentProxyFromFile';

import {
  setCurrentEPUBDocument,
  setCurrentEPUBDocumentHash,
  setCurrentEPUBFile,
} from '../EPUB/currentDocument';


const loadPDF = async (file: File): Promise<PDFJS.PDFDocumentProxy> => {  
  setCurrentEPUBDocument(undefined);
  setCurrentEPUBDocumentHash(undefined);
  setCurrentEPUBFile(undefined);
  const pdfDocumentProxy = await getPdfDocumentProxyFromFile(file);
  setCurrentPDFDocument(pdfDocumentProxy);
  setCurrentPDFFile(file);
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  setCurrentPDFDocumentHash(hashHex);
  return pdfDocumentProxy;
}

export default loadPDF;
