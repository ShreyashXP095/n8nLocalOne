import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleFormTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/google-form-trigger";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";

export const GoogleFormTrigger = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const nodeStatus = useNodeStatus({
        channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
        nodeId: props.id,
        topic: "status",
        refreshToken: fetchGoogleFormTriggerRealtimeToken,
    })

    const handleOpenSettings = () =>{
        setDialogOpen(true);
    }
    return (
        <>
        <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
       <BaseTriggerNode
        {...props}
        name="Google Form"
        icon="/logos/googleform.svg"
        description="When a Google Form is submitted"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        />
        </>
    )
})