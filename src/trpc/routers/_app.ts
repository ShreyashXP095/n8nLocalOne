import { inngest } from '@/inngest/client';
import { createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/db';
export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(({ctx}) => {
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation( async ({ctx}) => {

    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "shryash@mail.com"
      },
    });

    return {success: true , message: "workflow created" }
  }),
  
});
// export type definition of API
export type AppRouter = typeof appRouter;