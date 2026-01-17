import axios from "axios";
import React, { useEffect, useState } from "react";
import profile from "./profile.png";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import spinner from "./spinner.svg"

const Profile = () => {

    //for password error & success
    const [errPass, setErrorPass] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [image, setImage] = useState(true) //if there is an image
    const [image1, setImage1] = useState(false) //if user didnt add an image

    const [isLoading, setIsLoading] = useState(false)  //loading for when content hasn't arrrived




    //Type of user
    const [type, setType] = useState("")

    const [view, setView] = useState(true)

    const [viewPass, setViewPass] = useState(true) //hide the confimr button

    //get unique id for user
    let id = localStorage.getItem("customer_id")

    //store the passwords
    const [passwords, setPasswords] = useState({
        pass: "",
        confirm: "",
        c_id: id

    })

    //Store Profile changes
    const [edits, setEdits] = useState({
        user_name: "",
        user_phone: 0,
        user_email: "",
        user_address: "",
        user_code: 0,
        lcode: "",
        lnumber: "",
        c_id: id

    })


    //store info about user
    const [user, setUser] = useState({})

    const [open, setOpen] = useState(false)  //Controls the modal for change password 
    const [openEdit, setOpenEdit] = useState(false)   //Controls modal for edit profile

    const Open = () => setOpen(true)  //open password modal
    const OpenEdit = () => {
        setOpenEdit(true)  //open edit profile modal
        setEdits({
            user_name: "",
            user_phone: "",
            user_email: "",
            user_address: "",
            user_code: "",
            lcode: "",
            lnumber: "",
            c_id: id
        })
        console.log(edits)
    }

    const Close = () => {    //close password modal
        setOpen(false)
        setErrorPass("")
        setSuccessMessage("")
    }

    const CloseEdit = () => {    //close edit profile modal
        setOpenEdit(false)
        setErrorPass("")
        setSuccessMessage("")
    }


    const ChangePass = () => {
        //Ensure passwords Match
        if (passwords.pass === passwords.confirm) {

            setErrorPass("")
            axios.post("https://xclusive-service.onrender.com/user/password", passwords)
                .then(res => {
                    if (res.data === "Success") {
                        setSuccessMessage("Password Updated")
                        setViewPass(false)
                    } else {
                        setErrorPass("Failed To Update Password")
                    }
                })
        } else {
            setErrorPass("Passwords Do Not Match")
        }
    }

    //Get Image
    const GetImage = () => {

        axios.get(`https://xclusive-service.onrender.com/user/profile/image/${id}`)
            .then(res => {
                if (res.data === "Image Not Found") {
                    setImage(false);
                    setImage1(true)
                }
            })
    }


    //Edit Profile
    const EditProfile = () => {

        //Reset Error Value
        setErrorPass("")

        let success = true

        if (edits.user_phone !== "" && edits.user_phone.length !== 10) {  //check phone number
            success = false
            alert("Not a valid mobile number")
        } else if (edits.user_address !== "") {
            if (edits.user_code === "") {
                success = false
                alert("Update of address requires an update of Postal Code")

            }
        }
        if (success) {
            axios.post("https://xclusive-service.onrender.com/user/profile/update", edits)
                .then(res => {
                    if (res.data === "Success") {
                        setSuccessMessage("Updated Successfully")
                        setEdits({
                            user_name: "",
                            user_phone: 0,
                            user_email: "",
                            user_address: "",
                            user_code: 0,
                            lcode: "",
                            lnumber: "",
                            c_id: id
                        })
                    }
                })

        }
    }
    const UpdateStatus = () => {
        //Update vehicles that are booked for today
        axios.post("https://xclusive-service.onrender.com/booking/update")
            .then(res => {
                if (res.data !== "Success") {
                    alert("Error updating Upcoming Rentals")
                }
            })
    }

    //Handle Vehicles not collected to be cancelled
    const CancelBooking = () => {
        axios.put('https://xclusive-service.onrender.com/booking/cancel')
            .then(res => {
                if (res.data === "Success" || res.data === "None") {
                    //Do Nothing
                } else {
                    alert("Failure in updating booking status")
                }
            })

    }


    useEffect(() => {

        //Get Image
        GetImage()
        setIsLoading(true)
        //get info about user
        axios.get(`https://xclusive-service.onrender.com/user/${id}`)
            .then(res => {
                setUser(res.data)
                console.log(res.data)
                if (res.data.user_type === "C") {

                    setType("Client")
                    //hide buttons based on user type
                    setView(false)

                } else if (res.data.user_type === "M" || res.data.user_type === "S") {
                    setType("Manager")
                    //hide buttons based on user type
                    setView(true)
                }

            }

            )

        SetOverdue()  //Update overdue vehicles accordingly
        UpdateStatus()  //Update vehicles meant booked for today
        CancelBooking()
        // eslint-disable-next-line
    }, [successMessage])


    //set Overdue upon login
    const SetOverdue = () => {

        axios.put("https://xclusive-service.onrender.com/booking/overdue")
            .then(res => {
                if (res.data === "Success" || res.data === "No pending rentals") {
                    //do nothing
                } else {
                    alert("Update of overdue days and fees not working")
                }
            })
    }


    return (
        <>
            {/**Modal for Password Change */}
            <Modal show={open} onHide={Close}>
                <Modal.Header closeButton>
                    <Modal.Title ><strong style={{ color: "#5566f2" }}>Change Password</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    {/**Password */}
                    <div className="row mb-3">
                        <label htmlFor="password" className="col-sm-2 col-form-label" style={{ color: "#5566f2" }}>Password:</label>
                        <div className="col-sm-10">
                            <input type="password" id="password" name="password" className="form-control" onChange={e => setPasswords({ ...passwords, pass: e.target.value })} />
                        </div>
                    </div>

                    {/**Confirm Password */}
                    <div className="row mb-3">
                        <label htmlFor="con" className="col-sm-2 col-form-label" style={{ color: "#5566f2" }}>Confirm</label>
                        <div className="col-sm-10">
                            <input type="password" id="con" name="con" className="form-control" onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} />
                        </div>
                    </div>
                    <p style={{ color: "red" }}>{errPass && errPass}</p>
                    <p style={{ color: "green" }}>{successMessage && successMessage}</p>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={Close}>
                        Close
                    </Button>
                    {viewPass && <Button variant="secondary" onClick={ChangePass}>
                        Confirm
                    </Button>}
                </Modal.Footer>
            </Modal >

            {/**Modal for Profile Change */}
            < Modal show={openEdit} onHide={CloseEdit} scrollable style={{ maxHeight: '750px', position: 'fixed', top: '50%', left: '10', transform: 'translate(0, -50%)', width: '650px' }
            }>
                <Modal.Header closeButton>
                    <Modal.Title ><strong style={{ color: "#5566f2" }}>Edit Profile</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body >

                    {/**Name */}
                    <div className="row mb-3">
                        <label htmlFor="name" className="col-sm-2 col-form-label" style={{ color: "#5566f2" }}>Name</label>
                        <div className="col-sm-10">
                            <input type="text" id="name" className="form-control" placeholder={user.user_name} onChange={e => setEdits({ ...edits, user_name: e.target.value })} />
                        </div>
                    </div>

                    {/**Phone Number */}
                    <div className="row mb-3">
                        <label htmlFor="phone" className="col-sm-2 col-form-label" style={{ color: "#5566f2" }}>Phone Number</label>
                        <div className="col-sm-10">
                            <input type="number" id="phone" maxLength={10} placeholder={user.user_phone} className="form-control" onChange={e => setEdits({ ...edits, user_phone: e.target.value })} />
                        </div>
                    </div>

                    {/**Email*/}
                    <div className="row mb-3">
                        <label htmlFor="email" className="col-sm-2 col-form-label" style={{ color: "#5566f2" }}>Email:</label>
                        <div className="col-sm-10">
                            <input type="email" id="email" className="form-control" placeholder={user.user_email} onChange={e => setEdits({ ...edits, user_email: e.target.value })} />
                        </div>
                    </div>

                    {/**Address */}
                    <div className="row mb-3">
                        <label htmlFor="address" className="col-sm-2 col-form-label" style={{ color: "#5566f2" }}>Address</label>
                        <div className="col-sm-10">
                            <input type="text" id="address" className="form-control" placeholder={user.user_address} onChange={e => setEdits({ ...edits, user_address: e.target.value })} />
                        </div>
                    </div>

                    {/**Code */}
                    <div className="row mb-3">
                        <label htmlFor="code" className="col-sm-2 col-form-label" style={{ color: "#5566f2" }}>Postal/Zip Code</label>
                        <div className="col-sm-10">
                            <input type="text" id="code" className="form-control" placeholder={user.user_code} onChange={e => setEdits({ ...edits, user_code: e.target.value })} />
                        </div>
                    </div>

                    {/**License Code */}
                    <div className="row mb-3">
                        <label htmlFor="lcode" className="col-sm-2 col-form-label" style={{ color: "#5566f2" }}>License Code</label>
                        <div className="col-sm-10">
                            <input type="text" id="lcode" className="form-control" placeholder={user.lcode} onChange={e => setEdits({ ...edits, lcode: e.target.value })} />
                        </div>
                    </div>

                    {/**License Number */}
                    <div className="row mb-3">
                        <label htmlFor="lnumber" className="col-sm-2 col-form-label" style={{ color: "#5566f2" }}>License Number</label>
                        <div className="col-sm-10">
                            <input type="text" id="lnumber" className="form-control" placeholder={user.lnumber} onChange={e => setEdits({ ...edits, lnumber: e.target.value })} />
                        </div>
                    </div>

                    <p style={{ color: "red" }}>{errPass && errPass}</p>
                    <p style={{ color: "green" }}>{successMessage && successMessage}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={CloseEdit}>
                        Close
                    </Button>
                    <Button variant="secondary" onClick={EditProfile}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal >

            {/**Header */}
            < header id="header" className="header fixed-top d-flex align-items-center" >

                <div className="d-flex align-items-center justify-content-between">
                    <div className="logo d-flex align-items-center">

                        <span className="d-none d-lg-block">Xclusive Rentals</span>
                    </div>
                    <i className="bi bi-list toggle-sidebar-btn"></i>
                </div>
            </header >
            {/**End Header --> */}

            {/**SideBar */}
            <aside id="sidebar" className="sidebar">

                <ul className="sidebar-nav" id="sidebar-nav">

                    {view && (<li className="nav-item">
                        <a className="nav-link " href="/dash">
                            <i className="bi bi-grid"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>)} {/**End Dashboard Nav */}

                    {view && <li className="nav-heading">Vehicles</li>}


                    {view && (<li className="nav-item">
                        <a className="nav-link collapsed" href="/add">
                            <i className="bi bi-person"></i>
                            <span>Add Vehicle</span>
                        </a>
                    </li>
                    )}{/**End Add Vehicle Page Nav*/}

                    {view && (<li className="nav-item">
                        <a className="nav-link collapsed" href="/vehicles">
                            <i className="bi bi-person"></i>
                            <span>Vehicles</span>
                        </a>
                    </li>
                    )}{/**End Vehicle Page Nav*/}

                    {view && (<li className="nav-item">
                        <a className="nav-link collapsed" href="/rentals">
                            <i className="bi bi-person"></i>
                            <span>Rentals</span>
                        </a>
                    </li>)}
                    {/**End Vehicle Page Nav*/}

                    {view && <li className="nav-item">
                        <a className="nav-link collapsed" href="/service">
                            <i className="bi bi-question-circle"></i>
                            <span>Under Service</span>
                        </a>
                    </li>}{/**End Service Nav --> */}

                    <li className="nav-heading">Users</li>

                    {view && <li className="nav-item">
                        <a className="nav-link collapsed" href="/clients">
                            <i className="bi bi-person"></i>
                            <span>Clients</span>
                        </a>
                    </li>}{/**End Customers Page Nav*/}


                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/profile">
                            <i className="bi bi-person"></i>
                            <span>Profile</span>
                        </a>
                    </li>{/**End Profile Page Nav*/}

                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/">
                            <i className="bi bi-question-circle"></i>
                            <span>Logout</span>
                        </a>
                    </li>{/**End Logout Nav --> */}
                </ul>
            </aside>
            {/**End Sidebar*/}

            <main id="main" className="main">

                <div className="pagetitle">
                    <h1>Profile</h1>
                    <nav>
                        <ol className="breadcrumb">
                            {view && (<li className="breadcrumb-item"><a href="/dash">Dashboard</a></li>)} {/**ensure user doesn't see manager aspects */}
                            {view && <li className="breadcrumb-item active">Profile</li>}
                        </ol>
                    </nav>
                </div>
                {/**End Page Title */}

                <section className="section profile">
                    <div className="row">
                        <div className="col-xl-4">

                            <div className="card">
                                <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">

                                    {image && <img src={`https://xclusive-service.onrender.com/user/profile/image/${id}`} alt="Customer" className="rounded-circle" />}
                                    {image1 && <img src={profile} alt="Customer" className="rounded-circle" />}
                                    <h2>{user.user_name}</h2>


                                </div>
                            </div>

                        </div>

                        <div className="col-xl-8">

                            <div className="card">
                                <div className="card-body pt-3">
                                    {/**Bordered Tabs*/}
                                    <ul className="nav nav-tabs nav-tabs-bordered">

                                        <li className="nav-item">
                                            <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Overview</button>
                                        </li>

                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit" onClick={OpenEdit}>Edit Profile</button>
                                        </li>

                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-change-password" onClick={Open}>Change Password</button>
                                        </li>

                                        <li className="nav-item">
                                            <a className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-change-password" href="/history">Past/Present Rentals</a>
                                        </li>

                                        <li className="nav-item">
                                            <a className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-change-password" href="/invoices">Invoices</a>
                                        </li>

                                    </ul>
                                    <div className="tab-content pt-2">
                                        {isLoading && <center><img src={spinner} alt="Loading..."></img></center>}

                                        {!isLoading && <div className="tab-pane fade show active profile-overview" id="profile-overview">

                                            <h5 className="card-title"><strong>Profile Details</strong></h5>

                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label ">Full Name</div>
                                                <div className="col-lg-9 col-md-8">{user.user_name}</div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">User ID</div>
                                                <div className="col-lg-9 col-md-8">{user.customer_id}</div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">Job</div>
                                                <div className="col-lg-9 col-md-8">{type}</div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">Address</div>
                                                <div className="col-lg-9 col-md-8">{user.user_address + ", " + user.user_code}</div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">Phone</div>
                                                <div className="col-lg-9 col-md-8">{user.user_phone}</div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">Email</div>
                                                <div className="col-lg-9 col-md-8">{user.user_email}</div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">License Code</div>
                                                <div className="col-lg-9 col-md-8">{user.lcode}</div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">License Number</div>
                                                <div className="col-lg-9 col-md-8">{user.lnumber}</div>
                                            </div>

                                        </div>}

                                    </div>
                                    {/**End Bordered Tabs*/}

                                </div>
                            </div>

                        </div>
                    </div>
                </section>

            </main>
            {/**End main*/}

            {/**Footer */}
            <footer id="footer" className="footer">
                <div className="copyright">
                    &copy; Copyright <strong><span> Xclusive Rentals</span></strong>. All Rights Reserved
                </div>
                <div className="credits">
                    {/**<!-- All the links in the footer should remain intact. -->
                    <!-- You can delete the links only if you purchased the pro version. -->
                    <!-- Licensing information: https://bootstrapmade.com/license/ -->
                    <!-- Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/ -->
                    Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>*/}
                </div>
            </footer>
            {/**Footer End */}
        </>
    )
}

export default Profile;