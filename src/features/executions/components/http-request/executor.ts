import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky , {type Options as KyOptions} from "ky";
import Handlebars from "handlebars";

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
    step
}) => {
    // TODO: Publish "loading" state for http request

    if(!data.endpoint){
        throw new NonRetriableError("HTTP-Request: Endpoint is required");
    }
    if(!data.variableName){
        throw new NonRetriableError("HTTP-Request: Variable name is required");
    }
    if(!data.method){
        throw new NonRetriableError("HTTP-Request: Method is required");
    }

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
    

    // public sucdcess tate
    return result;
}