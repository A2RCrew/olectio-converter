import { useEffect, useRef, useState } from 'react';
import { getCurrentPDFDocumentHash, getCurrentPDFFile } from '~/logic/pdf/currentDocument';
import { fetchEventSource } from '@microsoft/fetch-event-source';

const useGenerateDocumentSummarization = () => {
  const documentHash = getCurrentPDFDocumentHash();
  const [result, setResult] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResult('');
  }, [documentHash]);

  // eslint-disable-next-line @typescript-eslint/require-await
  const uploadFile = async (): Promise<void> => {
    const formData = new FormData();
    const currentPDFFile = getCurrentPDFFile();
    if (currentPDFFile) {
      formData.append('file', currentPDFFile);
      setResult('Processing full document, it will take some minutes...');
      try {
        const ctrl = new AbortController();
        let fullText = '';
        fetchEventSource(`/api/createDocumentSummarization/${documentHash || ''}`, {
          method: 'POST',
          body: formData,
          openWhenHidden: true,
          signal: ctrl.signal,
          onmessage: (event) => {
            if (event.data.startsWith('result:')) {
              setResult(event.data.replace('result:', ''));
            } else if (event.data === '[CLEAR]') {
              fullText = '';
            } else if (event.data === '[DONE]') {
              if (result === ' ... ') {
                setResult('');
              }
              ctrl.abort();
            } else {
              const data = JSON.parse(event.data) as { data?: string; fullData?: string };
              if (data.data) {
                fullText += data.data;
                setResult(fullText);
                if (containerRef.current) {
                  containerRef.current.scrollBy({ top: 100 });
                }
              } else if (data.fullData) {
                fullText = data.fullData;
                if (containerRef.current) {
                  containerRef.current.scrollTo({ top: 0 });
                }
                setResult(fullText);
              }
            }
          },
        }).catch(console.error);
      } catch (error) {
        console.error(error);
      }
    }
  };
  return [result, uploadFile, documentHash, containerRef] as const;
};

export default useGenerateDocumentSummarization;
