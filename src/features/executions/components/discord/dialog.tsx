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
    .max(2000,"Discord messages cannot exceed 2000 characters"),
    username: z.string().optional()
})

export type DiscordFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit : (values: DiscordFormValues) => void;
    defaultValues?: Partial<DiscordFormValues>;
}



export const DiscordDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {


    const form = useForm<DiscordFormValues>({
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

    const watchVariableName = form.watch("variableName") || "myDiscord";


    const handleSubmit = (values: DiscordFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Discord Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the Discord node.
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
                                    <Input placeholder="myDiscord" {...field} />
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
                        name="webhookUrl"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Webhook URL</FormLabel>
                                 <FormControl>
                                    <Input placeholder="https://discord.com/api/webhooks/..." {...field} />
                                 </FormControl>
                                 <FormDescription>
                                    Get this from Discord: Channel Settings → Integrations → Webhooks → New Webhook
                                 </FormDescription>
                                <FormMessage /> 
                            </FormItem>
                        )}
                        />
                        <FormField
                            control={form.control}
                            name="content"   
                            render={({field}) => (
                            <FormItem>
                                <FormLabel> Message Content</FormLabel>
                                <FormControl>
                                    <Textarea
                                    className="min-h-[80px] font-mono text-sm"
                                    
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
                         <FormField
                        control={form.control}
                        name="username"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Bot Username (Optional)</FormLabel>
                                 <FormControl>
                                    <Input placeholder="Discord Bot" {...field} />
                                 </FormControl>
                                 <FormDescription>
                                    The username to display for the bot.
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
