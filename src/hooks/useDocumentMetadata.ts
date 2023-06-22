import { useEffect, useState } from 'react';
import { getCurrentEPUBDocument } from '~/logic/EPUB/currentDocument';
import { getCurrentPDFDocument, getCurrentPDFDocumentHash } from '~/logic/pdf/currentDocument';
import getPDFDocumentMetadata from '~/logic/pdf/getDocumentMetadata';
import getEPUBDocumentMetadata from '~/logic/EPUB/getDocumentMetadata';

let memoMetadata: unknown;
let lastDocument: ReturnType<typeof getCurrentPDFDocument> | ReturnType<typeof getCurrentEPUBDocument>;

const useDocumentMetadata = () => {
  const pdfDocument = getCurrentPDFDocument();
  const epubDocument = getCurrentEPUBDocument();
  const document = pdfDocument || epubDocument;
  if (document !== lastDocument) {
    memoMetadata = undefined;
  }
  const [metadata, setMetadata] = useState<unknown>(memoMetadata);
  useEffect(() => {
    if (!memoMetadata && document) {
      lastDocument = document;
      if (pdfDocument) {
        getPDFDocumentMetadata(pdfDocument)
        .then((newMetaData) => {
          (newMetaData as unknown as { hash: string }).hash = getCurrentPDFDocumentHash() as string;
          memoMetadata = newMetaData;
          setMetadata(newMetaData);
        })
        .catch((err) => console.error(err));
      } else if (epubDocument) {
        const newMetadata = getEPUBDocumentMetadata(epubDocument);
        (newMetadata as unknown as { hash: string }).hash = getCurrentPDFDocumentHash() as string;
        setMetadata(newMetadata);
      }
    }
  }, [document, epubDocument, pdfDocument]);

  return metadata;
};

export default useDocumentMetadata;
