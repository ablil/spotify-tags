import Logo from "@/svgs/Logo";
import React from "react";

const Header = () => {
  return (
    <article className="bg-zinc-900 p-4 m-4 rounded-md flex items-center justify-center gap-2">
      <div className="text-lime-600">
        <Logo />
      </div>
      <h1>Spotify Tags</h1>
    </article>
  );
};

export default Header;
