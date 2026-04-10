"use client";

import { formatDistanceToNow } from "date-fns";

import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseExecutions } from "../hooks/use-executions"
import { useRouter } from "next/navigation";
import { useExecutionsParams } from "../hooks/use-executions-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Execution } from "@/generated/prisma/browser";
import { ExecutionStatus } from "@/generated/prisma/browser";
import Image from "next/image";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";

                         


export const ExecutionsList = () =>{
    const executions = useSuspenseExecutions();

   return (
    <EntityList
    items={executions.data.items}
    getKey = {(execution) => execution.id}
    renderItem={(execution) => (
        <ExecutionItem key={execution.id} data={execution} />
    )}
    emptyView={<ExecutionsEmpty />}
    />
   )
}

export const ExecutionsHeader  = () =>{

    return (

        <EntityHeader
        title="Executions"
        description="View your workflow executions history"
        />
    )

}

export const ExecutionsPagination = () => {
    const [params , setParams] = useExecutionsParams();
    const executions  = useSuspenseExecutions();

    return (
        <EntityPagination
        disabled = {executions.isFetching}
        page={executions.data?.page}
        totalPages={executions.data?.totalPages}
        onPageChange={(page) => setParams({...params , page})}
        />
    )
}
export const ExecutionsContainer = ({children} : {children: React.ReactNode}) => {
    return (
       <EntityContainer 
       header = {<ExecutionsHeader />} 
       pagination = {<ExecutionsPagination />}
       >
        {children}
       </EntityContainer>
    )
}


export const ExecutionsLoading = () => {
    return (
            <LoadingView
            message="Loading executions..."
            />
    )
}

export const ExecutionsError = () => {
    return (
            <ErrorView
            message="Failed to load executions"
            />
    )
}

export const ExecutionsEmpty = () => {

    return (
    
            <EmptyView
            message="No executions found"
            />
    )
}

const getStatusIcon = (status: ExecutionStatus) =>{
    switch(status){
        case ExecutionStatus.SUCCESS:
            return <CheckCircle2Icon className="size-5 text-green-500" />
        case ExecutionStatus.FAILED:
            return <XCircleIcon className="size-5 text-red-500" />
        case ExecutionStatus.RUNNING:
            return <Loader2Icon className="size-5 text-blue-500 animate-spin" />
        default:
            return <ClockIcon className="size-5 text-muted-foreground"/>
    }
}

export const ExecutionItem = ({
   data,
}: {
   data: Execution & {
    workflow: {
        id:string;
        name:string;
    }
   }
}) => { 

    const duration = data.completedAt ?
    Math.round(
        (new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime()) / 1000
    )
    :  null;

    const subtitle = (
        <>
        {data.workflow.name} &bull; Started{" "}
        {formatDistanceToNow(data.startedAt, {addSuffix: true})}
        {duration !== null && ` • Took ${duration}s`}
        </>
    )
   

    return (


        <EntityItem
        key={data.id}
        href={`/executions/${data.id}`}
        title={data.status}
        subtitle= {subtitle}
        image = {
            <div className="size-8 flex items-center justify-center">
                {getStatusIcon(data.status)}
            </div>
        }
        />
    )
}