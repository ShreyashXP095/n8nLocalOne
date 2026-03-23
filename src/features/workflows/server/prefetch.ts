import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch , trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.workflows.getMany>;

// prefetching all the workflows here

export const prefetchWorkflows = (params: Input) => {
   return prefetch(trpc.workflows.getMany.queryOptions(params));
}

// prefetching the single workflow here
export const prefetchWorkflow = (id: string) => {
    return prefetch(trpc.workflows.getOne.queryOptions({ id }));
}