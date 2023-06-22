import { Prism as ReactSyntaxHighlighter } from 'react-syntax-highlighter';
import useDocumentPagesInfo from '~/hooks/useDocumentPagesInfo';
import useThynthwave84 from '~/hooks/useThynthwave84';

const DocumentPagesInfo: React.FC<{ currentPage: number }> = ({ currentPage }) => {
  const pagesInfo = useDocumentPagesInfo();
  const style = useThynthwave84();
  return pagesInfo ? (
    <div className="max-h-full overflow-auto">
      <ReactSyntaxHighlighter
        className="forceBlackBG"
        showLineNumbers
        language="yaml"
        style={style}
      >{`- Number of pages: ${pagesInfo?.numPages}
- CurrentPage: ${currentPage}
- Page labels: ${JSON.stringify(pagesInfo?.labels, null, 2)
        .replaceAll(',', ', ')
        .replaceAll('"', "'")}`}</ReactSyntaxHighlighter>
    </div>
  ) : (
    <div>Generating...</div>
  );
};

export default DocumentPagesInfo;
