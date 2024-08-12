// Header.tsx
"use client";
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";
import {Bell, Search} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserMenu from "./UserMenu";
import AuthButton from "../auth/AuthButton";
import {useDispatch, useSelector} from "react-redux";
import { RootState } from "@/store/store";
import {authService} from "@/api/services/authService";
import {tokenUtils} from "@/api/config";
import {setCredentials} from "@/store/slices/authSlice";
import {useEffect, useState} from "react";
import SearchBar from "@/components/public/Header/SearchBar";



export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const role = useSelector((state: RootState) => state.auth.role);
  const currentPath = usePathname();

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
            {currentPath === "/" ? <SearchBar />:null}

            {/* Navigation */}
            {isAuthenticated && (
                <nav className="hidden md:flex space-x-4">
                  {(role === "LANDLORD" || role === "SERVICE_PROVIDER") && currentPath === "/" ? (
                      <Button
                          variant="ghost"
                          onClick={() => router.push(getDashboardPath(role))}
                      >
                        My Space
                      </Button>
                  ) : (
                      getNavLinks(role).map((link) => (
                          <Button
                              key={link.path}
                              variant="ghost"
                              onClick={() => router.push(link.path)}
                          >
                            {link.label}
                          </Button>
                      ))
                  )}
                </nav>
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
        { path: "/my-reservations", label: "Reservations" },
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