import { NodeType } from "@/generated/prisma/enums";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { GoogleFormTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { stripeTriggerExecutor } from "@/features/triggers/components/stripe-trigger/executor";
import { geminiExecutor } from "../components/gemini/executor";
import { groqExecutor } from "../components/groq/executor";
import { openaiExecutor } from "../components/openai/executor";
import { discordExecutor } from "../components/discord/executor";
import { slackExecutor } from "../components/slack/executor";


export const executorRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.INITIAL]: manualTriggerExecutor,
    [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerExecutor,
    [NodeType.HTTP_REQUEST]: httpRequestExecutor, 
    [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
    [NodeType.GEMINI]: geminiExecutor,
    [NodeType.GROQ]: groqExecutor,
    [NodeType.ANTHROPIC]: geminiExecutor, 
    [NodeType.OPENAI]: openaiExecutor,
    [NodeType.DISCORD]: discordExecutor,
    [NodeType.SLACK]: slackExecutor,
    [NodeType.WHATSAPP]: discordExecutor,
    [NodeType.TELEGRAM]: discordExecutor,
    [NodeType.GMAIL]: discordExecutor,
}

export const getExecutor = (type: NodeType) : NodeExecutor =>{
    const executor = executorRegistry[type];
    if(!executor){
        throw new Error(`Executor not found for type: ${type}`);
    }
    return executor;
}