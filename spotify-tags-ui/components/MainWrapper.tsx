"use client";
import {
  Actions,
  createPlaylistAction,
  hasAnyTagSelectedSelector,
  loadAllTracksAction,
  useAppDispatch,
} from "@/lib/store";
import { SortBy, SortDirection } from "@/lib/types";
import { FC, useEffect } from "react";
import TracksTable from "./tracks/TracksTable";
import TrackSearchInput from "./TrackSearchInput";
import { useSelector } from "react-redux";

type Props = {
  isPreviewMode: boolean;
};

const TrackList: FC<Props> = ({ isPreviewMode }) => {
  const dispatcher = useAppDispatch();
  const hasAnyTagsSelected = useSelector(hasAnyTagSelectedSelector);

  useEffect(() => {
    dispatcher(loadAllTracksAction(isPreviewMode));
  }, []);

  return (
    <div className="bg-zinc-900 p-4 md:m-4 rounded-md">
      <header className="flex items-center">
        <h1 className="text-white capitlize mb-4 mr-auto">Tracks</h1>
        <button
          className="btn"
          title="create playlist with all filtered tracks"
          onClick={() => dispatcher(createPlaylistAction("someting"))}
          hidden={!hasAnyTagsSelected}
        >
          create playlist
        </button>
        <TrackSearchInput className="mx-2" />
        <select
          name="sort"
          id="sort"
          className="select"
          onChange={(evt) => dispatcher(Actions.sortBy(evt.target.value as SortBy))}
        >
          <option value={SortBy.last_updated}>Sort by last updated</option>
          <option value={SortBy.title}>Sort by title</option>
          <option value={SortBy.artist}>Sort by artist</option>
        </select>
        <select
          name="sort_in"
          id="sort_direction"
          className="select"
          onChange={(evt) => dispatcher(Actions.sortIn(evt.target.value as SortDirection))}
        >
          <option value={SortDirection.desc}>desc</option>
          <option value={SortDirection.asc}>asc</option>
        </select>
      </header>
      <TracksTable />
    </div>
  );
};

export default TrackList;
