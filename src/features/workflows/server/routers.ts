import { createTRPCRouter, premimumProcedure, protectedProcedure } from "@/trpc/init";
import prisma from "@/lib/db";
import { generateSlug } from "random-word-slugs";
import { z } from "zod";


export const workflowsRouter = createTRPCRouter({
    create: premimumProcedure.mutation(({ctx}) => {
        return prisma.workflow.create({
            data: {
                name: generateSlug(3),
                userId: ctx.auth.user.id,
            }
        })
    }),
    remove: protectedProcedure
    .input(z.object({id: z.string()}))
    .mutation(({ctx, input}) => {
        return prisma.workflow.delete({
            where: {
                userId: ctx.auth.user.id,
                id: input.id,
            }
        })
    }),
    updateName: protectedProcedure
    .input(z.object({id: z.string(), name: z.string().min(1)}))
    .mutation(({ctx, input}) => {
        return prisma.workflow.update({
            where: {
                userId: ctx.auth.user.id,
                id: input.id,
            },
            data: {
                name: input.name,
            }
        })
    }),
    getOne: protectedProcedure
    .input(z.object({id: z.string()}))
    .query(({ctx, input}) => {
        return prisma.workflow.findUnique({
            where: {
                userId: ctx.auth.user.id,
                id: input.id,
            }
        })
    }),
    getMany: protectedProcedure.query(({ctx}) => {
        return prisma.workflow.findMany({
            where: {
                userId: ctx.auth.user.id,
            }
        })
    })
})