import { ObjectInspector , chromeDark } from 'react-inspector';
import useBookmarksInfo from '~/hooks/useBookmarksInfo';

const DocumentBookmarks: React.FC = ({}) => {
  const bookmarksInfo = useBookmarksInfo();

  return bookmarksInfo ? (
    <div className="max-h-full overflow-auto">
      <ObjectInspector 
        theme={
          {
            ...chromeDark,
            TREENODE_FONT_SIZE: '16px',
            BASE_BACKGROUND_COLOR: 'transparent',
          } as unknown as string
        }
        table={false}        
        expandLevel={bookmarksInfo.length ? 2 : 1}
        data={bookmarksInfo}
      />
    </div>
  ) : (
    <div>No bookmarks</div>
  );
};

export default DocumentBookmarks;
