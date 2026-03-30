import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { createGroq  } from '@ai-sdk/groq';
import Handlebars from "handlebars";
import { groqChannel } from "@/inngest/channels/groq";
import { toast } from "sonner";
import { generateText } from "ai";
import { date } from "zod";

Handlebars.registerHelper("json" , (context) => {
    const strigified = JSON.stringify(context, null ,2);
    const safeString = new Handlebars.SafeString(strigified);
    
    return safeString;
})

type GroqData = {
    variableName?: string;
    model?: string;
    systemPrompt?: string;
    userPrompt?: string;
}

export const groqExecutor: NodeExecutor<GroqData> = async ({
    data,
    nodeId , 
    context , 
    step,
    publish,
}) => {
    // TODO: Publish "loading" state for groq request
    await publish(
        groqChannel().status({
            nodeId,
            status: "loading",
        })
    );

    if(!data.variableName){
        await publish(
            groqChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("Variable name is required");
    }

    if(!data.userPrompt){
        await publish(
            groqChannel().status({
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

    const credentialValue = process.env.GROQ_API_KEY!;

    const groq = createGroq({
        apiKey: credentialValue,
    });

    try {
        const { steps } = await step.ai.wrap(
            "gemini-generate-text",
            generateText,
            {
               model: groq(data.model || "llama-3.3-70b-versatile"),
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
            groqChannel().status({
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
            groqChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw error;
    }

}