import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const createInsert = async (sourceText: string) => {
  const fullSource = sourceText
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .split('[insert]');
  const prompt = fullSource[0] || '';
  const suffix = fullSource[1] || '';
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt,
    suffix,
    temperature: 0.7,
    max_tokens: 2000,
  });
  console.log(completion.data);
  return completion.data;
};

export default createInsert;
