import PauseButton from '@/svgs/PauseButton'
import PlayButton from '@/svgs/PlayButton'
import { ButtonHTMLAttributes, FC } from 'react'

type Props = {
  isPlaying?: boolean
}

const PlayOrPauseButton:FC<ButtonHTMLAttributes<HTMLButtonElement> & Props > = ({isPlaying, ...props}) => {

  if ( isPlaying  ) {
     return <PauseButton {...props} title="pause" />
  } else {
    return <PlayButton {...props} title="play song" />
  }
}

export default PlayOrPauseButton