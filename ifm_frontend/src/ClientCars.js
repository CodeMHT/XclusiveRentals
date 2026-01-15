import { useState, useEffect } from "react"
import axios from "axios"
import cross from "./cross.svg"
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Link } from "react-router-dom";
import spinner from "./client-spinner.svg"

const ClientCars = () => {

    //store vehicles
    const [cars, setCars] = useState([])
    const [error, setError] = useState("")

    const [pageNumbers, setPageNumbers] = useState([])  //number of pages needed for pagination  (used for buttons as well)
    const [currentPage, setCurrentPage] = useState(1)  //Stores the current page

    //Handle Pagination
    const [carsPerPage] = useState(12) //cars on each page
    const [carPage, setCarPages] = useState([]) //cars on each page

    const [isVehicles, setIsVehicles] = useState(true)


    //So user knows what they selected
    const [make, setMake] = useState("Make") //Make
    const [cat, setCat] = useState("Category") //Category
    const [feats, setFeats] = useState("Features")  //Features

    const [isLoading, setIsLoading] = useState(false)
    const [brands, setBrands] = useState([])  //Get Vehicle Make
    const [features, setFeatures] = useState([])  //Get Features


    //User Search
    const [search, setSearch] = useState({
        vehicle_make: "",
        vehicle_cat: "",
        vehicle_feat: ""
    })

    useEffect(() => {


        //ensure page loads at the top not where scrollbar was left
        window.scrollTo(0, 0)
        setIsLoading(true)
        //Get All Vehicles
        axios.get("https://two024uj.onrender.com/vehicles")
            .then(res => {
                setCars(res.data)

                //Pages
                let array = res.data

                const pages = []

                //get number of pages for the buttons 
                for (let i = 1; i <= Math.ceil(array.length / carsPerPage); i++) {
                    pages.push(i)
                }

                setPageNumbers(pages)
                setCarPages(array.slice(indexfirstCar, indexlastCar))  //get the number of posts in each page
                setIsLoading(false)
            })

        GetBrands()  //Get The Brands
        GetFeats() //Get The Features

        // eslint-disable-next-line
    }, [])

    //set the length of the the amount of vehicles on a page

    const indexlastCar = currentPage * carsPerPage
    const indexfirstCar = indexlastCar - carsPerPage

    const AllCars = (event) => {
        event.preventDefault()
        setIsLoading(true)
        axios.get("https://two024uj.onrender.com/vehicles")
            .then(res => {
                //Change the index
                setCars(res.data)
                let array = res.data

                const indexlastCar = 1 * carsPerPage
                const indexfirstCar = indexlastCar - carsPerPage

                setCarPages(array.slice(indexfirstCar, indexlastCar))  //get the number of posts in each page                //Reset error message and search 
                setError("")
                setSearch({
                    vehicle_make: "",
                    vehicle_cat: "",
                    vehicle_feat: ""
                })
                setCat("Category")
                setFeats("Features")
                setMake("Make")
                setIsVehicles(true)

                setIsLoading(false)
            })

    }

    //Get Vehicle Makes
    const GetBrands = async () => {

        let res = await axios.get('https://two024uj.onrender.com/make')

        if (res.data !== "Error in server" && res.data[0].status !== "None") {
            setBrands(res.data)
        } else {
            alert("Error getting vehicle brands")
        }
    }

    //Get Vehicle Features
    const GetFeats = async () => {

        let res = await axios.get('https://two024uj.onrender.com/make/features')

        if (res.data !== "Error in server" && res.data[0].status !== "None") {
            setFeatures(res.data)
        } else {
            alert("Error getting vehicle features")
        }
    }

    const Paginate = (event, number) => {
        event.preventDefault()
        setIsLoading(true)
        //Change the index
        const indexlastCar = number * carsPerPage
        const indexfirstCar = indexlastCar - carsPerPage

        setCarPages(cars.slice(indexfirstCar, indexlastCar))  //get the number of posts in each page

        //Change the page number
        setCurrentPage(number)
        setIsLoading(false)

    }

    //search vehicles according to specifications
    const Search = () => {
        setIsLoading(true)
        if (search.vehicle_cat === "" && search.vehicle_feat === "" && search.vehicle_make === "") {
            //fetch all vehicles
            setIsLoading(false)
        } else {
            setError("")
            //Get vehicles based on user selection
            axios.post("https://two024uj.onrender.com/vehicles/search", search)
                .then(res => {
                    if (res.data[0].status === "None" || res.data === "Error in server") {
                        setError("No vehicles found matching search")
                        setSearch({
                            vehicle_make: "",
                            vehicle_cat: "",
                            vehicle_feat: ""
                        })
                        setCat("Category")
                        setFeats("Features")
                        setMake("Make")
                        setCars([])
                        setIsVehicles(false)
                        setIsLoading(false)

                    } else {
                        let array = res.data

                        const lastCar = 1 * carsPerPage
                        const firstCar = lastCar - carsPerPage

                        setCarPages(array.slice(firstCar, lastCar))
                        setCars(array)
                        setSearch({
                            vehicle_make: "",
                            vehicle_cat: "",
                            vehicle_feat: ""
                        })
                        setCat("Category")
                        setFeats("Features")
                        setMake("Make")
                        setError("")
                        setIsVehicles(true)

                        setIsLoading(false)
                    }


                })
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
            <div style={{ height: 25 }} className="hero">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-lg-5">
                            <div >
                                <h1 style={{ textAlign: "center" }}>Our Vehicles</h1>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="flex-search">
                                {/**Make */}
                                <DropdownButton title={make} style={{ paddingBottom: 30, marginRight: 20 }}>
                                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        {brands.map((brand, index) => {
                                            return (
                                                <Dropdown.Item key={index} onClick={() => { setMake(brand.make); setSearch({ ...search, vehicle_make: brand.make }) }}>{brand.make}</Dropdown.Item>

                                            )

                                        })}
                                    </div>
                                </DropdownButton>

                                {/**Category */}
                                <DropdownButton className="DropDown" title={cat} style={{ paddingBottom: 30, marginRight: 20 }}>
                                    <Dropdown.Item onClick={() => { setCat("Convertible"); setSearch({ ...search, vehicle_cat: "Convertible" }) }}>Convertible</Dropdown.Item>
                                    <Dropdown.Item onClick={() => { setCat("Coupe"); setSearch({ ...search, vehicle_cat: "Coupe" }) }}>Coupe</Dropdown.Item>
                                    <Dropdown.Item onClick={() => { setCat("Estate"); setSearch({ ...search, vehicle_cat: "Estate" }) }}>Estate</Dropdown.Item>
                                    <Dropdown.Item onClick={() => { setCat("Hatchback"); setSearch({ ...search, vehicle_cat: "Hatchback" }) }}>Hatchback</Dropdown.Item>
                                    <Dropdown.Item onClick={() => { setCat("Luxury"); setSearch({ ...search, vehicle_cat: "Luxury" }) }}>Luxury</Dropdown.Item>
                                    <Dropdown.Item onClick={() => { setCat("Pickup"); setSearch({ ...search, vehicle_cat: "Pickup Truck" }) }}>Pickup</Dropdown.Item>
                                    <Dropdown.Item onClick={() => { setCat("Sedan"); setSearch({ ...search, vehicle_cat: "Sedan" }) }}>Sedan</Dropdown.Item>
                                    <Dropdown.Item onClick={() => { setCat("SUV"); setSearch({ ...search, vehicle_cat: "SUV" }) }}>SUV</Dropdown.Item>
                                </DropdownButton>

                                {/**Features*/}
                                <DropdownButton title={feats} style={{ paddingBottom: 30, marginRight: 20 }}>

                                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        {features.map((feature, index) => {
                                            return (
                                                <Dropdown.Item key={index} onClick={() => { setFeats(feature.feat); setSearch({ ...search, vehicle_feat: feature.feat }) }}>{feature.feat}</Dropdown.Item>

                                            )

                                        })}
                                    </div>
                                </DropdownButton>
                                <button className="search" onClick={Search}>Search Cars</button>
                                <button className="search" onClick={AllCars} style={{ marginLeft: 10 }}>All Cars</button>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/**End Hero Section */}

            <h4 style={{ marginLeft: 150, textAlign: "center", marginTop: 10 }}><strong>{error && error} </strong></h4>
            {isLoading && <center><img src={spinner} alt="Loading"></img></center>}

            <div >
                <ul className="pagination" style={{ justifyContent: "flex-end", marginRight: 20 }}>
                    {pageNumbers.map(num => {
                        return (
                            <li key={num} className="page-item">
                                <button onClick={(event) => Paginate(event, num)} className="page-link">{num}</button>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/** Client Cars  */}
            <div className="untree_co-section product-section before-footer-section" style={{ marginTop: -40 }}>
                <div className="container">
                    {isVehicles && <div className="row">

                        {!isLoading && carPage.map((car, index) => {
                            return (<div className="col-12 col-md-4 col-lg-3 mb-5" style={{ paddingRight: 20 }} key={index}>
                                <Link className="product-item" to="/bookings" state={{ id: car.vehicle_id }} style={{ width: 250, height: 350, marginTop: -20 }}>
                                    <img src={`https://two024uj.onrender.com/vehicles/image/${car.vehicle_id}`} alt="car here" className="img-dimensions img-fluid product-thumbnail" />
                                    <div style={{ position: "absolute", bottom: 30, left: 50 }}>
                                        <p>{car.vehicle_year}</p>
                                        <h3 className="product-title">{car.vehicle_make + " " + car.vehicle_model}</h3>
                                        <strong className="product-price">{"R" + car.vehicle_cost}</strong>
                                        <br />
                                        <br />
                                    </div>
                                    <span className="icon-cross">
                                        <img src={cross} alt="cross" className="img-fluid" />
                                    </span>
                                </Link>
                            </div>
                            )
                        })}
                    </div>}
                </div>
            </div>


            {/**End Client Cars */}



            {/**Start Footer Section*/}
            <footer className="footer-section" style={{ marginTop: -120 }}>
                <div className="container relative">
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

export default ClientCars