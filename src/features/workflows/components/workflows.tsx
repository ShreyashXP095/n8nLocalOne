"use client";

import { EntityContainer, EntityHeader } from "@/components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { toast } from "sonner";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { router } from "better-auth/api";
import { useRouter } from "next/navigation";


export const WorkflowsList = () =>{
    const workflows = useSuspenseWorkflows();

    return(
        <div className="flex-1 justify-center items-center flex">
            <p>
                {JSON.stringify(workflows.data , null , 2)}
            </p>
        </div>
    )
}

export const WorkflowsHeader  = ({disabled} : {disabled?: boolean}) =>{

    const createWorkflow = useCreateWorkflow();
    const router = useRouter();

    const {handleError , modal} = useUpgradeModal();

    const handleCreate = () =>{
        createWorkflow.mutate(undefined , {
            onError: (error) =>{
                handleError(error);
            },
            onSettled: (data) =>{
                router.push(`/workflows/${data?.id}`);
            }
        })
    }

    return (
        <>
        {modal}
        <EntityHeader
        title="Workflows"
        description="Create and manage your workflows"
        newButtonLabel="New Workflow"
        disabled={disabled}
        onNew={handleCreate}
        isCreating={createWorkflow.isPending}
        />
        </>
    )

}

export const WorkflowsContainer = ({children} : {children: React.ReactNode}) => {
    return (
       <EntityContainer 
       header = {<WorkflowsHeader />}
       search = {<></>}
       pagination = {<></>}
       >
        {children}
       </EntityContainer>
    )
}