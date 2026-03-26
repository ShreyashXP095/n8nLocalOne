import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky , {type Options as KyOptions} from "ky";
import Handlebars from "handlebars";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { toast } from "sonner";

Handlebars.registerHelper("json" , (context) => {
    const strigified = JSON.stringify(context, null ,2);
    const safeString = new Handlebars.SafeString(strigified);
    
    return safeString;
})

type HttpRequestData = {
    variableName: string;
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: string;
}

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
    data,
    nodeId , 
    context , 
    step,
    publish,
}) => {
    // TODO: Publish "loading" state for http request
    await publish(
        httpRequestChannel().status({
            nodeId,
            status: "loading",
        })
    )

    if(!data.endpoint){
        await publish(
        httpRequestChannel().status({
            nodeId,
            status: "error",
        })
    )
        throw new NonRetriableError("HTTP-Request: Endpoint is required");
    }
    if(!data.variableName){
        await publish(
        httpRequestChannel().status({
            nodeId,
            status: "error",
        })
    )
        throw new NonRetriableError("HTTP-Request: Variable name is required");
    }
    if(!data.method){
        await publish(
        httpRequestChannel().status({
            nodeId,
            status: "error",
        })
    )
        throw new NonRetriableError("HTTP-Request: Method is required");
    }
    try{
    const result = await step.run("http-request" , async () =>{
        const endpoint = Handlebars.compile(data.endpoint)(context);
        const method = data.method ;

        const options: KyOptions = {
            method,
        }

        if(["POST", "PUT", "PATCH"].includes(method) ){
            // if(data.body){}
            const resolved = Handlebars.compile(data.body || "{}")(context);
            JSON.parse(resolved);
            options.body = resolved;
            options.headers = {
                "Content-Type": "application/json"
            }
        }

        const response = await ky(endpoint , options);
        const contentType = response.headers.get("content-type");

        const responseData = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

        const responsePayload = {
            httpResponse:{
            status: response.status,
            statusText: response.statusText,
            data: responseData,
           }
        }
       
        return {
            ...context,
            [data.variableName]: responsePayload,
        }
        
       
       
    })
    

    // publish success state
    await publish(
        httpRequestChannel().status({
            nodeId,
            status: "success",
        })
    )
    return result;
}catch(error){
    await publish(
        httpRequestChannel().status({
            nodeId,
            status: "error",
        })
    )
    throw error;
}
}