"use client";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut, CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import {useSelector} from "react-redux";
import {RootState} from "@/store";

export default function UserMenu() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user)
  const { role, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  let currentPath = usePathname();
  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUserRound className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          {role === "TRAVELER" && (
              <>
                <DropdownMenuItem onClick={() => router.push("/invoices")}>
                  <span>Invoices</span>
                </DropdownMenuItem>
              </>
          )}
          {role === "LANDLORD" && (<></>)}
          {role === "SERVICE_PROVIDER" && (
              <DropdownMenuItem onClick={() => router.push("/reviews")}>
                <span>Reviews</span>
              </DropdownMenuItem>
          )}
          {(role === "LANDLORD" || role === "SERVICE_PROVIDER") && currentPath !== "/" && (
              <DropdownMenuItem onClick={() => router.push("/")}>
                <span>Switch to Traveler Mode</span>
              </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );
}