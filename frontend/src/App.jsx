import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { useRef } from "react"

import NavbarComponent from './Components/NavbarComponent.jsx'
import FirstFacade from './Components/FirstFacade.jsx'
import ReleasesFacade from './Components/ReleasesFacade.jsx'
import RollingHeadlines from './Components/RollingHeadlines.jsx'
import SecondFacade from './Components/SecondFacade.jsx'
import MediaSegmentsFacade from './Components/MediaSegmentsFacade.jsx'
import Footer from './Components/Footer.jsx'

const App = () => {
  const homeRef = useRef(null);
  const releasesRef = useRef(null);
  const mediaRef = useRef(null);
  const newsRef = useRef(null);

  const scrollRefs = { homeRef, releasesRef, mediaRef, newsRef};

  return(
    <div className = "app-wrapper" style = {{overflowX: 'hidden'}}>

    <Router>
      <NavbarComponent refs = {scrollRefs}
      />
      
      <Routes>
        <Route 
          path = "/" 
          element = {
            <>
            <section ref = {homeRef}>
              <FirstFacade />
            </section>
            
            <section ref = {releasesRef}>
              <ReleasesFacade />
            </section>

            <section ref = {mediaRef}>
              <MediaSegmentsFacade />
            </section>

            <section ref = {newsRef}>
              <SecondFacade />
            </section>
            </>
          }
          />

        {/** <Route path = "/KalyoFinalists" element {< Name of the thing />} >/ */}
          
      </Routes>
      <Footer />
    </Router>

    </div>
  )
}

export default App;