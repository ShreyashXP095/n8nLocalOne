"use client"

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";

export const EditorLoading = () => {
    return (
       <LoadingView message="Editor Loading..."/>
    );
}

export const EditorError = () => {
    return (
       <ErrorView message="Error Loading Workflow"/>
    );
}

export const Editor = ({id}: {id: string}) => {
    const {data: workflow} = useSuspenseWorkflow(id);
    return (
        <p>
            {JSON.stringify(workflow,null,2)}
        </p>
    );
}
