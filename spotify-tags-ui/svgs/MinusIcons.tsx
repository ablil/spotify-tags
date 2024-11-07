import React, { ButtonHTMLAttributes, FC } from 'react'

const MinusIcon: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  return (
    <button {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
</svg>
    </button>
  )
}

export default MinusIcon