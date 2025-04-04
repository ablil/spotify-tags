import { Actions, useAppDispatch, useAppSelector } from "@/lib/store";
import { FC, useCallback, useEffect, useRef } from "react";
import PlayOrPauseButton from "./PlayOrPauseButton";

const AudioPlayer: FC = () => {
  const dispatcher = useAppDispatch()

  const player = useAppSelector(state => state.player)

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playOrPause = useCallback((playing?: boolean) => dispatcher(Actions.togglePlayer(playing)), [dispatcher])


  useEffect(() => {
    if (player.track) {
      audioRef.current = new Audio(player.track.metadata.preview_url)
      playOrPause(true)

      // Stop the audio when it ends naturally
      audioRef.current.onended = () => playOrPause(false);
    }
    return () => {
      audioRef.current?.pause()
    }
  }, [playOrPause, player.track])

  useEffect(() => {
    if (player.playing) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [player.playing]);


  if (player.track) {
    return (
      <div className="sticky w-full md:w-min h-16 rounded-full px-12 bottom-4 transform md:left-1/2 md:-translate-x-1/2 bg-white flex items-center justify-between text-black">
        <div className="flex items-center justify-center">
          <PlayOrPauseButton isPlaying={player.playing} onClick={() => playOrPause()} />
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

        <div>
          <img className="mr-auto" src={player.track?.metadata.album.images[0].url} height={50} width={50} />
        </div>
      </div>
    );
  }

  return null
};

export default AudioPlayer;
