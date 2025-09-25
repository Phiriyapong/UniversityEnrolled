import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const newsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    const news = await db.news.findMany({
      orderBy: { publishedAt: "desc" },
    });
    return news;
  }),
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const newsItem = await db.news.findUnique({
        where: { id: input.id },
      });
      if (!newsItem) {
        throw new Error("News item not found");
      }
      return newsItem;
    }),
  add: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        publishedAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newNews = await ctx.db.news.create({
        data: input,
      });
      return newNews;
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        content: z.string(),
        publishedAt: z.date(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const updatedNews = await db.news.update({
          where: { id: input.id },
          data: input,
        });
        return updatedNews;
      } catch (error) {
        throw new Error("Failed to update news");
      }
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.news.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),
});
