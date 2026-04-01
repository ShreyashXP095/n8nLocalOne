import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { toast } from "sonner";
import { useCredentialsParams } from "./use-credentials-params";
import { CredentialType } from "@/generated/prisma/enums";



// hook to fetch all the credentials using suspense
export const useSuspenseCredentials = () => {
    const trpc = useTRPC();

    const [params] = useCredentialsParams();

    return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));
} 


// function / hook to create credentials using useMutation

export const useCreateCredential = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    

    return useMutation(
        trpc.credentials.create.mutationOptions({
            onSuccess: (data) =>{
                toast.success(`Credential created "${data.name}"`);
                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
            },
            onError: (error) => {
                toast.error(`Failed to create credential: ${error.message}`);
            }
        })
    )
}   

// hook to remove a credential from the page

export const useRemoveCredential = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    

    return useMutation(
        trpc.credentials.remove.mutationOptions({
            onSuccess: (data) =>{
                toast.success(`Credential removed "${data.name}"`);
                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
                queryClient.invalidateQueries(trpc.credentials.getOne.queryOptions({ id: data.id }));
            },
            onError: (error) => {
                toast.error(`Failed to remove credential: ${error.message}`);
            }
        })
    )   
}

// hook to fetch single credential using suspense

export const useSuspenseCredential = (id: string) => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }));
}



// hook to update credential

export const useUpdateCredential = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    

    return useMutation(
        trpc.credentials.update.mutationOptions({
            onSuccess: (data) =>{
                toast.success(`Credential  "${data.name}" saved successfully`);
                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
                queryClient.invalidateQueries(trpc.credentials.getOne.queryOptions({ id: data.id }));
            },
            onError: (error) => {
                toast.error(`Failed to save credential: ${error.message}`);
            }
        })
    )
}   

// hook to fetch credentials by type

export const useCredentialsByType = (type: CredentialType) =>{
    const trpc = useTRPC();
    return useQuery(trpc.credentials.getByType.queryOptions({type}))
}