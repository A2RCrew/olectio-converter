import { type FormEvent, useState } from 'react';
import { api } from '../utils/api';

const useCustomCorrectionEdit = (text: string) => {
  const [response, setResponse] = useState<string>();
  const correctTextMutation = api.gpt.correctText.useMutation();
  const correct = (ev: FormEvent) => {
    ev.preventDefault();
    setResponse('Correcting, it will take some minutes');
    correctTextMutation
      .mutateAsync({ text: text })
      .then((correction) => {
        setResponse(correction.choices[0]?.text || '');
      })
      .catch(console.error);
  };
  return [response, correct] as const;
};

export default useCustomCorrectionEdit;
