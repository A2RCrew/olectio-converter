import { Configuration, OpenAIApi } from 'openai';
import { type IncomingMessage } from 'node:http';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const createQuestionsGenerationChain = async (
  sourceText: string,
  totalQuestions: number,
  responsesPerQuestion: number,
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
          content: `Eres un asistente que dado un mensaje del usuario responderá con una lista de preguntas en español basadas en el texto proporcionado en el mensaje del usuario.
La respuesta que devolverás será en formato JSON con la siguiente estructura:
{
  "questions": [
    {
      "question": "Texto de la pregunta",
      "responses": [
        {
          "responseText": "Texto de la opción de respuesta",
          "isCorrect": false,
          "reason": "Motivo por el cual la respuesta no es correcta"
        },
        {
          "responseText": "Texto de la opción de respuesta",
          "isCorrect": false,
          "reason": "Motivo por el cual la respuesta no es correcta"
        },
        {
          "responseText": "Texto de la opción de respuesta",
          "isCorrect": true,
        },
        {
          "responseText": "Texto de la opción de respuesta",
          "isCorrect": false,
          "reason": "Motivo por el cual la respuesta no es correcta"
        }
      ]
    }
  ]
}

El número de preguntas que devolverás será ${totalQuestions}.
El número de respuestas por cada pregunta serán de ${responsesPerQuestion}.
Cada pregunta tendrá solamente una respuesta válida.
En la medida de lo posible las preguntas retornadas deberán abarcar todo el texto proporcionado de forma homogénea.
`,
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

export default createQuestionsGenerationChain;
