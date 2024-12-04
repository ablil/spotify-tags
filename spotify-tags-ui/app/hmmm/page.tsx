'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { FormEventHandler, useState } from 'react'

const Page = () => {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [failed, setFailed] = useState(false)

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (evt) => { 
    evt.preventDefault()

    const response = await signIn('credentials', {
      callbackUrl: '/',
      redirect: false,
      password: password
    })

    if (response?.ok) {
      router.push('/')
    } else {
      setFailed(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='w-full h-screen flex flex-col items-center justify-center'>
      <h1 className='font-bold tracking-wide text-4xl my-4'>What&apos;s the catch phrase 🤔</h1>
      {failed && <h1 className='text-red-600'>Nuuuuh, that&apos;s the wrong one 😞</h1>}
      <input className='bg-transparent outline-none border-none' placeholder='type here' type="password" value={password} onChange={evt => setPassword(evt.target.value)} name="password" id="password" />
    </form>
  )
}

export default Page