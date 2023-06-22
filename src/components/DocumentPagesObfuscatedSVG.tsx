/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import usePageToObfuscatedSVG from '~/hooks/usePageToObfuscatedSVG';

let lastZoom = 1;
const DocumentPagesObfuscatedSVG: React.FC<{ currentPage: number }> = ({ currentPage }) => {
  const container = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(lastZoom);
  const [embedFonts, setEmbedFonts] = useState<boolean>(false);
  const svg = usePageToObfuscatedSVG(currentPage, embedFonts);
  useEffect(() => {
    if (container.current && svg) {
      container.current.innerHTML = '';
      container.current.append(svg);
    }
  }, [container, svg]);
  return svg ? (
    <div className="max-h-full overflow-auto">
      <div className="fixed right-4 top-4.5 flex z-10">
        <label htmlFor="zoomLevel" className="text-white pr-2 block text-sm -mt-0.5">
          Zoom
        </label>
        <input
          name="zoomLevel"
          className="self-start w-96 accent-rose-600 block"
          type="range"
          min={0.2}
          max={8}
          step={0.1}
          value={scale}
          onChange={(ev) => {
            lastZoom = parseFloat(ev.target.value);
            setScale(lastZoom);
          }}
        />
        <label htmlFor="embeddedFonts" className="text-white pr-2 block text-sm -mt-0.5 ml-4">
          Embedded Fonts
        </label>
        <input
          id="embeddedFonts"
          name="embeddedFonts"
          className="self-start accent-rose-600 block"
          type="checkbox"
          checked={embedFonts}
          onChange={(ev) => {
            setEmbedFonts(ev.target.checked);
          }}
        />
      </div>
      <div className="min-h-screen min-w-full flex flex-col">
        <div className="m-auto">
          <div
            className="bg-white"
            style={{
              scale: `${scale}`,
            }}
            ref={container}
          />
        </div>
      </div>
      <a
        className="fixed top-4 left-100 text-sm underline text-rose-300"
        href=""
        onClick={(ev) => {
          ev.preventDefault();
          if (svg) {
            const serializer = new XMLSerializer();
            let source = serializer.serializeToString(svg);

            source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
            const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
            const tempLink = window.document.createElement('a');
            tempLink.href = url;
            tempLink.download = `page-${currentPage}.svg`;
            tempLink.click();
          }
        }}
      >
        Download SVG file
      </a>
    </div>
  ) : (
    <div>Generating...</div>
  );
};

export default DocumentPagesObfuscatedSVG;
