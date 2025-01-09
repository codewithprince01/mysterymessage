'use client';

import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import React from "react";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function SendMessage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);

    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });
      toast({
        title: response.data.message,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data?.message ?? "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-800 to-black min-h-screen flex items-center justify-center px-4 py-8">
      <div className="bg-gradient-to-t from-black via-indigo-900 to-purple-800 rounded-lg shadow-lg max-w-lg w-full text-white p-6">
        <h1 className="text-4xl font-bold text-center mb-6">
          ✨ Send a Mystery Message ✨
        </h1>
        <p className="text-center text-lg opacity-80 mb-8">
          Unlock the mystery of your anonymous message and let someone
          experience a moment of surprise. Don’t worry, we’ve got your secrets
          safe.{" "}
          <span className="text-xl text-yellow-400 font-semibold">@{username}</span> won’t even know who it’s from!
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl text-gray-300">Your Message</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Write your mysterious message here..."
                      className="text-black bg-white placeholder-gray-400 p-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-600 transition-all w-full" // Increased padding and full width
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button
                  disabled
                  className="bg-pink-700 text-white py-3 px-6 rounded-lg text-lg flex items-center"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || !messageContent}
                  className="bg-pink-700 text-white py-3 px-6 rounded-lg text-lg transform hover:scale-105 transition-all duration-200"
                >
                  Send It 💌
                </Button>
              )}
            </div>
          </form>
        </Form>

        <div className="mt-8 text-center text-lg opacity-60">
          <p className="text-gray-200">Don’t let the world know who you are.</p>
          <p className="text-pink-400 mt-2 font-semibold">The secret will stay between you and the universe.</p>
        </div>
      </div>
    </div>
  );
}
