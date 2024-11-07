import PauseButton from "@/svgs/PauseButton";
import PlayButton from "@/svgs/PlayButton";
import { FC, useEffect, useRef, useState } from "react";

type Props = {
  audioUrl: string;
  isActive: boolean;
  onPlay: () => void;
};

const AudioPlayer: FC<Props> = ({ audioUrl, isActive, onPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(audioUrl));

  useEffect(() => {
    if (isActive) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (!isPlaying) {
      onPlay(); // Notify parent to set this as the active player
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Stop the audio when it ends naturally
  useEffect(() => {
    audioRef.current.onended = () => setIsPlaying(false);
  }, []);

  return (
    <div>
      {isPlaying ? (
        <PauseButton title="pause" onClick={togglePlay} />
      ) : (
        <PlayButton title="play song" onClick={togglePlay} />
      )}
    </div>
  );
};

export default AudioPlayer;
