"use client"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { generateGoogleFormScript } from "./utils";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = ({open, onOpenChange}: Props) => {

    const params = useParams();
    const workflowId = params.workflowId as string;

    // construct the webhook url
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const webhookUrl = `${baseUrl}${process.env.NODE_ENV === "development" ? "/" : ""}api/webhooks/google-form?workflowId=${workflowId}`;

    const copyToClipboard = async () => {
        try{
            navigator.clipboard.writeText(webhookUrl);
            toast.success("Webhook URL copied to clipboard");
        }catch(error){
            toast.error("Failed to copy webhook URL");
        }
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Google Form Trigger Configuration</DialogTitle>
                    <DialogDescription>
                       Use this webhook URL in your Google Form's Apps Script to trigger this workflow when a form is submitted.
                    </DialogDescription>
                </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="webhook-url">Webhook URL</Label>
                            <div className="flex gap-2">
                                <Input id="webhook-url" value={webhookUrl} readOnly className="font-mono text-sm" />
                                <Button
                                 onClick={copyToClipboard}
                                 size="icon"
                                 type="button"
                                 variant="outline"
                                 >
                                    <CopyIcon className="size-4"/>
                                </Button>
                            </div>
                        </div>
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h4 className="font-medium text-sm">Setup Instructions:</h4>
                            <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                                <li>Open your Google Form and click on the three dots in the top right corner.</li>
                                <li>Select "Script editor" to open the Apps Script editor.</li>
                                <li>Replace the default code with the following script:</li>
                                <li>Save and click "Trigger" → "Add Trigger"</li>
                                <li>Select "onFormSubmit" as the function to run.</li>
                                <li>Select "From form" → "On form submit" → Save.</li>
                            </ol>
                        </div>

                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h4 className="font-medium text-sm">Google Apps Script:</h4>
                            <Button
                            variant="outline"
                            type="button"
                            onClick={async () =>{
                                const sciprt = generateGoogleFormScript(webhookUrl);
                                try{
                                    await navigator.clipboard.writeText(sciprt);
                                    toast.success("Google Apps Script copied to clipboard");
                                }catch(error){
                                    toast.error("Failed to copy Google Apps Script");
                                }
                            }}
                            >
                            <CopyIcon className="size-4 mr-2"/>
                            Copy Google Apps Script
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                This Script includes your webhook URL and handles your submissions
                            </p>
                           
                        </div>
                        
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h4 className="font-medium text-sm">Available Variables</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{googleForm.respondentEmail}}"}
                                    </code>
                                    - Respondent Email
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{googleForm.responses['Question Name']}}"}
                                    </code>
                                    - Specific Question Answer
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{json googleForm.responses}}"}
                                    </code>
                                    - All Responses as JSON
                                </li>
                            </ul>
                        </div>
                        
                    </div>
            </DialogContent>
        </Dialog>
    )
}




