import { type PDFDocumentProxy } from 'pdfjs-dist';

const getPage = async (document: PDFDocumentProxy, pageNumber: number) => {
  const page = await document.getPage(pageNumber);  
  return page;
};

export default getPage;