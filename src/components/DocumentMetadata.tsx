import { Prism as ReactSyntaxHighlighter } from 'react-syntax-highlighter';
import useDocumentMetadata from '~/hooks/useDocumentMetadata';
import useThynthwave84 from '~/hooks/useThynthwave84';

const TestDocument: React.FC = () => {
  const style = useThynthwave84();
  const metadata = useDocumentMetadata();
  return metadata ? (
    <div className="max-h-full overflow-auto">
      <ReactSyntaxHighlighter
        className="forceBlackBG"
        showLineNumbers
        language="json"
        style={style}
      >
        {JSON.stringify(metadata, null, 2)}
      </ReactSyntaxHighlighter>
    </div>
  ) : (
    <div>Generating...</div>
  );
};

export default TestDocument;
