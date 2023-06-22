import useEmbeddedFontsInfo from '~/hooks/useEmbeddedFontsInfo';
import { ObjectInspector, chromeDark } from 'react-inspector';


const DocumentEmbeddedFont: React.FC<{ currentPage: number }> = ({ currentPage }) => {
  const fontsInfo = useEmbeddedFontsInfo(currentPage);
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
        expandLevel={2}
        table={false}
        data={fontsInfo}
      />
    </div>
  ) : (
    <div>No fonts</div>
  );
};

export default DocumentEmbeddedFont;
