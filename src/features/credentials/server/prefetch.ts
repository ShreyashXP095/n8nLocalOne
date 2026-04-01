import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch , trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.credentials.getMany>;

// prefetching all the credentials here

export const prefetchCredentials = (params: Input) => {
   return prefetch(trpc.credentials.getMany.queryOptions(params));
}

// prefetching the single credential here
export const prefetchCredential = (id: string) => {
    return prefetch(trpc.credentials.getOne.queryOptions({ id }));
}