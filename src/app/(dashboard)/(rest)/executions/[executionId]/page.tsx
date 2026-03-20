import { requireAuth } from "@/lib/auth-utils";

interface Props {
    params: Promise<{executionId: string}>;
}

const Page = async ({params}: Props) =>{
    await requireAuth();
    const {executionId} = await params;
    return (
        <p>
            Execution id page! {executionId}
        </p>    
    );
}

export default Page;
