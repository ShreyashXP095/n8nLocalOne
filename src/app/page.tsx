"use client"
import Logout from "@/app/Logout";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const page =  () =>{
 
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());

  const testAi = useMutation(trpc.testAi.mutationOptions(
    {
      onSuccess: () =>{
       toast.success("AI Test");
      }
    }
  ));

  const create = useMutation(trpc.createWorkflow.mutationOptions(
    {
      onSuccess: () =>{
       toast.success("Job Queued");
      }
    }
  )); 



return (
  <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
    protected server component
    <div className="border border-gray-300 p-4">
      {JSON.stringify(data , null , 2)}
    </div>
    <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>
      Test AI
    </Button>
    <Button disabled={create.isPending} onClick={() => create.mutate()}>
      Create Workflow
    </Button>
    <Logout/>
  </div> 
)
}
export default page

// since prisma is not useful for scaling so we'll gonna user a trpc layer for acessing and managing the database
// trpc is a typescript framework that provides type-safe communication between the client and the server