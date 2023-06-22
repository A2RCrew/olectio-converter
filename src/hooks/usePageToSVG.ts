import * as pdfjsLib from 'pdfjs-dist';
import { useEffect, useState } from 'react';

import { getCurrentPDFDocument } from '~/logic/pdf/currentDocument';
import getPage from '~/logic/pdf/getPage';

const usePageToSVG = (currentPage: number, embedFonts: boolean) => {
  const document = getCurrentPDFDocument();
  const [svg, setSVG] = useState<SVGElement>();
  useEffect(() => {
    if (document) {
      getPage(document, currentPage)
        .then(async (page) => {
          const viewport = page.getViewport({ scale: 1.0 });
          const opList = await page.getOperatorList();

          const charsByFontTranslator = new Map<string, Map<string, string>>();
          let currentFont = '';
          for (let i = 0; i < opList.fnArray.length; i++) {
            const operation = opList.fnArray[i];
            if (operation === 37) {
              // Set font
              currentFont = (opList.argsArray[i] as [string])[0];
              if (!charsByFontTranslator.has(currentFont)) {
                charsByFontTranslator.set(currentFont, new Map<string, string>());
              }
            }
            if (operation === 44) {
              // show text
              const fragments = opList.argsArray[i] as { unicode: string; fontChar: string }[][];
              for (let j = 0; j < fragments.length; j++) {
                const fragment = fragments[j];
                if (fragment) {
                  for (let k = 0; k < fragment.length; k++) {
                    const char = fragment[k];
                    if (char && char.fontChar) {
                      if (char.unicode === '\u00AD') {
                        char.unicode = '-';
                      }
                      charsByFontTranslator.get(currentFont)?.set(char.fontChar, char.unicode);
                    }
                  }
                }
              }
            }
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          const svgGfx = new pdfjsLib.SVGGraphics(page.commonObjs, page.objs, false) as {
            embedFonts: boolean;
            getSVG: (
              opList: Awaited<ReturnType<(typeof page)['getOperatorList']>>,
              vp: typeof viewport,
            ) => Promise<SVGElement>;
          };
          svgGfx.embedFonts = embedFonts;
          const svg = await svgGfx.getSVG(opList, viewport);
          const temporalCanvas = window.document.createElement('canvas');
          const context = temporalCanvas.getContext('2d');
          svg.querySelectorAll('tspan').forEach((item) => {
            if (item.textContent && context) {
              const font = item.attributes.getNamedItem('font-family')?.value;
              const fontSize = parseFloat(
                item.attributes.getNamedItem('font-size')?.value?.replace('px', '') || '',
              );
              const xAttribute = item.attributes.getNamedItem('x');
              const xCoordinates = xAttribute?.value.split(' ').map((c) => parseFloat(c));
              if (font && charsByFontTranslator.has(font) && fontSize && xCoordinates) {
                context.font = `${font || ''} ${fontSize * 10}px`;
                const currentFont = charsByFontTranslator.get(font);

                const textCharacters = item.textContent.split('');
                const result = new Array<string>();
                const resultX = new Array<number>();
                let lastX = 0;
                let lastChar = '';
                for (let i = 0; i < textCharacters.length; i++) {
                  const char = textCharacters[i] || '';
                  const x = xCoordinates[i] || 0;
                  const deltaX = x - lastX;
                  if (lastChar) {
                    let width = context.measureText(lastChar).width / 10;
                    width += context.measureText(' ').width / 30;
                    if (deltaX >= width) {
                      resultX.push(lastX + width);
                      result.push(' ');
                    }
                  }
                  resultX.push(x);
                  const newChar = currentFont?.get(char) ?? char;
                  result.push(newChar);
                  lastChar = char;
                  lastX = x;
                }
                item.textContent = result.join('');
                if (xAttribute) {
                  xAttribute.value = resultX.join(' ');
                }
              }
            }
          });

          // Release page resources.
          setSVG(svg);
          page.cleanup();
        })
        .catch((err) => console.error(err));
    }
  }, [document, currentPage, embedFonts]);

  return svg;
};

export default usePageToSVG;
