"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserMenu from "./UserMenu";
import AuthButton from "./auth/AuthButton";

interface HeaderProps {
  isLoggedIn: boolean;
}

export default function Header({ isLoggedIn }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="text-2xl font-bold text-red-500">
                Paris Janitor
              </span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="hidden sm:block flex-grow max-w-md mx-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search for rentals..."
                className="w-full pl-10 pr-4"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-4">
            <Button variant="ghost" onClick={() => router.push("/rentals")}>
              Rentals
            </Button>
            <Button variant="ghost" onClick={() => router.push("/experiences")}>
              Experiences
            </Button>
          </nav>

          {/* Auth Button or User Menu */}
          <div>{isLoggedIn ? <UserMenu /> : <AuthButton />}</div>
        </div>
      </div>
    </header>
  );
}
