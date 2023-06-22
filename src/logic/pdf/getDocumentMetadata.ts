import { type PDFDocumentProxy } from 'pdfjs-dist';

const getDocumentMetadata = async (document: PDFDocumentProxy) => {
  const metadata = await document.getMetadata();
  return {
    ...metadata?.info,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    metadata: {
      ...metadata?.metadata?.getAll(),
    },
  };
};

export default getDocumentMetadata;