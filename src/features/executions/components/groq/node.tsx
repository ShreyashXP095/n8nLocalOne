"use client"

import { Node, NodeProps , useReactFlow} from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { GroqDialog, GroqFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchGroqRealtimeToken } from "./actions";
import { GROQ_CHANNEL_NAME } from "@/inngest/channels/groq";

type GroqNodeData = {
   variableName?: string;
   model?: string;
   systemPrompt?: string;
   userPrompt?: string;

}

type GroqNodeType = Node<GroqNodeData>;

export const GroqNode = memo((props: NodeProps<GroqNodeType>) => {

    const [dialogOpen , setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: GROQ_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchGroqRealtimeToken,
    });

    const handleSubmit = (values: GroqFormValues) => {
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

   const nodeData = props.data as GroqNodeData;
   const description = nodeData?.model 
   ? `${nodeData.model || "gemini-1.5-flash"} : ${nodeData.userPrompt?.slice(0,50)}...`
   : "No model configured";


   return (
    <>
        <GroqDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={handleSubmit}
           defaultValues={nodeData}
            />
        <BaseExecutionNode
         {...props}
          id={props.id}
          status={nodeStatus}
          name={"Groq"}
          description={description}
          icon={"/logos/groq.svg"}
          onSettings={handleSettings}
          onDoubleClick={handleDoubleClick}
          />

            
    </>
   )
})

GroqNode.displayName = "GroqNode";