import { Track } from "@/lib/types";
import React, { FC, useState } from "react";
import SpotifyTrack, { SpotifyTrackInLoadingState } from "./SpotifyTrack";

type Props = {
  tracks?: Array<Track>;
  selectedTags: Array<string>;
  onSelectTag?: (tag: string) => void;
};
const TracksTable: FC<Props> = ({ tracks, selectedTags, onSelectTag }) => {
  const [activeIndex, setActiveIndex] = useState<string | undefined>(); // Track currently playing audio

  const handlePlay = (index: string) => {
    setActiveIndex(index); // Set the active player index
  };

  if (tracks) {
    return (
      <div className="divide-y divide-zinc-800">
        <article className="hidden md:flex items-center gap-4 py-2 px-4">
          <div className="w-10"></div>
          <div style={{ width: "50px" }}></div>
          <div className="mx-4 w-72 capitalize">title</div>
          <div className="flex items-center gap-1 capitalize">tags</div>
        </article>
        {tracks.map((track, index) => (
          <SpotifyTrack
            onSelectTag={onSelectTag}
            index={index}
            selectedTags={selectedTags}
            onPlay={() => handlePlay(track.id)}
            isPlaying={activeIndex === track.id}
            track={track}
            key={track.id}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-800">
      <article className="flex items-center gap-4 py-2 px-4">
        <div style={{ width: "50px" }}></div>
        <div className="mx-4 w-72 capitalize">title</div>
        <div className="flex items-center gap-1 capitalize">tags</div>
      </article>
      <SpotifyTrackInLoadingState />
      <SpotifyTrackInLoadingState />
      <SpotifyTrackInLoadingState />
    </div>
  );
};

export default TracksTable;
