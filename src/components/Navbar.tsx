"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 p-4 shadow-lg text-white px-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-wider transition-transform hover:scale-105 "
        >
          Mystery Messages 💬
        </Link>

        {/* Center Greeting (Only Visible When Logged In) */}
        {session && (
          <div className="text-center hidden md:block">
            <div className="inline-block bg-purple-800 bg-opacity-50 px-6 py-2 rounded-full shadow-md">
              <span className="text-md font-semibold text-white tracking-wide">
                Welcome,{" "}
                <span className="text-yellow-300">
                  {user?.username
                    ? user.username.charAt(0).toUpperCase() +
                      user.username.slice(1)
                    : user?.email
                      ? user.email.charAt(0).toUpperCase() + user.email.slice(1)
                      : "Guest"}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Right Buttons */}
        <div className="flex items-center space-x-6">
          {/* Dashboard Button */}
          {session && (
            <Link href="/dashboard">
              <Button className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md">
                Dashboard
              </Button>
            </Link>
          )}

          {/* User Greeting or Login Button */}
          {session ? (
            <Button
              onClick={() => signOut()}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Logout
            </Button>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Centered Greeting */}
      {session && (
        <div className="md:hidden text-center mt-2 text-sm font-medium text-gray-100">
          Welcome, <strong>{user.username || user.email}</strong>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
