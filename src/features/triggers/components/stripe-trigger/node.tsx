import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { StripeTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { STRIPE_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/stripe-trigger";
import { fetchStripeTriggerRealtimeToken } from "./actions";

export const StripeTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const nodeStatus = useNodeStatus({
        channel: STRIPE_TRIGGER_CHANNEL_NAME,
        nodeId: props.id,
        topic: "status",
        refreshToken: fetchStripeTriggerRealtimeToken,
    })

    const handleOpenSettings = () =>{
        setDialogOpen(true);
    }
    return (
        <>
        <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
       <BaseTriggerNode
        {...props}
        name="Stripe"
        icon="/logos/stripe.svg"
        description="When a Stripe event is received"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        />
        </>
    )
})