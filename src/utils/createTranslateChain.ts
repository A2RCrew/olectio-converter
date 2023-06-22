import { Configuration, OpenAIApi } from 'openai';
import { type IncomingMessage } from 'node:http';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const createTranslateChain = async (
  sourceText: string,
  sourceLang: string,
  targetLang: string,
  onTokenStream?: (token: string) => Promise<void>,
) => {
  const handleNewToken = async (token: string): Promise<void> => {
    if (onTokenStream) {
      await onTokenStream(token);
    }
  };

  const completion = await openai.createChatCompletion(
    {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an assistant that will return a translated version in ${targetLang} for any message provided by the user in ${sourceLang}`,
        },
        { role: 'user', content: sourceText },
      ],
      max_tokens: 2000,
      temperature: 0.2,
      stream: true,
    },
    {
      responseType: 'stream',
    },
  );

  const execute = new Promise<void>((resolve, reject) => {
    const stream = completion.data as unknown as IncomingMessage;

    stream.on('data', (chunk: Buffer) => {
      const payloads = chunk.toString().split('\n\n');
      for (const payload of payloads) {
        if (payload.includes('[DONE]')) return;
        if (payload.startsWith('data:')) {
          const data = payload.replaceAll(/(\n)?^data:\s*/g, '');
          try {
            console.log(data);
            const parsedResponse = JSON.parse(data.trim()) as {
              choices: { delta: { content?: string } }[];
            };
            handleNewToken(parsedResponse.choices.map((c) => c.delta.content || '').join('')).catch(
              console.error,
            );
          } catch (error) {
            console.log(`Parsing error and ${payload}.\n${error as string}`);
          }
        }
      }
    });

    stream.on('end', () => {
      resolve();
    });
    stream.on('error', (e: Error) => {
      console.error(e);
      reject(JSON.stringify({ error: e.message }));
    });
  });

  return execute;
};

export default createTranslateChain;
