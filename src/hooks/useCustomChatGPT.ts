import { type FormEvent, useRef, useState, useEffect } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { api } from '~/utils/api';
import { getCurrentPDFDocumentHash } from '~/logic/pdf/currentDocument';

let storedChat: { text: string; mine: boolean }[] = [];
let lastDocumentHash = '';
const lastLang = 'es';
const CustomChatGPT = () => {
  const documentHash = getCurrentPDFDocumentHash();
  const [response, setResponse] = useState<{ text: string; mine: boolean }[]>(storedChat);
  const queryTextRef = useRef<HTMLInputElement>(null);
  const langSelectRef = useRef<HTMLSelectElement>(null);
  const embeddingExists = api.embedding.exists.useQuery({ hash: documentHash || '' });
  const currentLang = langSelectRef?.current?.value || 'es';
  storedChat = response || storedChat;
  useEffect(() => {
    if ((documentHash && lastDocumentHash !== documentHash) || lastLang !== currentLang) {
      storedChat = [];
      lastDocumentHash = documentHash as string;
      setResponse([]);
    }
  }, [documentHash, currentLang]);
  const clearChat = () => {
    storedChat = [];
    setResponse([]);
  };
  const addNewQuery = (ev: FormEvent) => {
    ev.preventDefault();
    if (queryTextRef.current) {
      const queryToRun = queryTextRef.current.value;
      queryTextRef.current.value = '';
      if (queryToRun) {
        const mine = { text: queryToRun, mine: true };
        const current = { text: ' ... ', mine: false };
        setResponse([current, mine, ...response]);
        const history = [...response.map((c) => c.text)].reverse();
        const ctrl = new AbortController();

        fetchEventSource('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          openWhenHidden: true,
          body: JSON.stringify({
            question: queryToRun,
            history,
            hash: documentHash,
            lang: langSelectRef?.current?.value || 'es',
          }),
          signal: ctrl.signal,
          onmessage: (event) => {
            if (event.data === '[DONE]') {
              if (current.text === ' ... ') {
                storedChat = [];
                setResponse([]);
              }
              ctrl.abort();
            } else {
              const data = JSON.parse(event.data) as { data: string };
              if (data.data) {
                if (current.text === ' ... ') {
                  current.text = '';
                }
                current.text += data.data;
                setResponse((r) => [...r]);
              }
            }
          },
        }).catch(console.error);
      }
    }
  };
  return [embeddingExists, addNewQuery, response, queryTextRef, langSelectRef, clearChat] as const;
};

export default CustomChatGPT;
