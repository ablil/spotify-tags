"use client";
import { signIn } from "next-auth/react";

const SignInWithSpotify = () => {
  return (
    <button
      className="text-black bg-green-500 px-4 py-2 rounded-full font-bold duration-300 hover:opacity-70"
      onClick={() => signIn("spotify", { callbackUrl: "/" })}
    >
      sign in with Spotify
    </button>
  );
};

export default SignInWithSpotify;
