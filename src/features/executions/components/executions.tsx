"use client";

import { formatDistanceToNow } from "date-fns";

import { EmptyView, EntityContainer, EntityGridItem, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView, type ViewMode } from "@/components/entity-components";
import { useSuspenseExecutions } from "../hooks/use-executions"
import { useRouter } from "next/navigation";
import { useExecutionsParams } from "../hooks/use-executions-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Execution } from "@/generated/prisma/browser";
import { ExecutionStatus } from "@/generated/prisma/browser";
import Image from "next/image";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";

const VIEW_MODE_KEY = "nodeflow-executions-view";

function getInitialViewMode(): ViewMode {
    if (typeof window === "undefined") return "grid";
    try {
        const stored = localStorage.getItem(VIEW_MODE_KEY);
        if (stored === "list" || stored === "grid") return stored;
    } catch {}
    return "grid";
}

const viewModeAtom = atom<ViewMode>(getInitialViewMode());

function useViewMode(): [ViewMode, (mode: ViewMode) => void] {
    const [viewMode, setViewModeState] = useAtom(viewModeAtom);

    const setViewMode = useCallback((mode: ViewMode) => {
        setViewModeState(mode);
        try {
            localStorage.setItem(VIEW_MODE_KEY, mode);
        } catch {}
    }, [setViewModeState]);

    return [viewMode, setViewMode];
}


export const ExecutionsList = () =>{
    const executions = useSuspenseExecutions();
    const [viewMode] = useViewMode();

   return (
    <EntityList
    items={executions.data.items}
    getKey = {(execution) => execution.id}
    viewMode={viewMode}
    renderItem={(execution) => (
        viewMode === "grid" ? (
            <ExecutionGridItem key={execution.id} data={execution} />
        ) : (
            <ExecutionItem key={execution.id} data={execution} />
        )
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
    const [viewMode, setViewMode] = useViewMode();

    return (
       <EntityContainer 
       header = {<ExecutionsHeader />} 
       pagination = {<ExecutionsPagination />}
       viewMode={viewMode}
       onViewModeChange={setViewMode}
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

const getStatusColor = (status: ExecutionStatus) =>{
    switch(status){
        case ExecutionStatus.SUCCESS:
            return "from-green-500/15 via-green-500/8 to-emerald-500/10";
        case ExecutionStatus.FAILED:
            return "from-red-500/15 via-red-500/8 to-rose-500/10";
        case ExecutionStatus.RUNNING:
            return "from-blue-500/15 via-blue-500/8 to-indigo-500/10";
        default:
            return "from-primary/15 via-primary/8 to-accent/10";
    }
}

type ExecutionWithWorkflow = Execution & {
    workflow: {
        id: string;
        name: string;
    }
};

export const ExecutionItem = ({
   data,
}: {
   data: ExecutionWithWorkflow
}) => { 

    const duration = data.completedAt ?
    Math.round(
        (new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime()) / 60000 * 10
    ) / 10
    :  null;

    const subtitle = (
        <>
        {data.workflow.name} &bull; Started{" "}
        {formatDistanceToNow(data.startedAt, {addSuffix: true})}
        {duration !== null && ` • Took ${duration}m`}
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

export const ExecutionGridItem = ({
   data,
}: {
   data: ExecutionWithWorkflow
}) => { 

    const duration = data.completedAt ?
    Math.round(
        (new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime()) / 60000 * 10
    ) / 10
    :  null;

    const subtitle = (
        <>
        {data.workflow.name} &bull; Started{" "}
        {formatDistanceToNow(data.startedAt, {addSuffix: true})}
        {duration !== null && ` • Took ${duration}m`}
        </>
    )

    return (
        <EntityGridItem
        href={`/executions/${data.id}`}
        title={data.status}
        subtitle={subtitle}
        image={getStatusIcon(data.status)}
        className={`[&>div:first-child]:bg-gradient-to-br [&>div:first-child]:${getStatusColor(data.status)}`}
        />
    )
}