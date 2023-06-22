import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import { type GenerateDocumentEmbeddingResponse } from '~/model/apiTypes';
import { PDFLoader } from 'langchain/document_loaders';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { HNSWLib } from 'langchain/vectorstores';
import vectorStores from '~/server/data/vectorStores';
import fs from 'node:fs';

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

// eslint-disable-next-line @typescript-eslint/require-await
const handlePost: HandlerFunction = async (req, res): Promise<void> => {
  try {
    const hash = req.query.hash as string;
    if (hash) {
      const storePath = `data/${hash}`;
      const storeDirInfoExists = fs.existsSync(storePath);
      if (storeDirInfoExists) {
        const vectorStore = await HNSWLib.load(storePath, new OpenAIEmbeddings());
        vectorStores.set(hash, vectorStore);
        const result: GenerateDocumentEmbeddingResponse = { success: true, message: 'OK' };
        result.message = `${vectorStore.embeddings.embedDocuments.length} documents loaded into HNSWLib database`;
        res.status(200).json(result);
      } else {
        const file = req.file;
        file.filename = `${hash}.pdf`;
        const result: GenerateDocumentEmbeddingResponse = { success: true, message: 'OK' };
        console.log(`File Path: ${file.originalname}`);
        const blob = new Blob([file.buffer], { type: 'application/pdf' });
        const loader = new PDFLoader(blob);
        console.log(`Loading document...`);
        const docs = await loader.load();
        let trace = `${docs.length} pages processed and transformed to text`;
        console.log(trace);
        result.message += `${trace}\n\n`;
        docs.forEach((doc) => (doc.metadata.pdf = undefined));
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 4096,
          chunkOverlap: 200,
        });
        const chunks = await textSplitter.splitDocuments(docs);
        trace = `${chunks.length} document chunks generated`;
        console.log(trace);
        result.message = `${trace}\n\n`;
        trace = `Appending ${chunks.length} chunks to index default`;
        console.log(trace);
        result.message += `${trace}\n\n`;
        const vectorStore = await HNSWLib.fromDocuments(chunks, new OpenAIEmbeddings());
        await vectorStore.save(storePath);
        vectorStores.set(hash, vectorStore);
        trace = `${chunks.length} chunks append to HNSWLib database`;
        result.message = `${trace}\n\n`;
        res.status(200).json(result);
      }
    } else {
      res.status(500).end('No hash provided');
    }
  } catch (ex) {
    console.error(ex);
    res.status(500).end('Error uploading');
  }
};

const handler = nextConnect().use(upload.single('file')).post(handlePost);

export default handler;
