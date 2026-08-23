import { Link } from "react-router-dom"
import { supabase } from "../supabaseClient.js"
import { useEffect, useState, Fragment } from "react"
import { getArticleUrl } from "../utils/articleUtils.js"

import TPALogoBlack from "../assets/Miniature_Icon_Version/TPALogoBlack.png"

import "../CSS/RollingHeadlines.css"

const RollingHeadlines = () => {

    const [headlines, setHeadlines] = useState([])

    useEffect(() => {
        const fetchHeadlines = async () => {
            const { data, error } = await supabase
                .from('article')
                .select(`
                    article_id,
                    article_headline,
                    article_type,
                    slug_headline,
                    published_at
                `)
                .eq('is_published', true)
                .order('published_at', { ascending: false })
                .limit(5)

            if (error) {
                console.log("Error Fetching Headlines: ", error)
                return;
            }

            setHeadlines(data || [])
        }
        fetchHeadlines()
    }, [])

    return (
        <div className="Rolling-Headline"> {/** MAXIMUM 5 LATEST HEADLINES */}
            <marquee behavior="scroll" direction="left" scrollamount="3">
                <img src={TPALogoBlack} alt="TPA Logo" />
                {headlines.map((headline) => (
                    <Fragment key={headline.article_id}>
                        <Link to={getArticleUrl(headline)} style={{ margin: "0 10px" }}>
                            {headline.article_headline}
                        </Link>
                        <img src={TPALogoBlack} alt="TPA Logo" />
                    </Fragment>
                ))}
            </marquee>
        </div>
    )
}

export default RollingHeadlines;