import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import Handlebars from "handlebars";
import { geminiChannel } from "@/inngest/channels/gemini";
import { toast } from "sonner";
import { generateText } from "ai";

Handlebars.registerHelper("json" , (context) => {
    const strigified = JSON.stringify(context, null ,2);
    const safeString = new Handlebars.SafeString(strigified);
    
    return safeString;
})

type GeminiData = {
    variableName?: string;
    model?: string;
    systemPrompt?: string;
    userPrompt?: string;
}

export const geminiExecutor: NodeExecutor<GeminiData> = async ({
    data,
    nodeId , 
    context , 
    step,
    publish,
}) => {
    // TODO: Publish "loading" state for gemini request
    await publish(
        geminiChannel().status({
            nodeId,
            status: "loading",
        })
    );

    if(!data.variableName){
        await publish(
            geminiChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("Variable name is required");
    }

    if(!data.userPrompt){
        await publish(
            geminiChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("User prompt is required");
    }

    const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant"; 

    const userPrompt = Handlebars.compile(data.userPrompt)(context);

    // TODO: Fetch the credentials of the users

    const credentialValue = process.env.GOOGLE_GENERATIVE_AI_API_KEY!;

    const google = createGoogleGenerativeAI({
        apiKey: credentialValue,
    });

    try {
        const { steps } = await step.ai.wrap(
            "gemini-generate-text",
            generateText,
            {
                model: google(data.model || "gemini-2.0-flash"),
               system: systemPrompt,
               prompt: userPrompt,
               experimental_telemetry: {
                isEnabled: true,
                recordInputs: true,
                recordOutputs: true,
               }
            },

        )

        const text = 
        steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

        await publish(
            geminiChannel().status({
                nodeId,
                status: "success",
            })
        )

        return {
            ...context,
            [data.variableName]:{
                text,
            }
        }
        
    } catch (error) {
        await publish(
            geminiChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw error;
    }

}