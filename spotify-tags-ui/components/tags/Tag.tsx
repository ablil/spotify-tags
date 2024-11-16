import { TagWrapper } from "@/lib/types";
import { ButtonHTMLAttributes, FC } from "react";

type Props = TagWrapper & ButtonHTMLAttributes<HTMLButtonElement>;

const Tag: FC<Props> = ({ tag, selected, ...props  }) => {
  return (
    <button {...props} className="tag" data-selected={selected}>
      {tag}
    </button>
  );
};

export const TagInLoadingState: FC = () => {
  return <button className="tag loading"></button>;
};

export default Tag;
