import type { NextApiRequest, NextApiResponse } from 'next';
import createQuestionsGenerationChain from '../../utils/createQuestionsGenerationChain';

const generateQuestionsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { sourceText, totalQuestions, responsesPerQuestion } = req.body as {
    sourceText: string,
    totalQuestions: number,
    responsesPerQuestion: number,
   };

  if (!sourceText) {
    return res.status(400).json({ message: 'No source text in the request' });
  }

  if (!totalQuestions) {
    return res.status(400).json({ message: 'No total questions in the request' });
  }

  if (!responsesPerQuestion) {
    return res.status(400).json({ message: 'No responses per question in the request' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });

  const sendData = (data: string) => {
    res.write(`data: ${data}\n\n`);
  };

  await createQuestionsGenerationChain(
    sourceText,
    totalQuestions,
    responsesPerQuestion,
    // eslint-disable-next-line @typescript-eslint/require-await
    async (token: string, _?: boolean) => {
      sendData(JSON.stringify({ data: token }));
    },
  );
  
  sendData('[DONE]');
  res.end();
};

export default generateQuestionsHandler;
