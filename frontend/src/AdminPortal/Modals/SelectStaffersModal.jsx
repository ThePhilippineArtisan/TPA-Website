import React, { useState, useEffect } from "react"
import "./SelectStaffersModal.css"

const SelectStaffersModal = ({
    isOpen,
    onClose,
    staffers = [],
    initialSelectedStaffers = [],
    onConfirm,
    title = "Select Staff"
}) => {
    const [selectedStaff, setSelectedStaff] = useState([])
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        if (isOpen) {
            setSelectedStaff(
                (initialSelectedStaffers || []).map(s => ({
                    ...s,
                    use_pseudonym: Boolean(s.use_pseudonym)
                }))
            )
            setSearchQuery("")
        }
    }, [isOpen, initialSelectedStaffers])

    if (!isOpen) return null

    const handleToggleSelect = (staffMember) => {
        setSelectedStaff(prev => {
            const exists = prev.some(s => s.staff_id === staffMember.staff_id)
            if (exists) {
                return prev.filter(s => s.staff_id !== staffMember.staff_id)
            } else {
                return [
                    ...prev,
                    {
                        ...staffMember,
                        use_pseudonym: false
                    }
                ]
            }
        })
    }

    const handleTogglePseudonym = (staffId, e) => {
        if (e) e.stopPropagation()
        setSelectedStaff(prev =>
            prev.map(s => {
                if (s.staff_id === staffId) {
                    return { ...s, use_pseudonym: !s.use_pseudonym }
                }
                return s
            })
        )
    }

    const handleConfirmSelection = () => {
        if (onConfirm) {
            onConfirm(selectedStaff)
        }
        onClose()
    }

    const filteredStaffers = (staffers || []).filter(staffItem => {
        if (!searchQuery.trim()) return true
        const query = searchQuery.toLowerCase().trim()
        const displayName = (
            staffItem.staff_display_name ||
            `${staffItem.staff_first_name || ""} ${staffItem.staff_last_name || ""}`
        ).toLowerCase()
        const pseudonym = (staffItem.staff_pseudonym || "").toLowerCase()
        const position = (staffItem.staff_position || "").toLowerCase()
        return displayName.includes(query) || pseudonym.includes(query) || position.includes(query)
    })

    return (
        <div className="Staff-Modal-Overlay" onClick={onClose}>
            <div className="Dialog-Box" onClick={(e) => e.stopPropagation()}>
                <div className="Staff-Modal-Header">
                    <h2>{title}</h2>
                    <button
                        type="button"
                        className="Staff-Modal-Close-X"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                {/* Selected Staff Chips Preview */}
                {selectedStaff.length > 0 && (
                    <div className="Selected-Staff-Chips">
                        {selectedStaff.map(s => {
                            const hasPseudonym = Boolean(s.staff_pseudonym)
                            const isUsingPseudonym = hasPseudonym && Boolean(s.use_pseudonym)
                            const creditedName = isUsingPseudonym ? s.staff_pseudonym : (s.staff_display_name || `${s.staff_first_name || ""} ${s.staff_last_name || ""}`)

                            return (
                                <span key={s.staff_id} className={`Staff-Chip ${isUsingPseudonym ? "using-pseudonym" : ""}`}>
                                    <span className="Staff-Chip-Name">{creditedName}</span>
                                    {hasPseudonym && (
                                        <button
                                            type="button"
                                            className={`Staff-Chip-Pseudonym-Toggle ${isUsingPseudonym ? "active" : ""}`}
                                            title={isUsingPseudonym ? "Using Pen Name. Click to use Real Name" : "Using Real Name. Click to use Pen Name"}
                                            onClick={(e) => handleTogglePseudonym(s.staff_id, e)}
                                        >
                                            {isUsingPseudonym ? "Pen Name" : "Real Name"}
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleToggleSelect(s)}
                                        className="Staff-Chip-Remove"
                                        aria-label={`Remove ${s.staff_display_name}`}
                                    >
                                        ×
                                    </button>
                                </span>
                            )
                        })}
                    </div>
                )}

                {/* Search Bar */}
                <div className="Staff-Modal-Search-Container">
                    <input
                        type="text"
                        className="Staff-Modal-Search-Input"
                        placeholder="Search staff by name, pseudonym, or position..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            className="Staff-Modal-Search-Clear"
                            onClick={() => setSearchQuery("")}
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Scrollable Staffer List */}
                <div className="Inside-Dialog-Box">
                    <div className="Staffer-Section">
                        {filteredStaffers.length > 0 ? (
                            filteredStaffers.map((staffItem) => {
                                const selectedEntry = selectedStaff.find(s => s.staff_id === staffItem.staff_id)
                                const isChecked = Boolean(selectedEntry)
                                const hasPseudonym = Boolean(staffItem.staff_pseudonym)
                                const isUsingPseudonym = isChecked && hasPseudonym && Boolean(selectedEntry.use_pseudonym)

                                return (
                                    <div
                                        key={staffItem.staff_id}
                                        className={`Staffer-Item ${isChecked ? "selected" : ""}`}
                                        onClick={() => handleToggleSelect(staffItem)}
                                    >
                                        <input
                                            className="Staffer-Item-Checkbox"
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleToggleSelect(staffItem)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="Staffer-Item-Details">
                                            <strong className="Staffer-Item-Name">
                                                {staffItem.staff_display_name || `${staffItem.staff_first_name || ""} ${staffItem.staff_last_name || ""}`}
                                            </strong>
                                            {hasPseudonym && (
                                                <span className="Staffer-Item-Pseudonym">
                                                    (Pseudonym: {staffItem.staff_pseudonym})
                                                </span>
                                            )}
                                        </div>

                                        {/* Pseudonym Toggle Button if Selected & Staffer has Pseudonym */}
                                        {isChecked && hasPseudonym && (
                                            <button
                                                type="button"
                                                className={`Staffer-Pseudonym-Action-Btn ${isUsingPseudonym ? "pseudonym-active" : ""}`}
                                                onClick={(e) => handleTogglePseudonym(staffItem.staff_id, e)}
                                                title="Toggle whether to publish under pseudonym or real name"
                                            >
                                                {isUsingPseudonym ? `✓ Using: "${staffItem.staff_pseudonym}"` : `Credit as Real Name`}
                                            </button>
                                        )}
                                    </div>
                                )
                            })
                        ) : (
                            <div className="Staffer-No-Results">
                                No staff found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                </div>

                <div className="Staff-Modal-Footer">
                    <button type="button" className="Staff-Modal-Cancel-Btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="button" className="Staff-Modal-Confirm-Btn" onClick={handleConfirmSelection}>
                        Confirm ({selectedStaff.length})
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SelectStaffersModal