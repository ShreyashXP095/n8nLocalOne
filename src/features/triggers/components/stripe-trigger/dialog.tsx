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

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const StripeTriggerDialog = ({open, onOpenChange}: Props) => {

    const params = useParams();
    const workflowId = params.workflowId as string;

    // construct the webhook url
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;

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
                    <DialogTitle>Stripe Trigger Configuration</DialogTitle>
                    <DialogDescription>
                       Use this webhook URL in your Stripe Dashboard to trigger this workflow when a a payment event occurs.
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
                                <li>Open your Stripe Dashboard.</li>
                                <li>Go to Developers → Webhooks.</li>
                                <li>Click "Add endpoint".</li>
                                <li>Paste the Webhook URL provided above.</li>
                                <li>Select the events you want to trigger the workflow for (e.g., payment_intent.succeeded, checkout.session.completed).</li>
                                <li>Save and copy the signing secret.</li>
                            </ol>
                        </div>

                        
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h4 className="font-medium text-sm">Available Variables</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{stripe.raw.amount}}"}
                                    </code>
                                    - Payment amount
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{stripe.raw.currency}}"}
                                    </code>
                                    - Payment currency
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{stripe.raw.customer}}"}
                                    </code>
                                    - Payment customerID
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{json stripe}}"}
                                    </code>
                                    - Full event data as JSON
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{stripe.eventType}}"}
                                    </code>
                                    - Event type (e.g., payment_intent.succeeded)
                                </li>
                            </ul>
                        </div>
                        
                    </div>
            </DialogContent>
        </Dialog>
    )
}




