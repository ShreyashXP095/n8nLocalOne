import type { NodeExecutor } from "@/features/executions/types";
import { manualTriggerChannel } from "@/inngest/channels/manual_trigger";

type ManualTriggerData = Record<string,unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
    nodeId , 
    context , 
    step,
    publish
}) => {
    // TODO: Publish "loading" state for manual trigger
    await publish(
        manualTriggerChannel().status({
            nodeId,
            status: "loading",
        })
    )
    const result = await step.run("manual-trigger" , async () => context);

    // public sucdcess tate
    await publish(
        manualTriggerChannel().status({
            nodeId,
            status: "success",
        })
    )
    return result;
}