import * as PDFJS from 'pdfjs-dist';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { type DocumentInitParameters } from 'pdfjs-dist/types/src/display/api';

const getPdfDocumentProxyFromFile  = async (file: File): Promise<PDFJS.PDFDocumentProxy> => {
  const buffer = await file.arrayBuffer();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  
  const params: DocumentInitParameters = {
    data: buffer,
    fontExtraProperties: true,
  };
  const result = PDFJS.getDocument(params);
  return result.promise;  
};

export default getPdfDocumentProxyFromFile;