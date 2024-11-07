import CloseButton from "@/svgs/CloseButton";
import LoopIcon from "@/svgs/LoopIcon";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";

type Props = {
  onKeywordChange: (keyword: string) => void;
  placeholder?: string;
};

const SearchInput: FC<Props> = ({ onKeywordChange, placeholder }) => {
  const [keyword, setKeyword] = useState("");
  const [isExpanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOnChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setKeyword(evt.target.value);
    onKeywordChange(evt.target.value);
  };

  const toggle = () => {
    if (isExpanded) {
      setKeyword("");
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  };

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    } else {
      onKeywordChange("");
    }
  }, [isExpanded]);

  return (
    <div className="search-input" data-expanded={isExpanded}>
      <LoopIcon onClick={toggle} disabled={isExpanded} />
      <input
        ref={inputRef}
        onBlur={toggle}
        hidden={!isExpanded}
        type="text"
        placeholder={placeholder ?? "Search"}
        value={keyword}
        onChange={handleOnChange}
      />
      <CloseButton data-visible={keyword.length > 0} hidden={!isExpanded} onClick={toggle} />
    </div>
  );
};

export default SearchInput;
