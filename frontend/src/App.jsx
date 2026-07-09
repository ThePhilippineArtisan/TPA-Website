import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import AnimatedLoader from "./Pages/AnimatedLoader.jsx";

// Components Folder
const NavbarComponent = lazy(() => import('./Components/NavbarComponent.jsx'));
const Footer = lazy(() => import('./Components/Footer.jsx'));

const FirstFacade = lazy(() => import('./Pages/FirstFacade.jsx'));
const SecondFacade = lazy(() => import('./Pages/SecondFacade.jsx'));
const ArticlePage = lazy(() => import('./Pages/ArticlePage.jsx'))
const PlaceholderArticlePage = lazy(() => import('./Pages/PlaceholderArticlePage.jsx'));
const PlaceholderMediaSegmentArticle = lazy(() => import('./Pages/PlaceholderMediaSegmentArticle.jsx'));
const AboutPage = lazy(() => import('./Pages/AboutPage.jsx'));
const MediaSegmentPage = lazy(() => import('./Pages/MediaSegmentPage.jsx'));
const MediaSegmentArticle = lazy(() => import('./Pages/MediaSegmentArticle.jsx'));
const LatestPosts = lazy(() => import('./Pages/LatestPosts.jsx'));
const ReleasesPage = lazy(() => import('./Pages/ReleasesPage.jsx'));
const StaffProfilePage = lazy(() => import('./Pages/StaffProfile.jsx'))

// AdminPortal Folder
const AdminLogInPage = lazy(() => import('./AdminPortal/AdminPageLogIn.jsx'))
const AdminPage = lazy(() => import('./AdminPortal/AdminPage.jsx'))
const AdminDashboard = lazy(() => import('./AdminPortal/AdminDashboard.jsx'))
const CreateArticlePage = lazy(() => import('./AdminPortal/CreateArticlePage.jsx'));
const ManageArticlesPage = lazy(() => import('./AdminPortal/ManageArticles.jsx'));
const ManageStaffPage = lazy(() => import('./AdminPortal/ManageStaff.jsx'));

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

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const cardsTop = window.innerHeight;

      if (currentScroll > cardsTop + 10) {
        document.documentElement.classList.remove('homepage-snap');
      } else {
        document.documentElement.classList.add('homepage-snap');
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.documentElement.classList.remove('homepage-snap');
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

const ProtectedRoute = () => {
  const isAuth = localStorage.getItem("isAuth") === "true"

  if (!isAuth) {
    return <Navigate to="/AdminLogInRandomWordsToMakeItHarderToGuessBecauseWhyNot" replace />
  }

  return <Outlet />
}

const App = () => {
  return (
    <div className="app-wrapper">
      <Router>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminPage />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/create-article" element={<CreateArticlePage />} />
              <Route path="/admin/articles" element={<ManageArticlesPage/>}  />
              <Route path="/admin/staff" element={<ManageStaffPage/>}  />
              <Route path="/admin/manage-page" element={<div style={{ padding: '20px' }}><h1>Manage Front Page</h1><p>Manage front page components here.</p></div>} />
              <Route path="/admin/add-releases" element={<div style={{ padding: '20px' }}><h1>Add Releases</h1><p>Add and manage media releases here.</p></div>} />
            </Route>
          </Route>

          <Route element={<MainLayout />}>

            <Route path="/" element={<HomePage />} />

            <Route path="/article/:articleId" element={<ArticlePage />} />
            <Route path="/joseph-brian-balut" element={<PlaceholderArticlePage />} />
            <Route path="/latest" element={<LatestPosts />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/staff/:staffSlug" element={<StaffProfilePage />} />
            <Route path="/releases" element={<ReleasesPage />} />

            <Route path="/media-segment" element={<MediaSegmentPage />} />
            <Route path="/media-segment/:id" element={<MediaSegmentArticle />} />
            <Route path="/media-segment/id" element={<PlaceholderMediaSegmentArticle />} />


            <Route path="/AdminLogInRandomWordsToMakeItHarderToGuessBecauseWhyNot" element={<AdminLogInPage />} />

          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;