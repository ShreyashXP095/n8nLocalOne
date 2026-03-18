'use client'

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Client = () =>{
    const trpc = useTRPC();
    const {data : user} = useSuspenseQuery(trpc.getUsers.queryOptions())
    return (
        <div>
            Client Component : {JSON.stringify(user)}
        </div>
    )
};