import { ObjectInspector, chromeDark } from 'react-inspector';
import useDocumentData from '~/hooks/useDocumentData';

const DocumentData: React.FC = ({}) => {
  const documentData = useDocumentData();
  return document ? (
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
        expandLevel={1}
        data={documentData}
      />
    </div>
  ) : (
    <div>No bookmarks</div>
  );
};

export default DocumentData;
