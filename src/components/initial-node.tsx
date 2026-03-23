"use client"

import type { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { memo , useState } from "react";
import { WorkflowNode } from "./workflow-node";


export const InitialNode = memo((props: NodeProps) =>{
    return (
        <WorkflowNode showToolbar={false} onSettings={()=>{}} onDelete={()=>{}}>
            <PlaceholderNode {...props} onClick={() =>{}}>
                <div className="flex items-center justify-center cursor-pointer">
                    <PlusIcon className="size-4 text-primary"/>
                </div>
            </PlaceholderNode>
        </WorkflowNode>
    )
})

InitialNode.displayName = "InitialNode";