import SignInWithSpotify from "@/components/SignInWithSpotify";
import Link from "next/link";
import React from "react";

const SignInPage = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-screen h-screen">
      <SignInWithSpotify />
      <p className="opacity-80">
        or check on{" "}
        <Link className="underline" href="/preview">
          preview mode
        </Link>
      </p>
    </div>
  );
};

export default SignInPage;
