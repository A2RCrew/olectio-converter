import { useEffect, useRef, useState } from 'react';
import * as PDFJS from 'pdfjs-dist';

import { getCurrentPDFDocument } from '~/logic/pdf/currentDocument';
import getPage from '~/logic/pdf/getPage';

let lastRenderProcess: PDFJS.RenderTask;

const usePageRasterizationWithText = (currentPage: number, lastZoom: number) => {
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
                  const result = PDFJS.renderTextLayer({
                    container: article,
                    textContentSource: textContent,
                    viewport,
                  });
                  await result.promise;

                  article.querySelectorAll('br').forEach((item) => item.remove());
                }
                article.style.setProperty('--scale-factor', `${scale}`);
              }
            }
          })
          .catch((err) => console.error(err));
      }
    }
  }, [document, currentPage, scale]);
  return [canvasRef, preRenderRef, articleRef, containerRef, scale, setScale] as const;
};

export default usePageRasterizationWithText;
