import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import profile from "./profile.png"
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const AddVehicle = () => {

    const redirect = useNavigate()

    //Customer ID
    let id = localStorage.getItem("customer_id")

    let today = new Date()
    today.setHours(0, 0, 0, 0)

    //User Prompt
    const [success, setSuccess] = useState("")   //success prompt
    const [error, setError] = useState("");    //Error prompt

    const [makeError, setMakeError] = useState("")  //Prompt user on vehicle make addition error
    const [makeSuccess, setMakeSuccess] = useState("")   //Prompt user on vehicle make addition success

    const [featError, setFeatError] = useState("")  //Prompt user on vehicle feature addition error
    const [featSuccess, setFeatSuccess] = useState("")   //Prompt user on vehicle feature addition success

    const [open, setOpen] = useState(false)  //Controls the modal for make addition
    const Open = () => {
        setOpen(true)  //open add vehicle make modal
        setViewAdd(true)
    }
    const Close = () => {    //close vehicle make change modal
        setOpen(false)
        setMakeError("")
        setMakeSuccess("")
        //Get Makes again
        GetMakes()
    }

    const [openFeat, setOpenFeat] = useState(false)  //Controls the modal for feature addition
    const OpenFeat = () => {
        setOpenFeat(true)  //open add feature modal
        setViewAddFeat(true)
    }
    const CloseFeat = () => {    //close vehicle feat change modal
        setOpenFeat(false)
        setFeatError("")
        setFeatSuccess("")
        //Get Features again
        GetFeats()
    }


    //store vehicle data 
    const [car, setCar] = useState({
        model: "",
        make: "",
        year: "",
        category: "",
        avail: "In Lot",
        color: "",
        seats: "",
        mileage: 0,
        feats: "",
        image: {},
        added: today
    })

    //store brands
    const [brands, setBrands] = useState([])

    //store the features
    const [feats, setFeats] = useState([])

    //get User info
    const [user, setUser] = useState({})

    //Store make
    const [make, setMake] = useState("")

    //Store feature
    const [feature, setFeature] = useState("")

    //Close Button after success
    const [viewAdd, setViewAdd] = useState(true)
    const [viewAddFeat, setViewAddFeat] = useState(true)

    useEffect(() => {

        //get info about user
        axios.get(`https://xclusive-service.onrender.com/user/${id}`)
            .then(res => {
                setUser(res.data)
            })

        //Get All the vehicle makes
        GetMakes()

        //Get All the features a vehicle can have
        GetFeats()
    }, [id])

    //Get Vehicle Makes
    const GetMakes = async () => {

        let res = await axios.get('https://xclusive-service.onrender.com/make')

        if (res.data !== "Error in server" && res.data[0].status !== "None") {
            setBrands(res.data)
        } else {
            alert("Error getting vehicle brands")
        }
    }

    //get Vehicle Features
    const GetFeats = async () => {

        let res = await axios.get("https://xclusive-service.onrender.com/make/features")

        if (res.data !== "Error in server" && res.data[0].status !== "None") {
            setFeats(res.data)
        } else {
            alert("Error getting vehicle feats")
        }
    }

    //Add Car To Database
    const AddCar = (event) => {
        event.preventDefault()

        //Ensure user has selected an option
        if (car.model === "" || car.color === "" || car.year === "" || car.category === "" || car.seats === "" || car.feats === "") {
            alert("Values not selected")
        } else {


            let form = new FormData()

            //make it easier to send data to API
            form.append("model", car.model)
            form.append("make", car.make)
            form.append("year", car.year)
            form.append("category", car.category)
            form.append("avail", car.avail)
            form.append("color", car.color)
            form.append("seats", car.seats)
            form.append("mileage", car.mileage)
            form.append("feats", car.feats)
            form.append("image", car.image)  //especially image
            form.append("added", car.added)


            //Send data to api
            axios.post("https://xclusive-service.onrender.com/vehicles", form)
                .then(res => {
                    if (res.data === "Success") {

                        setError("")
                        alert("Vehicle added successfully")
                        redirect("/vehicles")

                    } else {
                        setSuccess("")
                        setError("Failed to add vehicle")
                    }
                })
        }

    }

    //Add A new vehicle Brand
    const AddMake = async (event) => {
        event.preventDefault()

        let res = await axios.post("https://xclusive-service.onrender.com/make", { make: make })
        if (res.data === "Success") {
            setMakeError("")
            setMakeSuccess("Brand Added")
            setViewAdd(false)
        } else if (res.data === "Exists") {
            setMakeSuccess("")
            setMakeError("Vehicle brand already exists")
        } else {
            setMakeSuccess("")
            setMakeError("Failed To Add Brand")
        }
    }

    //Add A new vehicle feature
    const AddFeature = async (event) => {
        event.preventDefault()

        let res = await axios.post("https://xclusive-service.onrender.com/make/features", { feat: feature })
        if (res.data === "Success") {
            setFeatError("")
            setFeatSuccess("Feature Added")
            setViewAddFeat(false)

        } else if (res.data === "Exists") {
            setFeatSuccess("")
            setFeatError("Feature already exists")
        } else {
            setFeatSuccess("")
            setFeatError("Failed to add feature")
        }
    }

    return (
        <>
            {/**Modal for Vehicle Make Addition */}
            <Modal show={open} onHide={Close}>
                <Modal.Header closeButton>
                    <Modal.Title ><strong style={{ color: "#5566f2" }}>Add a new vehicle brand</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    {/**Password */}
                    <div className="row mb-3">
                        <label htmlFor="makeChange" className="col-sm-2 col-form-label" style={{ color: "#5566f2" }}>Name of Brand:</label>
                        <div className="col-sm-10">
                            <input type="text" id="makeChange" name="makeChange" className="form-control" onChange={e => setMake(e.target.value)} />
                        </div>
                    </div>

                    <p style={{ color: "red" }}>{makeError && makeError}</p>
                    <p style={{ color: "green" }}>{makeSuccess && makeSuccess}</p>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={Close}>
                        Close
                    </Button>
                    {viewAdd && <Button variant="secondary" onClick={AddMake}>
                        Confirm
                    </Button>}
                </Modal.Footer>
            </Modal >

            {/**Modal for Vehicle Make Addition */}
            <Modal show={openFeat} onHide={CloseFeat}>
                <Modal.Header closeButton>
                    <Modal.Title ><strong style={{ color: "#5566f2" }}>Add a new feature</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    {/**Password */}
                    <div className="row mb-3">
                        <label htmlFor="makeChange" className="col-sm-2 col-form-label" style={{ color: "#5566f2" }}>Feature:</label>
                        <div className="col-sm-10">
                            <input type="text" id="makeChange" name="makeChange" className="form-control" onChange={e => setFeature(e.target.value)} />
                        </div>
                    </div>

                    <p style={{ color: "red" }}>{featError && featError}</p>
                    <p style={{ color: "green" }}>{featSuccess && featSuccess}</p>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={CloseFeat}>
                        Close
                    </Button>
                    {viewAddFeat && <Button variant="secondary" onClick={AddFeature}>
                        Confirm
                    </Button>}
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
                            <span>Customers</span>
                        </a>
                    </li>{/**End Profile Page Nav*/}

                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/profile">
                            <i className="bi bi-person"></i>
                            <span>Profile</span>
                        </a>
                    </li>{/**End Profile Page Nav*/}

                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/clients">
                            <i className="bi bi-person"></i>
                            <span>Clients</span>
                        </a>
                    </li>{/**End Customers Page Nav*/}

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
                    <h1>Add Vehicle</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/dash">Dashboard</a></li>
                            <li className="breadcrumb-item active">Add Vehicle</li>
                        </ol>
                    </nav>
                </div>
                {/**End Page Title */}

                {/**Add Make or Feature */}

                <div style={{ marginBottom: 20 }}>
                    <button type="submit" className="btn btn-secondary" style={{ marginRight: 30 }} onClick={Open}>Add Vehicle Make</button>
                    <button type="submit" className="btn btn-secondary" onClick={OpenFeat}>Add Features</button>

                </div>

                {/**Add Vehicles Form */}
                <form className="row g-3" onSubmit={AddCar}>
                    <div className="col-md-6">
                        <label htmlFor="make" className="form-label">Make</label>
                        <select id="make" className="form-select" required onChange={e => setCar({ ...car, make: e.target.value })}>
                            <option defaultValue=".">Choose...</option>
                            {brands.map((brand, index) => {
                                return (
                                    <option key={index} value={brand.make}>{brand.make}</option>
                                )
                            })}


                        </select>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="model" className="form-label">Model</label>
                        <input type="text" className="form-control" id="model" required onChange={e => setCar({ ...car, model: e.target.value })} />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="year" className="form-label">Year</label>
                        <select id="year" className="form-select" required onChange={e => setCar({ ...car, year: e.target.value })}>
                            <option defaultValue=".">Choose...</option>
                            <option value="2017">2010</option>
                            <option value="2018">2011</option>
                            <option value="2019">2012</option>
                            <option value="2020">2013</option>
                            <option value="2021">2014</option>
                            <option value="2022">2015</option>
                            <option value="2023">2016</option>
                            <option value="2017">2017</option>
                            <option value="2018">2018</option>
                            <option value="2019">2019</option>
                            <option value="2020">2020</option>
                            <option value="2021">2021</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="cat" className="form-label">Category</label>
                        <select id="cat" className="form-select" required onChange={e => setCar({ ...car, category: e.target.value })}>
                            <option defaultValue=".">Choose...</option>
                            <option value="Sedan">Sedan</option>
                            <option value="Coupe">Coupe</option>
                            <option value="Hatchback">Hatchback</option>
                            <option value="Convertible">Convertible</option>
                            <option value="Estate">Estate</option>
                            <option value="SUV">SUV</option>
                            <option value="Pickup Truck">Pickup Truck</option>
                            <option value="Luxury">Luxury</option>

                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="color" className="form-label">Color</label>
                        <select id="color" className="form-select" required onChange={e => setCar({ ...car, color: e.target.value })}>
                            <option defaultValue=".">Choose...</option>
                            <option value="Black">Black</option>
                            <option value="White">White</option>
                            <option value="Blue">Blue</option>
                            <option value="Turquoise">Turquoise</option>
                            <option value="Red">Red</option>
                            <option value="Green">Green</option>
                            <option value="darkgreen"> Dark Green</option>
                            <option value="yellowgreen"> Yellow Green</option>
                            <option value="Beige">Beige</option>
                            <option value="Silver">Silver</option>
                            <option value="Orange">Orange</option>
                            <option value="Grey">Grey</option>
                            <option value="Brown">Brown</option>
                            <option value="Burgundy">Burgundy</option>
                            <option value="Gold">Gold</option>
                            <option value="Magenta">Magenta</option>
                            <option value="Navy">Navy</option>
                            <option value="Maroon">Maroon</option>
                            <option value="Pink">Pink</option>
                            <option value="Purple">Purple</option>
                            <option value="Yellow">Yellow</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="seats" className="form-label">Number of Seats</label>
                        <select id="seats" className="form-select" required onChange={e => setCar({ ...car, seats: e.target.value })}>
                            <option defaultValue=".">Choose...</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="7">7</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="mileage" className="form-label">Mileage</label>
                        <input type="number" className="form-control" id="mileage" required onChange={e => setCar({ ...car, mileage: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="feats" className="form-label">Extra Features</label>
                        <select id="feats" className="form-select" required onChange={e => setCar({ ...car, feats: e.target.value })}>

                            <option defaultValue=".">Choose...</option>
                            {feats.map((feature, index) => {
                                return (
                                    <option key={index} alue={feature.feat}>{feature.feat}</option>
                                )
                            })}


                        </select>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="image" className="col-sm-2 col-form-label">Image</label>
                        <input className="form-control" required type="file" id="image" onChange={e => setCar({ ...car, image: e.target.files[0] })} />
                    </div>


                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">Add Vehicle</button>
                    </div>
                </form>
                {/**Add Vehicles Form */}
                <p style={{ color: "green" }}><strong>{success && success}</strong></p>
                <p style={{ color: "red" }}><strong>{error && error}</strong></p>
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

export default AddVehicle;