import { useEffect, useState } from "react"
import axios from "axios"
import profile from "./profile.png"
import DropdownButton from "react-bootstrap/esm/DropdownButton";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import spinner from "./spinner.svg"



const Vehicles = () => {

    const id = localStorage.getItem("customer_id")
    const [user, setUser] = useState({})
    const [cars, setCars] = useState([])
    const [brands, setBrands] = useState([])
    const [error, setError] = useState("")  //if there are no vehicles matching search

    const [service, setService] = useState([]) //button to allow a vehicle to be serviced

    const [isLoading, setIsLoading] = useState(false)  //controls loading spinner
    const [noVehicles, setNoVehicles] = useState(true)   //IF There are no vehicles


    //Get Vehicle Makes
    const GetBrands = async () => {

        let res = await axios.get('https://two024uj.onrender.com/make')

        if (res.data !== "Error in server" && res.data[0].status !== "None") {
            setBrands(res.data)
        } else {
            alert("Error getting vehicle brands")
        }
    }

    useEffect(() => {

        //Get user info
        axios.get(`https://two024uj.onrender.com/user/${id}`)
            .then(res => setUser(res.data))

        //Get Vehicle Info
        GetAllVehicles()

        //get Brands
        GetBrands()
        // eslint-disable-next-line
    }, [])

    const GetAllVehicles = () => {
        setIsLoading(true)
        let today = new Date()
        today.setHours(0, 0, 0, 0)

        //array to hold the true and false for a vehicle needing service
        let serviceArray = []

        axios.get("https://two024uj.onrender.com/vehicles")
            .then(res => {
                let data = res.data
                for (let i = 0; i < data.length; i++) {

                    let date = new Date(data[i].added)
                    date.setHours(0, 0, 0, 0)

                    //Show newly added vehicles
                    if (data[i].added !== null && date.getTime() === today.getTime()) {

                        data[i].isnew = "NEW"
                        data[i].service = ""
                        serviceArray.push(false)

                    } //Show vehicles close to service and that are not new
                    else if (((data[i].vehicle_mileage >= 14000 && data[i].vehicle_mileage <= 16000) ||
                        (data[i].vehicle_mileage >= 29000 && data[i].vehicle_mileage <= 31000) ||
                        (data[i].vehicle_mileage >= 44000 && data[i].vehicle_mileage <= 46000) ||
                        (data[i].vehicle_mileage >= 59000 && data[i].vehicle_mileage <= 61000) ||
                        (data[i].vehicle_mileage >= 74000 && data[i].vehicle_mileage <= 76000) ||
                        (data[i].vehicle_mileage >= 89000 && data[i].vehicle_mileage <= 91000)) &&
                        (data[i].service === "No")
                    ) {
                        data[i].service = "Service Candidate"
                        serviceArray.push(true)
                    } else {
                        data[i].service = ""
                        serviceArray.push(false)
                    }
                }




                setService(serviceArray)
                setNoVehicles(true)
                setError("")
                setCars(data)

                setTimeout(() => {
                    setIsLoading(false)
                }, 500)
            })

    }

    const GetCertainVehicles = (event, name) => {
        event.preventDefault()

        setIsLoading(true)
        let today = new Date()
        today.setHours(0, 0, 0, 0)

        let car = {
            vehicle_make: name,
            vehicle_cat: "",
            vehicle_feat: ""
        }

        let serviceArray = []

        axios.post("https://two024uj.onrender.com/vehicles/search", car)
            .then(res => {
                if (res.data !== "Error in server" && res.data[0].status !== "None") {
                    let data = res.data
                    setNoVehicles(true)
                    setError("")
                    for (let i = 0; i < data.length; i++) {

                        if (data[i].added !== null && new Date(data[i].added).getTime() === today.getTime()) {

                            data[i].isnew = "NEW"
                        } else if (((data[i].vehicle_mileage >= 14000 && data[i].vehicle_mileage <= 16000) ||
                            (data[i].vehicle_mileage >= 29000 && data[i].vehicle_mileage <= 31000) ||
                            (data[i].vehicle_mileage >= 44000 && data[i].vehicle_mileage <= 46000) ||
                            (data[i].vehicle_mileage >= 59000 && data[i].vehicle_mileage <= 61000) ||
                            (data[i].vehicle_mileage >= 74000 && data[i].vehicle_mileage <= 76000) ||
                            (data[i].vehicle_mileage >= 89000 && data[i].vehicle_mileage <= 91000)) &&
                            (data[i].service === "No")) {
                            data[i].service = "Service Candidate"
                            serviceArray.push(true)
                        } else {
                            serviceArray.push(false)
                        }
                    }

                    setCars(data)
                    setNoVehicles(true)
                    setService(serviceArray)
                } else {
                    setCars(res.data)
                    setNoVehicles(false)
                    setError("No vehicles matching your search")
                }

                setTimeout(() => {
                    setIsLoading(false)
                }, 1200)

            }
            )
    }

    //Send vehicle for maintenance
    const ServiceVehicle = (event, id, mileage) => {
        event.preventDefault()

        axios.get(`https://two024uj.onrender.com/service/${id}`)
            .then(res => {
                if (res.data === "Unavailable") {
                    alert("This vehicle is currently out on rental")
                } else {
                    let details = {} //store details about service
                    let interval = ""

                    //set Service mileage
                    if (mileage >= 14000 && mileage <= 16000) {
                        interval = "15000KM"
                    } else if (mileage >= 29000 && mileage <= 31000) {
                        interval = "30000KM"
                    } else if (mileage >= 44000 && mileage <= 46000) {
                        interval = "45000KM"
                    } else if (mileage >= 59000 && mileage <= 61000) {
                        interval = "60000KM"
                    } else if (mileage >= 74000 && mileage <= 76000) {
                        interval = "75000KM"
                    } else if (mileage >= 89000 && mileage <= 91000) {
                        interval = "90000KM"
                    }

                    let today = new Date()
                    today.setHours(0, 0, 0, 0)

                    details = { service_date: today, service_interval: interval, vehicle_id: id } //add data to the service details

                    //Post Info to database
                    axios.post("https://two024uj.onrender.com/service", details)
                        .then(res1 => {
                            if (res1.data === "Success") {
                                // change the status of the vehicle
                                for (let i = 0; i < cars.length; i++) {
                                    if (cars[i].vehicle_id === id) {
                                        cars[i].service = ""
                                        service[i] = false
                                    }
                                }
                                alert("Vehicle has been sent for service")
                                window.location.reload()
                            } else {
                                alert("Failed to send vehicle to service")
                            }
                        })
                }
            })


    }

    //Delete Vehicle
    const Remove = (event, id) => {
        event.preventDefault()
        axios.delete(`https://two024uj.onrender.com/vehicles/${id}`)
            .then(res => {
                if (res.data === "Success") {
                    alert("Successfully deleted vehicle")
                    window.location.reload()
                } else {
                    alert("Failed to delete vehicle.Reload page and try again")
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
                    <h1>Vehicles</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active">Vehicles</li>
                        </ol>
                    </nav>
                </div>
                {/**End Page Title */}

                <div style={{ marginLeft: 10 }}>
                    <DropdownButton title="Make" >
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <DropdownItem onClick={GetAllVehicles}>All</DropdownItem>
                            {brands.map((brand, index) => {
                                return (
                                    <DropdownItem style={{ overflowY: 'auto' }} key={index} onClick={(event) => GetCertainVehicles(event, brand.make)}>{brand.make}</DropdownItem>
                                )
                            })}
                        </div>
                    </DropdownButton>

                </div>

                <center><h4 style={{ marginTop: 10, color: "#012973", fontWeight: "bold" }}>{error && error}</h4></center>

                {/**Vehicles  */}
                {noVehicles && <div className="untree_co-section product-section before-footer-section">
                    <div className="container">
                        <div className="row">
                            {isLoading && <center><img src={spinner} alt="Loading..."></img></center>}

                            {!isLoading && cars.map((car, index) => {
                                return (
                                    <div className="col-12 col-md-4 col-lg-3 mb-10" key={index} style={{ marginBottom: 70 }}>
                                        <div className="product-item" style={{ height: 450, marginTop: -20 }} >
                                            <div className="top-right">{car.isnew}</div>
                                            <div className="top-left">{car.service}</div>
                                            <img src={`https://two024uj.onrender.com/vehicles/image/${car.vehicle_id}`} alt="car here" className="img-dimensions img-fluid product-thumbnail" />

                                            {/**From here fix positioning */}
                                            <div style={{ position: "absolute", top: 200 }}>
                                                <p style={{ color: "#163a7c", fontWeight: "bold" }}>{car.vehicle_year}</p>
                                                <h3 className="product-title" style={{ marginLeft: 50 }}>{car.vehicle_make + " " + car.vehicle_model}</h3>
                                                <strong className="product-price" style={{ marginLeft: 50 }}>{"R" + car.vehicle_cost}</strong>

                                                <br />
                                                <h6 className="product-title" style={{ color: "#163a7c", fontWeight: "bold", marginLeft: 50 }}>{car.vehicle_cat}</h6>
                                                <br /></div>
                                            <div style={{ position: "absolute", bottom: 40, left: 90 }}>
                                                <button className="remove" onClick={(event) => Remove(event, car.vehicle_id)}>Remove</button>
                                            </div>

                                            {service[index] && <button onClick={(event) => ServiceVehicle(event, car.vehicle_id, car.vehicle_mileage)} className="icon-cross" >
                                                <FontAwesomeIcon icon="fa-solid fa-screwdriver-wrench" style={{ marginTop: 5, height: 25, width: 25, color: "white" }} />
                                                <p><strong style={{ marginTop: 10, marginLeft: -20 }}>Service</strong></p>
                                            </button>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>}


                {/**End Vehicles */}

            </main >

            {/**Footer */}
            < footer id="footer" className="footer" >
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
            </footer >
            {/**Footer End */}
        </>
    )
}

export default Vehicles