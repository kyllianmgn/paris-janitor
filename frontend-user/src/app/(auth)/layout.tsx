import AuthGuard from "@/components/public/auth/AuthGuard";
import React from "react";
import Header from "@/components/public/Header/Header";
import {Providers} from "@/components/public/providers";
import {useAuth} from "@/hooks/useAuth";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const {isLandlordPending} = useAuth();
  return (
      <>
          <Providers>

              <AuthGuard>
                  {children}
              </AuthGuard>
          </Providers>
      </>
      );
}