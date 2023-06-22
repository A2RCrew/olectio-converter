import { type TextContent } from 'pdfjs-dist/types/src/display/api';
import { useEffect, useState } from 'react';
import { getCurrentPDFDocument } from '~/logic/pdf/currentDocument';
import getPage from '~/logic/pdf/getPage';

const usePageTextNodes = (currentPage: number) => {
  const document = getCurrentPDFDocument();
  const [text, setText] = useState<TextContent>();

  useEffect(() => {
    if (document) {
      getPage(document, currentPage)
        .then(async (page) => {
          const newText = await page.getTextContent({
            disableCombineTextItems: false,
            includeMarkedContent: true,
          });
          setText(newText);
        })
        .catch((err) => console.error(err));
    }
  }, [document, currentPage]);

  return text;
};

export default usePageTextNodes;
