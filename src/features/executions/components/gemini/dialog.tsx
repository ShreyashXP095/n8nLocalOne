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
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";
import Image from "next/image";

const AVAILABLE_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.5-flash-lite",
] as const;



const formSchema = z.object({
    variableName: z.string()
    .min(1 , {message: "Variable name is required"})
    .regex(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/ , {message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores"}),
    model: z.string().min(1 , "Model is required"),
    credentialId: z.string().min(1 , "Credential is required"),
    systemPrompt: z.string().optional(),
    userPrompt: z.string().min(1, "User prompt is required"),
})

export type GeminiFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit : (values: GeminiFormValues) => void;
    defaultValues?: Partial<GeminiFormValues>;
}



export const GeminiDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {

    const { data: credentials
        ,isLoading: isLoadingCredentials
     } = useCredentialsByType(CredentialType.GEMINI)

    const form = useForm<GeminiFormValues>({
        defaultValues:{
            variableName: defaultValues.variableName || "",
            model: defaultValues.model || AVAILABLE_MODELS[0],   
            credentialId: defaultValues.credentialId || "",
            systemPrompt: defaultValues.systemPrompt || "",
            userPrompt: defaultValues.userPrompt || "",
        },
        resolver: zodResolver(formSchema),
    })

    useEffect(() =>{
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "",
                model: defaultValues.model || AVAILABLE_MODELS[0],
                credentialId: defaultValues.credentialId || "",
                systemPrompt: defaultValues.systemPrompt || "",
                userPrompt: defaultValues.userPrompt || "",
            });
        }
    }, [open, defaultValues, form]);

    const watchVariableName = form.watch("variableName") || "myGemini";


    const handleSubmit = (values: GeminiFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Gemini Configuration</DialogTitle>
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
                                    <Input placeholder="myGemini" {...field} />
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
                                <FormLabel>Gemini Credential</FormLabel>
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
                                                            src="/logos/gemini.svg"
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
