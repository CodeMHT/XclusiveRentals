import axios from "axios";
import { useState, useEffect } from "react";
import profile from "./profile.png"

const Service = () => {

    const [user, setUser] = useState({})
    let id = localStorage.getItem("customer_id")

    const [cars, setCars] = useState([])
    const [view, setView] = useState(true)
    const [message, setMessage] = useState("")


    useEffect(() => {

        //Get user info
        axios.get(`https://two024uj.onrender.com/user/${id}`)
            .then(res => setUser(res.data))

        //Get Vehicles
        GetServiceCars()
    }, [id])

    //Gets vehicles being serviced
    const GetServiceCars = () => {
        axios.get("https://two024uj.onrender.com/service")
            .then(res => {

                if (res.data[0].status === "None" || res.data === "Error in server") {
                    setView(false)
                    setMessage("No Vehicles currently being serviced")
                } else {
                    setView(true)
                    let array = res.data

                    let newarray = []

                    let today = new Date() //Vehicles are serviced for one day only 
                    today.setHours(0, 0, 0, 0)

                    for (let i = 0; i < array.length; i++) {

                        let serviceDate = new Date(array[i].service_date)
                        if (serviceDate.getTime() === today.getTime()) {
                            newarray.push(array[i])
                        }
                    }
                    setCars(newarray)
                }
            })
    }


    return (
        <>
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
                    <h1>Service</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active">Service</li>
                        </ol>
                    </nav>
                </div>
                {/**End Page Title */}

                <h2 style={{ textAlign: "center", color: "#163A7C" }}><strong>Vehicles Being Serviced</strong></h2>

                <h5 style={{ textAlign: "center", color: "#163A7C", marginTop: 10 }}><strong>{message && message}</strong></h5>


                {/** Client Cars  */}
                <div className="untree_co-section product-section before-footer-section" style={{ marginTop: -40 }}>
                    <div className="container">
                        <div className="row">

                            {view && cars.map((car, index) => {
                                return (
                                    <div className="col-12 col-md-4 col-lg-3 mb-5" style={{ paddingRight: 20 }} key={index}>
                                        <div style={{ width: 250, height: 350, marginTop: -20 }}>
                                            <img src={`https://two024uj.onrender.com/vehicles/image/${car.vehicle_id}`} alt="car here" className="img-dimensions img-fluid product-thumbnail" />
                                            <center><p style={{ color: "#163a7c", fontWeight: "bold" }}>{car.vehicle_year}</p></center>
                                            <center><h3 style={{ color: "#163a7c", fontWeight: "bold" }} className="product-title">{car.vehicle_make + " " + car.vehicle_model}</h3></center>
                                            <center><h4 style={{ color: "#163a7c", fontWeight: "bold" }}>{"Interval: " + car.service_interval}</h4></center>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>


                {/**End Client Cars */}


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

export default Service;