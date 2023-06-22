import { type FormEvent, useRef, useState } from 'react';
import { getCurrentPDFDocumentHash } from '~/logic/pdf/currentDocument';
import { api } from '~/utils/api';

const useQueryDocumentEmbedding = () => {
  const documentHash = getCurrentPDFDocumentHash();
  const [response, setResponse] = useState<{ text: string; mine: boolean }[]>([]);
  const queryTextRef = useRef<HTMLInputElement>(null);
  const embeddingExists = api.embedding.exists.useQuery({ hash: documentHash || '' });
  const replyQuestion = api.gpt.replyQuestion.useMutation();

  const addNewQuery = (ev: FormEvent) => {
    ev.preventDefault();
    if (queryTextRef.current) {
      const queryToRun = queryTextRef.current.value;
      queryTextRef.current.value = '';
      if (queryToRun) {
        const mine = { text: queryToRun, mine: true };
        const current = { text: '...', mine: false };
        setResponse([current, mine, ...response]);
        const history = [...response.map((c) => c.text)].reverse();
        replyQuestion
          .mutateAsync({ question: queryToRun, hash: documentHash || '', history })
          .then((text) => {
            current.text = text;
            setResponse((r) => [...r]);
          })
          .catch(console.error);
      }
    }
  };
  return [embeddingExists, addNewQuery, response, queryTextRef] as const;
};

export default useQueryDocumentEmbedding;
