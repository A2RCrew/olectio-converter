import useEmbeddedFontsDetails from '~/hooks/useEmbeddedFontsDetails';
import { ObjectInspector, chromeDark } from 'react-inspector';

const DocumentEmbeddedFontDetails: React.FC<{ currentPage: number }> = ({ currentPage }) => {
  const fontsInfo = useEmbeddedFontsDetails(currentPage);  
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

export default DocumentEmbeddedFontDetails;
