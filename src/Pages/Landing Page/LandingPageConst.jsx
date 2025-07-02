import React from 'react'
import Navbar from '../../components/LandingPage/Navbar'
import Hero from '../../components/LandingPage/Hero'
import Courses from '../../components/LandingPage/Courses'
import Features from '../../components/LandingPage/Features'
import Achivement from '../../components/LandingPage/Achivement'
import Categories from '../../components/LandingPage/Categories'
import Feedback from '../../components/LandingPage/Feedback'
import Cta from '../../components/LandingPage/Cta'
import Companies from '../../components/LandingPage/Companies'
import Footer from '../../components/LandingPage/Footer'
import { useState } from 'react'
import JsonData from '../../services/data.json'
import { useEffect } from 'react'
import '../../App.css'
import '../../index.css'

function LandingPageConst() {
    const [searchTerm, setSearchTerm] = useState("");
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);
  return (
    <div className='LandingPage'>
      <Navbar />
      <Hero  searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Courses searchTerm={searchTerm} />
      {/* <Features data={landingPageData.Features} /> */}
      {/* <Achivement />
      <Categories />
      <Feedback />
      <Cta />
      <Companies /> */}
      <Footer />  
    </div>
  )
}

export default LandingPageConst