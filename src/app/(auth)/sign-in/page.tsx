'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInSchema } from '@/schemas/signInnSchema';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: 'Login Failed',
          description: 'Incorrect username or password',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    }

    if (result?.url) {
      router.replace('/');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-800 via-purple-800 to-blue-700">
      <div className="w-full max-w-sm p-6 space-y-5 bg-gray-900 rounded-xl shadow-lg text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-yellow-300">
          Enter the Mystery Realm
          </h1>
          <p className="text-lg font-light mb-4 text-gray-300">
          Log in to unlock new secrets and continue your mysterious journey! 
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input
                    {...field}
                    className="bg-gray-800 px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    {...field}
                    className="bg-gray-800 px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
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
                'Sign In'
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4 text-gray-300">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-400 hover:text-blue-600">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
