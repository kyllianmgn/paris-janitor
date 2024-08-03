"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthModal from "./AuthModal";

export default function AuthButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const handleAuthClick = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setIsModalOpen(true);
  };

  return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Login / Sign Up</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => handleAuthClick("login")}>
              Login
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleAuthClick("signup")}>
              Sign Up
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AuthModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialMode={authMode}
        />
      </>
  );
}