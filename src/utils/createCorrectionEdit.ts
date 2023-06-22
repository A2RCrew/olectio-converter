import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const createCorrectionEdit = async (sourceText: string) => {
  const completion = await openai.createEdit({
    model: 'text-davinci-edit-001',
    instruction: `Fix the orthography and grammar. Use the same text provided by the user but corrected in markdown.`,
    input: sourceText
      .split('\n')
      .map((line) => line.trim())
      .join('\n'),
    temperature: 0.7,
  });
  console.log(completion.data);
  return completion.data;
};

export default createCorrectionEdit;
