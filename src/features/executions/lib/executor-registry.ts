import { NodeType } from "@/generated/prisma/enums";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { GoogleFormTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { stripeTriggerExecutor } from "@/features/triggers/components/stripe-trigger/executor";
import { geminiExecutor } from "../components/gemini/executor";
import { groqExecutor } from "../components/groq/executor";


export const executorRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.INITIAL]: manualTriggerExecutor,
    [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerExecutor,
    [NodeType.HTTP_REQUEST]: httpRequestExecutor, 
    [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
    [NodeType.GEMINI]: geminiExecutor,
    [NodeType.GROQ]: groqExecutor,
    [NodeType.ANTHROPIC]: geminiExecutor, // TODO : Fix later
    [NodeType.OPENAI]: geminiExecutor, // TODO : Fix later
}

export const getExecutor = (type: NodeType) : NodeExecutor =>{
    const executor = executorRegistry[type];
    if(!executor){
        throw new Error(`Executor not found for type: ${type}`);
    }
    return executor;
}