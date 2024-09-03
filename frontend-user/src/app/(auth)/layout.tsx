"use client";
import AuthGuard from "@/components/public/auth/AuthGuard";
import React from "react";
import Header from "@/components/public/Header/Header";
import {Providers} from "@/components/public/providers";
import {useSelector} from "react-redux";
import {RootState} from "@/store";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const user = useSelector((state: RootState) => state.auth.user);

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