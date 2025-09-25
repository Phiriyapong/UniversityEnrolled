import { postRouter } from "~/server/api/routers/post";
import { helloRouter } from "~/server/api/routers/hello";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { coursesRouter } from "~/server/api/routers/course";
import { newsRouter } from "~/server/api/routers/news";
import { editCourseRouter } from "./routers/editCourse";
import { availabilityRouter } from "./routers/availability";
import { assignCourseRouter } from "./routers/assignCourse";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  hello: helloRouter,
  courses: coursesRouter,
  news : newsRouter,
  editCourse : editCourseRouter,
  availability : availabilityRouter,
  assignCourse : assignCourseRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
