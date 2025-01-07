"use client"

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import Link from "next/link";

export default function HomePage() {
  const { data: session } = useSession(); // Get the session data
  const router = useRouter(); // Hook for routing

  const handleRedirect = () => {
    // If the user is logged in, redirect to '/dashboard'
    if (session) {
      router.push('/dashboard');
    } else {
      // If the user is not logged in, redirect to '/sign-in'
      router.push('/sign-in');
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 to-black min-h-screen flex flex-col items-center justify-center text-white font-mono">
   

      {/* Main Content */}
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Uncover the Secrets 🌌
        </h2>
        <p className="mb-10 max-w-3xl text-lg md:text-xl mx-auto">
          Dive into the world of encrypted stories, secretive riddles, and hidden messages.
          Unravel mysteries left behind by anonymous users. Are you ready to decode the unknown?
        </p>

        {/* Button Section */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
        <Link href={'/sign-up'}>  <button
  
            className="px-6 py-3 bg-purple-700 hover:bg-purple-500 text-lg rounded shadow-md transition-all duration-200 transform hover:scale-105"
          >
            🗝️ Sign up & Explore
          </button></Link>
         <button
           onClick={handleRedirect}
           className="px-6 py-3 bg-pink-700 hover:bg-pink-500 text-lg rounded shadow-md transition-all duration-200 transform hover:scale-105"
         >
           🔒 Go to Dashboard
         </button>
        </div>
      </div>

      {/* Floating Graphic */}
      <div className="absolute bottom-8 right-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 animate-spin-slow"></div>
          <p className="absolute inset-0 flex justify-center items-center text-sm text-black font-bold">
            Secret World
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-xs opacity-80">
        <p>© 2025 Mystery Messages. Crafted with 🕶️ Secrets.</p>
      </footer>
    </div>
  );
}
