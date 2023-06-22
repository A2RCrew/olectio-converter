import * as pdfjsLib from 'pdfjs-dist';
import { useEffect, useState } from 'react';

import { getCurrentPDFDocument } from '~/logic/pdf/currentDocument';
import getPage from '~/logic/pdf/getPage';

const usePageToObfuscatedSVG = (currentPage: number, embedFonts: boolean) => {
  const document = getCurrentPDFDocument();
  const [svg, setSVG] = useState<SVGElement>();
  useEffect(() => {
    if (document) {
      getPage(document, currentPage)
        .then(async (page) => {
          const viewport = page.getViewport({ scale: 1.0 });
          const opList = await page.getOperatorList();

          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          const svgGfx = new pdfjsLib.SVGGraphics(page.commonObjs, page.objs, true) as {
            embedFonts: boolean;
            getSVG: (
              opList: Awaited<ReturnType<(typeof page)['getOperatorList']>>,
              vp: typeof viewport,
            ) => Promise<SVGElement>;
          };
          svgGfx.embedFonts = embedFonts;
          const svg = await svgGfx.getSVG(opList, viewport);
          // Release page resources.
          setSVG(svg);
          page.cleanup();
        })
        .catch((err) => console.error(err));
    }
  }, [document, currentPage, embedFonts]);

  return svg;
};

export default usePageToObfuscatedSVG;
