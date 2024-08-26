import AuthGuard from "@/components/public/auth/AuthGuard";
import React from "react";
import Header from "@/components/public/Header/Header";
import {Providers} from "@/components/public/providers";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
      <>
        <Header />
          <Providers>
              <AuthGuard>
                  {children}
              </AuthGuard>
          </Providers>
      </>
      );
}