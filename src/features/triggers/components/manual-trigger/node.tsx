import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { MousePointerIcon } from "lucide-react";
import { BaseTriggerNode } from "../base-trigger-node";

export const ManualTriggerNode = memo((props: NodeProps) => {
    return (
        <BaseTriggerNode
        {...props}
        name="When Clicking 'Execute Workflow'"
        icon={MousePointerIcon}
        // status={nodeStatus}
        // onSettings={() => {}}
        // onDoubleClick={() => {}}
        />
    )
})