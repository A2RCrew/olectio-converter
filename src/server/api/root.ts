import { createTRPCRouter } from "~/server/api/trpc";
import { embedding } from "~/server/api/routers/embedding";
import { gpt } from "./routers/gpt";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  embedding,
  gpt,
});

// export type definition of API
export type AppRouter = typeof appRouter;
