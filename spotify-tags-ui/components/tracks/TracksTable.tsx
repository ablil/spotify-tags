import { Track } from "@/lib/types";
import React, { FC, useEffect, useState } from "react";
import SpotifyTrack, { SpotifyTrackInLoadingState } from "./SpotifyTrack";
import { Actions, useAppDispatch, useAppSelector } from "@/lib/store";

type Props = {
  tracks?: Array<Track>;
  selectedTags: Array<string>;
  onSelectTag?: (tag: string) => void;
};
const TracksTable: FC<Props> = ({ tracks, selectedTags, onSelectTag }) => {
  const dispatcher = useAppDispatch()
  const player = useAppSelector(state => state.player)
  const [activeIndex, setActiveIndex] = useState<string | undefined>(); // Track currently playing audio

  const handlePlay = (track: Track) => {
    setActiveIndex(track.id); // Set the active player index
    dispatcher(Actions.playTrack(track))
  };

  useEffect(() => {
    if (player.playing) {
      setActiveIndex(player.track?.id)
    } else {
      setActiveIndex(undefined)
    }
  }, [player])

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
            onPlay={() => handlePlay(track)}
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
