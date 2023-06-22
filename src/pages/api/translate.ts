import type { NextApiRequest, NextApiResponse } from 'next';
import createTranslateChain from '../../utils/createTranslateChain';

const translateHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { sourceText, sourceLang, targetLang } = req.body as { [key: string]: string };

  if (!sourceText) {
    return res.status(400).json({ message: 'No source text in the request' });
  }

  if (!sourceLang) {
    return res.status(400).json({ message: 'No source lang in the request' });
  }

  if (!targetLang) {
    return res.status(400).json({ message: 'No target lang in the request' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });

  const sendData = (data: string) => {
    res.write(`data: ${data}\n\n`);
  };

  await createTranslateChain(
    sourceText,
    sourceLang,
    targetLang,
    // eslint-disable-next-line @typescript-eslint/require-await
    async (token: string, _?: boolean) => {
      sendData(JSON.stringify({ data: token }));
    },
  );
  
  sendData('[DONE]');
  res.end();
};

export default translateHandler;
