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
import Image from "next/image";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import z from "zod";



const formSchema = z.object({
    variableName: z.string()
    .min(1 , {message: "Variable name is required"})
    .regex(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/ , {message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores"}),
    webhookUrl: z.string().min(1 , "Webhook URL is required"),
    content: z.string().min(1 , "Content is required")
    .max(40000,"Slack messages cannot exceed 40,000 characters"),
    username: z.string().optional()
})

export type SlackFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit : (values: SlackFormValues) => void;
    defaultValues?: Partial<SlackFormValues>;
}



export const SlackDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {


    const form = useForm<SlackFormValues>({
        defaultValues:{
            variableName: defaultValues.variableName || "",
            webhookUrl: defaultValues.webhookUrl || "",
            content: defaultValues.content || "",
            username: defaultValues.username || "",
        },
        resolver: zodResolver(formSchema),
    })

    useEffect(() =>{
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "",
                webhookUrl: defaultValues.webhookUrl || "",
                content: defaultValues.content || "",
                username: defaultValues.username || "",
            });
        }
    }, [open, defaultValues, form]);

    const watchVariableName = form.watch("variableName") || "mySlack";


    const handleSubmit = (values: SlackFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="wide">
                <DialogHeader>
                    <DialogTitle>Slack Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the Slack node.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}
                    className="mt-4 relative"
                    >
                        {/* Faded background watermark */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                            <Image
                            src="/logos/slack.svg"
                            alt=""
                            width={200}
                            height={200}
                            className="opacity-[0.04]"
                            />
                        </div>
                        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                            <div className="space-y-6">
                                <FormField
                                control={form.control}
                                name="variableName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Variable Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="mySlack" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                           Use this name to reference the result in other nodes: {`{{${watchVariableName}.messageContent}}`}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                 <FormField
                                control={form.control}
                                name="webhookUrl"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Webhook URL</FormLabel>
                                         <FormControl>
                                            <Input placeholder="https://hooks.slack.com/services/..." {...field} />
                                         </FormControl>
                                         <FormDescription>
                                            Get this from Slack: Apps → Incoming Webhooks → Add New Webhook to Workspace
                                         </FormDescription>
                                        <FormMessage /> 
                                    </FormItem>
                                )}
                                />
                                 <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Bot Username (Optional)</FormLabel>
                                         <FormControl>
                                            <Input placeholder="Slack Bot" {...field} />
                                         </FormControl>
                                         <FormDescription>
                                            The username to display for the bot.
                                         </FormDescription>
                                        <FormMessage /> 
                                    </FormItem>
                                )}
                                />
                            </div>
                            <div className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="content"   
                                    render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Message Content</FormLabel>
                                        <FormControl>
                                            <Textarea
                                            className="min-h-[200px] font-mono text-sm"
                                             placeholder= "Summary: {{myGemini.text}}"
                                             {...field} />
                                        </FormControl>
                                        <FormDescription> 
                                             The message to send. Use {"{{variable}}"} {` `} 
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
