import useEmbeddedFontsFontKitDetails from '~/hooks/useEmbeddedFontsFontKitDetails';
import { ObjectInspector, chromeDark } from 'react-inspector';

const DocumentEmbeddedFontKitDetails: React.FC<{ currentPage: number }> = ({ currentPage }) => {
  const fontsInfo = useEmbeddedFontsFontKitDetails(currentPage);  
  return fontsInfo ? (
    <div className="max-h-full overflow-auto ">
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
        data={fontsInfo}
      />
    </div>
  ) : (
    <div>No fonts</div>
  );
};

export default DocumentEmbeddedFontKitDetails;
