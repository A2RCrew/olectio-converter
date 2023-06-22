import { Inspector, chromeDark } from 'react-inspector';
import useProcessedPageOperatorList from '~/hooks/useProcessedPageOperatorList';

const ProcessedPageOperatorList: React.FC<{ currentPage: number }> = ({ currentPage }) => {
  const pageOperatorList = useProcessedPageOperatorList(currentPage);
  return currentPage ? (
    <div className="w-full h-screen overflow-scroll pb-10">
      <Inspector
        theme={
          {
            ...chromeDark,
            TREENODE_FONT_SIZE: '18px',
            BASE_BACKGROUND_COLOR: 'transparent',
          } as unknown as string
        }
        table={true}
        data={pageOperatorList}
      />
    </div>
  ) : (
    <div>No page set...</div>
  );
};

export default ProcessedPageOperatorList;
