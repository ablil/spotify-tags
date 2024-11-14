import { ButtonHTMLAttributes, FC } from 'react'

const LoopIcon:FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  return (
    <button {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    </button>
  )
}

export default LoopIcon