'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function VerifyAccount() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: 'Verification Failed',
        description: axiosError.response?.data.message ?? 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-800 via-purple-800 to-blue-700">
      <div className="w-full max-w-sm p-6 space-y-5 bg-gray-900 rounded-xl shadow-lg text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-yellow-300">
            Enter the Mystery Realm ✨
          </h1>
          <p className="text-lg font-light mb-4 text-gray-300">
            Enter the verification code sent to your email and unlock your mystical journey.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter Your 6-digit Code"
                      className="bg-gray-800 px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className={`w-full py-3 px-6 rounded-lg text-white transition-all duration-300 ${
                form.formState.isSubmitting
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:scale-105 focus:ring-4 focus:ring-indigo-200'
              }`}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Please wait...
                </>
              ) : (
                'Verify'
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4 text-gray-300">
          <p>
            Remembered your credentials?{' '}
            <Link href="/sign-in" className="text-blue-400 hover:text-blue-600">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
