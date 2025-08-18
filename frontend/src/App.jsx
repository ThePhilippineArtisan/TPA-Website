import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useRef, useState, useEffect } from "react";

import NavbarComponent from './Components/NavbarComponent.jsx';
import FirstFacade from './Components/FirstFacade.jsx';
import ReleasesFacade from './Components/ReleasesFacade.jsx';
// import RollingHeadlines from './Components/RollingHeadlines.jsx';
import SecondFacade from './Components/SecondFacade.jsx';
import MediaSegmentsFacade from './Components/MediaSegmentsFacade.jsx';
import Footer from './Components/Footer.jsx';

import TPACircleLogo from "./assets/Miniature_Icon_Version/TPACircleLogo.png";

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
        backgroundColor: "#0265A9"
      }}>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .loader-logo {
              width: 300px;
              height: 300px;
              animation: spin 1s linear infinite;
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
