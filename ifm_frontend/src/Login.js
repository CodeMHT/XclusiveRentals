import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import cla from "./clacoupe.avif";
import axios from "axios";

const Login = () => {

    const redirect = useNavigate()
    const [errMessage, setErrorMessage] = useState("") //message for if info is wrong

    const [login, setLogIn] = useState({
        email: "",
        password: ""
    })

    //ensure scrollbar resest to the top
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const Submit = (event) => {
        event.preventDefault()

        axios.get(`https://xclusive-service.onrender.com/user/${login.email}/${login.password}`)
            .then(res => {

                if (res.data === "User Not Found") {
                    setErrorMessage("Password and/or email is incorrect")
                } else if (res.data === "Error in server") {
                    setErrorMessage("Error Loggin In")
                } else {
                    //redirect to the dashboard
                    localStorage.setItem("customer_id", res.data)
                    redirect("/profile", { state: res.data })
                }
            })


    }
    return (
        <main>
            {/**<!-- /*
          * Bootstrap 5
          * Template Name: Furni
          * Template Author: Untree.co
          * Template URI: https://untree.co/
          * License: https://creativecommons.org/licenses/by/3.0/
          */}

            {/** Navigation*/}

            < nav className="custom-navbar navbar navbar navbar-expand-md navbar-dark bg-green" arial-label="Furni navigation bar" >

                <div className="container">
                    <a className="navbar-brand" href="/">Xclusive Rentals<span>.</span></a>

                    <div className="collapse navbar-collapse" id="navbarsFurni">
                        <ul className="custom-navbar-nav navbar-nav ms-auto mb-2 mb-md-0">
                            <li className="nav-item active">
                                <a className="nav-link" href="/">Home</a>
                            </li>
                            <li><a className="nav-link" href="/services">Vehicles</a></li>
                            <li><a className="nav-link" href="/signup">Sign Up/Log In</a></li>
                        </ul>

                    </div>
                </div>

            </nav >
            {/**Navigation */}

            {/**Start Hero Section*/}
            <div style={{ height: 5, marginTop: -50 }} className="hero">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-lg-5">
                            <div >
                                <h1 style={{ marginLeft: 150, textAlign: "center" }}>Login</h1>
                            </div>
                        </div>
                        <div className="col-lg-7">

                        </div>
                    </div>
                </div>
            </div>
            {/**End Hero Section */}

            <div style={{ marginTop: -40 }} className="untree_co-section">
                <div className="container">

                    <form onSubmit={Submit}> <div className="row">
                        <div className="col-md-6 mb-5 mb-md-0">
                            <div className="p-3 p-lg-5 border bg-white">

                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <label htmlFor="c_email_address" className="text-black">Email Address: <span className="text-danger">*</span></label>
                                        <input type="email" className="form-control" id="c_email_address" name="c_email_address" placeholder="example@gmail.com" required onChange={e => setLogIn({ ...login, email: e.target.value })} />
                                    </div>
                                </div>
                                <br />
                                <div className="form-group row">
                                    <div className="col-md-6">
                                        <label htmlFor="c_account_password" className="text-black">Account Password: <span className="text-danger">*</span></label>
                                        <input type="password" className="form-control" id="c_account_password" name="c_account_password" placeholder="" required onChange={e => setLogIn({ ...login, password: e.target.value })} />
                                    </div>

                                </div>

                                <br />
                                <button className="btn btn-secondary me-2">Log In</button>
                                <br />
                                <h6 style={{ color: "red" }}>{errMessage && errMessage}</h6>
                            </div>

                        </div>

                    </div>
                    </form>
                </div>
            </div>
            {/**Start Footer Section*/}
            <footer className="footer-section">
                <div className="container relative">

                    <div className="sofa-img">
                        <img src={cla} alt="mercedes cla" className="img-fluid" />
                    </div>

                    <div className="row g-5 mb-5">
                        <div className="col-lg-4">
                            <div className="mb-4 footer-logo-wrap"><a href="/" className="footer-logo">Xclusive Rentals<span>.</span></a></div>
                            <p className="mb-4">Ensure you ride in style wherever you are at all times</p>

                        </div>

                        <div className="col-lg-8">
                            <div className="row links-wrap">
                                <div className="col-6 col-sm-6 col-md-3">

                                </div>

                                <div className="col-6 col-sm-6 col-md-3">

                                </div>

                                <div className="col-6 col-sm-6 col-md-3">

                                </div>

                                <div className="col-6 col-sm-6 col-md-3">
                                    <ul className="list-unstyled">
                                        <li><a href="/">Home</a></li>
                                        <li><a href="/services">Services</a></li>
                                        <li><a href="signup">Sign Up/Log In</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/**License information: https://untree.co/license/ */}

                    <div className="col-lg-6 text-center text-lg-end">
                        <ul className="list-unstyled d-inline-flex ms-auto">
                            <li className="me-4"><i>Terms &amp; Conditions</i></li>

                        </ul>
                    </div>
                </div>
            </footer>
            {/**End Footer Section*/}


        </main >
    )
}

export default Login;