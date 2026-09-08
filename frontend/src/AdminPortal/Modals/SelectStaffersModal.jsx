import { useRef, useEffect, useState } from "react"
import "../Modals/SelectStaffersModal.css"

const SelectStaffersModal = ({ isOpen, onClose, staffers, onConfirm }) => {
    const dialogRef = useRef(null)
    const [selectedStaff, setSelectedStaff] = useState([])
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const dialog = dialogRef.current
        if (isOpen && !dialog.open) {
            dialog.showModal()
            setSelectedStaff([])
            setSearchQuery("")
        } else if (!isOpen && dialog?.open) {
            dialog.close()
        }
    }, [isOpen])

    const handleBackdropClick = (action) => {
        if (action.target === dialogRef.current) {
            onClose()
        }
    }

    const handleToggle = (staffMember) => {
        setSelectedStaff((prev) => {
            if (prev.some(s => s.staff_id === staffMember.staff_id)) {
                return prev.filter(s => s.staff_id !== staffMember.staff_id)
            } else {
                return [...prev, staffMember]
            }
        })
    }

    const handleConfirmSelection = () => {
        onConfirm(selectedStaff)
        onClose()
    }

    const filteredStaffers = staffers?.filter(staffItem => {
        if (!searchQuery.trim()) return true
        const query = searchQuery.toLowerCase().trim()
        const displayName = (staffItem.staff_display_name || `${staffItem.staff_first_name || ""} ${staffItem.staff_last_name || ""}`).toLowerCase()
        const pseudonym = (staffItem.staff_pseudonym || "").toLowerCase()
        const position = (staffItem.staff_position || "").toLowerCase()
        return displayName.includes(query) || pseudonym.includes(query) || position.includes(query)
    }) || []

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            onClick={handleBackdropClick}
            className="Select-Staffers-Dialog"
        >
            <div className="Dialog-Box">
                <div className="Staff-Modal-Header">
                    <h2>Select Staff</h2>
                    <button type="button" className="Staff-Modal-Close-X" onClick={onClose} aria-label="Close modal">
                        ×
                    </button>
                </div>

                {selectedStaff.length > 0 && (
                    <div className="Selected-Staff-Chips">
                        {selectedStaff.map((staffShowItem) => (
                            <span key={staffShowItem.staff_id} className="Staff-Chip">
                                {staffShowItem.staff_display_name}
                                <button
                                    type="button"
                                    onClick={() => handleToggle(staffShowItem)}
                                    className="Staff-Chip-Remove"
                                    aria-label={`Remove ${staffShowItem.staff_display_name}`}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                <div className="Staff-Modal-Search-Container">
                    <input
                        type="text"
                        className="Staff-Modal-Search-Input"
                        placeholder="Search staff by name or pseudonym..."
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

                <div className="Inside-Dialog-Box">
                    <div className="Staffer-Section">
                        {filteredStaffers.length > 0 ? (
                            filteredStaffers.map((staffItem) => {
                                const isChecked = selectedStaff.some(s => s.staff_id === staffItem.staff_id)
                                return (
                                    <label key={staffItem.staff_id} className="Staffer-Item-Label">
                                        <div className={`Staffer-Item ${isChecked ? "selected" : ""}`}>
                                            <input
                                                className="Staffer-Item-Checkbox"
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleToggle(staffItem)}
                                            />
                                            <div className="Staffer-Item-Details">
                                                <strong className="Staffer-Item-Name">{staffItem.staff_display_name}</strong>
                                                {staffItem.staff_pseudonym && (
                                                    <span className="Staffer-Item-Pseudonym">
                                                        ({staffItem.staff_pseudonym})
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </label>
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
        </dialog>
    )
}

export default SelectStaffersModal