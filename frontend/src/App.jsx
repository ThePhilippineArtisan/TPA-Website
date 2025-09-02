import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useRef, useState, useEffect } from "react";

import NavbarComponent from './Components/NavbarComponent.jsx';
import FirstFacade from './Components/FirstFacade.jsx';
import ReleasesFacade from './Components/ReleasesFacade.jsx';
// import RollingHeadlines from './Components/RollingHeadlines.jsx';
import SecondFacade from './Components/SecondFacade.jsx';
import MediaSegmentsFacade from './Components/MediaSegmentsFacade.jsx';
import Footer from './Components/Footer.jsx';



import ArticlePage from './Components/ArticlePage.jsx';
import MediaSegmentPage from './Components/MediaSegmentPage.jsx';

import TPACircleLogo from "./assets/Miniature_Icon_Version/TPACircleLogo.svg";
import RollingHeadlines from './Components/RollingHeadlines.jsx';

const App = () => {
  const homeRef = useRef(null);
  const releasesRef = useRef(null);
  const mediaRef = useRef(null);
  const newsRef = useRef(null);

  const scrollRefs = { homeRef, releasesRef, mediaRef, newsRef };

  // Loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
      <div className="app-wrapper" style = {{backgroundColor: '#e2e2e26c'}}>

    {loading ? (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffffff"
      }}>
        <style>
          {`
            @keyframes scale {
              0% { transform: scale(6); 
                    opacity: 100%; }
              25% { opacity: 75%; }
              50% { opacity: 100%; }
              75% { opacity: 75%; height: 0vh;}
              105% { transform: scale(1);
                     opacity: 100%;}
            }
            .loader-logo {
              width: 125px;
              height: 125px;
              animation: scale 1s ease-in;
            }
              span{
              lo
              }
              
          `}
        </style>
        <img src={TPACircleLogo} className="loader-logo" alt="Loading" />
      </div>
    ) : (

        <Router>

          <Routes>
            <Route
              path="/"
              element={
                <>
                  <NavbarComponent refs={scrollRefs} />
                  
                  <section ref={newsRef}>
                    <SecondFacade />
                  </section>

                  <section ref={homeRef}>
                    <FirstFacade />
                  </section>

                  <section ref={releasesRef}>
                    <ReleasesFacade />
                  </section>

                  <section ref={mediaRef}>
                    <MediaSegmentsFacade />
                  </section>

                  <Footer />

                </>
              }
            />

            <Route 
              path = "/Joseph-Brian-Balut"
              element = {
                <>
                  <NavbarComponent refs={scrollRefs} />
                  <RollingHeadlines />
                  <ArticlePage />
                  <Footer />
                </>
              }
            />

            <Route 
              path = "/Media-Segment-Page"
              element = {
                <>
                  <NavbarComponent refs={scrollRefs} />
                  <MediaSegmentPage />
                  <Footer />
                </>
              }
            />

              {/** <Route path = "/KalyoFinalists" element {< Name of the thing />} >/ */}

          </Routes>
        </Router>
      )}
    </div>
  );
};

export default App;
