import { Actions, useAppDispatch } from "@/lib/store";
import { FC, HTMLAttributes, useCallback } from "react";
import SearchInput from "./SearchInput";

const TrackSearchInput: FC<HTMLAttributes<HTMLDivElement>> = (props) => {
  const dispatcher = useAppDispatch();
  const searchByKeyword = useCallback((keyword: string) => dispatcher(Actions.filterByKeyword(keyword)), []);

  return (
    <div {...props}>
      <SearchInput onKeywordChange={searchByKeyword} placeholder="Search for a track" />
    </div>
  );
};

export default TrackSearchInput;
