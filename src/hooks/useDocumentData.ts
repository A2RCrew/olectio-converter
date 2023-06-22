import { type Book } from 'epubjs';
import { type PDFDocumentProxy } from 'pdfjs-dist';
import { useEffect, useState } from 'react';
import { getCurrentEPUBDocument } from '~/logic/EPUB/currentDocument';
import { getCurrentPDFDocument } from '~/logic/pdf/currentDocument';

type InfoTypePDF = Awaited<ReturnType<typeof getPDFDocumentData>>;
let documentInfo: InfoTypePDF | undefined | Book;

let lastDocument:
  | ReturnType<typeof getCurrentPDFDocument>
  | ReturnType<typeof getCurrentEPUBDocument>;

const getPDFDocumentData = async (pdfDoc: PDFDocumentProxy) => {
  return {
    pdfDoc,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    attachments: await pdfDoc.getAttachments(),
    calculationOrderIds: await pdfDoc.getCalculationOrderIds(),
    fieldObjects: await pdfDoc.getFieldObjects(),
    JSActions: await pdfDoc.getJSActions(),
    javaScript: await pdfDoc.getJavaScript(),
    markInfo: await pdfDoc.getMarkInfo(),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    openAction: await pdfDoc.getOpenAction(),
    optionalContentConfig: await pdfDoc.getOptionalContentConfig(),
    pageLayout: await pdfDoc.getPageLayout(),
    pageMode: await pdfDoc.getPageMode(),
    permissions: await pdfDoc.getPermissions(),
    viewerPreferences: await pdfDoc.getViewerPreferences(),
  };
};

const useDocumentData = () => {
  const pdfDocument = getCurrentPDFDocument();
  const epubDocument = getCurrentEPUBDocument();
  const document = pdfDocument || epubDocument;
  if (document !== lastDocument) {
    documentInfo = undefined;
  }
  const [documentData, setDocumentData] = useState<InfoTypePDF | undefined | Book>(documentInfo);

  useEffect(() => {
    if (!documentInfo && document) {
      lastDocument = document;
      if (pdfDocument) {
        getPDFDocumentData(pdfDocument)
          .then((res) => {
            setDocumentData(res);
            documentInfo = res;
          })
          .catch(console.error);
      } else if (epubDocument) {
        documentInfo = epubDocument;
        setDocumentData(epubDocument);
      }
    }
  }, [document, pdfDocument, epubDocument]);
  return documentData;
};

export default useDocumentData;
