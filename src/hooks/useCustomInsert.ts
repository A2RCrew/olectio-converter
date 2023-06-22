import { type FormEvent, useState } from 'react';
import { api } from '../utils/api';

const useCustomInsert = (text: string) => {
  const [response, setResponse] = useState<string>();
  const correctTextMutation = api.gpt.insertText.useMutation();
  const correct = (ev: FormEvent) => {
    ev.preventDefault();
    setResponse('Inserting, it will take some minutes');
    correctTextMutation
      .mutateAsync({ text: text })
      .then((correction) => {
        setResponse(correction.choices[0]?.text || '');
      })
      .catch(console.error);
  };
  return [response, correct] as const;
};

export default useCustomInsert;
