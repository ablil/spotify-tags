import React, { ButtonHTMLAttributes, FC } from 'react'

const OptionsIcon:FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  return (
    <button {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
    </button>
  )
}

export default OptionsIcon