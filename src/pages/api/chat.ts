import type { NextApiRequest, NextApiResponse } from 'next';
import createChatChain from '../../utils/createChatChain';
import { HNSWLib } from 'langchain/vectorstores';
import vectorStores from '~/server/data/vectorStores';
import fs from 'node:fs';
import { OpenAIEmbeddings } from 'langchain/embeddings';

const chatHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { question, history, hash, lang } = req.body as { [key: string]: string };

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }

  if (hash) {
    if (!vectorStores.has(hash)) {
      const storePath = `data/${hash}`;
      const storeDirInfoExists = fs.existsSync(storePath);
      if (storeDirInfoExists) {
        const vectorStore = await HNSWLib.load(storePath, new OpenAIEmbeddings());
        vectorStores.set(hash, vectorStore);
      }
    }
  }

  const language = lang !== 'es' ? 'en' : 'es';

  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });

  const sendData = (data: string) => {
    res.write(`data: ${data}\n\n`);
  };

  const chain = createChatChain(
    hash || '',
    // eslint-disable-next-line @typescript-eslint/require-await
    async (token: string, _?: boolean) => {
      sendData(JSON.stringify({ data: token }));
    },
    language,
  );

  try {
    //Ask a question
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    });

    sendData(
      JSON.stringify({ sourceDocs: (response as { sourceDocuments: string }).sourceDocuments }),
    );
  } catch (error) {
    console.log('error', error);
  } finally {
    sendData('[DONE]');
    res.end();
  }
};

export default chatHandler;
