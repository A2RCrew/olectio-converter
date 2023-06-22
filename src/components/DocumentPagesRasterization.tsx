import usePageRasterization from "~/hooks/usePageRasterization";

let lastZoom = 2;
const DocumentPagesRasterization: React.FC<{ currentPage: number }> = ({ currentPage }) => {
  const [canvasRef, preRenderRef, scale, setScale] = usePageRasterization(currentPage, lastZoom);
  return currentPage ? (
    <div className="w-full h-screen overflow-scroll">
      <div className="min-h-screen min-w-full flex flex-col">
        <div className="fixed right-4 top-4.5 flex">
          <label htmlFor="zoomLevel" className="text-white pr-2 block text-sm -mt-0.5">
            Zoom
          </label>
          <input
            id="zoomLevel"
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
        </div>
        <canvas className="bg-black m-auto hidden" ref={preRenderRef} />
        <canvas className="bg-black m-auto" ref={canvasRef} />
        <a
          className="fixed top-4 left-100 text-sm underline text-rose-300"
          href=""
          onClick={(ev) => {
            ev.preventDefault();
            const canvasToDownload = canvasRef.current;
            if (canvasToDownload) {
              const imageData = canvasToDownload.toDataURL('image/webp');
              const tempLink = window.document.createElement('a');
              tempLink.href = imageData;
              tempLink.download = `Page-${currentPage}.webp`;
              tempLink.click();
            }
          }}
        >
          Download Image
        </a>
      </div>
    </div>
  ) : (
    <div>No page set...</div>
  );
};

export default DocumentPagesRasterization;
