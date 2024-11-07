import { defaultContexMenuCallback } from "@/lib/misc";
import { ContextMenuCallbacks, Track } from "@/lib/types";
import { includesIgnoreCase } from "@/lib/utils";
import LabelIcon from "@/svgs/LabelIcon";
import MinusIcon from "@/svgs/MinusIcons";
import OptionsIcon from "@/svgs/OptionsIcon";
import PersonIcon from "@/svgs/PersonIcon";
import SongIcon from "@/svgs/SongIcon";
import { FC } from "react";
import { Item, Menu, Separator, useContextMenu } from "react-contexify";
import AudioPlayer from "./AudioPlayer";
import Tag, { TagInLoadingState } from "./Tag";

type Props = {
  track: Track;
  index: number;
  selectedTags: Array<string>;
  onSelectTag?: (tag: string) => void;
  isPlaying: boolean;
  onPlay: () => void;
};

const SpotifyTrack: FC<Props> = ({ track, onPlay, isPlaying, selectedTags, index, onSelectTag }) => {
  const cover = track.metadata.album.images[0];
  const artists = track.metadata.artists;

  return (
    <article className="flex items-center gap-4 py-2 md:px-4 group hover:bg-zinc-700 duration-300">
      <div className="w-10 hidden md:block group-hover:hidden">{index + 1}</div>
      <div className="w-10 hidden group-hover:block">
        <AudioPlayer onPlay={onPlay} isActive={isPlaying} audioUrl={track.metadata.preview_url} />
      </div>
      <div>
        <img src={cover.url} height={50} width={50} />
      </div>

      <div className="mx-4 w-72">
        <h1 className="tracking-tighter hover:underline" data-playing={isPlaying} title="Open song on Spotify">
          <a href={track.metadata.external_urls.spotify} target="_blank">
            {track.metadata.name}
          </a>
        </h1>
        <p className="text-sm text-zinc-400" title="Open artist on spotify">
          {artists.map((artist) => (
            <a
              key={artist.name}
              className="pr-1 hover:underline cursor-pointer"
              target="_blank"
              href={artist.external_urls?.spotify}
            >
              {artist.name}
            </a>
          ))}
        </p>
      </div>

      <div className="md:flex items-center gap-1 hidden">
        {track.tags.map((tag) => (
          <Tag
            onClick={() => onSelectTag && onSelectTag(tag)}
            tag={tag}
            key={tag}
            selected={includesIgnoreCase(selectedTags, tag)}
          />
        ))}
      </div>

      <div className="ml-auto">
        <TrackContextMenu callbacks={defaultContexMenuCallback} track={track} trackIndex={index} />
      </div>
    </article>
  );
};

type ContextMenuProps = {
  track: Track;
  trackIndex: number;
  callbacks?: ContextMenuCallbacks;
};

const TrackContextMenu: FC<ContextMenuProps> = ({ track, trackIndex, callbacks }) => {
  const trackId = track.id;
  const artistUrl = track.metadata.artists[0].external_urls.spotify;
  const songUrl = track.metadata.external_urls.spotify;
  const { show } = useContextMenu({ id: `track-menu-${trackIndex}` });

  return (
    <>
      <OptionsIcon onClick={(event) => show({ event })} />
      <Menu id={`track-menu-${trackIndex}`} theme="dark" className="contextmenu">
        <Item onClick={() => callbacks?.onDelete(trackId)}>
          <MinusIcon />
          <span className="menulabel">Delete this track</span>
        </Item>
        <Item onClick={() => callbacks?.onAddMoreTags(track)}>
          <LabelIcon />
          <span className="menulabel">Add more tags</span>
        </Item>
        <Separator />
        <Item>
          <PersonIcon />
          <a href={artistUrl} target="_blank" className="menulabel">
            Open artist on Spotify
          </a>
        </Item>
        <Item>
          <SongIcon />
          <a href={songUrl} target="_blank" className="menulabel">
            Open song on Spotify
          </a>
        </Item>
      </Menu>
    </>
  );
};

export const SpotifyTrackInLoadingState = () => {
  return (
    <article className="flex items-center gap-4 p-2 text-transparent">
      <div className="w-12 h-12 bg-zinc-600 rounded-md"></div>

      <div className="mx-4 w-72">
        <div className="center-h">
          <h1 className="tracking-tighter w-20 h-2 bg-zinc-600 rounded-full"></h1>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <TagInLoadingState />
        <TagInLoadingState />
        <TagInLoadingState />
      </div>
    </article>
  );
};

export default SpotifyTrack;
