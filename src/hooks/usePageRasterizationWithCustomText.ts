import { useEffect, useRef, useState } from 'react';
import * as PDFJS from 'pdfjs-dist';

import { getCurrentPDFDocument } from '~/logic/pdf/currentDocument';
import getPage from '~/logic/pdf/getPage';
import { type TextItem } from 'pdfjs-dist/types/src/display/api';

let lastRenderProcess: PDFJS.RenderTask;

const usePageRasterizationWithCustomText = (currentPage: number, lastZoom: number) => {
  const document = getCurrentPDFDocument();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const articleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const preRenderRef = useRef<HTMLCanvasElement>(null);

  const [scale, setScale] = useState<number>(lastZoom);
  useEffect(() => {
    const article = articleRef.current;
    if (article) {
      article.innerHTML = '';
    }
  }, [document, currentPage]);
  useEffect(() => {
    if (canvasRef.current) {
      if (document) {
        getPage(document, currentPage)
          .then(async (page) => {
            const canvas = canvasRef.current;
            const article = articleRef.current;
            const container = containerRef.current;
            const prerender = preRenderRef.current;
            if (canvas && article && container && prerender) {
              const context = prerender.getContext('2d');
              const viewport = page.getViewport({ scale });
              const outputScale = window.devicePixelRatio || 1;
              prerender.width = Math.floor(viewport.width * outputScale);
              prerender.height = Math.floor(viewport.height * outputScale);
              container.style.width = `${Math.floor(viewport.width)}px`;
              container.style.height = `${Math.floor(viewport.height)}px`;
              const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
              if (context && transform) {
                const renderContext = {
                  canvasContext: context,
                  transform: transform,
                  viewport: viewport,
                };

                if (lastRenderProcess) {
                  lastRenderProcess.cancel();
                }
                lastRenderProcess = page.render(renderContext);

                lastRenderProcess.promise
                  .then(() => {
                    canvas.width = prerender.width;
                    canvas.height = prerender.height;
                    const targetContext = canvas.getContext('2d');
                    targetContext?.drawImage(prerender, 0, 0);
                  })
                  .catch(() => {
                    // Do nothing
                  });

                if (!article.innerHTML) {
                  const textContent = await page.getTextContent();
                  let text = '';
                  let lastX = -1;
                  let lastY = -1;
                  textContent.items.forEach((item) => {
                    const textItem = item as TextItem;
                    const tx = PDFJS.Util.transform(
                      viewport.transform,
                      textItem.transform,
                    ) as number[];
                    const px = tx[4] || 0;
                    const py = tx[5] || 0;
                    let sep = '';
                    if (py < -100) return;
                    if (px < lastX - 10 || Math.abs(py - lastY) > 5) {
                      sep = '\n';
                    }
                    text = text == '' ? textItem.str : text + sep + textItem.str;
                    lastX = px;
                    lastY = py;
                  });
                  console.log(text);
                }
              }
            }
          })
          .catch((err) => console.error(err));
      }
    }
  }, [document, currentPage, scale]);
  return [canvasRef, preRenderRef, articleRef, containerRef, scale, setScale] as const;
};

export default usePageRasterizationWithCustomText;
