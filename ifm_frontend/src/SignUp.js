import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//Image Imports
import cla from "./clacoupe.avif";

const SignUp = () => {

    const redirect = useNavigate()  // Page redirects
    const [confirm, setConfirm] = useState("")  //Passsword check
    const [errorMessage, setErrorMessage] = useState("") //prompt for user


    const [details, setDetails] = useState({
        user_name: "",
        user_phone: 0,
        user_email: "",
        user_image: {},
        user_type: "C",
        user_address: "",
        user_code: 0,
        user_pass: "",
        user_LCode: "",
        user_Lnumber: ""

    })


    const Submit = (event) => {
        event.preventDefault()

        //ensure password has special characters
        const regex = /(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/

        let form = new FormData()

        form.append("user_name", details.user_name)
        form.append("user_phone", details.user_phone)
        form.append("user_email", details.user_email)
        form.append("image", details.user_image)
        form.append("user_type", details.user_type)
        form.append("user_address", details.user_address)
        form.append("user_code", details.user_code)
        form.append("user_pass", details.user_pass)
        form.append("lcode", details.user_LCode)
        form.append("lnumber", details.user_Lnumber)

        if (details.user_pass === confirm.toString()) {

            if (regex.test(details.user_pass)) {
                //Sign Up User

                axios.post(`https://xclusive-service.onrender.com/user`, form)
                    .then(res => {
                        if (res.data === "Success") {
                            alert("Successfully Signed Up")
                            redirect("/login")
                        } else if (res.data === "Exists") {
                            setErrorMessage("")
                            alert("This Email already exists")
                        } else {
                            setErrorMessage("Error Signing up. Please reload page and try again")
                        }
                    })
            } else {
                setErrorMessage("Please add atleast 1 special character and/or a digit")
            }
        } else {
            setErrorMessage("Passwords Do Not Match")
        }
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
                                <h1 style={{ marginLeft: 150, textAlign: "center" }}>Sign Up</h1>
                            </div>
                        </div>
                        <div className="col-lg-7">

                        </div>
                    </div>
                </div>
            </div>
            {/**End Hero Section */}

            <div style={{ marginTop: -60 }} className="untree_co-section">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-md-12">
                            <div className="border p-4 rounded" role="alert">
                                Returning customer? <a href="/login">Click here</a> to login
                            </div>
                        </div>
                    </div>

                    <form onSubmit={Submit}> <div className="row">
                        <div className="col-md-6 mb-5 mb-md-0">
                            <h2 className="h3 mb-3 text-black">Details</h2>
                            <div className="p-3 p-lg-5 border bg-white">

                                <div className="form-group row">
                                    <div className="col-md-6">
                                        <label htmlFor="c_fname" className="text-black">Name: <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" id="c_fname" name="c_fname" placeholder="Sarah Smith" required onChange={e => setDetails({ ...details, user_name: e.target.value })} />
                                    </div>

                                </div>

                                <div className="form-group row" style={{ marginTop: 15 }}>
                                    <div className="col-md-12">
                                        <label htmlFor="c_email_address" className="text-black">Email Address: <span className="text-danger">*</span></label>
                                        <input type="email" className="form-control" id="c_email_address" name="c_email_address" placeholder="example@gmail.com" required onChange={e => setDetails({ ...details, user_email: e.target.value })} />
                                    </div>
                                </div>

                                <div className="form-group mt-3">
                                    <label htmlFor="cell" className="text-black">Phone Number: <span className="text-danger">*</span></label>
                                    <input type="number" minLength={10} maxLength={10} className="form-control" id="cell" name="cell" required onChange={e => setDetails({ ...details, user_phone: e.target.value })} />
                                </div>

                                <div className="form-group mt-3">
                                    <label htmlFor="image" className="text-black">Photo: <i>(optional)</i></label>
                                    <input type="file" className="form-control" id="image" name="image" onChange={e => setDetails({ ...details, user_image: e.target.files[0] })} />
                                </div>
                                <br />
                                <div className="form-group row">
                                    <div className="col-md-6">
                                        <label htmlFor="c_address" className="text-black">Address: <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" id="c_address" name="c_address" placeholder="1 Main Street" required onChange={e => setDetails({ ...details, user_address: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="c_postal_zip" className="text-black">Postal / Zip <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" id="c_postal_zip" name="c_postal_zip" required onChange={e => setDetails({ ...details, user_code: e.target.value })} />
                                    </div>



                                    <div className="col-md-6" style={{ marginTop: 15 }}>
                                        <label htmlFor="c_account_password" className="text-black">Account Password: <span className="text-danger">*</span></label>
                                        <input type="password" minLength={8} className="form-control" id="c_account_password" name="c_account_password" placeholder="" required onChange={e => setDetails({ ...details, user_pass: e.target.value })} />
                                    </div>

                                    <div className="col-md-6" style={{ marginTop: 15 }}>
                                        <label htmlFor="c_password" className="text-black">Confirm Password: <span className="text-danger">*</span></label>
                                        <input type="password" minLength={8} className="form-control" id="c_password" name="c_password" placeholder="" required onChange={e => setConfirm(e.target.value)} />
                                    </div>.


                                </div>
                                <div className="form-group row">
                                    <div className="col-md-6">
                                        <label htmlFor="c_password" className="text-black">License Code: <span className="text-danger">*</span></label>
                                        <select id="code" className="form-select" required onChange={e => setDetails({ ...details, user_LCode: e.target.value })}>
                                            <option defaultValue=".">Choose...</option>
                                            <option value="A1">A1</option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="EB">EB</option>
                                            <option value="C1">C1</option>
                                            <option value="C">C</option>
                                            <option value="EC1">EC1</option>
                                            <option value="EC">EC</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="license" className="text-black">License Number:<span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" id="license" name="license" placeholder="" required onChange={e => setDetails({ ...details, user_Lnumber: e.target.value })} />
                                    </div>
                                </div>
                                <br />
                                <button className="btn btn-secondary me-2">Sign Up</button>

                                <h6 style={{ marginTop: 5, color: "red" }}><strong>{errorMessage}</strong></h6>

                            </div>

                        </div>

                    </div>
                    </form>
                </div>
            </div>
            <div className="col-md-4" style={{ position: "absolute", bottom: 600, left: 800 }}>
                <div className="row mb-5">
                    <div className="col-md-12">
                        <h2 className="h3 mb-3 text-black"><strong>NOTE</strong></h2>
                        <div className="p-3 p-lg-5 border bg-white">
                            <ul>
                                <li><p>Password must be longer than 8 characters</p></li>
                                <li><p>Password must include any digit</p></li>
                                <li><p>{'Password must include any special character e.g [!@#$%^&*(),.?":{}|<>]'}</p></li>
                            </ul>

                        </div>
                    </div>
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

export default SignUp;