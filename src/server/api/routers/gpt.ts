import { z } from 'zod';
import { OpenAI } from 'langchain/llms';
import { ConversationalRetrievalQAChain } from 'langchain/chains';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import vectorStores from '~/server/data/vectorStores';
import createCorrectionEdit from '~/utils/createCorrectionEdit';
import createInsert from '~/utils/createInsert';

const model = new OpenAI({ modelName: 'gpt-4' });

export const gpt = createTRPCRouter({
  replyQuestion: publicProcedure
    .input(z.object({ question: z.string(), hash: z.string(), history: z.string().array()}))
    .mutation(async ({ input }) => {
      const vectorStore = vectorStores.get(input.hash);
      let result = '';
      if (vectorStore) {
        const chain = ConversationalRetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
        const chainResponse = await chain.call({
          question: input.question,
          chat_history: input.history,
        });
        result = (chainResponse as { text: string }).text;
      }
      return result;
    }),
  correctText: publicProcedure
    .input(z.object({ text: z.string()}))
    .mutation(async ({ input }) => {
      const result = createCorrectionEdit(input.text);
      return result;
    }),
  insertText: publicProcedure
    .input(z.object({ text: z.string()}))
    .mutation(async ({ input }) => {
      const result = createInsert(input.text);
      return result;
    }),
});
