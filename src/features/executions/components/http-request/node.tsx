"use client"

import { Node, NodeProps , useReactFlow} from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { HttpRequestDialog, HTTPRequestFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { HTTP_REQUEST_CHANNEL_NAME, httpRequestChannel } from "@/inngest/channels/http-request";
import { fetchHttpRequestRealtimeToken } from "./actions";

type HttpRequestNodeData = {
    variableName?: string;
    endpoint?: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: string;

}

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {

    const [dialogOpen , setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: HTTP_REQUEST_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchHttpRequestRealtimeToken,
    });

    const handleSubmit = (values: HTTPRequestFormValues) => {
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

   const nodeData = props.data as HttpRequestNodeData;
   const description = nodeData?.endpoint 
   ? `${nodeData.method || "GET"} : ${nodeData.endpoint}`
   : "No endpoint configured";


   return (
    <>
        <HttpRequestDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={handleSubmit}
           defaultValues={nodeData}
            />
        <BaseExecutionNode
         {...props}
          id={props.id}
          status={nodeStatus}
          name={"HTTP Request"}
          description={description}
          icon={GlobeIcon}
          onSettings={handleSettings}
          onDoubleClick={handleDoubleClick}
          />

            
    </>
   )
})

HttpRequestNode.displayName = "HttpRequestNode";