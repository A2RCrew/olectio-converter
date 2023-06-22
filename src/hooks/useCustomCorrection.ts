import { type FormEvent, useState, useEffect } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';

let ctrl: AbortController | undefined = new AbortController();

const useCustomCorrection = (text: string) => {
  const [response, setResponse] = useState<string>();
  useEffect(() => {
    if (ctrl) {
      ctrl.abort();
    }
    setResponse('');
    return () => {
      if (ctrl) {
        ctrl.abort();
      }
    };
  }, [text]);

  useEffect(() => {
    return () => {
      if (ctrl) {
        ctrl.abort();
      }
    };
  }, []);

  const correct = (ev: FormEvent) => {
    ev.preventDefault();
    if (ctrl) {
      ctrl.abort();
      ctrl = undefined;
    }
    ctrl = new AbortController();
    setResponse('...');
    fetchEventSource('/api/correct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      openWhenHidden: true,
      body: JSON.stringify({
        sourceText: text,
      }),
      signal: ctrl.signal,
      onmessage: (event) => {
        if (event.data === '[DONE]') {
          if (ctrl) {
            ctrl.abort();
          }
        } else {
          const data = JSON.parse(event.data) as { data: string };
          if (data.data) {
            setResponse((current) => `${current === '...' ? '' : current || ''}${data.data}`);
          }
        }
      },
    }).catch(console.error);
  };
  return [response, correct] as const;
};

export default useCustomCorrection;
