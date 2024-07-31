"use client";
import Header from "@/components/public/Header";
import RentalList from "@/components/public/RentalList";
import { useState } from "react";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} />
      <main>
        <RentalList />
      </main>
    </div>
  );
}
