import React, { useState, useEffect } from 'react'
import axios from 'axios'
import profile from "./profile.png"
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";


const Clients = () => {

    let id = localStorage.getItem("customer_id")
    const [user, setUser] = useState({})
    const [clients, setClients] = useState([])

    const [oneClient, setOneClient] = useState({}) //one client
    const [clientError, setClientError] = useState("")   //if failed to get client
    const [view, setView] = useState(true)

    const [open, setOpen] = useState(false)  //Control Modal

    const Open = () => {   //open Modal
        setOpen(true)
    }

    const Close = () => {  //close modal
        setOpen(false)
    }

    //get info about user
    const GetUser = () => {
        axios.get(`https://xclusive-service.onrender.com/user/${id}`)
            .then(res => {
                setUser(res.data)
            })
    }

    const GetClients = async () => {

        let res = await axios.get('https://xclusive-service.onrender.com/user/all/users/db')

        if (res.data !== "Error in server" || res.data !== "Failure") {
            setClients(res.data)
        } else {
            //Do error handling 
        }
    }

    //get client info
    const ViewClient = async (event, id) => {
        event.preventDefault()

        let res = await axios.get(`https://xclusive-service.onrender.com/user/personal/client/${id}`)


        if (res.data !== "Error in server" && res.data !== "Failure") {
            setOneClient(res.data)
        } else {
            setClientError("Failed to retrieve client")
            setView(false)

        }
        Open()  //Open Modal
    }



    useEffect(() => {
        //get info on user
        GetUser()

        //Get Our Clients
        GetClients()

        //eslint-disable-next-line
    }, [])





    return (
        <>
            <Modal show={open} onHide={Close}>
                <Modal.Header closeButton>
                    <Modal.Title ><strong style={{ color: "#5566f2" }}>{oneClient.user_name}</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!view && <center><h6 style={{ color: "#5566F2", fontWeight: "bold" }}>{clientError}</h6></center>}

                    {view && <div style={{ display: "flex" }}><h6 style={{ color: "#5566f2", fontWeight: "bold", marginRight: 10 }}>User ID:</h6><p>{oneClient.customer_id}</p></div>}
                    {view && <div style={{ display: "flex" }}><h6 style={{ color: "#5566f2", fontWeight: "bold", marginRight: 10 }}>Phone: </h6><p>{oneClient.user_phone}</p></div>}
                    {view && <div style={{ display: "flex" }}><h6 style={{ color: "#5566f2", fontWeight: "bold", marginRight: 10 }}>Email: </h6><p>{oneClient.user_email}</p></div>}
                    {view && <div style={{ display: "flex" }}><h6 style={{ color: "#5566f2", fontWeight: "bold", marginRight: 10 }}>Address: </h6><p>{oneClient.user_address + ", " + oneClient.user_code}</p></div>}
                    {view && <div style={{ display: "flex" }}><h6 style={{ color: "#5566f2", fontWeight: "bold", marginRight: 10 }}>Rentals: </h6><p>{oneClient.rentals}</p></div>}



                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={Close}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal >

            {/**Header */}
            < header id="header" className="header fixed-top d-flex align-items-center" >

                <div className="d-flex align-items-center justify-content-between">
                    <a href="/dash" className="logo d-flex align-items-center">

                        <span className="d-none d-lg-block">Xclusive Rentals</span>
                    </a>
                    <i className="bi bi-list toggle-sidebar-btn"></i>
                </div>

                <nav className="header-nav ms-auto">
                    <ul className="d-flex align-items-center">

                        <li className="nav-item dropdown pe-3">

                            <a className="nav-link nav-profile d-flex align-items-center pe-0" data-bs-toggle="dropdown" href="/profile">
                                <img src={profile} alt="Profile" className="rounded-circle" />
                                <span className="d-none d-md-block ps-2">{user.user_name}</span>
                            </a> {/**End Profile Image Icon --> */}

                        </li>{/** End Profile Nav -->*/}

                    </ul>
                </nav > {/**End Icons Navigation --> */}

            </header >
            {/**End Header --> */}

            {/**SideBar */}
            <aside id="sidebar" className="sidebar">

                <ul className="sidebar-nav" id="sidebar-nav">

                    <li className="nav-item">
                        <a className="nav-link " href="/dash">
                            <i className="bi bi-grid"></i>
                            <span>Dashboard</span>
                        </a>
                    </li> {/**End Dashboard Nav */}

                    <li className="nav-heading">Vehicles</li>

                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/add">
                            <i className="bi bi-person"></i>
                            <span>Add Vehicle</span>
                        </a>
                    </li>{/**End Add Vehicle Page Nav*/}

                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/vehicles">
                            <i className="bi bi-person"></i>
                            <span>Vehicles</span>
                        </a>
                    </li>{/**End Vehicle Page Nav*/}

                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/rentals">
                            <i className="bi bi-person"></i>
                            <span>Rentals</span>
                        </a>
                    </li>
                    {/**End Vehicle Page Nav*/}

                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/service">
                            <i className="bi bi-question-circle"></i>
                            <span>Under Service</span>
                        </a>
                    </li>{/**End Service Nav --> */}

                    <li className="nav-heading">Users</li>

                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/clients">
                            <i className="bi bi-person"></i>
                            <span>Clients</span>
                        </a>
                    </li>{/**End Profile Page Nav*/}

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
                    <h1>Clients</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active">Clients</li>
                        </ol>
                    </nav>
                </div>
                {/**End Page Title */}

                <h2 style={{ textAlign: "center", color: "#163A7C" }}><strong>Active Clients</strong></h2>

                <div className="untree_co-section product-section before-footer-section">
                    <div className="container">
                        <div className="row">

                            {clients.map((client, index) => {
                                return (
                                    <div className="col-12 col-md-4 col-lg-3 mb-5" key={index} onClick={(event) => ViewClient(event, client.customer_id)} >
                                        <div className="product-item" style={{ width: 250, height: 150, marginTop: -20 }}>
                                            <h3 className="product-title">{client.customer_id}</h3>
                                            <strong className="product-price">{client.user_name}</strong>
                                            <br />
                                            <br />
                                            <h6 className="product-title" style={{ color: "#163a7c", fontWeight: "bold" }}>{"Joined: " + new Date(client.joined).toDateString()}</h6>
                                            <br />
                                        </div>
                                    </div>
                                )

                            })}
                        </div>
                    </div>
                </div>
            </main>

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

export default Clients;