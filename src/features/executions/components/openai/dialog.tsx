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
    "gpt-4o",
    "gpt-4o-mini",
    "gpt-4-turbo",
    "gpt-4",
    "gpt-3.5-turbo",
    "o1",
    "o1-mini",
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

export type OpenAIFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit : (values: OpenAIFormValues) => void;
    defaultValues?: Partial<OpenAIFormValues>;
}

export const OpenAIDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {

    const form = useForm<OpenAIFormValues>({
        defaultValues:{
            variableName: defaultValues.variableName || "",
            model: defaultValues.model || AVAILABLE_MODELS[0],
            systemPrompt: defaultValues.systemPrompt || "",
            credentialId: defaultValues.credentialId || "",
            userPrompt: defaultValues.userPrompt || "",
        },
        resolver: zodResolver(formSchema),
    })

    useEffect(() =>{
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "",
            model: defaultValues.model || AVAILABLE_MODELS[0],
            systemPrompt: defaultValues.systemPrompt || "",
            credentialId: defaultValues.credentialId || "",
            userPrompt: defaultValues.userPrompt || "",
            });
        }
    }, [open, defaultValues, form]);

    const watchVariableName = form.watch("variableName") || "myOpenAI";


    const handleSubmit = (values: OpenAIFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    }

    const { data: credentials
                ,isLoading: isLoadingCredentials
             } = useCredentialsByType(CredentialType.OPENAI)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="wide">
                <DialogHeader>
                    <DialogTitle>OpenAI Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the AI model and prompts for this node.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}
                    className="mt-4"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                            {/* Left column — config fields */}
                            <div className="space-y-6">
                                <FormField
                                control={form.control}
                                name="variableName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Variable Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="myOpenAI" {...field} />
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
                                        <FormLabel>OpenAI Credential</FormLabel>
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
                                                                    src="/logos/openai.svg"
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
                                {/* Faded logo watermark */}
                                <div className="flex-1 flex items-center justify-center pt-4 opacity-[0.07]">
                                    <Image
                                    src="/logos/openai.svg"
                                    alt=""
                                    width={120}
                                    height={120}
                                    className="pointer-events-none select-none"
                                    />
                                </div>
                            </div>

                            {/* Right column — prompt fields */}
                            <div className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="systemPrompt"   
                                    render={({field}) => (
                                    <FormItem>
                                        <FormLabel>System Prompt (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                            className="min-h-[100px] font-mono text-sm"
                                            
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
                                            className="min-h-[130px] font-mono text-sm"
                                            
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
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
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
