"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GithubIcon, ChromeIcon } from "lucide-react";
import { login } from "@/api/user";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(username, password);
      router.push("/admin/dashboard");
    } catch (error) {
      setError("Invalid credentials");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-gray-400">
            Enter your credentials below to login to your account
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="text-black"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-black"
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          {/* {error && <p className="text-center text-red-500">{error}</p>} */}
          {/* <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full" disabled>
              <GithubIcon className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button variant="outline" className="w-full" disabled>
              <ChromeIcon className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div> */}
          {/* <Link
            href="#"
            className="inline-block w-full text-center text-sm underline"
            prefetch={false}
          >
            Don't have an account? Register
          </Link> */}
        </form>
      </div>
    </main>
  );
}
