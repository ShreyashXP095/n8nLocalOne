"use client"

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const page = () =>{
    return (
        <div>
            <Button  className="w-full" onClick={async () => {
                await authClient.signOut();
            }}>
                Logout
            </Button>
        </div>
    )
}

export default page;