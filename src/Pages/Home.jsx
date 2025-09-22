import React from 'react'
import Header from '../component/Header'
import About from '../component/About'
import Discover from '../component/Discover'
import ReviewCarousel from '../component/Reviews'
import Contact from '../component/Contact'
import Footer from '../component/footer'

const Home = () => {
  return (
    <header>
      <Header/>
      <About/>
      <Discover/>
      <ReviewCarousel/>
      <Contact/>
      <Footer/>
      </header>
  )
}

export default Home