import { useEffect, useState } from "react"
import axios from "axios"
import Button from "react-bootstrap/Button";
import profile from "./profile.png"
import Modal from "react-bootstrap/Modal";
import spinner from "./spinner.svg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Rentals = () => {

    let id = localStorage.getItem("customer_id")
    //Store user
    const [user, setUser] = useState({})
    const [viewError, setViewError] = useState(false)
    const [view, setView] = useState(true)

    const [disable, setDisable] = useState(true)

    const [collect, setCollect] = useState([])

    //Set Old and new mileage
    const [oldMileage, setOldMileage] = useState(0)
    const [newMileage, setNewMileage] = useState(0)

    //Loading Prompt for better user experience
    const [isLoading, setIsLoading] = useState(false)


    //User prompt
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")
    const [none, setNone] = useState("") //prompt when there is no rentals


    //vehicle ID and rent ID is needed to correctly check in vehicle
    const [ids, setIDs] = useState({
        vehicle_id: 0,
        rent_id: 0
    })

    //controls Modal for user prompt
    const [open, setOpen] = useState(false)  //Controls the modal for change mileage

    const Open = () => {

        setOpen(true)
    }
    //open Modal
    const Close = () => {

        setOpen(false)
        setDisable(true)
        window.location.reload()
    }  //close modal

    //Set Booked Vehicles
    const [vehicles, setVehicles] = useState([])

    useEffect(() => {

        //get info about user
        axios.get(`https://xclusive-service.onrender.com/user/${id}`)
            .then(res => {
                setUser(res.data)
            }

            )

        GetBooked()
    }, [id])


    //Get Booked Vehicles
    const GetBooked = () => {
        setIsLoading(true)

        let arrCollect = []
        axios.get("https://xclusive-service.onrender.com/booking")
            .then(res => {
                let user = res.data
                if (user === "Error in server" || res.data[0].status === "No rentals found") {
                    setNone("No rentals currently")
                    setViewError(true)
                } else {
                    setViewError(false)
                    setView(true)

                    //Set Collected message
                    let array = res.data
                    for (let i = 0; i < array.length; i++) {
                        if (array[i].collected === "Yes") {
                            arrCollect.push(false)
                            array[i].collected = <div style={{ position: 'absolute', top: 0, right: 0, fontWeight: "bold", color: 'green' }}>Collected</div>
                        } else {
                            arrCollect.push(true)
                            array[i].collected = <div style={{ position: 'absolute', top: 0, right: 0, fontWeight: "bold", color: 'purple' }}>Awaiting Collection</div>
                        }
                    }


                    setVehicles(array)
                    setCollect(arrCollect)

                }
                setIsLoading(false)

            })
    }

    //confirm That vehicle has been returned
    const CheckIn = (event, id, rent) => {
        event.preventDefault()
        //Get old mileage
        axios.get(`https://xclusive-service.onrender.com/vehicles/booking/car/${id}`)
            .then(res => {
                if (res.data !== "Error in server") {
                    setOldMileage(res.data.vehicle_mileage)
                }
            })

        setIDs({ ...ids, vehicle_id: id, rent_id: rent })
        Open()

    }

    //Update vehicle 
    const Update = () => {

        //update the booking
        axios.put("https://xclusive-service.onrender.com/booking", ids)
            .then(res => {
                if (res.data === "Success") {
                    setSuccess("Vehicle checked in successfully")
                    setError("")
                    setDisable(false)
                } else {
                    setError("Failed to check in vehicle")
                }
            })
    }

    //Update Mileage
    const UpdateMileage = (event) => {
        event.preventDefault()

        //required info to update
        let info = { id: ids.vehicle_id, mileage: newMileage }

        if (newMileage < oldMileage) {
            setError("Mileage can't be less than mileage before rental")
        } else {
            setError("")
            axios.put("https://xclusive-service.onrender.com/vehicles", info)
                .then(res => {
                    if (res.data === "Success") {
                        Update()
                    } else {
                        setError("Failed To Update Mileage")
                    }
                }
                )
        }

    }

    //Confirm Colection
    const Collection = (event, id) => {
        event.preventDefault()

        axios.put(`https://xclusive-service.onrender.com/booking/collect/${id}`)
            .then(res => {
                if (res.data === "Success") {
                    alert("Collection Confirmed")
                    window.location.reload()
                } else {
                    alert("Failure in Collection Confirmation")
                }
            })
    }

    return (
        <>

            {/**Modal for Mileage Change */}
            <Modal show={open} onHide={Close}>
                <Modal.Header closeButton>
                    <Modal.Title ><strong style={{ color: "#5566f2" }}>Check In</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    {/**Mileage */}
                    <h2>Update Mileage</h2>
                    <div className="row mb-3">
                        <label htmlFor="mileage" className="col-sm-2 col-form-label" style={{ color: "#5566f2" }}>Previous</label>
                        <div className="col-sm-10">
                            <p id="mileage" style={{ marginTop: 15 }}><strong>{oldMileage}</strong></p>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label htmlFor="new" className="col-sm-2 col-form-label" style={{ color: "#5566f2" }}>Updated</label>
                        <div className="col-sm-10">
                            <input type="number" id="new" className="form-control" onChange={e => setNewMileage(e.target.value)} />
                        </div>
                    </div>


                    <p style={{ color: "red" }}>{error && error}</p>
                    <p style={{ color: "green" }}>{success && success}</p>

                </Modal.Body>
                <Modal.Footer>
                    {disable && <Button variant="secondary" onClick={UpdateMileage}>
                        Check In
                    </Button>}
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
                    <h1>Rentals</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active">Rentals</li>
                        </ol>
                    </nav>
                </div>
                {/**End Page Title */}

                <h2 style={{ textAlign: "center", color: "#163A7C" }}><strong>Current Vehicles Rented Out</strong></h2>
                {viewError && (<h5><strong>{none}</strong></h5>)}
                {isLoading && <center><img src={spinner} alt="Loading..."></img></center>}

                {/**Vehicles  */}
                {!isLoading && <div className="untree_co-section product-section before-footer-section">
                    <div className="container">
                        <div className="row">

                            {view && vehicles.map((car, index) => {
                                return (<div className="col-12 col-md-4 col-lg-3 mb-5" key={index} >
                                    <div className="product-item" style={{ width: 250, height: 450, marginTop: -20 }}>
                                        {car.collected}
                                        <img src={`https://xclusive-service.onrender.com/vehicles/image/${car.vehicle_id}`} alt="car here" className="img-dimensions img-fluid product-thumbnail" />
                                        <h3 className="product-title">{car.vehicle_make + " " + car.vehicle_model}</h3>
                                        <strong className="product-price">Amount:  <span style={{ color: "#163a7c" }}>{"R" + car.income}</span></strong>
                                        <br />
                                        <br />
                                        <h6 className="product-title" style={{ fontWeight: "bold", color: "#2f2f2f" }}>Return: <span style={{ color: "#163a7c", fontWeight: "bold" }}>{new Date(car.dropoff).toDateString()}</span></h6>
                                        <br />
                                        <h3 className="product-title" style={{ fontWeight: "bold", color: "#2f2f2f" }}>Client: <span style={{ color: "#163a7c" }}>{car.user_name + " (" + car.customer_id + ")"}</span></h3>

                                        <div style={{ position: "absolute", bottom: 25, left: 53 }}>
                                            <button className="remove" onClick={(event) => CheckIn(event, car.vehicle_id, car.rent_id)}>Confirm Check In</button>
                                        </div>

                                        {collect[index] && <button className="icon-cross" onClick={(event) => Collection(event, car.rent_id)}>
                                            <FontAwesomeIcon icon="fa-solid fa-check" style={{ marginLeft: -2.5, marginTop: 2, height: 25, width: 25, color: "white" }} />
                                            <p><strong style={{ marginTop: 10, marginLeft: -40 }}>Collected?</strong></p>
                                        </button>}
                                    </div>
                                </div>
                                )

                            })}
                        </div>
                    </div>
                </div>}


                {/**End Vehicles */}


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

export default Rentals
