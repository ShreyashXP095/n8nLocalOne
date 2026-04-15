"use client"
import { ExecutionStatus } from "@/generated/prisma/enums"
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDownIcon } from "lucide-react"
import { useSuspenseExecution } from "@/features/executions/hooks/use-executions"
import { exec } from "child_process"

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

const formatStatus = (status: ExecutionStatus) =>{
    return status.charAt(0) + status.slice(1).toLowerCase();
}

export const ExecutionView = ({
    executionId
}: {
    executionId: string;
}) => {
    const { data : execution} = useSuspenseExecution(executionId);
    const [showStackTrace , setShowStackTrace] = useState(false);

    const duration = execution.completedAt ?
    Math.round(
        (new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000
    )
    : null;

    return (
        <Card className="shadow-none">
            <CardHeader>
                <div className="flex items-center gap-3">
                    {getStatusIcon(execution.status)}
                    <div>
                        <CardTitle>
                            {formatStatus(execution.status)}
                        </CardTitle>
                        <CardDescription>
                            Execution for {execution.workflow.name}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid grid-cols-2  gap-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Workflow
                        </p>
                        <Link
                         prefetch
                         className="text-sm hoever:underline text-primary"
                         href={`/workflows/${execution.workflowId}`}>
                        {execution.workflow.name}
                        </Link>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Status
                        </p>
                        <p className="text-sm">{formatStatus(execution.status)}</p>
                    </div>
                    <div>

                        <p className="text-sm font-medium text-muted-foreground">
                            Started
                        </p>
                        <p className="text-sm">{formatDistanceToNow(new Date(execution.startedAt), {addSuffix: true})}</p>
                    </div>
                    {execution.completedAt ? (

                        <div>

                        <p className="text-sm font-medium text-muted-foreground">
                            Completed
                        </p>
                        <p className="text-sm">{formatDistanceToNow(new Date(execution.completedAt), {addSuffix: true})}</p>
                    </div>
                    ): null}
                    {execution.inngestEventId ? (

                        <div>

                        <p className="text-sm font-medium text-muted-foreground">
                            Inngest Event ID
                        </p>
                        <p className="text-sm">{execution.inngestEventId}</p>
                    </div>
                    ): null}
                </div>
                    {execution.error && (
                        <div className="mt-6 p-4 bg-red-50 rounded-md space-y-3">
                            <p className="text-sm font-medium text-red-900 mb-2">
                                Error
                            </p>
                            <p className="text-sm font-mono">{execution.error}</p>
                        </div>
                    )}
                    {execution.errorStack && (
                        <Collapsible
                        open={showStackTrace}
                        onOpenChange={setShowStackTrace}
                        className="w-full mt-6"
                        >
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-900 hover:bg-red-100">
                               {showStackTrace ? "Hide Stack Trace" : "Show Stack Trace"}
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 p-4 bg-red-50 rounded-md">
                            <pre className="text-xs font-mono text-red-800 overflow-auto mt-2 p-2 bg-red-100">{execution.errorStack}</pre>
                        </CollapsibleContent>
                        </Collapsible>
                    )}
                    {execution.output && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-md space-y-3">
                            <p className="text-sm font-medium text-blue-900 mb-2">
                                Output
                            </p>
                            <pre className="text-sm font-mono overflow-auto max-h-96 p-2 bg-blue-100 rounded">{JSON.stringify(execution.output, null, 2)}</pre>
                        </div>
                    )}
            </CardContent>

        </Card>
    )
}



