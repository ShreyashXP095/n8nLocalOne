"use client"

import { useState , useCallback, useMemo } from "react";
import {
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    ReactFlow,
    type Node,
    type Edge,
    type NodeChange,
    type EdgeChange,
    type Connection,
    Background,
    Controls,
    MiniMap,
    Panel,
    Position
} from "@xyflow/react";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";

import '@xyflow/react/dist/style.css';
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "@/components/add-node-button";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";
import { NodeType } from "@/generated/prisma/enums";
import { ExecuteWorkflowButton } from "./execute-workflow-button";

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


export const Editor = ({workflowId}: {workflowId: string}) => {
    const {data: workflow} = useSuspenseWorkflow(workflowId);

    const setEditor = useSetAtom(editorAtom);

    const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
    const [edges, setEdges] = useState<Edge[]>(workflow.edges);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((ns) => applyNodeChanges(changes, ns)),
        [setNodes]
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((es) => applyEdgeChanges(changes, es)),
        [setEdges]
    );

    const onConnect = useCallback(
        (params: Connection) => setEdges((es) => addEdge(params, es)),
        [setEdges]
    );

    const hasManualTrigger = useMemo(() => {
        return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
    }, [nodes]);

    return (
      <div className="size-full">
        <ReactFlow  
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          proOptions={{ hideAttribution: true }}
          nodeTypes={nodeComponents}
          fitView
          onInit={setEditor}
          snapGrid={[10,10]}
          snapToGrid
          panOnScroll
          panOnDrag={false}
          selectionOnDrag
        >
          <Background/>
          <Controls/>
          <MiniMap/>
          <Panel position= "top-right">
            <AddNodeButton/>
          </Panel>
          {hasManualTrigger && (
              <Panel position= "bottom-center">
              <ExecuteWorkflowButton workflowId={workflowId}/>
            </Panel>
          )}
        </ReactFlow>
      </div>
    );
}
