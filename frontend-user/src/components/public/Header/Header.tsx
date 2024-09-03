"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UserMenu from "./UserMenu";
import AuthButton from "../auth/AuthButton";
import SearchBar from "@/components/public/Header/SearchBar";
import { useAuth } from "@/hooks/useAuth";
import { BadgeProps } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import SubscriptionDialog from "@/components/subscriptions/SubscriptionDialog";
import { authService } from "@/api/services/authService";
import { LandlordStatus, User } from "@/types";

export default function Header() {
  const router = useRouter();
  const { role } = useSelector((state: RootState) => state.auth);
  const { isLoading } = useAuth();
  const currentPath = usePathname();
  const [showNav, setShowNav] = useState(false);
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const isLinkActive = (path: string) => {
    return currentPath.startsWith(path);
  };

  useEffect(() => {
    setShowNav(true);
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const info = await authService.getUserInfo();
      setUserInfo(info);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const isLandlordPending = userInfo?.Landlord?.status === LandlordStatus.PENDING;
  const isTravelerFree = userInfo?.Traveler?.status === TravelerStatus.FREE;

  return (
      <header className="border-b fixed w-full bg-white shadow z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              {userInfo && showNav && (role === "LANDLORD" || role === "SERVICE_PROVIDER") ? (
                  <Link href="/dashboard">
                    <span className="text-2xl font-bold text-red-500">Paris Janitor</span>
                  </Link>
              ) : (
                  <Link href="/">
                    <span className="text-2xl font-bold text-red-500">Paris Janitor</span>
                  </Link>
              )}
            </div>

            {/* Search bar */}
            {currentPath === "/" && <SearchBar />}

            {/* Navigation */}
            {userInfo && showNav && (
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
                              variant={isLinkActive(link.path) ? "default" as BadgeProps['variant'] : "ghost" as BadgeProps['variant']}
                              onClick={() => router.push(link.path)}
                          >
                            {link.label}
                          </Button>
                      ))
                  )}
                </nav>
            )}

            {isLandlordPending && (
                <Button onClick={() => setIsSubscriptionDialogOpen(true)}>
                  Subscribe Now
                </Button>
            )}

            <SubscriptionDialog
                isOpen={isSubscriptionDialogOpen}
                onClose={() => setIsSubscriptionDialogOpen(false)}
            />

            {/* Auth Button or User Menu */}
            <div>{userInfo && showNav ? <UserMenu /> : <AuthButton />}</div>
          </div>
        </div>
      </header>
  );
}

// Helper functions remain the same
// Helper functions remain the same
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
        { path: "/my-reservations", label: "Reservations" },
      ];
    case "LANDLORD":
      return [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/my-properties", label: "My Properties" },
        { path: "/calendar", label: "Calendar" },
        { path: "/interventions", label: "Interventions" },
        { path: "/invoices", label: "Invoices" },
      ];
    case "SERVICE_PROVIDER":
      return [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/my-services", label: "My Services" },
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