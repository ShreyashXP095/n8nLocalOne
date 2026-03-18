

import { authClient } from "@/lib/auth-client";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import Logout from "@/app/Logout";

const page =  async () =>{

 await requireAuth();

 const data = await caller.getUsers();
return (
  <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
    protected server component
    <div className="border border-gray-300 p-4">
      {JSON.stringify(data , null , 2)}
    </div>
    <Logout/>
  </div>
)
}
export default page

// since prisma is not useful for scaling so we'll gonna user a trpc layer for acessing and managing the database
// trpc is a typescript framework that provides type-safe communication between the client and the server