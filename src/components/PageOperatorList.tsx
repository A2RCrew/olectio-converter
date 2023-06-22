import { ObjectInspector, chromeDark } from 'react-inspector';
import usePageOperatorList from '~/hooks/usePageOperatorList';

const PageOperatorList: React.FC<{ currentPage: number }> = ({ currentPage }) => {
  const pageOperatorList = usePageOperatorList(currentPage);

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
        data={pageOperatorList}
      />
    </div>
  ) : (
    <div>No page set...</div>
  );
};

export default PageOperatorList;
