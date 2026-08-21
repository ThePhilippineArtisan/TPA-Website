import React, { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../supabaseClient"
import { replaceUnderscore, slugify } from "../utils/slugifyUtils"

import TPAWTurno from "/TPA-LEFT_BLUE.png"
import TPACircleLogo from "../assets/Miniature_Icon_Version/TPACircleLogo.svg"

import LAMPOON from "../TPA-Releases/2025-Lampoon/2025-Lampoon_Duh-Filipit-Artihan/2025-Lampoon_Duh-Filipit-Artihan-1.png"

import PreviousSlide from "../assets/Miniature_Icon_Version/Previous.svg"
import NextSlide from "../assets/Miniature_Icon_Version/Next.svg"

import "../CSS/AboutPage.css"

const AboutPage = () => {
    const [staff, setStaff] = useState([])
    const [activeIndex, setActiveIndex] = useState(0)
    const [direction, setDirection] = useState("next")
    const slideRef = useRef(null)

    useEffect(() => {
        const fetchStaff = async () => {
            let { data, error } = await supabase
                .from('staff')
                .select('staff_id, staff_first_name, staff_last_name, staff_display_name, staff_position, is_editorial_board, staff_picture, staff_order')
                .eq('staff_isactive', true)
                .not('staff_position', 'is', null)
                .order('staff_order', { ascending: true })

            if (error) {
                console.log('Error fetching staff: ', error)
            } else {
                setStaff(data)
            }
        }

        fetchStaff()
    }, [])

    const slides = [
        {
            id: 1,
            src: TPAWTurno,
            topText: "THE PHILIPPINE ARTISAN",
            li1: "The Philippine Artisan is the official student publication of the Technological University of the Philippines and has served the TUPian community since 1944.",
            li2: "The student publication is a member of the College Editors Guild of the Philippines",
            li3: "Our activities, funding, and readership is ascribed in Republic Act No. 7079 or the Campus Journalism Act of 1991."
        },
        {
            id: 2,
            src: TPAWTurno,
            topText: "PREAMBLE",
            li1: "We, the Artisans, imploring the aid of the Eternal Father, in order to build a just publication which shall contribute to the development of the journalistic skills of the students of Technological University of the Philippines Manila, to uphold justice, to promote freedom of expression, to expose the truth accurately and without ambiguity, to immortalize the importance of campus journalism and to develop an atmosphere of brotherhood, unity, workmanship, honesty, and patience, do ordain and promulgate this Constitution",
        },
        {
            id: 3,
            src: TPAWTurno,
            topText: "The Artisan's Creed",
            li1: "I, chosen among the many who were called to join The Philippine Artisan – Manila, do hereby pledge to conscientiously fulfill my tasks and obligations, abide in all the rules and regulations of the publication, fight for its constitution, strongly fight against corruption, immortalize truth, justice and freedom of expression, and serve the Technological University of the Philippines System as a student journalist."
        },
        {
            id: 4,
            src: TPACircleLogo,
            topText: "The Artisan's Clutch",
            li1: "The Artisan's Clutch represent the duty of the publication to deliver reliable information to the students without fear and become the voice of the oppressed masses"
        },
        {
            id: 5,
            src: TPACircleLogo,
            topText: "Symbolism of the Clutch",
            li1: "The COLOR BLUE symbolizes the wisdom, peace, and truth",
            li2: "The LEFT FIST symbolizes the publication's ability to inform and educate TUP students through responsible journalism.",
            li3: "The QUILL symbolizes the publication's ability to inform and educate TUP students through responsible journalism."
        },
        {
            id: 6,
            src: TPAWTurno,
            topText: "WHERE WE'RE LOCATED",
            li1: "The Philippine Artisan Manila's headquarters is located at the Ground Floor, College of Liberal Arts - College of Science building at the Technological University of the Philippines Main Campus, Ayala Boulevard, Ermita, Manila."
        }
    ]

    const handleSlideChange = (dir) => {
        setDirection(dir)
        setActiveIndex((i) =>
            dir === "next"
                ? (i + 1) % slides.length
                : (i - 1 + slides.length) % slides.length
        )
    }

    const handleNext = () => handleSlideChange("next")
    const handlePrev = () => handleSlideChange("prev")

    const currentSlide = slides[activeIndex]

    // Cleanly separate the filtered arrays before the return block
    const editorialBoard = staff.filter(member => member.is_editorial_board === true)
    const seniorStaffers = staff.filter(member => !member.is_editorial_board && [12, 13, 14, 15, 16].includes(member.staff_order))
    const juniorStaffers = staff.filter(member => !member.is_editorial_board && [17, 18, 19, 20, 21].includes(member.staff_order))

    return (
        <div className="About-Page">
            <div className={`First-Part SlideWrapper ${direction}`} ref={slideRef}>
                <div className="Slide-Navigation">
                    <img
                        src={PreviousSlide}
                        alt="Previous Slide"
                        onClick={handlePrev}
                    />
                </div>
                <div className="Slide-Image">
                    <img src={currentSlide.src} alt={currentSlide.topText} id="TPAWTurno" />
                </div>
                <div className="First-Part-Text">
                    <h1> {currentSlide.topText} </h1>
                    <ul>
                        {currentSlide.li1 && <li>{currentSlide.li1}</li>}
                        {currentSlide.li2 && <li>{currentSlide.li2}</li>}
                        {currentSlide.li3 && <li>{currentSlide.li3}</li>}
                    </ul>
                </div>

                <div className="Slide-Navigation">
                    <img
                        src={NextSlide}
                        alt="Next Slide"
                        onClick={handleNext}
                    />
                </div>
            </div>

            <div className="Releases-Part">
                <h1> OUR LATEST RELEASES </h1>
                <div className="Releases-Part-Covers">
                    <div className="Covers">
                        <img src={LAMPOON} alt="Kalyo Cover" />
                        <div className="Cover-Text">
                            <p className="Cover-Title">KALYO: KAMATAYAN</p>
                            <p className="Cover-Year">'24 - '25</p>
                        </div>
                    </div>
                    <div className="Covers">
                        <img src={LAMPOON} alt="PhilArts Cover" />
                        <div className="Cover-Text">
                            <p className="Cover-Title">PHILARTS: STATUS QUO</p>
                            <p className="Cover-Year">'24 - '25</p>
                        </div>
                    </div>
                    <div className="Covers">
                        <img src={LAMPOON} alt="Broadsheet Cover" />
                        <div className="Cover-Text">
                            <p className="Cover-Title">BROADSHEET</p>
                            <p className="Cover-Year">'24 - '25</p>
                        </div>
                    </div>
                    <div className="Covers">
                        <img src={LAMPOON} alt="Newsletter Cover" />
                        <div className="Cover-Text">
                            <p className="Cover-Title">NEWSLETTER</p>
                            <p className="Cover-Year">'24 - '25</p>
                        </div>
                    </div>
                    <div className="Covers">
                        <img src={LAMPOON} alt="Lampoon Cover" />
                        <div className="Cover-Text">
                            <p className="Cover-Title">LAMPOON</p>
                            <p className="Cover-Year">'24 - '25</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="Meet-Our-Editors First-Part-Text">
                <h1> MEET OUR EDITORIAL BOARD </h1>

                <div className="Editors">
                    <div className="Editorial-Board">
                        {editorialBoard.map(isEdBoard => (
                            <Link
                                to={`/staff/${slugify(isEdBoard.staff_display_name)}-${isEdBoard.staff_id}`}
                                className="Editorial-Board-Individual-Card"
                                key={isEdBoard.staff_display_name}
                                style={{ textDecoration: "none", color: "inherit" }}
                            >
                                <div className="Editorial-Board-Pad-When-Hover" style={{ border: "2px whitesmoke solid", borderRadius: "100%" }}>
                                    <div className="Editorial-Board-Individual">
                                        <img
                                            src={isEdBoard.staff_picture}
                                            alt={isEdBoard.staff_display_name}
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", lineHeight: "1.1" }}>
                                    <h3> {replaceUnderscore(isEdBoard.staff_display_name)} </h3>
                                    <p style={{ color: 'whitesmoke', margin: "0.25rem" }}> {replaceUnderscore(isEdBoard.staff_position)} </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Staff Directory Section */}
            {((seniorStaffers && seniorStaffers.length > 0) || (juniorStaffers && juniorStaffers.length > 0)) && (
                <div className="All-Staffer-About-Page-Section">
                    <h1 className="Staffer-Section-Main-Title">STAFF DIRECTORY</h1>

                    {seniorStaffers.length > 0 && (
                        <div className="Regular-Staffers">
                            <h2 className="Staff-Category-Header">Senior Staffers</h2>
                            <div className="Regular-Staffers-Whole">
                                {seniorStaffers.map(seniorStaffMember => (
                                    <Link
                                        to={`/staff/${slugify(seniorStaffMember.staff_display_name)}-${seniorStaffMember.staff_id}`}
                                        className="Staffer-Item"
                                        key={seniorStaffMember.staff_display_name}
                                        style={{ textDecoration: "none" }}
                                    >
                                        <div className="Circle"></div>
                                        <div className="Staffer-Names-Individual">
                                            <h3>{seniorStaffMember.staff_display_name}</h3>
                                            <p>{replaceUnderscore(seniorStaffMember.staff_position)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {juniorStaffers.length > 0 && (
                        <div className="Regular-Staffers">
                            <h2 className="Staff-Category-Header">Junior Staffers</h2>
                            <div className="Regular-Staffers-Whole">
                                {juniorStaffers.map((juniorStaffMember) => (
                                    <Link
                                        to={`/staff/${slugify(juniorStaffMember.staff_display_name)}-${juniorStaffMember.staff_id}`}
                                        className="Staffer-Item"
                                        key={juniorStaffMember.staff_display_name}
                                        style={{ textDecoration: "none" }}
                                    >
                                        <div className="Circle"></div>
                                        <div className="Staffer-Names-Individual">
                                            <h3>{juniorStaffMember.staff_display_name}</h3>
                                            <p>{replaceUnderscore(juniorStaffMember.staff_position)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Vision, Mission & Principles Section */}
            <div className="Two-Part">
                <h1 className="Section-Title-Header">VISION & MISSION</h1>
                <div className="VM-Section-Grid">
                    <div className="VM-Block-Card">
                        <h2>VISION</h2>
                        <p>To be a student publication that celebrates responsible freedom of expression. The organization envisions itself to be the center of journalism in the TUP community that serves with dignity, integrity, and sincerity to be responsible for a standard of excellence.</p>
                    </div>

                    <div className="VM-Block-Card">
                        <h2>MISSION</h2>
                        <p>To inspire, motivate, and involve every student in the TUP community to create a medium of open communication with the student body and the administration in light of true service, transparency, and freedom of expression.</p>
                    </div>
                </div>

                <div className="Principles-Section-Wrapper">
                    <h1 className="Section-Title-Header">BASIC PRINCIPLES & OBJECTIVES</h1>
                    <div className="Principles-List-Grid">
                        <div className="Principle-Item-Card">
                            <span className="Principle-Num">1</span>
                            <p>TPA shall serve as an independent publication of the students. Its primary concern is to inform, to educate, and to give opinions about local, sectoral, and national events that are of concern and would benefit the interests of the students.</p>
                        </div>

                        <div className="Principle-Item-Card">
                            <span className="Principle-Num">2</span>
                            <p>TPA shall exercise the freedom of the press as stipulated in the 1987 Philippine Constitution, Article 3 - Bill of Rights, Section 4, and pursue the corresponding obligations as guaranteed and provided by Republic Act 7079 (Campus Journalism Act of 1991) and university policies.</p>
                        </div>

                        <div className="Principle-Item-Card">
                            <span className="Principle-Num">3</span>
                            <p>TPA shall publish at least two (2) issues (Kalyo: Literary, Duh Filipit Artihan: Lampoon, Broadsheet, Newsletter, PhilArts: Feature, Sports) per academic year in line with community and campus engagement advocacies and agenda in the contemporary.</p>
                        </div>

                        <div className="Principle-Item-Card">
                            <span className="Principle-Num">4</span>
                            <p>TPA shall not deprive the right of any person, group, or institution to publish their positions or commentaries regarding the articles published in the said paper in conformity with the printing policies of the Editorial Board.</p>
                        </div>

                        <div className="Principle-Item-Card">
                            <span className="Principle-Num">5</span>
                            <p>The releases of TPA shall be governed by these policies and principles and regulations as promulgated by the Editorial Board in accordance with the laws of the Republic and objectives of the University.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutPage 