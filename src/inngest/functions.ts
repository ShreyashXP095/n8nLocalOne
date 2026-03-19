import prisma from "@/lib/db";
import { inngest } from "./client";


export const helloWorld = inngest.createFunction(
  { id: "hello-world" }, 
  { event: "test/hello.world" }, 
  async ({ event, step }) => {
    await step.sleep("fetcing", "5s");

    // fetching something
    await step.sleep("sending", "5s");

    await step.run("create-workflow" , () =>{
        return prisma.workflow.create({
            data: {
                name: "workflow_crerate-from-inngest"
            }
        });
    });
  },
);