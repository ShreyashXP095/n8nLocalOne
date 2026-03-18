import { getQueryClient, trpc } from "@/trpc/server";
import { Client } from "./client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";



const page = async () =>{
 
const queryClient = getQueryClient();

void queryClient.prefetchQuery(trpc.getUsers.queryOptions());

return (
  <div className="min-h-screen min-w-screen flex items-center justify-center">
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <Client/>
      </Suspense>
    </HydrationBoundary>
  </div>
)
}
export default page

// since prisma is not useful for scaling so we'll gonna user a trpc layer for acessing and managing the database
// trpc is a typescript framework that provides type-safe communication between the client and the server