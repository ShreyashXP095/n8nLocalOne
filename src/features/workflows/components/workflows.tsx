"use client";

import { formatDistanceToNow } from "date-fns";

import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components";
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { toast } from "sonner";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { router } from "better-auth/api";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Workflow } from "@/generated/prisma/client";
import { WorkflowIcon } from "lucide-react";

export const WorkflowsSearch = () =>{

    const [params , setParams] = useWorkflowsParams();
    const {searchValue , onSearchChange} = useEntitySearch({
        params,
        setParams,
        debounceMs: 500,
    })

    return (
        <EntitySearch
        value = {searchValue}
        onChange={onSearchChange}
        placeholder="Search workflows"
        />
    )
}


export const WorkflowsList = () =>{
    const workflows = useSuspenseWorkflows();

   return (
    <EntityList
    items={workflows.data.items}
    getKey = {(workflow) => workflow.id}
    renderItem={(workflow) => (
        <WorkflowItem key={workflow.id} data={workflow} />
    )}
    emptyView={<WorkflowsEmpty />}
    />
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
            onSuccess: (data) =>{
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

export const WorkflowsPagination = () => {
    const [params , setParams] = useWorkflowsParams();
    const workflows  = useSuspenseWorkflows();

    return (
        <EntityPagination
        disabled = {workflows.isFetching}
        page={workflows.data?.page}
        totalPages={workflows.data?.totalPages}
        onPageChange={(page) => setParams({...params , page})}
        />
    )
}
export const WorkflowsContainer = ({children} : {children: React.ReactNode}) => {
    return (
       <EntityContainer 
       header = {<WorkflowsHeader />}
       search = {<WorkflowsSearch />}
       pagination = {<WorkflowsPagination />}
       >
        {children}
       </EntityContainer>
    )
}


export const WorkflowsLoading = () => {
    return (
            <LoadingView
            entity="workflows"
            />
    )
}

export const WorkflowsError = () => {
    return (
            <ErrorView
            message="Failed to load workflows"
            />
    )
}

export const WorkflowsEmpty = () => {

    const createWorkflow = useCreateWorkflow();
    const { handleError , modal} = useUpgradeModal();
    const router = useRouter();

    const handleCreate = () =>{
        createWorkflow.mutate(undefined , {
            onError: (error) =>{
                handleError(error);
            },
            onSuccess: (data) =>{
                router.push(`/workflows/${data?.id}`);
            }
        })
    }

    return (
        <>
            {modal}
            <EmptyView
            message="Get Started by creating your first workflow"
            onNew={handleCreate}
            />
        </>
    )
}

export const WorkflowItem = ({
   data,
}: {
   data: Workflow
}) => {
    const removeWorkflow = useRemoveWorkflow();

    const handleRemove = () => {
        removeWorkflow.mutate({id: data.id})
    }
    return (


        <EntityItem
        key={data.id}
        href={`/workflows/${data.id}`}
        title={data.name}
        subtitle={
            <>
            Updated {formatDistanceToNow(data.updatedAt , {addSuffix: true})}{" "}
            &bull; Created{" "}
            {formatDistanceToNow(data.createdAt , {addSuffix: true})}
            </>
        }
        image = {
            <div className="size-8 flex items-center justify-center">
                <WorkflowIcon className="size-5 text-muted-foreground" />
            </div>
        }
        onRemove={handleRemove}
        isRemoving={removeWorkflow.isPending}
        />
    )
}