import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { slackChannel } from "@/inngest/channels/slack";
import { decode } from "html-entities";
import ky from "ky";

Handlebars.registerHelper("json" , (context) => {
    const strigified = JSON.stringify(context, null ,2);
    const safeString = new Handlebars.SafeString(strigified);
    
    return safeString;
})

type SlackData = {
    variableName?: string;
    webhookUrl?: string;
    content?: string;
    username?: string;
}

export const slackExecutor: NodeExecutor<SlackData> = async ({
    data,
    nodeId , 
    context , 
    step,
    publish,
}) => {
    await publish(
        slackChannel().status({
            nodeId,
            status: "loading",
        })
    );

   
    if(!data.content){
        await publish(
            slackChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("Content is required");
    }

    if(!data.variableName){
        await publish(
            slackChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("Variable name is required");
    }

    if(!data.webhookUrl){
        await publish(
            slackChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("Webhook URL is required");
    }
    
    const rawContent = Handlebars.compile(data.content)(context);
    const content = decode(rawContent);
    const username = data.username
    ? Handlebars.compile(data.username)(context)
    : undefined;
   

    try {
        const result = await step.run("slack-webhook" , async () =>{
            await ky.post(data.webhookUrl!, {
                json: {
                    text: content.slice(0 , 40000),
                    username
                }
            });
            
            return {
                ...context,
                [data.variableName!]:{
                    messageContent: content.slice(0 , 40000),
                }
            }
        });

        await publish(
            slackChannel().status({
                nodeId,
                status: "success",
            })
        )
        return result;
    } catch (error) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw error;
    }

}