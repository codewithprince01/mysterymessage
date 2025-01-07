"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useDebounceCallback } from 'usehooks-ts'
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingMessage, setIsCheckingMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingMessage(true);
        setUsernameMessage(""); // Reset message while checking

        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingMessage(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);

      toast({
        title: "Account Created",
        description: response.data.message,
      });

      router.replace(`/verify/${data.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ??
        "Oops! Something went wrong. Please try again.";

      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-800 via-purple-800 to-blue-700">
      <div className="w-full max-w-sm p-6 space-y-5 bg-gray-900 rounded-xl shadow-lg text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-yellow-300">
            Start Your Adventure
          </h1>
          <p className="text-lg font-light mb-4 text-gray-300">
            Join the fun and send mysterious messages to the world!
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value); // Update username state
                    }}
                  />
                  <div className="flex items-center gap-2 mt-1">
                    {isCheckingMessage && (
                      <Loader2 className="animate-spin h-5 w-5 text-gray-500" />
                    )}
                    <p
                      className={`text-sm ${
                        usernameMessage === "Username is unique"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

<Button
  type="submit"
  className={`w-full py-3 px-6 rounded-lg text-white transition-all duration-300 ${
    isSubmitting
      ? "bg-gray-600 cursor-not-allowed"
      : "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:scale-105 focus:ring-4 focus:ring-indigo-200"
  }`}
  disabled={isSubmitting}
>
  {isSubmitting ? (
    <>
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      Please wait...
    </>
  ) : (
    "Sign Up"
  )}
</Button>

          </form>
        </Form>

        <div className="text-center mt-4 text-gray-300">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-400 hover:text-blue-600">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
