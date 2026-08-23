import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient.js"

import "./AdminPageLogIn.css"

const AdminPageLogIn = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg("")

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if (error) {
            setErrorMsg(error.message || "Invalid credentials.")
            setLoading(false)
        } else {
            navigate("/admin/dashboard")
        }
    }

    return (
        <div className="Admin-Log-In-Full-Page">
            <div className="Admin-Log-In-Form-Container">
                <form onSubmit={handleSubmit} className="Admin-Log-In-Form">
                    <div>
                        <h1> Admin Portal </h1>
                        <p> Sign-in using your provided credentials to explore the dashboard</p>
                    </div>
                    {errorMsg && <div className="Admin-Login-Error" style={{ color: '#ff4d4d', marginTop: '10px', fontSize: '0.9rem', textAlign: 'center' }}>{errorMsg}</div>}
                    <div className="Admin-Mid-Bottom-Part">
                        <div className="Admin-Log-In-Form-Inputs">
                            <div>
                                <p> EMAIL ADDRESS </p>
                                <input
                                    type="email"
                                    placeholder="admin@tpa.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <p> PASSWORD </p>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="Admin-Log-In-Form-Button">
                        <button type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Log-In"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )

}

export default AdminPageLogIn