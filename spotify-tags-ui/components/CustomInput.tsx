import CloseButton from "@/svgs/CloseButton";
import LoopIcon from "@/svgs/LoopIcon";
import { ChangeEventHandler, FC, useEffect, useState } from "react";

type Props = {
  keyword: string;
  onKeyword: (keyword: string) => void;
  placeHolder?: string;
};

const CustomInput: FC<Props> = ({ keyword, onKeyword, placeHolder }) => {
  const [_keyword, setKeyword] = useState(keyword);

  const onChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setKeyword(evt.target.value);
    onKeyword(evt.target.value);
  };

  const onClear = () => {
    setKeyword("");
    onKeyword("");
  };

  useEffect(() => {
    setKeyword(keyword);
  }, [keyword]);

  return (
    <div className="center-h gap-2 p-1 bg-zinc-700">
      <LoopIcon />
      <input
        className="w-full outline-none border-none bg-transparent"
        type="text"
        placeholder={placeHolder ?? "Search"}
        value={_keyword}
        onChange={onChange}
      />
      <CloseButton data-visible={_keyword.length > 0} onClick={onClear} />
    </div>
  );
};

export default CustomInput;
