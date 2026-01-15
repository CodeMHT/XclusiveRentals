import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import spinner from "./client-spinner.svg"


const Booking = () => {

    //Get Vehicle ID
    const location = useLocation()
    const redirect = useNavigate()

    const [isLoading, setIsLoading] = useState(false)  //handles loading state

    const [open, setOpen] = useState(false)   //handles modal 

    const Open = () => setOpen(true) ///Open T's and C's Modal

    const Close = () => {    //close T's and C's modal
        setOpen(false)
        redirect("/services")
    }

    //Vehicle ID
    let params = location.state

    //Store vehicle details
    const [car, setCar] = useState({})

    //Store vehicle dates
    const [dates, setDates] = useState([])

    //if vehicle has a booking show dates otherwise keep at false
    const [viewDates, setViewDates] = useState(true)

    //User Prompt
    const [error, setError] = useState("")  //failure

    const [dateerror, setDateError] = useState("") //in case user sets return date before collection date

    //store booking info  
    const [booking, setBooking] = useState({
        collection: "",
        return: "",
        avail: "",
        customer_id: "",
        email: "",
        cost: 0,
        make: "",
        cat: "",
        id: params.id

    })

    //confirm booking
    const ConfirmUser = (event) => {
        event.preventDefault()

        //first confirm user is an actual customer
        axios.get(`https://two024uj.onrender.com/user/${booking.customer_id}`)
            .then(res => {
                if (res.data === "Error getting profile" || res.data === "User Not Found") {
                    alert("This user does not exist. Please create and account before making a booking")
                } else {
                    let user = res.data

                    if (user.user_email === booking.email) {

                        ConfirmBooking()
                    } else {
                        alert("Emails do not match. Either log in and change the email or insert the correct email")
                    }
                }

            })

    }

    const ConfirmBooking = () => {
        //Set the payment
        booking.cost = car.vehicle_cost
        booking.make = car.vehicle_make
        booking.cat = car.vehicle_cat

        let today = new Date()
        today.setHours(0, 0, 0, 0)
        //set Status

        let book = new Date(booking.collection)
        book.setHours(0, 0, 0, 0)
        let equal = today.getTime() === book.getTime()  //Check if the pickup date is todays date

        if (equal) {
            booking.avail = "Pending"
        } else {
            booking.avail = "Upcoming"
        }

        let bookingError = false;

        if (booking.collection > booking.return) {
            setDateError("Return date can't be before collection date")
        } else {

            //Set Collection date and database stored date to the same type
            let collect = new Date(booking.collection)
            collect.setHours(0, 0, 0, 0)
            let return1 = new Date(booking.return)
            return1.setHours(0, 0, 0, 0)

            for (let i = 0; i < dates.length; i++) {
                let dropoff = new Date(dates[i].dropoff)
                let pickup = new Date(dates[i].pickup)

                if ((collect >= pickup && collect <= dropoff) ||
                    (return1 >= pickup && return1 <= dropoff) ||
                    (collect <= pickup && return1 >= dropoff)) {
                    alert("This vehicle is booked for those days")
                    bookingError = true
                    break;
                }
            }


            //the vehicle is not booked on those days
            if (!bookingError) {
                Book() //Make the booking
            }
        }

    }

    const Book = () => {
        //send booking info to database

        axios.post("https://two024uj.onrender.com/booking", booking)
            .then(res => {
                if (res.data === "Success") {
                    Open()  //open the modal
                } else {
                    alert("Failed to book this car")

                }
            })
    }

    //Get all the days that the vehicle is booked on
    const GetBookingInfo = () => {
        axios.get(`https://two024uj.onrender.com/booking/dates/${params.id}`)
            .then(res => {
                let returndays = res.data
                //give return days a 5 day buffer to cater for service days or overdue days
                for (let i = 0; i < returndays.length; i++) {
                    let day = new Date(returndays[i].dropoff)
                    returndays[i].dropoff = day.setDate(day.getDate() + 5)
                }

                setDates(returndays)

                //remove viewing of booking propmt
                if (res.data[0].status === "None") {
                    setViewDates(false)
                }

            })

    }


    useEffect(() => {

        //ensure page loads at the top not where scrollbar was left
        window.scrollTo(0, 0)
        setIsLoading(true)

        //Get Vehicle Detail
        axios.get(`https://two024uj.onrender.com/vehicles/booking/car/${params.id}`)
            .then(res => {

                if (res.data === "Failure" || res.data === "Error in server") {
                    setError("Vehicle not found")
                } else {
                    setCar(res.data)
                }
            })

        //Get Dates of bookings of vehicle
        GetBookingInfo()



        //give database time to retrieve info
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)

        // eslint-disable-next-line
    }, [])

    return (



        <main>
            {/**<!-- /*
          * Bootstrap 5
          * Template Name: Furni
          * Template Author: Untree.co
          * Template URI: https://untree.co/
          * License: https://creativecommons.org/licenses/by/3.0/
          */}

            {/**Modal for Password Change */}
            <Modal show={open} onHide={Close}>
                <Modal.Header closeButton>
                    <Modal.Title ><strong style={{ color: "#5566f2" }}>NOTE</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <p>Booking has been made successfully.</p>
                    <p>Vehicles that are returned late have a R500 overdue fee PER DAY</p>
                    <p>Customers that do not collect vehicle/s on day of pickup will have their bookings cancelled</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={Close}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal >

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
            <div className="hero" style={{ height: 100 }}>
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-lg-5" style={{ marginTop: -20 }}>
                            <div >
                                <h1 style={{ marginLeft: 150, textAlign: "center" }}>Booking</h1>
                                <p style={{ marginLeft: 150, textAlign: "center" }}>One more step and the car is yours to enjoy </p>

                            </div>
                        </div>
                        <div className="col-lg-7">

                        </div>
                    </div>
                </div>
            </div>
            {/**End Hero Section */}
            <h4 style={{ marginTop: 10, color: "#2f2f2f", fontWeight: "bold" }}>{error && error}</h4>

            {isLoading && <center><img src={spinner} alt="Loading"></img></center>}

            {!isLoading && <div className="we-help-section">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-lg-7 mb-5 mb-lg-0">
                            <div className="imgs-grid">
                                <div className="grid grid-1"><img src={`https://two024uj.onrender.com/vehicles/image/${car.vehicle_id}`} alt="Untree.co" /></div>

                            </div>
                        </div>
                        <div className="col-lg-5 ps-lg-5">
                            <h2 className="section-title mb-4">{car.vehicle_make + " " + car.vehicle_model}</h2>

                            <ul className="list-unstyled custom-list my-4">
                                <li><strong>Color: </strong>{car.vehicle_color}</li>
                                <li><strong>Year: </strong>{car.vehicle_year}</li>
                                <li><strong>Seats: </strong>{car.vehicle_seats}</li>
                                <li><strong>Mileage: </strong>{car.vehicle_mileage}</li>
                                <li><strong>Extras: </strong>{car.vehicle_feat}</li>
                                <li><strong>Category: </strong>{car.vehicle_cat}</li>
                            </ul>

                        </div>
                    </div>
                </div>
            </div>
            }
            {/**Booking Form */}
            {!isLoading && <form onSubmit={ConfirmUser} style={{ marginLeft: 300, marginTop: -40 }}>
                <div className="row g-3">
                    <div className="col-auto" style={{ marginBottom: 20 }}>
                        <label htmlFor="name"><strong>Customer ID</strong></label>
                        <input type="text" id="name" className="form-control" required onChange={e => setBooking({ ...booking, customer_id: e.target.value })} />
                    </div>
                    <div className="col-auto">
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" id="email" required className="form-control" placeholder="example@gmail.com" onChange={e => setBooking({ ...booking, email: e.target.value })} />
                    </div>
                </div>

                <div className="row g-3">
                    <div className="col-auto" style={{ paddingRight: 10 }}>
                        <label htmlFor="pickup"><strong>Collection Date</strong></label>
                        <input type="date" id="pickup" min={new Date().toISOString().split("T")[0]} className="form-control" required style={{ width: 236 }} onChange={e => setBooking({ ...booking, collection: e.target.value })} />
                    </div>
                    <div className="col-auto">
                        <label htmlFor="return"><strong>Return Date</strong></label>
                        <input type="date" id="return" min={new Date().toISOString().split("T")[0]} className="form-control" required style={{ width: 236 }} onChange={e => setBooking({ ...booking, return: e.target.value })} />
                    </div>
                </div>

                <div className="col-auto" style={{ marginTop: 20, marginLeft: 200, paddingBottom: 10 }}>
                    <button className="btn btn-primary">
                        <span className="fa fa-paper-plane" >Book Car</span>
                    </button>
                </div>
            </form>
            }
            <p style={{ color: 'red', paddingTop: 5, textAlign: "center" }}><strong>{dateerror && dateerror}</strong></p>
            {/**End Booking Form */}

            {/**Booked Days */}
            {!isLoading && viewDates && <div className="col-md-4" style={{ position: "absolute", bottom: 400, left: 900 }}>
                <div className="row mb-5">
                    <div className="col-md-12">
                        <h5>Vehicle Booked on:</h5>
                        <div className="p-3 p-lg-5 border bg-white">
                            <ul >
                                {dates.map((date, index) => {
                                    return (
                                        <li key={index}><p>{new Date(date.pickup).toDateString()} - {new Date(date.dropoff).toDateString()}</p></li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>}
            {/**End Booked Days */}


            {/**Start Footer Section*/}
            <footer className="footer-section">
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
        </main>
    )
}

export default Booking