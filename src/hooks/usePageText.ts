import { type TextItem } from 'pdfjs-dist/types/src/display/api';
import { useEffect, useState } from 'react';
import { getCurrentPDFDocument } from '~/logic/pdf/currentDocument';
import getPage from '~/logic/pdf/getPage';

const usePageText = (currentPage: number) => {
  const document = getCurrentPDFDocument();
  const [text, setText] = useState<string>('');
  useEffect(() => {
    if (document) {
      getPage(document, currentPage)
        .then(async (page) => {
          const newText = await page.getTextContent({
            includeMarkedContent: false,
            disableCombineTextItems: false,
          });
          const textItems = newText.items as TextItem[];
          setText(
            textItems.map((token) => `${token.str || ''}${token.hasEOL ? `\n` : ''}`).join(''),
          );
        })
        .catch((err) => console.error(err));
    }
  }, [document, currentPage]);
  return [text, setText] as const;
};

export default usePageText;
