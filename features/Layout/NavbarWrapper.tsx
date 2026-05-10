"use client";

import Navbar from "./Navbar";
import NavbarLoggedIn from "./NavbarLoggedIn";

/**
 * Renders the appropriate navbar based on auth state.
 * Replace the logic below with your auth store (e.g. useAuthStore) when ready.
 */
export default function NavbarWrapper() {
  const isLoggedIn = false; 

  if (isLoggedIn) {
    return (
      <NavbarLoggedIn
        user={{
          name: "کاربر",
          avatar: "/default-avatar.png",
        }}
      />
    );
  }

  return <Navbar />;
}
