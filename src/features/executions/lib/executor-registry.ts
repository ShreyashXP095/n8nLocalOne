import { NodeType } from "@/generated/prisma/enums";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { GoogleFormTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";


export const executorRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.INITIAL]: manualTriggerExecutor,
    [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerExecutor,
    [NodeType.HTTP_REQUEST]: httpRequestExecutor, // TODO: fix the type error
}

export const getExecutor = (type: NodeType) : NodeExecutor =>{
    const executor = executorRegistry[type];
    if(!executor){
        throw new Error(`Executor not found for type: ${type}`);
    }
    return executor;
}