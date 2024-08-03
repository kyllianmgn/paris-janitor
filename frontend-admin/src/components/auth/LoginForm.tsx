"use client";
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { authService } from '@/api/services/authService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminLoginRequest } from '@/types';
import {useRouter} from "next/navigation";


export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const loginData: AdminLoginRequest = { username, password };
            await authService.loginAdmin(loginData, dispatch);
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            setError('Invalid login credentials');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
            </div>
        </form>
    );
}