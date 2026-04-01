import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { createOpenAI } from '@ai-sdk/openai';
import Handlebars from "handlebars";
import { openaiChannel } from "@/inngest/channels/openai";
import { generateText } from "ai";
import prisma from "@/lib/db";

Handlebars.registerHelper("json" , (context) => {
    const strigified = JSON.stringify(context, null ,2);
    const safeString = new Handlebars.SafeString(strigified);
    
    return safeString;
})

type OpenAIData = {
    variableName?: string;
    model?: string;
    systemPrompt?: string;
    userPrompt?: string;
    credentialId?: string;
}

export const openaiExecutor: NodeExecutor<OpenAIData> = async ({
    data,
    userId,
    nodeId , 
    context , 
    step,
    publish,
}) => {
    await publish(
        openaiChannel().status({
            nodeId,
            status: "loading",
        })
    );

    if(!data.variableName){
        await publish(
            openaiChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("Variable name is required");
    }
    
    if(!data.credentialId){
        await publish(
            openaiChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("Credential is required");
    }

    if(!data.userPrompt){
        await publish(
            openaiChannel().status({
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
    const credential = await step.run("get-credential", () =>{
        return prisma.credential.findUnique({
            where: {
                id: data.credentialId,
                userId,
            }
        });
    });

    if(!credential){
        await publish(
            openaiChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("Credential not found");
    }


    const credentialValue = credential.value;

    const openai = createOpenAI({
        apiKey: credentialValue,
    });

    try {
        const { steps } = await step.ai.wrap(
            "openai-generate-text",
            generateText,
            {
               model: openai(data.model || "gpt-4o"),
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
            openaiChannel().status({
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
            openaiChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw error;
    }

}
