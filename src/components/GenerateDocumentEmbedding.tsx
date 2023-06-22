import useGenerateDocumentEmbedding from '~/hooks/useGenerateDocumentEmbedding';

const GenerateDocumentEmbedding: React.FC = ({}) => {
  const [status, uploadError, result, embeddingExists, uploadFile, documentHash] =
    useGenerateDocumentEmbedding();
  if (embeddingExists.isLoading) {
    return <div className="max-h-full overflow-auto">Loading...</div>;
  }
  if (embeddingExists.data) {
    return <div className="max-h-full overflow-auto">Full Text store already created</div>;
  }
  return documentHash ? (
    <div className="max-h-full overflow-auto">
      {status === 0 && (
        <button
          onClick={() => {
            uploadFile().catch((err) => console.error(err));
          }}
          className="rounded-full p-2 px-4 bg-purple-950 border-rose-500 border-2 text-white font-bold"
        >
          Create New Embedding
        </button>
      )}
      {status === 1 && <p className="text-green-400">Uploading and processing...</p>}
      {status === 0 && uploadError && <p className="text-red-500">{uploadError}</p>}
      {status === 2 && result && <p className="text-blue-300">{result}</p>}
    </div>
  ) : (
    <div>No Document</div>
  );
};

export default GenerateDocumentEmbedding;
