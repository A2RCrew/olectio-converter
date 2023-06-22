import useVerticalRender from '~/hooks/useVerticalRender';

const VerticalRender: React.FC = () => {
  const [containerRef, rendition] = useVerticalRender();
  return (
    <div className="w-full h-screen flex flex-col align-middle justify-center ">
      <button
        title="Prev Chapter"
        className="fixed bg-pink-700 left-100 px-3 py-1 rounded-full top-4 z-10"
        onClick={() => {
          rendition?.prev().catch(console.error);
        }}
      >
        Prev
      </button>
      <button
        title="Next Chapter"
        className="fixed bg-pink-700 right-4 px-3 py-1 rounded-full top-4 z-10"
        onClick={() => {
          rendition?.next().catch(console.error);
        }}
      >
        Next
      </button>
      <div className="w-full h-full mb-14 bg-white" ref={containerRef}></div>
    </div>
  );
};

export default VerticalRender;
