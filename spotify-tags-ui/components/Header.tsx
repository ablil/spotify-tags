"use client";
import { isPreviewModeSelector } from "@/lib/store";
import Logo from "@/svgs/Logo";
import { useSelector } from "react-redux";
import SignOutFromSpotify from "./SignOutFromSpotify";
import { useSession } from "next-auth/react";

const Header = () => {
  const isPreviewMode = useSelector(isPreviewModeSelector);
  const { status } = useSession();

  return (
    <article className="bg-zinc-900 p-4 m-4 rounded-md flex items-center justify-center">
      <div className="flex justify-center gap-2">
        <Logo />
        <h1>Spotify Tags</h1>
        {isPreviewMode && (
          <div className="py-2 px-20 bg-gray-100 text-black fixed -left-16" style={{ transform: "rotate(-45deg)" }}>
            preview mode
          </div>
        )}
        {status === "authenticated" && (
          <div className="absolute right-12">
            <SignOutFromSpotify />
          </div>
        )}
      </div>
    </article>
  );
};

export default Header;
