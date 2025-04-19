import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Send } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Switch } from "./ui/switch";

interface SendMessageDialogProps {
  showMessage: boolean;
  displayName: string;
  setShowMessage: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SendMessageDialog({
  showMessage,
  setShowMessage,
  displayName,
}: SendMessageDialogProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async (message: string) => {
    const token = useAuth();
    try {
    } catch (error) {
      console.error(error);
      toast.error(
        `Error while sending message to ${displayName}. Please try again later.`
      );
    } finally {
      setIsLoading(false);
    }
  };

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
