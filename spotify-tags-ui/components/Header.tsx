import { isPreviewModeSelector } from "@/lib/store";
import Logo from "@/svgs/Logo";
import { useSelector } from "react-redux";

const Header = () => {
  const isPreviewMode = useSelector(isPreviewModeSelector);

  return (
    <article className="bg-zinc-900 p-4 m-4 rounded-md flex items-center justify-center">
      <div className="flex justify-center gap-2">
        <Logo />
        <h1>Spotify Tags</h1>
        {isPreviewMode && (
          <div className="rounded-full capitalize bg-white text-black font-bold px-4 absolute right-12">
            preview mode
          </div>
        )}
      </div>
    </article>
  );
};

export default Header;
