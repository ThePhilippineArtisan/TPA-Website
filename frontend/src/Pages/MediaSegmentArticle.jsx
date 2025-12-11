import Photo2 from "../Sample-Photos/Multification-Invication.jpg"
import JUSTIN from "../Sample-Photos/JUST-IN.jpg"
import FEATFRIDAY from "../Sample-Photos/Features_Friday.jpg"

import "../CSS/MediaSegmentArticle.css"
import ListOfMediaSegments from "../Components/ListOfMediaSegments.jsx"
import "../CSS/LatestMediaSegment.css"
import VerticalFastNews from "../Components/VerticalFastNews.jsx";

const MediaSegmentArticle = () => {
    return(
        <div className = "Media-Segment-Article-Page">
            <div className = "Media-Segment-Article">
                <div className = "Latest-Media-Segment-Image" id = "imga"
                    style={{ "--bgImage": `url(${FEATFRIDAY})` }} >
                    
                    <img
                        src = {FEATFRIDAY} 
                    />

                </div>
                <h1> The last resort of those drowning in a tide of corruption </h1>
                
                <div className = "Media-Segment-Article-Below-Photo">
                    <div className = "Author-and-Details">
                        <div>
                        <h2> <span> Features Friday </span></h2> <br></br>
                        <p> Written by <span> Joseph Brian Balut </span></p>
                        <p> Graphics by <span> Joseph Brian Balut </span></p>
                        <br></br>
                        <p> Published on <span>  October 12, 2025 10:11 AM </span></p>
                        </div>
                    </div>

                    <div className = "Media-Segment-Article-Text">
                        <p> When in the course of human events, it becomes necessary for material action over pleasantries, olive branches, and sweet nothings, there exists an ol’ reliable for mass mobilization of different groups and sectors to demand concrete change, if not an entire overhaul of a system plagued by injustice and corruption.
                        <br></br><br></br> 𝗦𝗼𝗰𝗶𝗮𝗹 𝗖𝗼𝗻𝘁𝗿𝗮𝗰𝘁’𝘀 𝗦𝗲𝗽𝗮𝗿𝗮𝗯𝗶𝗹𝗶𝘁𝘆 𝗖𝗹𝗮𝘂𝘀𝗲 <br></br>
                        The world has never been a stranger to the disgruntled masses singing the choir’s resolve.<br></br>
                        There exists a social contract between the government and its people when some rights, except life, liberty, and property, are voluntarily surrendered in exchange for protection, fairness, and benefits. 
                        Once the contract is broken through overreach or corruption of goodwill, the masses must take up arms to reiterate that their government is subservient to the will of the many – that the government is of the people, by the people, and for the people.
                        <br></br><br></br>𝗧𝗵𝗲 𝘀𝘁𝗿𝗮𝘄 𝘁𝗵𝗮𝘁 𝗯𝗿𝗼𝗸𝗲 𝘁𝗵𝗲 𝗰𝗮𝗺𝗲𝗹’𝘀 𝗯𝗮𝗰𝗸<br></br>
                        The past few weeks of constant exposées after Poncious Pilate uttered “Mahiya naman kayo!” confirming what we already knew, as he washed his hands in the onslaught of the very floodwater his Trillion-peso signatures unleashed. Marcos Jr. is trying his very best to salvage a legacy – finger-pointing himself away from the blood-soaked pavement of his family’s past and present like a wolf in sheep’s clothing as he aligns with the rabbling anger at the Judases who sold their country for a few shekels.<br></br>
                        <br></br>When inundated by posts of the luxurious lifestyle of these 'nepo-babies,' a term used to describe the sons and daughters of government officials and contractors living lavishly atop the petty backs of those who fund it, flaunting their family’s ill-gotten wealth, the questionable pomp and dubious pageantry leave a bad taste in the mouth, for however much they spend on clothing and properties with wings, they cannot buy class or delicadeza.
                        <br></br><br></br>𝗣𝘂𝗯𝗹𝗶𝗰 𝘀𝗲𝗻𝘁𝗶𝗺𝗲𝗻𝘁 𝗶𝗻𝘁𝗿𝗼-𝗿𝗲𝘁𝗿𝗼𝘀𝗽𝗲𝗰𝘁𝗶𝗼𝗻<br></br>
                        Inspired by the revolutions of the past, present, and abroad’s justified indignation, the Filipino people woke up to the gravity of their situation as a hundred thousand flocked to the streets. 
                        <br></br><br></br>What was once the general public against union strikes and protesters as they disrupt public service and private production, eating airtime from telenovelas, and overall annoyance, forgetting whence their measly-luxury came. 
                        <br></br><br></br>They are reminded that these things we now take for granted were once a luxury hard-fought:<br></br><br></br>
                        40-hour work week and overtime pay? Protesters.<br></br>
                        Labor exploitation laws? Protesters.<br></br>
                        Tuition-free state colleges and universities? Protesters.<br></br>
                        Democracy and freedom of speech to express our stupid opinions? Protesters.<br></br>
                        Dismantling the system of oppression and exploitation of the working class? Ongoing…<br></br>
                        If demanding these rights are socialism, communism, or Joma Sison-ism — let's wonder who our enemies really are.<br></br> 
                        <br></br>𝗠𝘂𝗹𝘁𝗶𝗹𝗮𝘁𝗲𝗿𝗮𝗹 𝗶𝗻 𝗰𝗼𝗹𝗼𝗿, 𝗨𝗻𝗶𝗹𝗮𝘁𝗲𝗿𝗮𝗹 𝗶𝗻 𝗰𝗮𝘂𝘀𝗲<br></br>
                        When push comes to shove, the masses tend to shove. <br></br>
                        The restless and disgusted are united in one cause. Whether you’re red, yellow, pink, or blue–we all bleed the same color and cry the same tears when lives are destroyed by our 𝘳𝘦𝘱𝘳𝘦𝘴𝘦𝘯𝘵𝘢-𝘵𝘩𝘪𝘦𝘷𝘦𝘴 in Congress.<br></br>
                        Whether in the spirit of Martin Luther King Jr. or Malcolm X, Jose Rizal or Andres Bonifacio–we must remain vigilant against distractions muddying the floodwater. To throw Andres under the carriage because of the bloodshed and property damage the Cry of Pugad Lawin provoked only benefits the friars–and so will the fence sitters.<br></br>
                        <br></br>United we stand, divided we fall.<br></br>
                        Organize, Speak, Vote, Mobilize.<br></br><br></br>
                        #ThePhilippineArtisan
                        </p>
                    </div>

                </div>
            </div>

            <ListOfMediaSegments />
        </div>
    )
}

export default MediaSegmentArticle;