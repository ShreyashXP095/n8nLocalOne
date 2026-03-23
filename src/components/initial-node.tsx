"use client"

import type { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { memo , useState } from "react";
import { WorkflowNode } from "./workflow-node";
import { NodeSelector } from "./node-selector";


export const InitialNode = memo((props: NodeProps) =>{
    const [selectorOpen, setSelectorOpen] = useState(false);
    return (
        <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
            <WorkflowNode showToolbar={false} onSettings={()=>{}} onDelete={()=>{}}>
                <PlaceholderNode {...props} onClick={() => setSelectorOpen(true)}>
                    <div className="flex items-center justify-center cursor-pointer">
                        <PlusIcon className="size-4 text-primary"/>
                    </div>
                </PlaceholderNode>
            </WorkflowNode>
        </NodeSelector>
    )
})

InitialNode.displayName = "InitialNode";