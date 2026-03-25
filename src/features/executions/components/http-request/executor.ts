import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky , {type Options as KyOptions} from "ky";

type HttpRequestData = {
    variableName?: string;
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
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

    const result = await step.run("http-request" , async () =>{
        const endpoint = data.endpoint!;
        const method = data.method || "GET";

        const options: KyOptions = {
            method,
        }

        if(["POST", "PUT", "PATCH"].includes(method) ){
            // if(data.body){}
            options.body = data.body;
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
            body: responseData,
           }
        }
        if(data.variableName){
            return {
                ...context,
                [data.variableName]: responsePayload,
            }
        }
        // fallback for direct httprequest for backward compatibility
        return {
            ...context,
            ...responsePayload,
        }
       
    })
    

    // public sucdcess tate
    return result;
}