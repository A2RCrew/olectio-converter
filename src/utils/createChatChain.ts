import { OpenAIChat } from 'langchain/llms';
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from 'langchain/chains';

import { CallbackManager } from 'langchain/callbacks';
import vectorStores from '~/server/data/vectorStores';
import { type HNSWLib } from 'langchain/vectorstores';
import prompts from './prompts';

const createChatChain = (
  hash: string,
  onTokenStream?: (token: string, verbose?: boolean) => Promise<void>,
  lang: 'es' | 'en' = 'es',
) => {
  const questionGenerator = new LLMChain({
    llm: new OpenAIChat({ temperature: 0 }),
    prompt: prompts[lang].condensePrompt,
  });

  const handleLLMNewToken = async (token: string, verbose?: boolean): Promise<void> => {
    if (onTokenStream) {
      await onTokenStream(token, verbose);
    }
  };
  const docChain = loadQAChain(
    new OpenAIChat({
      temperature: 0,
      modelName: 'gpt-4', // gpt-3.5-turbo
      streaming: Boolean(onTokenStream),
      callbackManager: onTokenStream
        ? CallbackManager.fromHandlers({
            handleLLMNewToken,
          })
        : undefined,
    }),
    { prompt: prompts[lang].qaPrompt },
  );

  const vectorstore = vectorStores.get(hash) as HNSWLib;

  return new ChatVectorDBQAChain({
    vectorstore,
    combineDocumentsChain: docChain,
    questionGeneratorChain: questionGenerator,
    returnSourceDocuments: false,
    k: 5,
  });
};

export default createChatChain;
