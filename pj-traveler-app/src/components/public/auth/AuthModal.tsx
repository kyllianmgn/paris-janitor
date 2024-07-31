"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import EmailForm from "./EmailForm";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: "login" | "signup";
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode,
}: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<"email" | "login" | "signup">("email");

  useEffect(() => {
    if (isOpen) {
      setMode("email");
    }
  }, [isOpen]);

  const handleEmailSubmit = async (submittedEmail: string) => {
    setEmail(submittedEmail);
    // Here you would check if the email exists in your database
    const emailExists = await checkEmailExists(submittedEmail);
    setMode(emailExists ? "login" : "signup");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "email"
              ? "Enter your email"
              : mode === "login"
              ? "Login"
              : "Sign Up"}
          </DialogTitle>
          <DialogDescription>
            {mode === "email"
              ? "Enter your email to continue"
              : mode === "login"
              ? "Enter your password to login"
              : "Create your account"}
          </DialogDescription>
        </DialogHeader>
        {mode === "email" && <EmailForm onSubmit={handleEmailSubmit} />}
        {mode === "login" && <LoginForm email={email} />}
        {mode === "signup" && <SignUpForm email={email} />}
      </DialogContent>
    </Dialog>
  );
}

// This function would need to be implemented to check if the email exists in your database
async function checkEmailExists(email: string): Promise<boolean> {
  // Implement your logic here
  return false;
}
