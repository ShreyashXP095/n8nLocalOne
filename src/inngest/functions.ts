
import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual_trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { geminiChannel } from "./channels/gemini";
import { discordChannel } from "./channels/discord";


export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow",
    retries: 0, // TODO: Remove in production
   }, 
  { event: "workflows/execute.workflow",
    channels: [httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      discordChannel(),
    ],
   }, 
  async ({ event, step , publish}) => {

    // first get to know that if you have data to starts with or not
    const workflowId = event.data.workflowId;
    if(!workflowId){
      throw new NonRetriableError("Workflow ID is required")
    }
   

    const sortedNodes = await step.run("prepare-workflow" , async () =>{
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId
        },
        include:{
          nodes:true,
          connections: true,
        }
      })


      
      return topologicalSort(workflow.nodes , workflow.connections);
    });

    const userId = await step.run("find-user-id" , async () =>{
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId
        },
        select:{
          userId:true,
        }
      })
      return workflow.userId;
    })

    // intitalise the context with any intital data form the trigger
    let context = event.data.initialData || {};

    // execute each node
    for(const node of sortedNodes){
      const executor = getExecutor(node.type as NodeType);

      context = await executor({
        data: node.data as Record<string,unknown>,
        nodeId: node.id,
        userId,
        context,
        step,
        publish,
      })
    }

    return { 
      workflowId,
      result: context,
     }


  },
);