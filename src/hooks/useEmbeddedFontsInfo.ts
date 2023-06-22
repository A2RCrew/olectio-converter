import { type TextItem } from 'pdfjs-dist/types/src/display/api';
import { useEffect, useState } from 'react';
import { getCurrentPDFDocument } from '~/logic/pdf/currentDocument';
import getPage from '~/logic/pdf/getPage';

const useEmbeddedFontsInfo = (currentPage: number) => {
  const document = getCurrentPDFDocument();
  const [fontsInfo, setFontInfo] = useState<{ [fontName: string]: unknown }>();
  useEffect(() => {
    if (document) {
      getPage(document, currentPage)
        .then(async (page) => {
          const temporalCanvas = window.document.createElement('canvas');
          temporalCanvas.width = 10;
          temporalCanvas.height = 10;
          const viewport = page.getViewport({ scale: 1 });
          await page.render({
            canvasContext: temporalCanvas.getContext('2d') as object,
            viewport,
            transform: undefined,
          }).promise;
          const newText = await page.getTextContent({
            includeMarkedContent: true,
            disableCombineTextItems: false,
          });
          const textItems = newText.items as TextItem[];
          const fonts: { [fontName: string]: unknown } = {};
          for (let i = 0; i < textItems.length; i++) {
            const item = textItems[i];
            if (item && item.fontName && !fonts[item.fontName]) {
              fonts[item.fontName] = page.commonObjs.get(item.fontName);
            }
          }
          (global as unknown as { fonts: { [fontName: string]: unknown } }).fonts = fonts;
          setFontInfo(fonts);
        })
        .catch((err) => console.error(err));
    }
  }, [document, currentPage]);
  return fontsInfo;
};

export default useEmbeddedFontsInfo;
