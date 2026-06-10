import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import AnimatedLoader from "./Pages/AnimatedLoader.jsx";

const NavbarComponent = lazy(() => import('./Components/NavbarComponent.jsx'));
const Footer = lazy(() => import('./Components/Footer.jsx'));
const FirstFacade = lazy(() => import('./Pages/FirstFacade.jsx'));
const SecondFacade = lazy(() => import('./Pages/SecondFacade.jsx'));
const ArticlePage = lazy(() => import('./Pages/ArticlePage.jsx'));
const AboutPage = lazy(() => import('./Pages/AboutPage.jsx'));
const MediaSegmentPage = lazy(() => import('./Pages/MediaSegmentPage.jsx'));
const MediaSegmentArticle = lazy(() => import('./Pages/MediaSegmentArticle.jsx'));
const CreateArticlePage = lazy(() => import('./Pages/CreateArticlePage.jsx'));
const LatestPosts = lazy(() => import('./Pages/LatestPosts.jsx'));
const ReleasesPage = lazy(() => import('./Pages/ReleasesPage.jsx'));
const StaffProfilePage = lazy (() => import('./Pages/StaffProfile.jsx'))
const AdminLogInPage = lazy (() => import('./Pages/AdminPageLogIn.jsx'))

const MainLayout = () => {
  return (
    <>
      <NavbarComponent />
      
      <Suspense fallback={<AnimatedLoader />}>
        <main className="main-content">
          <Outlet />
        </main>
      </Suspense>
      
      <Footer />
    </>
  );
};

const HomePage = () => {
  const location = useLocation();

  const smoothScrollTo = (targetY, duration = 800) => {
    const startY = window.scrollY
    const difference = targetY - startY
    let startTime = null

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percent = Math.min(progress / duration, 1)
      
      const ease = percent < 0.5 
        ? 2 * percent * percent 
        : -1 + (4 - 2 * percent) * percent

      window.scrollTo(0, startY + difference * ease)

      if (progress < duration) {
        window.requestAnimationFrame(step)
      }
    }

    window.requestAnimationFrame(step)
  }

  return (
    <>
      <section id="home">
        <FirstFacade />
      </section>
      
      <section id="news">
        <SecondFacade />
      </section>
    </>
  );
};

const App = () => {
  return (
    <div className="app-wrapper">
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            
            <Route path="/" element={<HomePage />} />
            
            <Route path="/article/:articleId" element={<ArticlePage />} />
            <Route path="/joseph-brian-balut" element={<ArticlePage />} />
            <Route path="/AdminLogInRandomWordsToMakeItHarderToGuessBecauseWhyNot/josephbrianbalut" element={<AdminLogInPage />} />
            <Route path="/latest" element={<LatestPosts />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/staff/:staffSlug" element={<StaffProfilePage />} />
            <Route path="/releases" element={<ReleasesPage />} />
            <Route path="/create-article" element={<CreateArticlePage />} />
            
            <Route path="/media-segment" element={<MediaSegmentPage />} />
            <Route path="/media-segment/:id" element={<MediaSegmentArticle />} />
            <Route path="/media-segment/id" element={<MediaSegmentArticle />} />

          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;