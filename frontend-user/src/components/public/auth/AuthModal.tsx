"use client";
import {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
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
    const [mode, setMode] = useState<"login" | "signup">(initialMode);

    useEffect(() => {
        setMode(initialMode);
    }, [initialMode]);

    const toggleMode = () => {
        setMode(mode === "login" ? "signup" : "login");
    };

    const handleClose = () => {
        setMode(initialMode);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "login" ? "Login" : "Sign Up"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "login"
                            ? "Enter your credentials to login"
                            : "Create your account"}
                    </DialogDescription>
                </DialogHeader>
                {mode === "login" ? (
                    <LoginForm onSignUpClick={toggleMode} onClose={onClose} />
                ) : (
                    <SignUpForm onLoginClick={toggleMode} onClose={onClose} />
                )}
            </DialogContent>
        </Dialog>
    );
}