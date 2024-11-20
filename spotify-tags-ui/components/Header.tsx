import Logo from "@/svgs/Logo";

const Header = () => {
  return (
    <article className="bg-zinc-900 p-4 m-4 rounded-md flex items-center justify-center">
      <div className="flex gap-2">
        <Logo />
        <h1>Spotify Tags</h1>
      </div>

    </article>
  );
};

export default Header;
