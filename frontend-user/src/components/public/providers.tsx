"use client";
import * as React from "react";
import { store } from "@/store";
import { Provider } from "react-redux";

export const Providers: React.FC = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};