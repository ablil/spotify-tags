import { signOut } from "next-auth/react";
import React from "react";

const SignOutFromSpotify = () => {
  const handleSignout = () => {
    signOut({ callbackUrl: "/signin" });
    sessionStorage.removeItem("token");
  };
  return (
    <button className="btn" onClick={handleSignout}>
      sign out
    </button>
  );
};

export default SignOutFromSpotify;
