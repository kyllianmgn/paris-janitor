import { useState } from 'react';
import { useDispatch } from "react-redux";
import { authService } from '@/api/services/authService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginRequest } from '@/types';

interface LoginFormProps {
  onSignUpClick: () => void;
}

export default function LoginForm({ onSignUpClick }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const loginData: LoginRequest = { email, password };
      console.log(loginData);
      await authService.login(loginData, dispatch);
      // Handle successful login (e.g., redirect to dashboard)
    } catch (error) {
      setError('Invalid login credentials');
    }
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
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
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