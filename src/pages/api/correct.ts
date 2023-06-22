import type { NextApiRequest, NextApiResponse } from 'next';
import createCorrectionChain from '../../utils/createCorrectionChain';

const correctHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { sourceText } = req.body as { [key: string]: string };

  if (!sourceText) {
    return res.status(400).json({ message: 'No source text in the request' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });

  const sendData = (data: string) => {
    res.write(`data: ${data}\n\n`);
  };

  await createCorrectionChain(
    sourceText,
    // eslint-disable-next-line @typescript-eslint/require-await
    async (token: string, _?: boolean) => {
      sendData(JSON.stringify({ data: token }));
    },
  );
  
  sendData('[DONE]');
  res.end();
};

export default correctHandler;
