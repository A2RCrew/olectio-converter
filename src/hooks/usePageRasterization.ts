import { type RenderTask } from 'pdfjs-dist';
import { useEffect, useRef, useState } from 'react';

import { getCurrentPDFDocument } from '~/logic/pdf/currentDocument';
import getPage from '~/logic/pdf/getPage';

let lastRenderProcess: RenderTask;

const usePageRasterization = (currentPage: number, lastZoom: number) => {
  const document = getCurrentPDFDocument();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const preRenderRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState<number>(lastZoom);
  useEffect(() => {
    if (canvasRef.current) {
      if (document) {
        getPage(document, currentPage)
          .then((page) => {
            const canvas = canvasRef.current;
            const prerender = preRenderRef.current;
            if (canvas && prerender) {
              const viewport = page.getViewport({ scale });
              const outputScale = window.devicePixelRatio || 1;
              canvas.style.width = `${Math.floor(viewport.width)}px`;
              canvas.style.height = `${Math.floor(viewport.height)}px`;
              prerender.width = Math.floor(viewport.width * outputScale);
              prerender.height = Math.floor(viewport.height * outputScale);
              const context = prerender.getContext('2d');
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
                prerender.width = Math.floor(viewport.width * outputScale);
                prerender.height = Math.floor(viewport.height * outputScale);

                lastRenderProcess = page.render(renderContext);
                if (lastRenderProcess) {
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
                }
              }
            }
          })
          .catch((err) => console.error(err));
      }
    }
  }, [document, currentPage, scale]);

  return [canvasRef, preRenderRef, scale, setScale] as const;
};

export default usePageRasterization;
