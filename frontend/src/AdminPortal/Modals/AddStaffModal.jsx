import React, { useState, useEffect, useRef } from "react"
import { supabase } from "../../supabaseClient"
import { replaceUnderscore } from "../../utils/slugifyUtils"
import { compressImage, uploadToR2Storage, generateSafeFilename } from "../../utils/imageUtils"
import "./EditStaffModal.css"

const STAFF_POSITIONS = [
    "Editor-In-Chief",
    "Associate_Editor",
    "Circulation_Manager",
    "Managing_Editor",
    "News_Editor",
    "Features_Editor",
    "Literary_Editor",
    "Sports_Editor",
    "Web_Editor",
    "Graphics_Editor",
    "Multimedia_Editor",
    "Senior_Staff_Writer",
    "Senior_Staff_Broadcaster",
    "Senior_Staff_Designer",
    "Senior_Staff_Illustrator",
    "Senior_Staff_Photojournalist",
    "Junior_Staff_Writer",
    "Junior_Staff_Broadcaster",
    "Junior_Staff_Designer",
    "Junior_Staff_Illustrator",
    "Junior_Staff_Photojournalist"
]

const AddStaffModal = ({ onClose, onStaffAdded }) => {
    const [firstName, setFirstName] = useState("")
    const [middleName, setMiddleName] = useState("")
    const [lastName, setLastName] = useState("")
    const [pseudonym, setPseudonym] = useState("")
    const [position, setPosition] = useState("Junior_Staff_Writer")
    const [bio, setBio] = useState("")
    const [birthday, setBirthday] = useState("")
    const [joinDate, setJoinDate] = useState(() => new Date().toISOString().split("T")[0])
    const [pictureUrl, setPictureUrl] = useState("")
    const [selectedPhotoFile, setSelectedPhotoFile] = useState(null)
    const [photoPreview, setPhotoPreview] = useState("")
    const [showUrlInput, setShowUrlInput] = useState(false)
    const [isActive, setIsActive] = useState(true)
    const [isEdBoard, setIsEdBoard] = useState(false)

    const [saving, setSaving] = useState(false)
    const [uploadStatus, setUploadStatus] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const fileInputRef = useRef(null)

    useEffect(() => {
        return () => {
            if (photoPreview && photoPreview.startsWith("blob:")) {
                URL.revokeObjectURL(photoPreview)
            }
        }
    }, [photoPreview])

    const handlePhotoFileChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        setSelectedPhotoFile(file)
        const objectUrl = URL.createObjectURL(file)
        setPhotoPreview(objectUrl)
        setPictureUrl("")
    }

    const handleRemovePhoto = () => {
        setSelectedPhotoFile(null)
        setPhotoPreview("")
        setPictureUrl("")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!firstName.trim()) {
            setErrorMessage("First Name is required.")
            return
        }

        setSaving(true)
        setErrorMessage("")
        setUploadStatus("")

        try {
            let finalPictureUrl = pictureUrl.trim() || null

            // If a photo was selected, compress and upload to Cloudflare R2
            if (selectedPhotoFile) {
                setUploadStatus("Compressing photo...")
                const compressedBlob = await compressImage(selectedPhotoFile, 1000, 1000, 0.85, "image/webp")

                setUploadStatus("Uploading photo...")
                const namePart = `${firstName.trim()}-${lastName.trim()}`.replace(/^-+|-+$/g, "")
                const safeBase = namePart || selectedPhotoFile.name || "new-staff"
                const safeFilename = generateSafeFilename(safeBase)

                const { publicUrl } = await uploadToR2Storage({
                    file: compressedBlob,
                    filename: safeFilename,
                    folder: "staff-photos",
                    contentType: "image/webp",
                    bucket: "article-photos"
                })

                finalPictureUrl = publicUrl
            }

            setUploadStatus("Determining staff ID...")
            const { data: maxStaffRows, error: maxErr } = await supabase
                .from("staff")
                .select("staff_id")
                .order("staff_id", { ascending: false })
                .limit(1)

            if (maxErr) throw maxErr

            let nextStaffId = 1
            if (maxStaffRows && maxStaffRows.length > 0 && maxStaffRows[0].staff_id != null) {
                nextStaffId = Number(maxStaffRows[0].staff_id) + 1
            }

            setUploadStatus("Creating staff record...")

            const newStaffData = {
                staff_id: nextStaffId,
                staff_first_name: firstName.trim(),
                staff_middle_name: middleName.trim() || null,
                staff_last_name: lastName.trim() || null,
                staff_pseudonym: pseudonym.trim() || null,
                staff_position: position,
                staff_bio: bio.trim() || null,
                staff_birthday: birthday || null,
                join_date: joinDate || new Date().toISOString().split("T")[0],
                staff_picture: finalPictureUrl,
                staff_isactive: isActive,
                is_editorial_board: isEdBoard
            }

            const { data, error } = await supabase
                .from("staff")
                .insert(newStaffData)
                .select()
                .single()

            if (error) throw error

            if (onStaffAdded) {
                const insertedRecord = {
                    ...newStaffData,
                    ...(data || {}),
                    staff_display_name: `${firstName.trim()} ${lastName.trim()}`.trim()
                }
                onStaffAdded(insertedRecord)
            }
            onClose()
        } catch (err) {
            console.error("Error creating staff record:", err)
            setErrorMessage(err.message || "Failed to create staff record. Please try again.")
        } finally {
            setSaving(false)
            setUploadStatus("")
        }
    }

    return (
        <div className="Edit-Modal-Overlay" onClick={onClose}>
            <div className="Edit-Modal-Card" onClick={(e) => e.stopPropagation()}>
                <div className="Edit-Modal-Header">
                    <div>
                        <h2>Add Staff Member</h2>
                        <span className="Edit-Modal-Subtitle">Enter details to add a new member to the publication roster</span>
                    </div>
                    <button type="button" className="Edit-Modal-Close-Btn" onClick={onClose}>
                        Close
                    </button>
                </div>

                {errorMessage && (
                    <div className="Edit-Modal-Error">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="Edit-Modal-Form">
                    <div className="Edit-Modal-Form-Row">
                        <div className="Edit-Form-Group">
                            <label>First Name *</label>
                            <input
                                type="text"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First Name"
                                autoFocus
                            />
                        </div>
                        <div className="Edit-Form-Group">
                            <label>Middle Name</label>
                            <input
                                type="text"
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                                placeholder="Middle Name (optional)"
                            />
                        </div>
                        <div className="Edit-Form-Group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last Name"
                            />
                        </div>
                    </div>

                    <div className="Edit-Modal-Form-Row">
                        <div className="Edit-Form-Group">
                            <label>Pseudonym (Pen Name)</label>
                            <input
                                type="text"
                                value={pseudonym}
                                onChange={(e) => setPseudonym(e.target.value)}
                                placeholder="Pseudonym / Byline Handle (optional)"
                            />
                        </div>
                        <div className="Edit-Form-Group">
                            <label>Position *</label>
                            <select
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                            >
                                {STAFF_POSITIONS.map((pos) => (
                                    <option key={pos} value={pos}>
                                        {replaceUnderscore(pos)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="Edit-Modal-Form-Row">
                        <div className="Edit-Form-Group">
                            <label>Birthday</label>
                            <input
                                type="date"
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                            />
                        </div>
                        <div className="Edit-Form-Group">
                            <label>Join Date</label>
                            <input
                                type="date"
                                value={joinDate}
                                onChange={(e) => setJoinDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="Edit-Form-Group Edit-Staff-Photo-Group">
                        <label>Profile Picture</label>
                        <div className="Edit-Staff-Photo-Container">
                            <div className="Edit-Staff-Photo-Avatar-Wrapper">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Staff profile preview"
                                        className="Edit-Staff-Photo-Avatar"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null
                                            e.currentTarget.src = "/TPA-LEFT_BLUE.png"
                                        }}
                                    />
                                ) : (
                                    <div className="Edit-Staff-Photo-Placeholder">
                                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <div className="Edit-Staff-Photo-Controls">
                                <div className="Edit-Staff-Photo-Btn-Row">
                                    <label className="Edit-Staff-Upload-Btn">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                        <span>{photoPreview ? "Change Photo" : "Upload Photo"}</span>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            onChange={handlePhotoFileChange}
                                            disabled={saving}
                                        />
                                    </label>

                                    {photoPreview && (
                                        <button
                                            type="button"
                                            className="Edit-Staff-Remove-Photo-Btn"
                                            onClick={handleRemovePhoto}
                                            disabled={saving}
                                            title="Remove photo"
                                        >
                                            Remove Photo
                                        </button>
                                    )}
                                </div>

                                {selectedPhotoFile && (
                                    <span className="Edit-Staff-Photo-Selected-Hint">
                                        Selected: <strong>{selectedPhotoFile.name}</strong> (will upload when you save)
                                    </span>
                                )}

                                <div className="Edit-Staff-Url-Toggle-Row">
                                    <button
                                        type="button"
                                        className="Edit-Staff-Toggle-Url-Btn"
                                        onClick={() => setShowUrlInput(prev => !prev)}
                                    >
                                        {showUrlInput ? "Hide direct image URL" : "Or enter direct image URL..."}
                                    </button>
                                </div>

                                {showUrlInput && (
                                    <input
                                        type="url"
                                        value={pictureUrl}
                                        onChange={(e) => {
                                            setPictureUrl(e.target.value)
                                            setPhotoPreview(e.target.value)
                                            setSelectedPhotoFile(null)
                                        }}
                                        placeholder="https://media.philartisan.org/staff-photos/..."
                                        className="Edit-Staff-Url-Input"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="Edit-Form-Group">
                        <label>Bio</label>
                        <textarea
                            rows="3"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Write a brief bio about the staff member..."
                        />
                    </div>

                    <div className="Edit-Modal-Toggles-Row">
                        <label className="Edit-Checkbox-Label">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                            />
                            Active Member
                        </label>
                        <label className="Edit-Checkbox-Label">
                            <input
                                type="checkbox"
                                checked={isEdBoard}
                                onChange={(e) => setIsEdBoard(e.target.checked)}
                            />
                            Editorial Board Member
                        </label>
                    </div>

                    <div className="Edit-Modal-Footer">
                        <button
                            type="button"
                            className="Edit-Btn-Cancel"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="Edit-Btn-Save"
                            disabled={saving}
                        >
                            {saving ? (uploadStatus || "Adding Staff...") : "+ Add Staff Member"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddStaffModal
