import { signOut } from "next-auth/react";
import React from "react";

const SignOutFromSpotify = () => {
  return (
    <button
      className="bg-white font-bold px-4 rounded-full text-black hover:opacity-70 duration-300"
      onClick={() => signOut({ callbackUrl: "/signin" })}
    >
      sign out
    </button>
  );
};

export default SignOutFromSpotify;
