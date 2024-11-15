import { Actions, useAppDispatch, useAppSelector } from "@/lib/store";
import { FC, useEffect, useRef } from "react";
import PlayOrPauseButton from "./PlayOrPauseButton";

const AudioPlayer: FC = () => {
  const dispatcher = useAppDispatch()

  const player = useAppSelector(state => state.player)

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (player.track) {
      audioRef.current = new Audio(player.track.metadata.preview_url)
      // Stop the audio when it ends naturally
      audioRef.current.onended = () => togglePlay(false);
      togglePlay(true)
    }
    return () => {
      audioRef.current?.pause()
    }
  }, [player.track])

  useEffect(() => {
    if (player.playing) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [player.playing]);

  const togglePlay = (playing?: boolean) => dispatcher(Actions.togglePlayer(playing))

  if (player.track) {
    return (
      <div className="sticky w-screen h-16 px-12 bottom-0 bg-black flex items-center justify-between">
        <div>
          <img className="mr-auto" src={player.track?.metadata.album.images[0].url} height={50} width={50} />
        </div>
        <div className="mx-4 w-72 text-center">
          <h1 className="tracking-tighter hover:underline" data-playing={player.playing} title="Open song on Spotify">
            <a href={player.track?.metadata.external_urls.spotify} target="_blank">
              {player.track?.metadata.name}
            </a>
          </h1>
          <p className="text-sm text-zinc-400" title="Open artist on spotify">
            {player.track?.metadata.artists.map((artist) => (
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
        <div className="flex items-center justify-center text-green-500">
          <PlayOrPauseButton isPlaying={player.playing} onClick={() => togglePlay()} />
        </div>
      </div>
    );
  }

  return null
};

export default AudioPlayer;
