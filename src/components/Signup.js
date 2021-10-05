import React, {useState} from 'react'
import { useHistory } from 'react-router-dom'

const Signup = (props) => {
    const [credentials, setCredentials] = useState({name:"", email:"", password:"", cpassword:""})
    let history = useHistory()
    const handleSubmit= async(e)=>{
        e.preventDefault();
        const {name, email, password} = credentials;

        const response = await fetch("http://localhost:5000/api/auth/createuser",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjE1MDI3ZWU0M2U1MDcwMDVlN2M1YmRiIn0sImlhdCI6MTYzMjY0MzIwMH0.D5rvfgoDVTuFWAftPmISfftHm2eXPV-eKtQ7yGJhzY0"
            },
            body: JSON.stringify({name, email, password})
        })
        const json = await response.json()
        console.log(json);
        if (json.success){
            // Save the auth token and Redirect
            localStorage.setItem('token', json.authtoken)
            history.push("/home")
            props.showAlert("Account Created Successfully", "success")
        }
        else{
            props.showAlert("Invalid Credentials", "danger")
        }
    }

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    return (
        <div className="container mt-3">
            <h2>Signup/Create Account to Continue to iNotebook...</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" onChange={onChange} name="name" id="email" aria-describedby="emailHelp"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" required minLength={5} onChange={onChange} name="email" id="email" aria-describedby="emailHelp"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" required minLength={5} onChange={onChange} name="password" id="password"/>
                </div>
                {/* <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" onChange={onChange} name={cpassword} id="cpassword"/>
                </div> */}
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup
