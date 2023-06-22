import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import { PDFLoader } from 'langchain/document_loaders';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import fs from 'node:fs';
import { OpenAI } from 'langchain/llms';
import { loadSummarizationChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { CallbackManager } from 'langchain/callbacks';

const upload = multer({ storage: multer.memoryStorage() });

interface NextApiRequestWithFile extends NextApiRequest {
  file: Express.Multer.File;
}

type HandlerFunction = (req: NextApiRequestWithFile, res: NextApiResponse) => Promise<void>;

export const config = {
  api: {
    bodyParser: false,
  },
};

const allowStreaming = false;

// eslint-disable-next-line @typescript-eslint/require-await
const handleSummarization: HandlerFunction = async (req, res): Promise<void> => {
  try {
    const hash = req.query.hash as string;
    console.log(`handleSummarization: ${hash}`);
    if (hash) {
      const storePath = `content/${hash}.md`;
      const storeDirInfoExists = fs.existsSync(storePath);
      if (storeDirInfoExists) {
        // TODO: load file
      } else {
        const file = req.file;
        file.filename = `${hash}.pdf`;
        console.log(`File Path: ${file.originalname}`);
        const blob = new Blob([file.buffer], { type: 'application/pdf' });
        const loader = new PDFLoader(blob);
        console.log(`Loading document...`);
        const docs = await loader.load();
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        });
        let trace = `${docs.length} pages processed and transformed to text`;
        console.log(trace);
        docs.forEach((doc) => (doc.metadata.pdf = undefined));
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 4096,
          chunkOverlap: 200,
        });

        const chunks = await textSplitter.splitDocuments(docs);
        trace = `${chunks.length} document chunks generated`;

        const sendData = (data: string) => {
          res.write(`data: ${data}\n\n`);
        };

        // eslint-disable-next-line @typescript-eslint/require-await
        const handleLLMNewToken = async (token: string, _?: boolean): Promise<void> => {
          sendData(JSON.stringify({ data: token }));
        };

        const model = new OpenAI({
          temperature: 0,
          maxTokens: 2000,
          modelName: 'gpt-3.5-turbo',
          callbackManager: allowStreaming
            ? CallbackManager.fromHandlers({
                handleLLMNewToken,
              })
            : undefined,
        });
        const template = `Redacta un resumen en formato markdown del siguiente texto:

"{text}"

RESUMEN:`;

        const prompt = new PromptTemplate({
          template,
          inputVariables: ['text'],
        });
        const chain = loadSummarizationChain(model, {
          prompt,
          combineMapPrompt: prompt,
          combinePrompt: prompt,
          type: 'map_reduce',
        });
        const result = (await chain.call({
          input_documents: docs,
        })) as { text: string };
        console.log(result.text);
        await fs.promises.writeFile(storePath, result.text);
        res.write(`data: ${JSON.stringify({ fullData: result.text })}\n\n`);
        res.status(200).end('');
      }
    } else {
      res.status(500).end('No hash provided');
    }
  } catch (ex) {
    console.error(ex);
    res.status(500).end('Error uploading');
  }
};

const handler = nextConnect().use(upload.single('file')).post(handleSummarization);

export default handler;
