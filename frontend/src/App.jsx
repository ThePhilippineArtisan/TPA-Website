import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useRef, useState, useEffect } from "react";
import React, { Suspense, lazy } from 'react';

import AnimatedLoader from "./Components/AnimatedLoader.jsx";

const NavbarComponent = lazy (() => import('./Components/NavbarComponent.jsx'));
const FirstFacade = lazy (() => import('./Components/FirstFacade.jsx'));
const ReleasesFacade = lazy (() => import('./Components/ReleasesFacade.jsx'));
const SecondFacade = lazy (() => import('./Components/SecondFacade.jsx'));
const MediaSegmentsFacade = lazy (() => import('./Components/MediaSegmentsFacade.jsx'));
const Footer = lazy (() => import('./Components/Footer.jsx'));

const ArticlePage = lazy (() => import('./Components/ArticlePage.jsx'));
const MediaSegmentPage = lazy (() => import('./Components/MediaSegmentPage.jsx'));
const NewArticlePage = lazy (() => import('./Components/NewArticlePage.jsx'));

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
    <div className="app-wrapper" style = {{backgroundColor: '#e2e2e26c', scrollBehavior: 'smooth'}}>
    {loading ? (
      <AnimatedLoader />
    ) : (
        <Router>
          <Suspense>
            <Routes>
              <Route
                path = "/"
                element = {
                  <Suspense>
                  <>
                    <NavbarComponent refs={scrollRefs} />
                    <section ref={homeRef}>
                    </section>

                    <section ref={newsRef}>
                    <Suspense  >
                      <SecondFacade />
                    </Suspense>
                    </section>

                    <section>
                      <suspense  >
                      <FirstFacade />
                      </suspense>
                    </section>

                    <section ref={releasesRef}>
                    <Suspense  >
                      <ReleasesFacade />
                    </Suspense>
                    </section>
                    
                    <Suspense  >
                    <Footer />
                    </Suspense>
                  </>
                  </Suspense>
                }
              />

              <Route 
                path = "/Joseph-Brian-Balut"
                element = {
                  <Suspense>
                  <>
                    <NavbarComponent refs={scrollRefs} />
                    <ArticlePage />
                    <Footer />
                  </>
                  </Suspense>
                }
              />

              <Route 
                path = "/Media-Segment-Page"
                element = {
                  <Suspense>
                  <>
                    <NavbarComponent refs={scrollRefs} />
                    <MediaSegmentPage />
                    <Footer />
                  </>
                  </Suspense>
                }
              />

              <Route 
                path = "/About"
                element = {
                  <Suspense>
                  <>
                    <NavbarComponent refs={scrollRefs} />
                    <Footer/>
                  </>
                  </Suspense>
                }
              />

              <Route
                path = "/Create-Article-Page"
                element = {
                  <Suspense>
                  <>
                    <NavbarComponent refs = {scrollRefs} />
                    <NewArticlePage />
                    <Footer />
                  </>
                  </Suspense>
                }
              />
                {/** <Route path = "/KalyoFinalists" element {< Name of the thing />} >/ */}

          </Routes>
        </Suspense>
        </Router>
      )}
    </div>
  );
};

export default App;
