import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { slugify, replaceUnderscore } from "../utils/slugifyUtils.js";
import { getStaffBadge } from "../utils/staffUtils.js";

import "../CSS/StaffDirectory.css";

const CATEGORY_TABS = [
    { key: "editorial-board", label: "Editorial Board", path: "/editorial-board" },
    { key: "senior-staffers", label: "Senior Staffers", path: "/senior-staffers" },
    { key: "junior-staffers", label: "Junior Staffers", path: "/junior-staffers" },
    { key: "all", label: "All Staff", path: "/staff" }
];

const getInitials = (displayName, firstName, lastName) => {
    if (firstName && lastName) {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (!displayName) return "TPA";
    const cleaned = replaceUnderscore(displayName).trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const StaffDirectoryPage = ({ initialCategory }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const activeCategory = useMemo(() => {
        if (initialCategory) return initialCategory;
        const path = location.pathname.toLowerCase();
        if (path.includes("editorial-board")) return "editorial-board";
        if (path.includes("senior-staffer")) return "senior-staffers";
        if (path.includes("junior-staffer")) return "junior-staffers";
        return "all";
    }, [initialCategory, location.pathname]);

    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [availableYears, setAvailableYears] = useState(["AY 2025 - 2026", "AY 2024 - 2025", "AY 2023 - 2024"]);
    const [selectedYear, setSelectedYear] = useState("AY 2025 - 2026");

    useEffect(() => {
        const fetchStaffAndYears = async () => {
            setLoading(true);
            try {
                const { data: staffData, error: staffError } = await supabase
                    .from("staff")
                    .select("staff_id, staff_first_name, staff_last_name, staff_display_name, staff_pseudonym, staff_position, is_editorial_board, staff_picture, staff_order")
                    .eq("staff_isactive", true)
                    .not("staff_position", "is", null)
                    .order("staff_order", { ascending: true });

                if (staffError) {
                    console.error("Error fetching staff directory:", staffError);
                } else {
                    setStaff(staffData || []);
                }

                const { data: releaseYearsData } = await supabase
                    .from("releases")
                    .select("academic_year")
                    .not("academic_year", "is", null);

                const yearSet = new Set();
                yearSet.add("AY 2025 - 2026");

                (releaseYearsData || []).forEach(r => {
                    if (r.academic_year && r.academic_year.trim()) {
                        const trimmed = r.academic_year.trim();
                        if (trimmed.toUpperCase().startsWith("AY ")) {
                            yearSet.add(trimmed);
                        } else {
                            yearSet.add(`AY ${trimmed}`);
                        }
                    }
                });

                const sortedYears = Array.from(yearSet).sort().reverse();
                setAvailableYears(sortedYears);
            } catch (err) {
                console.error("Unexpected error in staff directory:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStaffAndYears();
    }, []);

    const isCurrentActiveYear = selectedYear === "AY 2025 - 2026" || selectedYear === "ALL";

    const currentStaff = useMemo(() => {
        if (!isCurrentActiveYear) return [];
        return staff;
    }, [staff, isCurrentActiveYear]);

    const editorialBoard = useMemo(() => {
        return currentStaff.filter(m => m.is_editorial_board === true);
    }, [currentStaff]);

    const seniorStaffers = useMemo(() => {
        return currentStaff.filter(m =>
            !m.is_editorial_board &&
            ([12, 13, 14, 15, 16].includes(m.staff_order) || m.staff_position?.toLowerCase().includes("senior"))
        );
    }, [currentStaff]);

    const juniorStaffers = useMemo(() => {
        return currentStaff.filter(m =>
            !m.is_editorial_board &&
            !([12, 13, 14, 15, 16].includes(m.staff_order) || m.staff_position?.toLowerCase().includes("senior"))
        );
    }, [currentStaff]);

    const getCategoryCount = (tabKey) => {
        switch (tabKey) {
            case "editorial-board":
                return editorialBoard.length;
            case "senior-staffers":
                return seniorStaffers.length;
            case "junior-staffers":
                return juniorStaffers.length;
            case "all":
            default:
                return currentStaff.length;
        }
    };

    const filterBySearch = (list) => {
        if (!searchQuery.trim()) return list;
        const q = searchQuery.toLowerCase().trim();
        return list.filter(m => {
            const name = (m.staff_display_name || "").toLowerCase();
            const pseudo = (m.staff_pseudonym || "").toLowerCase();
            const pos = (m.staff_position || "").toLowerCase();
            return name.includes(q) || pseudo.includes(q) || pos.includes(q);
        });
    };

    const filteredEditorial = useMemo(() => filterBySearch(editorialBoard), [editorialBoard, searchQuery]);
    const filteredSenior = useMemo(() => filterBySearch(seniorStaffers), [seniorStaffers, searchQuery]);
    const filteredJunior = useMemo(() => filterBySearch(juniorStaffers), [juniorStaffers, searchQuery]);

    const headerDetails = useMemo(() => {
        switch (activeCategory) {
            case "editorial-board":
                return {
                    title: "Editorial Board",
                    description: "The Editorial Board serves as the custodian of truth, justice, (and chismis) in the spirit of true campus journalism, by the students, for the students."
                };
            case "senior-staffers":
                return {
                    title: "Senior Staffers",
                    description: "The Senior Staffers are the veterans of the publication, from coverages, write-ups, and the occasional chismis."
                };
            case "junior-staffers":
                return {
                    title: "Junior Staffers",
                    description: "The Junior Staffers are the new blood of the publication, ready to take up the mantel after undergoing rigorous sifting process."
                };
            default:
                return {
                    title: "The Artisan Staff",
                    description: "Meet the student journalists, editors, photojournalists, designers, and video producers of Technological University of the Philippines Manila."
                };
        }
    }, [activeCategory]);

    const handleTabClick = (tabPath) => {
        navigate(tabPath);
    };

    return (
        <div className="Staff-Directory-Page">
            <div className="Staff-Directory-Hero">
                <div className="Staff-Directory-Hero-Content">
                    <h1 className="Staff-Directory-Title">{headerDetails.title}</h1>
                    <p className="Staff-Directory-Subtitle">{headerDetails.description}</p>
                </div>
            </div>

            <div className="Staff-Directory-Controls-Wrapper">
                <nav className="Staff-Filter-Nav" aria-label="Staff directory category filter">
                    <div className="Staff-Category-Pills">
                        {CATEGORY_TABS.map(tab => {
                            const isActive = activeCategory === tab.key;
                            const count = getCategoryCount(tab.key);
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    className={`Staff-Filter-Pill ${isActive ? "active" : ""}`}
                                    onClick={() => handleTabClick(tab.path)}
                                    aria-pressed={isActive}
                                >
                                    <span className="Pill-Label">{tab.label}</span>
                                    {count > 0 && <span className="Pill-Count">{count}</span>}
                                </button>
                            );
                        })}
                    </div>

                    <div className="Staff-Year-Filter-Container">
                        <label htmlFor="staff-academic-year-filter" className="Staff-Year-Filter-Label">
                            Academic Year:
                        </label>
                        <select
                            id="staff-academic-year-filter"
                            className="Staff-Year-Select"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            {availableYears.map(yr => (
                                <option key={yr} value={yr}>{yr}</option>
                            ))}
                            <option value="ALL">All Academic Years</option>
                        </select>
                    </div>

                    <div className="Staff-Search-Container">
                        <svg className="Staff-Search-Icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search staff..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="Staff-Search-Input"
                            aria-label="Search staff members"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="Staff-Search-Clear"
                                onClick={() => setSearchQuery("")}
                                aria-label="Clear search"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        )}
                    </div>
                </nav>
            </div>

            <main className="Staff-Directory-Container">
                {loading ? (
                    <div className="Staff-Directory-Loading">
                        <div className="Staff-Directory-Spinner" />
                        <p>Loading staff roster...</p>
                    </div>
                ) : currentStaff.length === 0 ? (
                    <div className="Staff-Directory-Empty">
                        <p>No archived staff records found for {selectedYear}. Current roster records reflect AY 2025 - 2026.</p>
                        <button
                            type="button"
                            className="Staff-Filter-Pill active"
                            style={{ marginTop: "1.25rem" }}
                            onClick={() => setSelectedYear("AY 2025 - 2026")}
                        >
                            Return to AY 2025 - 2026
                        </button>
                    </div>
                ) : (
                    <>
                        {(activeCategory === "editorial-board" || activeCategory === "all") && (
                            <section className="Staff-Tier-Section">
                                {activeCategory === "all" && (
                                    <div className="Staff-Tier-Header">
                                        <h2>Editorial Board</h2>
                                        <span className="Staff-Tier-Count">{filteredEditorial.length} Members</span>
                                    </div>
                                )}

                                {filteredEditorial.length === 0 ? (
                                    <div className="Staff-Directory-Empty">
                                        <p>No editorial board members matched your search.</p>
                                    </div>
                                ) : (
                                    <div className="Editorial-Board">
                                        {filteredEditorial.map(isEdBoard => (
                                            <Link
                                                to={`/staff/${slugify(isEdBoard.staff_display_name)}`}
                                                className="Editorial-Board-Individual-Card"
                                                key={isEdBoard.staff_id || isEdBoard.staff_display_name}
                                                style={{ textDecoration: "none", color: "inherit" }}
                                            >
                                                <div className="Editorial-Board-Pad-When-Hover">
                                                    <div className="Editorial-Board-Individual">
                                                        {isEdBoard.staff_picture ? (
                                                            <img
                                                                src={isEdBoard.staff_picture}
                                                                alt={isEdBoard.staff_display_name}
                                                                loading="lazy"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = "none";
                                                                    if (e.currentTarget.nextSibling) {
                                                                        e.currentTarget.nextSibling.style.display = "flex";
                                                                    }
                                                                }}
                                                            />
                                                        ) : null}
                                                        <div
                                                            className="Ed-Board-Initials"
                                                            style={{ display: isEdBoard.staff_picture ? "none" : "flex" }}
                                                        >
                                                            {getInitials(isEdBoard.staff_display_name, isEdBoard.staff_first_name, isEdBoard.staff_last_name)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="Editorial-Board-Card-Text">
                                                    <h3>{replaceUnderscore(isEdBoard.staff_display_name)}</h3>
                                                    <p className="Editorial-Board-Role">{replaceUnderscore(isEdBoard.staff_position)}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {(activeCategory === "senior-staffers" || activeCategory === "all") && (
                            <section className="Staff-Tier-Section">
                                {activeCategory === "all" && (
                                    <div className="Staff-Tier-Header">
                                        <h2>Senior Staffers</h2>
                                        <span className="Staff-Tier-Count">{filteredSenior.length} Members</span>
                                    </div>
                                )}

                                {filteredSenior.length === 0 ? (
                                    <div className="Staff-Directory-Empty">
                                        <p>No senior staffers matched your search.</p>
                                    </div>
                                ) : (
                                    <div className="Regular-Staffers-Whole">
                                        {filteredSenior.map(seniorStaffMember => (
                                            <Link
                                                to={`/staff/${slugify(seniorStaffMember.staff_display_name)}`}
                                                className="Staffer-Item"
                                                key={seniorStaffMember.staff_id || seniorStaffMember.staff_display_name}
                                                style={{ textDecoration: "none" }}
                                            >
                                                <div className="Staffer-Item-Badge">
                                                    {getStaffBadge(seniorStaffMember.staff_position, false)}
                                                </div>
                                                <div className="Staffer-Names-Individual">
                                                    <h3>{seniorStaffMember.staff_display_name}</h3>
                                                    <p>{replaceUnderscore(seniorStaffMember.staff_position)}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {(activeCategory === "junior-staffers" || activeCategory === "all") && (
                            <section className="Staff-Tier-Section">
                                {activeCategory === "all" && (
                                    <div className="Staff-Tier-Header">
                                        <h2>Junior Staffers</h2>
                                        <span className="Staff-Tier-Count">{filteredJunior.length} Members</span>
                                    </div>
                                )}

                                {filteredJunior.length === 0 ? (
                                    <div className="Staff-Directory-Empty">
                                        <p>No junior staffers matched your search.</p>
                                    </div>
                                ) : (
                                    <div className="Regular-Staffers-Whole">
                                        {filteredJunior.map(juniorStaffMember => (
                                            <Link
                                                to={`/staff/${slugify(juniorStaffMember.staff_display_name)}`}
                                                className="Staffer-Item"
                                                key={juniorStaffMember.staff_id || juniorStaffMember.staff_display_name}
                                                style={{ textDecoration: "none" }}
                                            >
                                                <div className="Staffer-Item-Badge Staffer-Badge-JR">
                                                    {getStaffBadge(juniorStaffMember.staff_position, true)}
                                                </div>
                                                <div className="Staffer-Names-Individual">
                                                    <h3>{juniorStaffMember.staff_display_name}</h3>
                                                    <p>{replaceUnderscore(juniorStaffMember.staff_position)}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default StaffDirectoryPage;
