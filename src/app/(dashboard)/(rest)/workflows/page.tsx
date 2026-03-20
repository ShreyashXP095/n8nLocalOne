import { requireAuth } from "@/lib/auth-utils";

const Page = async () =>{

    await requireAuth();

    return (
        <p>
            Workflows page!
        </p>
    );
}

export default Page;
