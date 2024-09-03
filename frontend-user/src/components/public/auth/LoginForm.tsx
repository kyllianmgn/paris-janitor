import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginRequest } from '@/types';
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { store} from "@/store";
import {Eye, EyeOff} from "lucide-react";

interface LoginFormProps {
  onSignUpClick: () => void;
  onClose: () => void;
}

export default function LoginForm({ onSignUpClick, onClose }: LoginFormProps ) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const loginData: LoginRequest = { email, password };
      await login(loginData);
      const { role } = store.getState().auth;
      switch (role) {
        case "LANDLORD":
          router.push("/dashboard");
          break;
        case "TRAVELER":
          onClose();
          break;
        case "SERVICE_PROVIDER":
          router.push("/dashboard");
          break;
        default:
          onClose();
          break;
      }
    } catch (error) {
      console.error(error);
      setError('Invalid login credentials');
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>
          <div className="grid gap-2 relative">
            <Label htmlFor="password">Password</Label>
            <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
            />
            <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-11 transform -translate-y-1/2 p-2 focus:outline-none"
            >
              {showPassword ? (
                  <EyeOff className="h-5 w-5"/>
              ) : (
                  <Eye className="h-5 w-5"/>
              )}
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit">Login</Button>
          <Button type="button" variant="outline" onClick={onSignUpClick}>
            Don&apos;t have an account? Sign Up
          </Button>
        </div>
      </form>
  );
}