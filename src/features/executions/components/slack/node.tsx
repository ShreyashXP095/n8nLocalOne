"use client"

import { Node, NodeProps , useReactFlow} from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { SlackDialog, SlackFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchSlackRealtimeToken } from "./actions";
import { SLACK_CHANNEL_NAME } from "@/inngest/channels/slack";

type SlackNodeData = {
  webhookUrl?: string;
  content?: string;
  username?: string;

}

type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {

    const [dialogOpen , setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: SLACK_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchSlackRealtimeToken,
    });

    const handleSubmit = (values: SlackFormValues) => {
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

   const nodeData = props.data as SlackNodeData;
   const description = nodeData?.content 
   ? `Send: ${nodeData.content?.slice(0,50)}...`
   : "Not configured";


   return (
    <>
        <SlackDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={handleSubmit}
           defaultValues={nodeData}
            />
        <BaseExecutionNode
         {...props}
          id={props.id}
          status={nodeStatus}
          name={"Slack"}
          description={description}
          icon={"/logos/slack.svg"}
          onSettings={handleSettings}
          onDoubleClick={handleDoubleClick}
          />

            
    </>
   )
})

SlackNode.displayName = "SlackNode";