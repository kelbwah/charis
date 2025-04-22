"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface SendMessageDialogProps {
  showMessage: boolean;
  displayName: string;
  setShowMessage: (value: boolean) => void;
}

export function SendMessageDialog({
  showMessage,
  setShowMessage,
  displayName,
}: SendMessageDialogProps) {
  return (
    <Dialog open={showMessage} onOpenChange={setShowMessage}>
      <DialogContent className="bg-card border-primary/20">
        <DialogHeader>
          <DialogTitle>Send message</DialogTitle>
          <DialogDescription>
            Your words can provide comfort and strength to{" "}
            <span className="font-medium tracking-tight italic">
              {displayName}
            </span>
            .
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Write your message of encouragement..."
            className="min-h-32 resize-y border-primary/20"
          />
        </div>
        <div className="flex justify-between items-center gap-12 pb-3">
          <div className="flex flex-col gap-0.5">
            <p className="font-bold">Send anonymously</p>
            <p className="text-muted-foreground text-xs">
              Your name won't be shown with your message
            </p>
          </div>
          <Switch className="cursor-pointer" />
        </div>
        <DialogFooter>
          <Button
            disabled
            className="cursor-pointer"
            onClick={() => {
              setShowMessage(false);
              toast.success("Message sent", {
                description: `Your encouragement has been sent to ${displayName}.`,
              });
            }}
          >
            <Send className="mr-1 h-4 w-4" />
            Send message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
