import React from 'react'
import image from './assets/gradient.png'
import Header from './Components/Header.jsx'
const App = () => {
  return (
    <main>
      <img className="absolute top-0 right-0 opacity-60 -z-10" src={image} alt="gradient" />
      <div className="h-0 w-360 absolute top-[20%] right-[-5%] shadow-[0_0_900px_20px_#e99b63] -rotate-30deg -z-10 "></div>
      <Header/>
    </main>
  )
}

export default App
