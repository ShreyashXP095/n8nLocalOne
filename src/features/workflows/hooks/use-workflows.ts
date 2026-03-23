

// hook to fetch all the workflows using suspense

import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();

    const [params] = useWorkflowsParams();

    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
} 


// function / hook to fetch workflows using useQuery

export const useCreateWorkflow = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    

    return useMutation(
        trpc.workflows.create.mutationOptions({
            onSuccess: (data) =>{
                toast.success(`Workflow created "${data.name}"`);
                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
            },
            onError: (error) => {
                toast.error(`Failed to create workflow: ${error.message}`);
            }
        })
    )
}   

export const useRemoveWorkflow = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    

    return useMutation(
        trpc.workflows.remove.mutationOptions({
            onSuccess: (data) =>{
                toast.success(`Workflow removed "${data.name}"`);
                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
                queryClient.invalidateQueries(trpc.workflows.getOne.queryOptions({ id: data.id }));
            },
            onError: (error) => {
                toast.error(`Failed to remove workflow: ${error.message}`);
            }
        })
    )   
}

// hook to fetch single workflow using suspense

export const useSuspenseWorkflow = (id: string) => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
}

// hook to update workflow name using useMutation

export const useUpdateWorkflowName = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    

    return useMutation(
        trpc.workflows.updateName.mutationOptions({
            onSuccess: (data) =>{
                toast.success(`Workflow name updated "${data.name}"`);
                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
                queryClient.invalidateQueries(trpc.workflows.getOne.queryOptions({ id: data.id }));
            },
            onError: (error) => {
                toast.error(`Failed to update workflow name: ${error.message}`);
            }
        })
    )
}   