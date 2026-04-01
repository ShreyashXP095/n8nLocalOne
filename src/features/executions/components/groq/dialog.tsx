"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import z from "zod";
import { GeminiFormValues } from "../gemini/dialog";
import { useCredentialsByType, useSuspenseCredential } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";
import Image from "next/image";

const AVAILABLE_MODELS = [
    "llama-3.3-70b-versatile",
    "openai/gpt-oss-120b",
    "qwen/qwen3-32b",
    "groq/compound-mini",
    "llama-3.1-8b-instant",
    "moonshotai/kimi-k2-instruct-0905"
] as const;



const formSchema = z.object({
    variableName: z.string()
    .min(1 , {message: "Variable name is required"})
    .regex(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/ , {message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores"}),
    model: z.string().min(1 , "Model is required"),
    systemPrompt: z.string().optional(),
    credentialId: z.string().min(1 , "Credential is required"),
    userPrompt: z.string().min(1, "User prompt is required"),
})

export type GroqFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit : (values: GroqFormValues) => void;
    defaultValues?: Partial<GroqFormValues>;
}

export const GroqDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {

    const { data: credentials
            ,isLoading: isLoadingCredentials
         } = useCredentialsByType(CredentialType.GROQ)

    const form = useForm<GroqFormValues>({
        defaultValues:{
            variableName: defaultValues.variableName || "",
            model: defaultValues.model || AVAILABLE_MODELS[0],
            systemPrompt: defaultValues.systemPrompt || "",
            userPrompt: defaultValues.userPrompt || "",
            credentialId: defaultValues.credentialId || "",
        },
        resolver: zodResolver(formSchema),
    })

    useEffect(() =>{
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "",
            model: defaultValues.model || AVAILABLE_MODELS[0],
            systemPrompt: defaultValues.systemPrompt || "",
            userPrompt: defaultValues.userPrompt || "",
            credentialId: defaultValues.credentialId || "",
            });
        }
    }, [open, defaultValues, form]);

    const watchVariableName = form.watch("variableName") || "myGroq";


    const handleSubmit = (values: GeminiFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Groq Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the AI model and prompts for this node.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-8 mt-4"
                    >
                        <FormField
                        control={form.control}
                        name="variableName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Variable Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="myGroq" {...field} />
                                </FormControl>
                                <FormDescription>
                                   Use this name to reference the result in other nodes: {`{{${watchVariableName}.text}}`}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormField
                        control={form.control}
                        name="credentialId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Groq Credential</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingCredentials || credentials?.length === 0}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a credential" />
                                            </SelectTrigger>
                                        </FormControl>
                                            <SelectContent>
                                                {credentials?.map((credential) => (
                                                    <SelectItem key={credential.id} value={credential.id}>
                                                        <div className="flex items-center gap-2">
                                                            <Image
                                                            src="/logos/groq.svg"
                                                            alt={credential.name}
                                                            width={16}
                                                            height={16}
                                                            />
                                                        {credential.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                    </Select>
                                <FormDescription>
                                    Select the Credential to use.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormField
                        control={form.control}
                        name="model"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Model</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a model" />
                                            </SelectTrigger>
                                        </FormControl>
                                            <SelectContent>
                                                {AVAILABLE_MODELS.map((model) => (
                                                    <SelectItem key={model} value={model}>
                                                        {model}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                    </Select>
                                <FormDescription>
                                   Select the AI model to use.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                            control={form.control}
                            name="systemPrompt"   
                            render={({field}) => (
                            <FormItem>
                                <FormLabel>System Prompt (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                    className="min-h-[80px] font-mono text-sm"
                                    
                                     placeholder= "You are a helpful assistant."
                                     {...field} />
                                </FormControl>
                                <FormDescription> 
                                     Sets the behaviour of the assistant. Use {"{{variable}}"} {` `} 
                                      for simple values or {"{{json variable}}"} {` `} 
                                     to stringify objects.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                            control={form.control}
                            name="userPrompt"   
                            render={({field}) => (
                            <FormItem>
                                <FormLabel>User Prompt (Required)</FormLabel>
                                <FormControl>
                                    <Textarea
                                    className="min-h-[110px] font-mono text-sm"
                                    
                                     placeholder= "Summarize this text: {{json httpResponse.data}}"
                                     {...field} />
                                </FormControl>
                                <FormDescription> 
                                      The prompt to send to the AI . Use {"{{variable}}"} {` `} 
                                      for simple values or {"{{json variable}}"} {` `} 
                                     to stringify objects.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                 </Form>
            </DialogContent>
        </Dialog>
    )
}
