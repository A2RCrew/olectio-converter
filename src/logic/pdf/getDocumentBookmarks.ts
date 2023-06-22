import { type PDFDocumentProxy } from 'pdfjs-dist';

const getDocumentBookmarks = async (document: PDFDocumentProxy) => {
  return await document.getOutline();  
};

export default getDocumentBookmarks;