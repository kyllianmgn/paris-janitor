// Header.tsx
"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {Bell, Search} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserMenu from "./UserMenu";
import AuthButton from "./auth/AuthButton";
import {useDispatch, useSelector} from "react-redux";
import { RootState } from "@/store/store";
import {authService} from "@/api/services/authService";
import {tokenUtils} from "@/api/config";
import {DecodedToken, User} from "@/types";
import {setCredentials} from "@/store/slices/authSlice";
import {useEffect, useState} from "react";



export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const role = useSelector((state: RootState) => state.auth.role);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const isAuthenticated = await authService.checkAuth(dispatch);
        setIsAuthenticated(isAuthenticated);

        if (isAuthenticated) {
          const token = tokenUtils.getTokens();
          if (!token) {
            console.log("Authentifié mais pas de token");
            return;
          }
          tokenUtils.setTokens(token);
          dispatch(setCredentials(token));
          console.log("token");
          console.log(token);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };

    verifyAuth();
  }, [dispatch]);
  return (
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href={isAuthenticated ? getDashboardPath(role) : "/"}>
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
                        placeholder="Search for properties or services..."
                        className="w-full pl-10 pr-4"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>


            {/* Navigation */}
            {isAuthenticated && (
                <nav className="hidden md:flex space-x-4">
                  {getNavLinks(role).map((link) => (
                      <Button
                          key={link.path}
                          variant="ghost"
                          onClick={() => router.push(link.path)}
                      >
                        {link.label}
                      </Button>
                  ))}
                </nav>
            )}

            {/* Notifications */}
            {role !== "TRAVELER" && isAuthenticated && (
                <div className="ml-4">
                  <Button variant="ghost" className="relative">
                    <span className="sr-only">Notifications</span>
                    <Bell />
                  </Button>
                </div>
            )}

            {/* Auth Button or User Menu */}
            <div>{isAuthenticated ? <UserMenu /> : <AuthButton />}</div>
          </div>
        </div>
      </header>
  );
}

// Helper functions
function getDashboardPath(role: string | null) {
  switch (role) {
    case "TRAVELER":
      return "/";
    case "LANDLORD":
      return "/dashboard";
    case "SERVICE_PROVIDER":
      return "/dashboard";
    default:
      return "/";
  }
}

function getNavLinks(role: string | null) {
  switch (role) {
    case "TRAVELER":
      return [
        { path: "/rentals", label: "Properties" },
        { path: "/services", label: "Services" },
      ];
    case "LANDLORD":
      return [
        { path: "/my-properties", label: "My Properties" },
        { path: "/calendar", label: "Calendar" },
        { path: "/interventions", label: "Interventions" },
        { path: "/invoices", label: "Invoices" },
      ];
    case "SERVICE_PROVIDER":
      return [
        { path: "services", label: "My Services" },
        {
          path: "/calendar",
          label: "Calendar",
        },
        {
          path: "/interventions",
          label: "Interventions",
        },
        {
          path: "/invoices",
          label: "Invoices",
        },
      ];
    default:
      return [];
  }
}