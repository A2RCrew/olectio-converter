import ReactSyntaxHighlighter from 'react-syntax-highlighter';
import usePageText from '~/hooks/usePageText';
import useThynthwave84 from '~/hooks/useThynthwave84';

const PageTextExtraction: React.FC<{ currentPage: number }> = ({ currentPage }) => {
  const style = useThynthwave84();
  const [text] = usePageText(currentPage);
  return currentPage ? (
    <div className="w-full h-screen overflow-scroll">
      <ReactSyntaxHighlighter
        className="forceBlackBG"
        showLineNumbers
        language="markdown"
        style={style}
      >
        {text}
      </ReactSyntaxHighlighter>
    </div>
  ) : (
    <div>No page set...</div>
  );
};

export default PageTextExtraction;
