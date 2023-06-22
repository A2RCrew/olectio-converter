import { type FormEvent, useRef, useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';

const useCustomTranslation = (text: string) => {
  const [response, setResponse] = useState<string>();
  const sourceLangRef = useRef<HTMLSelectElement>(null);
  const targetLangRef = useRef<HTMLSelectElement>(null);

  const translate = (ev: FormEvent) => {
    ev.preventDefault();
    const ctrl = new AbortController();
    setResponse('...');
    fetchEventSource('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      openWhenHidden: true,
      body: JSON.stringify({
        sourceText: text,
        sourceLang: sourceLangRef?.current?.value || 'spanish',
        targetLang: targetLangRef?.current?.value || 'english',
      }),
      signal: ctrl.signal,
      onmessage: (event) => {
        if (event.data === '[DONE]') {
          ctrl.abort();
        } else {
          const data = JSON.parse(event.data) as { data: string };
          if (data.data) {
            setResponse((current) => `${current === '...' ? '' : current || ''}${data.data}`);
          }
        }
      },
    }).catch(console.error);
  };
  return [response, sourceLangRef, targetLangRef, translate] as const;
};

export default useCustomTranslation;
