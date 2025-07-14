import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import NavbarComponent from './Components/NavbarComponent.jsx'
import FirstFacade from './Components/FirstFacade.jsx'
import SecondFacade from './Components/SecondFacade.jsx'
import RollingHeadlines from './Components/RollingHeadlines.jsx'
import Footer from './Components/Footer.jsx'

const App = () => {

  return(

    <Router>
      <NavbarComponent />
      <Routes>
        <Route path = "/" element = {
          <>
            <FirstFacade />
            <RollingHeadlines />
            <SecondFacade />
          </>
        } />

        {/** <Route path = "/KalyoFinalists" element {< Name of the thing />} >/ */}
      </Routes>

      <Footer />
    </Router>
  )
}

export default App;