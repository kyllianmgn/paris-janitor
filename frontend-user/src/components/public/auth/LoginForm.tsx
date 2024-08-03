import { useState } from 'react';
import { useDispatch } from "react-redux";
import { authService } from '@/api/services/authService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginRequest } from '@/types';
import {useRouter} from "next/navigation";
import {store} from "@/store/store";

interface LoginFormProps {
  onSignUpClick: () => void;
  onClose: () => void;
}

export default function LoginForm({ onSignUpClick, onClose }: LoginFormProps ) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setError('');
    try {
      const loginData: LoginRequest = { email, password };
      console.log(loginData);
      await authService.login(loginData, dispatch);
      const {role} =store.getState().auth;
      switch (role) {
        case "LANDLORD":
          router.push("/dashboard/");
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
      console.log(error);
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