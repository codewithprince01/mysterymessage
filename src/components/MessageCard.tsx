import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { ApiResponse } from '@/types/ApiResponse';
import { Message } from '@/model/user.models';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!message._id) {
      toast({
        title: 'Error',
        description: 'Message ID is missing',
        variant: 'destructive',
      });
      return;
    }

    setIsDeleting(true);
    try {
      // Check if message._id is valid before sending it
      const messageId = message._id.toString(); // Ensure it's a string

      const response = await axios.delete<ApiResponse>(`/api/delete-message/${messageId}`);
      console.log(`Message deleted: ${messageId}`);  // For debugging

      toast({
        title: response.data.message,
        description: 'The message has been successfully deleted.',
      });

      // Notify parent component to remove the deleted message from the UI
      onMessageDelete(messageId);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to delete the message',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={isDeleting}
                className={isDeleting ? 'cursor-not-allowed' : ''}>
                {isDeleting ? (
                  <span className="animate-spin h-5 w-5 border-2 border-t-transparent rounded-full" />
                ) : (
                  <X className="w-5 h-5" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
