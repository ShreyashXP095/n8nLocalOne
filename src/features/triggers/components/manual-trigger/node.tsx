import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { MousePointerIcon } from "lucide-react";
import { BaseTriggerNode } from "../base-trigger-node";
import { ManualTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual_trigger";
import { fetchManualTriggerRealtimeToken } from "./actions";

export const ManualTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: MANUAL_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchManualTriggerRealtimeToken,
    });

    const handleOpenSettings = () =>{
        setDialogOpen(true);
    }
    return (
        <>
        <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
       <BaseTriggerNode
        {...props}
        name="When Clicking 'Execute Workflow'"
        icon={MousePointerIcon}
        description="Manual Trigger Configuration"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        />
        </>
    )
})