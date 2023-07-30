import Quote from '@/components/Quote'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={`flex min-h-screen flex-col items-center justify-center xl:px-60 sm:px-36 p-8 ${inter.className}`}>
      <Quote />
    </main>
  )
}
