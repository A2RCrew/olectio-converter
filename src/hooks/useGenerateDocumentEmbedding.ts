import { useEffect, useState } from 'react';
import { getCurrentPDFDocumentHash, getCurrentPDFFile } from '~/logic/pdf/currentDocument';
import { type GenerateDocumentEmbeddingResponse } from '~/model/apiTypes';
import { api } from '~/utils/api';
const statusValues = ['pending', 'uploading', 'done'];

const useGenerateDocumentEmbedding = () => {
  const documentHash = getCurrentPDFDocumentHash();
  const [status, setStatus] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const embeddingExists = api.embedding.exists.useQuery({ hash: documentHash || '' });

  useEffect(() => {
    setStatus(0);
  }, [documentHash]);
  const uploadFile = async (): Promise<void> => {
    setStatus(statusValues.indexOf('uploading'));
    setResult('');
    setUploadError('');
    const formData = new FormData();
    const currentPDFFile = getCurrentPDFFile();
    if (currentPDFFile && documentHash) {
      formData.append('file', currentPDFFile);
      try {
        const response = await fetch(`/api/createDocumentEmbedding/${documentHash}`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          const text = response.statusText;
          setUploadError(`Error uploading file: ${text}`);
        } else {
          const data = (await response.json()) as GenerateDocumentEmbeddingResponse;
          if (data.success) {
            setResult(data.message);
            setStatus(statusValues.indexOf('done'));
          } else {
            setUploadError(`Error: ${data.message}`);
            setStatus(0);
          }
        }
      } catch (error) {
        setUploadError(`Error uploading file: ${(error as string) || ''}`);
      }
    }
  };
  return [status, uploadError, result, embeddingExists, uploadFile, documentHash] as const;
};

export default useGenerateDocumentEmbedding;
