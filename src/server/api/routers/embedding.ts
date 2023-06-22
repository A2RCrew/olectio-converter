import { z } from 'zod';
import { OpenAIEmbeddings } from 'langchain/embeddings';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import vectorStores from '~/server/data/vectorStores';

const embeddings = new OpenAIEmbeddings();

export const embedding = createTRPCRouter({
  exists: publicProcedure
    .input(z.object({ hash: z.string() }))
    .query(({ input }) => vectorStores.has(input.hash)),
  fromText: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ input }) => embeddings.embedQuery(input.text)),
});
