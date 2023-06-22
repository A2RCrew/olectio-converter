import useGenerateDocumentSummarization from '~/hooks/useGenerateDocumentSummarization';
import MarkDown from './Markdown';

const GenerateFullDocumentSummarization: React.FC = ({}) => {
  
  const [result, uploadFile, documentHash, containerRef] = useGenerateDocumentSummarization();

  return documentHash ? (
    <div className="max-h-full overflow-auto" ref={containerRef}>
      {result ? (
        <MarkDown>{result}</MarkDown>
      ) : (
        <button
          onClick={() => {
            uploadFile().catch((err) => console.error(err));
          }}
          className="rounded-full p-2 px-4 bg-purple-950 border-rose-500 border-2 text-white font-bold"
        >
          Full Document Summarization
        </button>
      )}
    </div>
  ) : (
    <div>No Document</div>
  );
};

export default GenerateFullDocumentSummarization;
