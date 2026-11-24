import { useState } from 'react'
import { Finale } from './components/Finale'
import { MusicToggle } from './components/MusicToggle'
import { GuideSection } from './components/GuideSection'
import { Hero } from './components/Hero'
import { MessageSection } from './components/MessageSection'
import { SessionSection } from './components/SessionSection'

export default function App() {
  const [openRequest, setOpenRequest] = useState(0)

  const openMessage = () => {
    document.getElementById('message')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setOpenRequest((n) => n + 1)
  }

  return (
    <>
      <main>
        <Hero onOpen={openMessage} />
        <MessageSection openRequest={openRequest} />
        <GuideSection />
        <SessionSection />
      </main>
      <Finale />
      <MusicToggle />
    </>
  )
}
