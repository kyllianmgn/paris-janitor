// UserMenu.tsx
"use client";
import {usePathname, useRouter} from "next/navigation";
import {User, Settings, LogOut, CircleUserRound} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logout } from "@/store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {Fragment} from "react";

export default function UserMenu() {
  const router = useRouter();
  const { user, role } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    console.log("Logging out...");
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
                <DropdownMenuItem onClick={() => router.push("/subscription")}>
                  <span>Subscription</span>
                </DropdownMenuItem>
              </>
          )}
          {role === "LANDLORD" && (
              <>
                <DropdownMenuItem onClick={() => router.push("/subscription")}>
                  <span>Subscription</span>
                </DropdownMenuItem>
              </>
          )}
          {role === "SERVICE_PROVIDER" && (
              <>
                <DropdownMenuItem onClick={() => router.push("/reviews")}>
                  <span>Reviews</span>
                </DropdownMenuItem>
              </>
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