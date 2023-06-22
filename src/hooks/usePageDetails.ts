import { type PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
import { useEffect, useState } from 'react';
import { getCurrentPDFDocument } from '~/logic/pdf/currentDocument';
import getPage from '~/logic/pdf/getPage';

const usePageDetails = (currentPage: number) => {
  const document = getCurrentPDFDocument();
  const [pageDetails, setPageDetails] = useState<PDFPageProxy>();

  useEffect(() => {
    if (document) {
      getPage(document, currentPage)
        .then((page) => {
          setPageDetails(page);
        })
        .catch((err) => console.error(err));
    }
  }, [document, currentPage]);

  return pageDetails;
};

export default usePageDetails;
