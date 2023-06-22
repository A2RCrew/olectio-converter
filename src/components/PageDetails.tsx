import { ObjectInspector, chromeDark } from 'react-inspector';
import usePageDetails from '~/hooks/usePageDetails';

const PageDetails: React.FC<{ currentPage: number }> = ({ currentPage }) => {
  const pageDetails = usePageDetails(currentPage);

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
        data={pageDetails}
      />
    </div>
  ) : (
    <div>No page set...</div>
  );
};

export default PageDetails;
