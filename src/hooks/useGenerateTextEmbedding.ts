import { type FormEvent, useRef, useState } from 'react';
import { api } from '../utils/api';

const useGenerateTextEmbedding = () => {
  const [texts, setTexts] = useState<{ text: string; vector: number[] }[]>([]);
  const [distances, setDistances] = useState<{ text: string; distance: number }[]>([]);
  const [selectedText, setSelectedText] = useState<{ text: string; vector: number[] }>({
    text: '',
    vector: [],
  });
  const addTextRef = useRef<HTMLInputElement>(null);
  const generateEmbeddingForText = api.embedding.fromText.useMutation();
  const addNewText = (ev: FormEvent) => {
    ev.preventDefault();
    if (addTextRef.current) {
      const textToAdd = addTextRef.current.value;
      if (textToAdd) {
        generateEmbeddingForText
          .mutateAsync({ text: textToAdd })
          .then((res) => {
            const newText = { text: textToAdd, vector: res };
            if (selectedText.text === '') {
              setSelectedText(newText);
            }
            setTexts((t) => [newText, ...t]);
          })
          .catch(console.error);
        addTextRef.current.value = '';
      }
    }
  };
  return [texts, setTexts, distances, setDistances, addNewText, addTextRef, selectedText, setSelectedText] as const;
}

export default useGenerateTextEmbedding;