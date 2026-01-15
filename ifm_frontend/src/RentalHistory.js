import { useState, useEffect } from "react"
import axios from "axios"
import profile from "./profile.png"
import DropdownButton from "react-bootstrap/esm/DropdownButton";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import spinner from "./spinner.svg"


const RentalHistory = () => {

    const [user, setUser] = useState({})

    //User Prompt
    const [error, setError] = useState("")

    //Controls loading icon
    const [isLoading, setIsLoading] = useState(false)

    //Vehicle history
    const [rentals, setRentals] = useState([])

    //Hide Components of page for client
    const [view, setView] = useState(true)
    const [viewCar, setViewCar] = useState(true)

    //Get Customer ID
    const id = localStorage.getItem("customer_id")


    useEffect(() => {

        //Get user info
        axios.get(`https://xclusive-service.onrender.com/user/${id}`)
            .then(res => {
                setUser(res.data)
                if (res.data.user_type === "C") {
                    setView(false)
                } else {
                    setView(true)
                }

            })

        GetRentals()
        // eslint-disable-next-line
    }, [id])



    //Get All Rentals By user
    const GetRentals = () => {
        setIsLoading(true)
        axios.get(`https://xclusive-service.onrender.com/booking/history/${id}`)
            .then(res => {

                if (res.data === "No rentals") {
                    setError("No rentals found for user")
                    setViewCar(false)
                } else if (res.data === "Error in server") {
                    setError("System Failure")
                    setViewCar(false)
                } else {
                    let array = res.data

                    for (var i = 0; i < array.length; i++) {
                        var collect = new Date(array[i].pickup)
                        array[i].pickup = collect.toDateString()
                        var return1 = new Date(array[i].dropoff)
                        array[i].dropoff = return1.toDateString()
                    }

                    SetStatus(array)
                }

                setTimeout(() => {
                    setIsLoading(false)
                }, 200)


            })
    }

    //Get Specific Rentals
    const Filter = (event, status) => {
        event.preventDefault()

        if (status === "All") {
            setError("")
            setViewCar(true)
            GetRentals()
        } else {
            axios.get(`https://xclusive-service.onrender.com/booking/${id}/${status}`)
                .then(res => {
                    if (res.data[0].status !== "No rentals found") {
                        setError("")
                        setViewCar(true)
                        let array = res.data

                        for (var i = 0; i < array.length; i++) {
                            var collect = new Date(array[i].pickup)
                            array[i].pickup = collect.toDateString()
                            var return1 = new Date(array[i].dropoff)
                            array[i].dropoff = return1.toDateString()
                        }

                        SetStatus(array)
                    } else if (res.data[0].status === "No rentals found") {
                        setViewCar(false)
                        setError("No " + status + " vehicles found")
                    } else {
                        setViewCar(false)
                        setError("System Failure")
                    }


                })
        }
    }

    const SetStatus = (array) => {
        let today = new Date()
        today.setHours(0, 0, 0, 0)

        for (let i = 0; i < array.length; i++) {

            let returnDate = new Date(array[i].dropoff)  //To allow comparison of the two dates
            returnDate.setHours(0, 0, 0, 0)

            let pickup = new Date(array[i].pickup)
            pickup.setHours(0, 0, 0, 0)



            if (array[i].status === "Completed") {
                array[i].status = <h3 style={{ color: "green" }}><strong>Completed</strong></h3>
            } else if (array[i].status === "Cancelled") {
                array[i].status = <h3 style={{ color: "Grey" }}><strong>Cancelled</strong></h3>
            } else if (array[i].status === "Pending" && today <= returnDate && array[i].collected === 'NO ') {
                array[i].status = <h3 style={{ color: "purple" }}><strong>Pending</strong></h3>
            } else if (array[i].status === "Pending" && today <= returnDate && array[i].collected === 'Yes') {
                array[i].status = <h3 style={{ color: "orange" }}><strong>Collected</strong></h3>
            } else if (array[i].status === "Upcoming" && today < pickup) {
                array[i].status = <h3 style={{ color: "#4072A4" }}><strong>Upcoming</strong></h3>
            } else if (array[i].status === "Pending" && today > returnDate && array[i].collected === 'Yes') {
                array[i].status = <h3 style={{ color: "red" }}><strong>Overdue</strong></h3>
            }

        }

        setRentals(array)
    }

    return (
        <>

            {/**Header */}
            < header id="header" className="header fixed-top d-flex align-items-center" >

                <div className="d-flex align-items-center justify-content-between">
                    <div className="logo d-flex align-items-center">

                        <span className="d-none d-lg-block">Xclusive Rentals</span>
                    </div>
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
                    </li>
                    )}{/**End Vehicle Page Nav*/}

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
                    <h1>Your Previous Rentals</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/profile">Profile</a></li>
                            <li className="breadcrumb-item active">History</li>
                        </ol>
                    </nav>
                </div>
                {/**End Page Title */}
                <h2 style={{ textAlign: "center", paddingTop: 5, color: "#163a7c", fontStyle: "italic" }}><strong>{error && error}</strong></h2>

                <div style={{ marginLeft: 10 }}>
                    <DropdownButton title="Status">
                        <DropdownItem onClick={(event) => Filter(event, "All")}>All</DropdownItem>
                        <DropdownItem onClick={(event) => Filter(event, "Upcoming")}>Upcoming</DropdownItem>
                        <DropdownItem onClick={(event) => Filter(event, "Pending")}>Pending</DropdownItem>
                        <DropdownItem onClick={(event) => Filter(event, "Completed")}>Completed</DropdownItem>
                        <DropdownItem onClick={(event) => Filter(event, "Cancelled")}>Cancelled</DropdownItem>
                    </DropdownButton>

                </div>

                {isLoading && <center><img src={spinner} alt="Loading..."></img></center>}

                {/**Vehicles  */}
                {!isLoading && <div className="untree_co-section product-section before-footer-section">
                    <div className="container">
                        <div className="row">

                            {viewCar && rentals.map((car, index) => {
                                return (
                                    <div className="col-12 col-md-4 col-lg-3 mb-5" key={index}>

                                        {car.status}
                                        <div className="product-item" style={{ height: 400 }}>
                                            <img src={`https://xclusive-service.onrender.com/vehicles/image/${car.vehicle_id}`} alt="car here" className="img-dimensions img-fluid product-thumbnail" />
                                            <div style={{ position: "absolute", top: 200 }}>
                                                <p style={{ color: "#163a7c", fontWeight: "bold" }}>{car.vehicle_year}</p>
                                                <h3 className="product-title">{car.vehicle_make + " " + car.vehicle_model}</h3>
                                                <p style={{ color: "#163a7c" }}><strong className="product-price">Collection: </strong>{car.pickup}</p>
                                                <p style={{ color: "#163a7c" }}><strong className="product-price">DropOff: </strong>{car.dropoff}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>}
                {/**End Vehicles */}



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

export default RentalHistory