import { Link } from "react-router-dom";

import "../CSS/Tabs.css"

const Tabs = () => {
    return(
    <div className = "Tabs">
        <Link to = "#"> Latest </Link>
        <Link to = "#"> Opinion </Link>
        <Link to = "#"> Editorial </Link>
        <Link to = "#" title = "Poetry, Prose, Pretention Galore! Ang Makata Monday ay ang pang-Literaryong Media Segment ng TPA"> Makata Monday </Link>
        <Link to = "#" title = "Our Teks dive into the world of technology!"> Tek Tuesday </Link>
        <Link to = "#" title = "Editorial Cartoonist and Wankers Wanking for attention"> Wankjob Wednesday </Link>
        <Link to = "#" title = "Filipino por Indio words of the Day!"> Tala Thursday </Link>
        <Link to = "#" title = "Professional Yappers Yapping About Yap"> Features Friday </Link>
        <Link to = "#" title = "Professional Yappers Yapping About Yap"> Streaming Saturday </Link>
        <Link to = "#" title = "May Athletes pa pala tayo bukod kina Pacquiao, Yulo, Eala, at Diaz?"> Sports Sunday </Link>
    </div>
)}

export default Tabs;