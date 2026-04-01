import { InitialNode } from "@/components/initial-node";
import { GeminiNode } from "@/features/executions/components/gemini/node";
import { GroqNode } from "@/features/executions/components/groq/node";
import { OpenAINode } from "@/features/executions/components/openai/node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { GoogleFormTriggerNode } from "@/features/triggers/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";
import { StripeTriggerNode } from "@/features/triggers/components/stripe-trigger/node";
import { NodeType } from "@/generated/prisma/enums";
import { NodeTypes } from "@xyflow/react";
import { DiscordNode } from "@/features/executions/components/discord/node";
import { SlackNode } from "@/features/executions/components/slack/node";


export const nodeComponents: NodeTypes = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
    [NodeType.HTTP_REQUEST]: HttpRequestNode,
    [NodeType.GEMINI]: GeminiNode,
    [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
    [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
    [NodeType.GROQ]: GroqNode,
    [NodeType.OPENAI]: OpenAINode,
    [NodeType.DISCORD]: DiscordNode,
    [NodeType.SLACK]: SlackNode,
} as const satisfies NodeTypes;


export type RegisteredNodeTypes = keyof typeof nodeComponents;