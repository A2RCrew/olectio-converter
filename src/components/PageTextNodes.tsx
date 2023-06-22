import { ObjectInspector, chromeDark } from 'react-inspector';
import usePageTextNodes from '~/hooks/usePageTextNodes';

const PageTextNodes: React.FC<{ currentPage: number }> = ({ currentPage }) => {
  const text = usePageTextNodes(currentPage);

  return currentPage ? (
    <div className="w-full h-screen overflow-scroll">
      <ObjectInspector
        theme={
          {
            ...chromeDark,
            TREENODE_FONT_SIZE: '18px',
            BASE_BACKGROUND_COLOR: 'transparent',
          } as unknown as string
        }
        expandLevel={1}
        table={false}
        data={text}
      />
    </div>
  ) : (
    <div>No page set...</div>
  );
};

export default PageTextNodes;
