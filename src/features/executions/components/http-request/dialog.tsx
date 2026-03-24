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

const formSchema = z.object({
    endpoint: z.url({message: "Please enter a valid URL"}),
    method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
    body: z.string()
    .optional(),
    // .refine()
})

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit : (values: z.infer<typeof formSchema>) => void;
    defaultEndpoint?: string;
    defaultMethod?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    defaultBody?: string;
}

export const HttpRequestDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultEndpoint = "",
    defaultMethod = "GET",
    defaultBody = "",
}: Props) => {

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues:{
            endpoint: defaultEndpoint,
            method: defaultMethod,
            body: defaultBody,
        },
        resolver: zodResolver(formSchema),
    })

    useEffect(() =>{
        if (open) {
            form.reset({
                endpoint: defaultEndpoint,
                method: defaultMethod,
                body: defaultBody,
            });
        }
    }, [open, defaultEndpoint, defaultMethod, defaultBody, form]);

    const watchMethod = form.watch("method");
    const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    }

    useEffect(() => {
        if (open) {
            form.reset({
                endpoint: defaultEndpoint,
                method: defaultMethod,
                body: defaultBody,
            });
        }
    }, [open, defaultEndpoint, defaultMethod, defaultBody, form]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>HTTP Request</DialogTitle>
                    <DialogDescription>
                        Configure the HTTP Request.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-8 mt-4"
                    >
                        <FormField
                        control={form.control}
                        name="method"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Method</FormLabel>
                                <Select 
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a method" />
                                        </SelectTrigger>
                                    </FormControl>
                                        <SelectContent>
                                            <SelectItem value="GET">GET</SelectItem>
                                            <SelectItem value="POST">POST</SelectItem>
                                            <SelectItem value="PUT">PUT</SelectItem>
                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                            <SelectItem value="PATCH">PATCH</SelectItem>
                                        </SelectContent>
                                </Select>
                                <FormDescription>
                                    The method to use for the request.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="endpoint"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Endpoint</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://api.example.com/users/{{httpResponse.data.id}}" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Static URL or use {"{{variable}}"} for 
                                    simple values or {"{{json variable}}"} to
                                    stringify objects.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        {showBodyField && (
                            <FormField
                            control={form.control}
                            name="body"
                            render={({field}) => (
                            <FormItem>
                                <FormLabel> Request Body</FormLabel>
                                <FormControl>
                                    <Textarea
                                    className="min-h-[120px] font-mono text-sm"
                                    
                                     placeholder= {
                                        `{\n "userId": "{{httpResponse.data.id}}",\n "name": "{{httpResponse.data.name}}",\n "email": "{{httpResponse.data.email}}"\n}`
                                     } 
                                     {...field} />
                                </FormControl>
                                <FormDescription>
                                    JSON with template variables {"{{variable}}"}
                                     for simple values or {"{{json variable}}"} 
                                     to stringify objects.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        )}
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
