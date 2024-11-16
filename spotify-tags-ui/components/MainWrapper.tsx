"use client";
import {
  Actions,
  loadAllTracksAction,
  useAppDispatch
} from "@/lib/store";
import { useCallback, useEffect } from "react";
import SearchInput from "./SearchInput";
import TagsFilters from "./tags/TagsFilters";
import TracksTable from "./tracks/TracksTable";

const TrackList = () => {
  const dispatcher = useAppDispatch();
  const searchByKeyword = useCallback((keyword: string) => dispatcher(Actions.filterByKeyword(keyword)), []);

  useEffect(() => {
    dispatcher(loadAllTracksAction());
  }, []);

  return (
    <div className="bg-zinc-900 p-4 md:m-4 rounded-md">
      <article className="center-h justify-end">
        <SearchInput onKeywordChange={searchByKeyword} placeholder="Search for a track" />
      </article>
      <TagsFilters />
      <TracksTable />
    </div>
  );
};


export default TrackList;
