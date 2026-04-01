"use client"

import { Node, NodeProps , useReactFlow} from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { GeminiDialog, GeminiFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchGeminiRealtimeToken } from "./actions";
import { GEMINI_CHANNEL_NAME } from "@/inngest/channels/gemini";

type GeminiNodeData = {
   variableName?: string;
   model?: string;
   systemPrompt?: string;
   userPrompt?: string;
   credentialId?: string;

}

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {

    const [dialogOpen , setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: GEMINI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchGeminiRealtimeToken,
    });

    const handleSubmit = (values: GeminiFormValues) => {
        setNodes((prevNodes) =>
        prevNodes.map((node) => {
            if (node.id === props.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        ...values,
                    },
                };
            }
            return node;
        })
        );
    }

    
    const handleSettings = () => {
        setDialogOpen(true);
    }

    const handleDoubleClick = () => {
        setDialogOpen(true);
    }

   const nodeData = props.data as GeminiNodeData;
   const description = nodeData?.model 
   ? `${nodeData.model || "gemini-1.5-flash"} : ${nodeData.userPrompt?.slice(0,50)}...`
   : "No model configured";


   return (
    <>
        <GeminiDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={handleSubmit}
           defaultValues={nodeData}
            />
        <BaseExecutionNode
         {...props}
          id={props.id}
          status={nodeStatus}
          name={"Gemini"}
          description={description}
          icon={"/logos/gemini.svg"}
          onSettings={handleSettings}
          onDoubleClick={handleDoubleClick}
          />

            
    </>
   )
})

GeminiNode.displayName = "GeminiNode";