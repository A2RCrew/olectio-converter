import { type PDFOperatorList } from 'pdfjs-dist/types/src/display/api';
import { useEffect, useState } from 'react';
import { getCurrentPDFDocument } from '~/logic/pdf/currentDocument';
import getPage from '~/logic/pdf/getPage';

const usePageOperatorList = (currentPage: number) => {
  const document = getCurrentPDFDocument();
  const [operatorList, setOperatorList] = useState<PDFOperatorList>();

  useEffect(() => {
    if (document) {
      getPage(document, currentPage)
        .then(async (page) => {
          const newOperatorList = await page.getOperatorList();
          setOperatorList(newOperatorList);
        })
        .catch((err) => console.error(err));
    }
  }, [document, currentPage]);

  return operatorList;
};

export default usePageOperatorList;
