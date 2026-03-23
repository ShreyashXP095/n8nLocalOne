"use client"

import { Node, NodeProps , useReactFlow} from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";

type HttpRequestNodeData = {
    endpoint?: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    [key: string]: unknown;
    body?: string;
}

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
   const nodeData = props.data as HttpRequestNodeData;
   const description = nodeData?.endpoint 
   ? `${nodeData.method || "GET"} : ${nodeData.endpoint}`
   : "No endpoint configured";

   return (
    <>
        <BaseExecutionNode
         {...props}
          id={props.id}
          name={"HTTP Request"}
          description={description}
          icon={GlobeIcon}
          onSettings={() => {}}
          onDoubleClick={() => {}}
          />
            
    </>
   )
})

HttpRequestNode.displayName = "HttpRequestNode";