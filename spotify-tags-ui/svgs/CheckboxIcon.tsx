import React, { ButtonHTMLAttributes, FC } from 'react'

const CheckboxIcon: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  return (
    <button {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"  className="size-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
    </button>
  )
}

export default CheckboxIcon