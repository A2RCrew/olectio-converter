import { type FormEvent, useRef, useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';

const useCustomQuestionsGenerator = (text: string) => {
  const [response, setResponse] = useState<string>();
  const totalQuestions = useRef<HTMLSelectElement>(null);
  const responsesPerQuestion = useRef<HTMLSelectElement>(null);

  const generate = (ev: FormEvent) => {
    ev.preventDefault();
    const ctrl = new AbortController();
    setResponse('...');
    fetchEventSource('/api/generateQuestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      openWhenHidden: true,
      body: JSON.stringify({
        sourceText: text,
        totalQuestions: parseInt(totalQuestions?.current?.value || '5', 10) || 5,
        responsesPerQuestion: parseInt(responsesPerQuestion?.current?.value || '4', 10) || 4,
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
  return [response, totalQuestions, responsesPerQuestion, generate] as const;
};

export default useCustomQuestionsGenerator;
