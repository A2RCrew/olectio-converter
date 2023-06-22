import { type PDFDocumentProxy } from 'pdfjs-dist';

const getDocumentPagesInfo = async (document: PDFDocumentProxy) => {
  const labels = await document.getPageLabels();
  const destinations = await document.getDestinations();
  return {
    numPages: document.numPages,
    labels,
    destinations,
  };
};

export default getDocumentPagesInfo;