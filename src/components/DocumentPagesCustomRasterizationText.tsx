import usePageRasterizationWithCustomText from "~/hooks/usePageRasterizationWithCustomText";

let lastZoom = 2;

const DocumentPagesCustomRasterizationText: React.FC<{ currentPage: number }> = ({ currentPage }) => {
  const [canvasRef, preRenderRef, articleRef, containerRef, scale, setScale] = usePageRasterizationWithCustomText(currentPage, lastZoom);

  return currentPage ? (
    <div className="w-full h-screen overflow-scroll relative">
      <div className="min-h-screen min-w-full flex flex-col">
        <div className="fixed right-4 top-4.5 flex z-30">
          <label htmlFor="zoomLevel" className="text-white pr-2 block text-sm -mt-0.5">
            Zoom
          </label>
          <input
            id="zoomLevel"
            name="zoomLevel"
            className="self-start w-96 accent-rose-600 block"
            type="range"
            min={0.2}
            max={6}
            step={0.1}
            value={scale}
            onChange={(ev) => {
              lastZoom = parseFloat(ev.target.value);
              setScale(lastZoom);
            }}
          />
        </div>
        <div className="relative m-auto" ref={containerRef}>
          <canvas className="bg-black m-auto hidden" ref={preRenderRef} />
          <canvas className="bg-black relative w-full h-full transition-all" ref={canvasRef} />
          <div
            className="text-layer text-transparent relative -top-full w-full h-full"
            ref={articleRef}
          />
        </div>
      </div>
    </div>
  ) : (
    <div>No page set...</div>
  );
};

export default DocumentPagesCustomRasterizationText;
