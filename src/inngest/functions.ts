import prisma from "@/lib/db";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from "ai";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();



export const execute = inngest.createFunction(
  { id: "execute-ai" }, 
  { event: "execute/ai" }, 
  async ({ event, step }) => {
    const { steps : geministeps } = await step.ai.wrap("gemini-generate-text",
        generateText , {
            model: google("gemini-2.5-flash"),
            system: "You are a helpful assistant.",
            prompt: "what is the meaning of acquaitance ?",
        }
    );
    const { steps : openaisteps } = await step.ai.wrap("openai-generate-text",
        generateText , {
            model: openai("gpt-4.1") ,
            system: "You are a helpful assistant.",
            prompt: "what is the meaning of acquaitance ?",
        }
    );

    return {
        geministeps,
        openaisteps
    }
  },
);