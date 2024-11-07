import { FC, HTMLAttributes } from 'react'

const CloseButton:FC<HTMLAttributes<HTMLButtonElement>> = (props) => {
  return (
    <button {...props}>

    <svg xmlns="http://www.w3.org/2000/svg" fill='none' viewBox="0 0 24 24" height={24} width={24} strokeWidth={1.5} stroke="currentColor" className="size-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
  
    </button>
  )
}

export default CloseButton