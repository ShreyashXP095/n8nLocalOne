

// hook to fetch all the workflows using suspense

import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { toast } from "sonner";

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.workflows.getMany.queryOptions());
} 


// function / hook to fetch workflows using useQuery

export const useCreateWorkflow = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    

    return useMutation(
        trpc.workflows.create.mutationOptions({
            onSuccess: (data) =>{
                toast.success(`Workflow created "${data.name}"`);
                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions());
            },
            onError: (error) => {
                toast.error(`Failed to create workflow: ${error.message}`);
            }
        })
    )
}   