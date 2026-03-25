import toposort from "toposort";
import { Connection , Node} from "@/generated/prisma/client";

export const topologicalSort = (
    nodes: Node[],
    connections: Connection[]
): Node[] =>{
    
    if(connections.length === 0){
        return nodes;
    }

    // create edges array for toposort
    const edges : [string , string][] = connections.map((conn) => [
        conn.fromNodeId,
        conn.toNodeId
    ]);

    // add nodes with no connections as self-edges to ensuret theya are includedd
    const connectedNodeIds = new Set<string>();
    for(const conn of connections){
        connectedNodeIds.add(conn.fromNodeId);
        connectedNodeIds.add(conn.toNodeId);
    }

    // add nodes that are not connected to anything
    for(const node of nodes){
        if(!connectedNodeIds.has(node.id)){
            edges.push([node.id , node.id]);
        }
    }

    // perform topological sort
    let sortedNodeIds: string[];
    try{
      sortedNodeIds = toposort(edges);
      // remove duplicates (from self-edges);
      sortedNodeIds = [...new Set(sortedNodeIds)];
    }catch(error){
       if(error instanceof Error && error.message.includes("Cyclic")){
        throw new Error("Workflow has a cycle");
       }
       throw error;
    }

    // map sorted ids back to node objects
    const nodeMap = new Map(nodes.map((n) => [n.id , n]));

    // return sorted nodes in the correct order
    return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
}