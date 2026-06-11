import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./AdminPageLogIn.css"

const AdminPageLogIn = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const navigate = useNavigate()

    const handleSubmit = (submitted) => {
        submitted.preventDefault()
        setLoading(true);
        setErrorMsg("")

        setTimeout(() => {
            if(email === "admin@tpa.com" && password === "admin") {// temporary placeholder credentials
            localStorage.setItem("isAuth", "true")
            navigate("/admin/dashboard")
        } else {
            setErrorMsg("Invalid Credentials.")
            setLoading(false)
        }
    })
    }

    return(
        <div className = "Admin-Log-In-Full-Page">
            <div className = "Admin-Log-In-Form-Container">
                <form onSubmit = {handleSubmit} className = "Admin-Log-In-Form">
                    <div>
                        <h1> Admin Portal </h1>
                        <p> Sign-in using your provided credentials to explore the dashboard</p>
                    </div>
                    {errorMsg && <div className = "Admin-Login-Error" style={{ color: '#ff4d4d', marginTop: '10px', fontSize: '0.9rem', textAlign: 'center' }}>{errorMsg}</div>}
                    <div className = "Admin-Mid-Bottom-Part">
                        <div className = "Admin-Log-In-Form-Inputs">
                            <div>
                                <p> EMAIL ADDRESS </p>
                                <input
                                    type = "email"
                                    placeholder = "admin@tpa.com"
                                    value = { email }
                                    onChange = {(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <p> PASSWORD </p>
                                <input
                                    type = "password"
                                    placeholder = "••••••••" 
                                    value = {password}
                                    onChange = {(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className = "Admin-Log-In-Form-Button">
                        <button type = "submit" disabled = {loading}> 
                            <h2> {loading ? "Logging in..." : "Log-In"} </h2>
                        </button>
                    </div>
                </form>    
            </div>
        </div>
    )

}

export default AdminPageLogIn