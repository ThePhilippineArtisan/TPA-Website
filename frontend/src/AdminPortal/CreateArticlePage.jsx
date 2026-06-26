import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import { replaceUnderscore, slugify } from "../utils/slugifyUtils"
import { compressImage } from "../utils/imageUtils.js"
import { formatDateReadable, formatRelativeTime } from "../utils/dateUtils"

import BOLD from "../assets/Miniature_Icon_Version/Bold.svg"
import ITALIC from "../assets/Miniature_Icon_Version/Italic.svg"
import EMDASH from "../assets/Miniature_Icon_Version/EmDash.svg"
import SUPERSCRIPT from "../assets/Miniature_Icon_Version/Superscript.svg"
import SUBSCRIPT from "../assets/Miniature_Icon_Version/Subscript.svg"
import HIGHLIGHT from "../assets/Miniature_Icon_Version/Highlight.svg"
import BULLET from "../assets/Miniature_Icon_Version/Bullet.svg"
import NUMBERED from "../assets/Miniature_Icon_Version/Numbered.svg"
import REFERENCE from "../assets/Miniature_Icon_Version/reference.svg"
import ATTACH from "../assets/Miniature_Icon_Version/Attach-File.svg"

import Author from "../assets/Miniature_Icon_Version/Author.svg"
import MediaProvider from "../assets/Miniature_Icon_Version/MediaProvider.svg"

import "../AdminPortal/CreateArticlePage.css"
import StaffModal from "./Modals/SelectStaffersModal.jsx"

const CreateArticlePage = () => {

    // container for all staff
    const [staff, setStaff] = useState([]);

    // fetch all staffers with qualifiers
    useEffect(() => {
        const fetchStaff = async () => {
            let { data, error } = await supabase
                .from('staff')
                .select('staff_id, staff_display_name, staff_position, staff_order')
                .eq('staff_isactive', true)
                .order('staff_order', { ascending: true })

            if (error) {
                console.log('Error fetching staffers: ', error)
            } else {
                setStaff(data)
            }
        }

        fetchStaff() // everytime you initiate fetchStaff, you call it immediately after before component can be seen
    }, [])

    // container for selected authors and media providers
    const [selectedAuthors, setSelectedAuthors] = useState([])
    const [selectedMediaProviders, setSelectedMediaProviders] = useState([])

    // container for headline and body, initially empty string
    const [headline, setHeadline] = useState("")
    const [body, setBody] = useState("")
    const [articleType, setArticleType] = useState("")

    // container for photo/s, initially empty array
    const [mediaImagePhoto, setMediaImagePhoto] = useState([])

    // calls imageUtils.js = 
    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files) 
        
        try{ // Compress all selected images
            const compressedResults = await Promise.all(
                files.map(async (file) => {
                    const compressedBlob = await compressImage(file)
                    const previewUrl = URL.createObjectURL(compressedBlob)
                    return {
                        file: compressedBlob,
                        name: file.name.replace(/\.[^/.]+$/, "") + ".webp",
                        preview: previewUrl
                    }
                })
            )
            // add recent image into the array of mediaImagePhoto
            setMediaImagePhoto(prev => [...prev, ...compressedResults])
        } catch (error) {
            console.error("Image compression error: ", error)
            alert("Error compressing images: " + error.message)
        }
    }

    const handleRemoveImage = (indexToRemove) => {
        setMediaImagePhoto(prev => {
            return prev.filter((imgObj, idx) => {
                if(idx === indexToRemove){
                    if(imgObj.preview){
                        URL.revokeObjectURL(imgObj.preview)
                    }
                    return false
                }
                return true
            })
        })
    }

    // Modal states for authors and media providers
    const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false)
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)

    const [scheduledTime, setScheduledTime] = useState("")
    const [showDatePicker, setShowDatePicker] = useState(false)

    const handleConfirmSchedule = () => {
        if (!scheduledTime) {
            alert("Please select a date and time to schedule the post.");
            return;
        }
        addNewArticle(true);
    };

    // const wordCounter = bodystr =>

    // multiple consecutive supabase inserts and updates
    const addNewArticle = async (isPublishedStatus) => {
        if (!headline) {
            alert("Please enter a headline before submitting.")
            return
        }

        const generatedSlug = slugify(headline)

        const newArticlePayloads = {
            article_headline: headline,
            article_body: body,
            article_type: articleType,
            slug_headline: generatedSlug,
            is_published: isPublishedStatus,
            published_at: scheduledTime ? new Date(scheduledTime).toISOString() : new Date().toISOString(),
            // published_by: figure it out
            // word_count
            // tag 1
            // tag 2
            // tag 3
            // edit_history: probably just json
        }

        // send single row all the article payloads at once
        let { data: articleData, error: articleError } = await supabase
            .from('article')
            .insert([newArticlePayloads])
            .select()
            .single()

        if (articleError) {
            console.log('Error creating new article: ', articleError)
            alert(articleError)
            return
        }

        // Inserting in article_staff for credits
        const newArticleId = articleData.article_id

        const authorPayloads = selectedAuthors.map(author => ({
            article_id: newArticleId,
            staff_id: author.staff_id,
            contribution_as: 'Author'
        }))

        const mediaPayloads = selectedMediaProviders.map(media => ({
            article_id: newArticleId,
            staff_id: media.staff_id,
            contribution_as: 'Media_Provider'
        }))

        const allStaffPayloads = [...authorPayloads, ...mediaPayloads] // combines both to be inserted in the article_staff for credits

        if (allStaffPayloads.length > 0) {
            let { error: staffError } = await supabase
                .from('article_staff')
                .insert(allStaffPayloads)

            if (staffError) {
                console.log('Error linking staff: ', staffError)
                alert(staffError)
                return
            }
        }

        alert("Article saved successfully!")

        // reset states to null/empty arrays
        setHeadline("")
        setBody("")
        setSelectedAuthors([])
        setSelectedMediaProviders([])
        setScheduledTime("")
        setShowDatePicker(false)

        mediaImagePhoto.forEach(imgObj => {
            if(imgObj.preview){
                URL.revokeObjectURL(imgObj.preview) 
            }
        })
        setMediaImagePhoto([])

        document.getElementById("Body-Text").innerHTML = ""
    }

    return (
        <div className="Entire-Page">
            <div className="Editor-Rectangle">

                <div className="Text-Formatting-Section">
                    <img src={BOLD} />
                    <img src={ITALIC} />
                    <img src={HIGHLIGHT} />
                    <img src={REFERENCE} />
                    <img src={SUBSCRIPT} />
                    <img src={SUPERSCRIPT} />
                    <img src={BULLET} />
                    <img src={NUMBERED} />
                    <img src={EMDASH} />

                    <select name="Article-Type" id="Article-Type" value={articleType} onChange={(e) => setArticleType(e.target.value)}>
                        <option value="LOOK"> LOOK </option>
                        <option value="ICYMI"> ICYMI </option>
                        <option value="ANNOUNCEMENT"> ANNOUNCEMENT </option>
                        <option value="ADVISORY"> ADVISORY </option>
                        <option value="ALERT"> ALERT </option>
                        <option value="JUST_IN"> JUST IN </option>
                        <option value="UNIVERSITY_NEWS"> UNIVERSITY NEWS </option>
                        <option value="NATIONAL_NEWS"> NATIONAL NEWS</option>
                        <option value="INTERNATIONAL_NEWS"> INTERNATIONAL NEWS </option>
                        <option value="DEVELOPING_STORY"> DEVELOPING STORY </option>

                        <option value="NULL"> ================== </option>

                        <option value="MAKATA_MONDAYS"> Makata Mondays </option>
                        <option value="TEK_TUESDAY"> Tek Tuesday </option>
                        <option value="WANKJOB_WEDNESDAY"> Wankjob Wednesday </option>
                        <option value="TALA_THURSDAY"> Tala Thursday</option>
                        <option value="FEATURES_FRIDAY"> Features Friday </option>
                        <option value="STREAMING_SATURDAY"> Streaming Saturday </option>
                        <option value="SPORTS_SUNDAY"> Sports Sunday </option>
                    </select>

                    <label htmlFor="file-upload">
                        <img
                            src={ATTACH}
                            alt="Upload"
                            style={{ cursor: "pointer" }}
                        />

                        <input
                            id = "file-upload"
                            type = "file"
                            accept = "image/*"
                            multiple
                            style = {{ display: "none" }}
                            onChange = {handleFileChange}
                        />

                    </label>

                    <img
                        src={Author}
                        alt="Select Author/s"
                        onClick={() =>
                            setIsAuthorModalOpen(true)
                        }

                        style={{ cursor: "pointer" }}
                    />

                    <StaffModal
                        isOpen={isAuthorModalOpen}
                        onClose={() => setIsAuthorModalOpen(false)}
                        staffers={staff}
                        onConfirm={(selectedStaffers) => {
                            setSelectedAuthors(selectedStaffers)
                            setIsAuthorModalOpen(false)
                        }}
                    />

                    <img
                        src={MediaProvider}
                        alt="Select Media Provider/s"
                        onClick={() =>
                            setIsMediaModalOpen(true)
                        }

                        style={{ cursor: "pointer" }}
                    />

                    <StaffModal
                        isOpen={isMediaModalOpen}
                        onClose={() => setIsMediaModalOpen(false)}
                        staffers={staff}
                        onConfirm={(selectedStaffers) => {
                            setSelectedMediaProviders(selectedStaffers)
                            setIsMediaModalOpen(false)
                        }}
                    />

                </div>

                {/** List of Images with Remove Option through handleRemoveImage's index */}
                {mediaImagePhoto.length > 0 && (
                    <div className = "Selected-Images-List">
                        <h4> Selected Images ({mediaImagePhoto.length}): </h4>
                        <div className = "Selected-Images-Grid">
                            {mediaImagePhoto.map((imgObj, idx) => (
                                <div key = {idx} className = "Selected-Image-Item">
                                    <span> {imgObj.name} </span>
                                    <button type = "button" onClick = {() => handleRemoveImage(idx)}> Remove</button>
                                </div>
                            ))}
                        </div> 
                    </div>
                )}

                <div className="Text-Area">
                    <input
                        type="text"
                        placeholder="Enter your new article headline here."
                        id="Headline-Text"
                        className="Headline-Input"
                        value={headline}
                        onChange={(typing) => setHeadline(typing.target.value)}
                    />

                    <div
                        contentEditable
                        suppressContentEditableWarning={true}
                        id="Body-Text"
                        className="Headline-Input"
                        onInput={(typing) => setBody(typing.currentTarget.innerHTML)}
                    >
                    </div>
                </div>

                <button type="submit" onClick={() => addNewArticle(false)}> Save as Draft </button>
                <button type="submit" onClick={() => addNewArticle(true)}> Post </button>
                <button type="button" onClick={() => setShowDatePicker(true)}> Schedule Post </button>

                {showDatePicker && (
                    <div className="Schedule-Picker-Modal">
                        <input
                            type="datetime-local"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                        />

                        <button onClick={handleConfirmSchedule}> Confirm Schedule </button>
                        <button onClick={() => setShowDatePicker(false)}> Cancel </button>
                    </div>
                )}


            </div>

            <div className="Preview-Section">
                <h1> Article Preview </h1>
            </div>


        </div>
    )
}

export default CreateArticlePage;