'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/model/user.models';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id?.toString() !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);
      if (refresh) {
        toast({
          title: 'Messages Refreshed',
          description: 'New messages await your discovery.',
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to fetch messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setIsLoading, setMessages, toast]);

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'Link Copied!',
      description: 'Share the secret code with others!',
    });
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 to-black min-h-screen flex flex-col items-center justify-center text-white font-mono transition-all">
      <div className="bg-gradient-to-r from-purple-700 to-indigo-900 p-12 md:p-16 rounded-lg shadow-2xl w-full max-w-5xl mt-20 space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-shadow-md">
          Unlock Your Hidden Path 🌒
        </h1>

        <div className="text-center">
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-80">
            Your journey into the unknown starts here. Unlock secrets and explore mysterious connections.
          </p>
        </div>

        <div className="mb-8 text-center">
  <h2 className="text-3xl font-bold text-shadow-lg mb-6 text-white">Your Personal Secret Code 🔮</h2>
  <div className="flex justify-center items-center gap-4 md:gap-8 mb-6">
    <input
      type="text"
      value={profileUrl}
      disabled
      className="input input-bordered bg-gray-800 text-white w-2/3 md:w-1/2 p-4 text-center text-xl font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
    />
    <Button
      onClick={copyToClipboard}
      className="bg-gradient-to-r from-purple-700 to-pink-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 text-white px-6 py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
    >
      ✨ Copy Link
    </Button>
  </div>
 </div>

 <div className="flex justify-between items-center mb-8 w-full px-12">
  {/* Switch */}
  <div className="flex items-center gap-4">
    <Switch
      {...register('acceptMessages')}
      checked={acceptMessages}
      onCheckedChange={handleSwitchChange}
      disabled={isSwitchLoading}
      className="bg-indigo-600 border-0 rounded-full transition duration-200 transform hover:scale-105"
    />
    <span className="text-xl text-white text-shadow-md">
      {acceptMessages ? 'Accept Messages: ON' : 'Accept Messages: OFF'}
    </span>
  </div>

  {/* Button */}
  <Button
    className="bg-gradient-to-r from-purple-700 to-pink-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 text-white px-6 py-3 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
    onClick={(e) => {
      e.preventDefault();
      fetchMessages(true);
    }}
  >
    {isLoading ? (
      <Loader2 className="h-5 w-5 animate-spin" />
    ) : (
      <RefreshCcw className="h-5 w-5" />
    )}
    <span className="ml-3 text-lg">Refresh</span>
  </Button>
</div>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={String(message._id)}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p className="text-center text-gray-400">No mysterious messages found yet...</p>
          )}
        </div>
      </div>

      {/* Floating Graphic */}
      <div className="absolute bottom-10 right-10">
        <div className="relative">
          <div className="w-36 h-36 rounded-full bg-gradient-to-br from-indigo-600 to-pink-500 animate-spin-slow"></div>
          <p className="absolute inset-0 flex justify-center items-center text-sm text-black font-bold">
            Secret Portal
          </p>
        </div>
      </div>
    </div>
  );
}
