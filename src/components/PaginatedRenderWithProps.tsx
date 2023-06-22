import usePaginatedRender from '~/hooks/usePaginatedRender';
import { ObjectInspector, chromeDark } from 'react-inspector';

const PaginatedRenderWithProps: React.FC = () => {
  const [containerRef, rendition] = usePaginatedRender();
  return (
    <div className="w-full h-screen flex flex-row align-middle justify-center ">
      <button
        title="Prev Chapter"
        className="fixed bg-pink-700 left-[400px] px-3 py-1 rounded-full top-4 z-10"
        onClick={() => {
          rendition?.prev().catch(console.error);
        }}
      >
        Prev
      </button>
      <button
        title="Next Chapter"
        className="fixed bg-pink-700 right-[calc((100%-384px)/3)] mr-1 px-3 py-1 rounded-full top-4 z-10"
        onClick={() => {
          rendition?.next().catch(console.error);
        }}
      >
        Next
      </button>
      <div className="w-2/3 h-[calc(100vh-2.5em)] mb-14 bg-white" ref={containerRef}></div>
      <div className="w-1/3 h-[calc(100vh-2.5em)] bg-black p-4 overflow-y-scroll">
        <ObjectInspector
          theme={
            {
              ...chromeDark,
              TREENODE_FONT_SIZE: '16px',
              BASE_BACKGROUND_COLOR: 'transparent',
            } as unknown as string
          }
          table={false}
          expandLevel={1}
          data={rendition}
        />
      </div>
    </div>
  );
};

export default PaginatedRenderWithProps;
