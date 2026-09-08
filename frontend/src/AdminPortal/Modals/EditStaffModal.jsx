import React, { useState } from "react"
import { supabase } from "../../supabaseClient"
import { replaceUnderscore } from "../../utils/slugifyUtils"
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

const EditStaffModal = ({ staff, onClose, onSave }) => {
    if (!staff) return null

    const [firstName, setFirstName] = useState(staff.staff_first_name || "")
    const [middleName, setMiddleName] = useState(staff.staff_middle_name || "")
    const [lastName, setLastName] = useState(staff.staff_last_name || "")
    const [pseudonym, setPseudonym] = useState(staff.staff_pseudonym || "")
    const [position, setPosition] = useState(staff.staff_position || STAFF_POSITIONS[0])
    const [bio, setBio] = useState(staff.staff_bio || "")
    const [birthday, setBirthday] = useState(staff.staff_birthday || "")
    const [joinDate, setJoinDate] = useState(staff.join_date || "")
    const [pictureUrl, setPictureUrl] = useState(staff.staff_picture || "")
    const [isActive, setIsActive] = useState(staff.staff_isactive !== false)
    const [isEdBoard, setIsEdBoard] = useState(Boolean(staff.is_editorial_board))

    const [saving, setSaving] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setErrorMessage("")

        try {
            const updates = {
                staff_first_name: firstName.trim(),
                staff_middle_name: middleName.trim() || null,
                staff_last_name: lastName.trim() || null,
                staff_pseudonym: pseudonym.trim() || null,
                staff_position: position,
                staff_bio: bio.trim() || null,
                staff_birthday: birthday || null,
                join_date: joinDate || null,
                staff_picture: pictureUrl.trim() || null,
                staff_isactive: isActive,
                is_editorial_board: isEdBoard
            }

            const { data, error } = await supabase
                .from("staff")
                .update(updates)
                .eq("staff_id", staff.staff_id)
                .select()
                .single()

            if (error) throw error

            if (onSave) {
                const updatedRecord = {
                    ...staff,
                    ...updates,
                    ...(data || {}),
                    staff_display_name: `${firstName.trim()} ${lastName.trim()}`.trim()
                }
                onSave(updatedRecord)
            }
            onClose()
        } catch (err) {
            console.error("Error updating staff record:", err)
            setErrorMessage(err.message || "Failed to update staff record. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="Edit-Modal-Overlay" onClick={onClose}>
            <div className="Edit-Modal-Card" onClick={(e) => e.stopPropagation()}>
                <div className="Edit-Modal-Header">
                    <div>
                        <h2>Edit Staff Member</h2>
                        <span className="Edit-Modal-Subtitle">Staff ID: #{staff.staff_id}</span>
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
                                placeholder="Pseudonym / Byline Handle"
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

                    <div className="Edit-Form-Group">
                        <label>Profile Picture URL</label>
                        <div className="Edit-Picture-Row">
                            <input
                                type="url"
                                value={pictureUrl}
                                onChange={(e) => setPictureUrl(e.target.value)}
                                placeholder="https://media.philartisan.org/staff-photos/name.jpg"
                            />
                            {pictureUrl && (
                                <img
                                    src={pictureUrl}
                                    alt="Preview"
                                    className="Edit-Picture-Preview"
                                    onError={(e) => { e.currentTarget.style.display = "none" }}
                                />
                            )}
                        </div>
                    </div>

                    <div className="Edit-Form-Group">
                        <label>Bio</label>
                        <textarea
                            rows="4"
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
                            {saving ? "Saving Changes..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditStaffModal
