import PauseButton from '@/svgs/PauseButton'
import PlayButton from '@/svgs/PlayButton'
import { ButtonHTMLAttributes, FC, MouseEventHandler, useEffect, useState } from 'react'

type Props = {
  isPlaying?: boolean
}

const PlayOrPauseButton:FC<ButtonHTMLAttributes<HTMLButtonElement> & Props > = ({isPlaying: playing, ...props}) => {
  const [isPlaying, setPlaying] = useState(false)

  useEffect(() => {
    setPlaying(playing ?? false)
  }, [playing])

  const handleOnClick: MouseEventHandler<HTMLButtonElement> = (evt) => { 
    setPlaying(old => !old)
    if (props.onClick) {
      props.onClick(evt)
    }
   }
  if ( isPlaying  ) {
     return <PauseButton {...props} title="pause" onClick={handleOnClick} />
  } else {
    return <PlayButton {...props} title="play song" onClick={handleOnClick} />
  }
}

export default PlayOrPauseButton