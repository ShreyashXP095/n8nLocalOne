"use client"

import { Node, NodeProps , useReactFlow} from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { DiscordDialog,  DiscordFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchDiscordRealtimeToken } from "./actions";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord";

type DiscordNodeData = {
  webhookUrl?: string;
  content?: string;
  username?: string;

}

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {

    const [dialogOpen , setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: DISCORD_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchDiscordRealtimeToken,
    });

    const handleSubmit = (values: DiscordFormValues) => {
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

   const nodeData = props.data as DiscordNodeData;
   const description = nodeData?.content 
   ? `Send: ${nodeData.content?.slice(0,50)}...`
   : "Not configured";


   return (
    <>
        <DiscordDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={handleSubmit}
           defaultValues={nodeData}
            />
        <BaseExecutionNode
         {...props}
          id={props.id}
          status={nodeStatus}
          name={"Discord"}
          description={description}
          icon={"/logos/discord.svg"}
          onSettings={handleSettings}
          onDoubleClick={handleDoubleClick}
          />

            
    </>
   )
})

DiscordNode.displayName = "DiscordNode";