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
    variableName: z.string()
    .min(1 , {message: "Variable name is required"})
    .regex(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/ , {message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores"}),
    endpoint: z.string().min(1,{message: "Please enter a valid URL"}),
    method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
    body: z.string()
    .optional(),
    // .refine()
})

export type HTTPRequestFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit : (values: HTTPRequestFormValues) => void;
    defaultValues?: Partial<HTTPRequestFormValues>;
}

export const HttpRequestDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {

    const form = useForm<HTTPRequestFormValues>({
        defaultValues:{
            variableName: defaultValues.variableName || "",
            endpoint: defaultValues.endpoint || "",
            method: defaultValues.method || "GET",
            body: defaultValues.body || "",
        },
        resolver: zodResolver(formSchema),
    })

    useEffect(() =>{
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "",
                endpoint: defaultValues.endpoint || "",
                method: defaultValues.method || "GET",
                body: defaultValues.body || "",
            });
        }
    }, [open, defaultValues, form]);

    const watchVariableName = form.watch("variableName") || "myApiCall";
    const watchMethod = form.watch("method");
    const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

    const handleSubmit = (values: HTTPRequestFormValues) => {
        onSubmit(values);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="wide">
                <DialogHeader>
                    <DialogTitle>HTTP Request</DialogTitle>
                    <DialogDescription>
                        Configure the HTTP Request.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}
                    className="mt-4"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                            <div className="space-y-6">
                                <FormField
                                control={form.control}
                                name="variableName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Variable Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="myApiCall" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                           Use this name to reference the result in other nodes: {`{{${watchVariableName}.httpResponse.data}}`}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
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
                                        <FormLabel>Endpoint URL</FormLabel>
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
                            </div>
                            <div className="space-y-6">
                                {showBodyField && (
                                    <FormField
                                    control={form.control}
                                    name="body"
                                    render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Request Body</FormLabel>
                                        <FormControl>
                                            <Textarea
                                            className="min-h-[200px] font-mono text-sm"
                                            
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
                                {!showBodyField && (
                                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                        Select POST, PUT, or PATCH to add a request body.
                                    </div>
                                )}
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
