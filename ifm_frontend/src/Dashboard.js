import React, { useEffect, useState } from "react";
import axios from "axios"
import profile from "./profile.png"
import spinner from "./spinner.svg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Doughnut } from "react-chartjs-2"
import { Line } from "react-chartjs-2"
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Legend
} from "chart.js"


ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement
)


const Dashboard = () => {

    const [user, setUser] = useState({})

    const [openRentals, setOpenRentals] = useState(true)  //Making todays rentals collapsable

    const rentalsOpen = () => setOpenRentals(true) //expand rentals

    const rentalsClose = () => setOpenRentals(false)  //collapse rentals

    const [openOverdue, setOpenOverdue] = useState(true)  //Managing overdue vehicles collapse

    const overdueOpen = () => setOpenOverdue(true) //expand rentals

    const overdueClose = () => setOpenOverdue(false)  //collapse rentals

    const [openTopRentals, setOpenTopRentals] = useState(true)  //Managing top rentals collapse

    const topRentalsOpen = () => setOpenTopRentals(true) //expand top rentals

    const topRentalsClose = () => setOpenTopRentals(false)  //collapse top rentals

    const [monthRentals, setMonthRentals] = useState(true)  //Managing rentals collapse

    const monthRentalsOpen = () => setMonthRentals(true) //expand rentals

    const monthRentalsClose = () => setMonthRentals(false)  //collapse  rentals


    const [monthRevenue, setMonthRevenue] = useState(true)  //Managing revenue collapse

    const monthRevenueOpen = () => setMonthRevenue(true) //expand revenue

    const monthRevenueClose = () => setMonthRevenue(false)  //collapse revenue

    const [isLoading, setIsLoading] = useState(false) //Handle Loading of screen

    //Months
    const dates = ['No Data', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    //Customer ID
    let id = localStorage.getItem("customer_id")

    //Store todays rentals
    const [todaysRentals, setTodaysRentals] = useState([])

    //Store frequent customers
    const [frequent, setFrequent] = useState([])

    //Store current overdue vehicles
    const [overdue, setOverdue] = useState([])

    //Store This Months Revenue
    const [revenue, setRevenue] = useState([])

    //Store Most Popular Vehicles
    const [topVehicles, setTopVehicles] = useState([])

    //Store this months rentals
    const [monthlyRentals, setMonthlyRentals] = useState([])

    //store top 5 makes
    const [makes, setMakes] = useState([])

    //store top 5 categories
    const [categories, setCategories] = useState([])

    //get info about user
    const GetUser = () => {
        axios.get(`https://xclusive-service.onrender.com/user/${id}`)
            .then(res => {
                setUser(res.data)
            })
    }

    //Get Todays Rentals
    const TodaysRentals = () => {
        axios.get("https://xclusive-service.onrender.com/reports/today")
            .then(res => {
                if (res.data !== "Error in server") {
                    setTodaysRentals(res.data)
                }

            })
    }

    //Get This months revenue
    const MonthlyRevenue = () => {
        axios.get("https://xclusive-service.onrender.com/reports/month")
            .then(res => {
                if (res.data !== "Error in server" || res.data.month !== 0) {
                    setRevenue(res.data)

                    //} else if (res.data.month === 0) {

                } else {
                    setRevenue({ revenue: 0 })
                }
            }
            )
    }

    //This months rentals
    const MonthlyRentals = () => {
        axios.get("https://xclusive-service.onrender.com/reports/monthly/rentals")
            .then(res => {
                if (res.data !== "Error in server") {
                    setMonthlyRentals(res.data)
                }
            })

    }

    //Get current overdue vehicles this
    const OverdueCars = () => {
        axios.get("https://xclusive-service.onrender.com/reports/month/overdue")
            .then(res => {
                if (res.data !== "Error in server") {
                    setOverdue(res.data)
                }
            })
    }

    //Get Most Popular Vehicles
    const TopRentals = () => {
        axios.get("https://xclusive-service.onrender.com/reports/top/selling")
            .then(res => {
                if (res.data !== "Error in server") {
                    setTopVehicles(res.data)
                }
            })
    }


    //Get Frequent Customers
    const FrequentCustomers = () => {
        axios.get("https://xclusive-service.onrender.com/reports/frequent/customers")
            .then(res => {
                if (res.data !== "Error in server") {
                    setFrequent(res.data)
                }
            })
    }

    //get popular makes
    const GetMakes = () => {
        axios.get("https://xclusive-service.onrender.com/reports/brands")
            .then(res => {
                if (res.data !== "Error in server") {
                    setMakes(res.data)
                }
            })
    }

    //get top categories
    const GetCategories = () => {
        axios.get("https://xclusive-service.onrender.com/reports/category")
            .then(res => {
                if (res.data !== "Error in server") {

                    setCategories(res.data)
                }
            })
    }

    // Most Popular Makes Dougnut Chart
    const data = {
        labels: makes.map((car) => car.make),
        datasets: [{
            Label: "Rented",
            data: makes.map((car) => car.times),
            backgroundColor: ['blue', 'aqua', 'yellow', 'yellowgreen', 'orange'],
            borderColor: ['blue', 'aqua', 'yellow', 'yellowgreen', 'orange']
        }]
    }

    const options = {}

    //Most Popular Categories Doughnut Chart
    const catData = {
        labels: categories.map((cat) => cat.category),
        datasets: [{
            Label: "Popular Categories",
            data: categories.map((cat) => cat.times),
            backgroundColor: ['blue', 'aqua', 'yellow', 'yellowgreen', 'orange'],
            borderColor: ['blue', 'aqua', 'yellow', 'yellowgreen', 'orange']
        }]
    }

    const catOption = {}

    //Revenue Line Graph
    const lineData = {
        labels: revenue.map((money) => dates[parseInt(money.month)]),
        datasets: [{
            label: "Revenue (in Rands)",
            data: revenue.map((money) => + parseInt(money.total)),
            borderColor: "#2baafe"
        }]
    }

    const lineOptions = {}

    //Rentals Bar Graph
    const barData = {
        labels: monthlyRentals.map((rentals) => dates[parseInt(rentals.month)]),
        datasets: [{
            label: "Rentals",
            data: monthlyRentals.map((rentals) => parseInt(rentals.rented)),
            backgroundColor: [
                "#2BAAFE",
            ],
            borderColor: [
                '#2BAAFE',
            ],
        }]
    }

    const barOptions = {}


    useEffect(() => {

        setIsLoading(true)
        //Get User
        GetUser()

        //Get Todays Rentals
        TodaysRentals()

        //Get This Months Revenue
        MonthlyRevenue()

        //Get This Months Rentals
        MonthlyRentals()

        //Get current overdue vehicles
        OverdueCars()

        //Get Top Rentals
        TopRentals()

        //Get Frequent Customers
        FrequentCustomers()

        //Get popular Makes
        GetMakes()

        //Get popular categories
        GetCategories()

        setTimeout(() => {
            setIsLoading(false)
        }, 1500)
        // eslint-disable-next-line
    }, [])


    return (

        <>

            {/**Header */}
            <header id="header" className="header fixed-top d-flex align-items-center">

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
                    </li>{/**End Customers Page Nav*/}

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
                    <h1>Dashboard</h1>

                </div>{/* End Page Title -->*/}
                {isLoading && <center><img src={spinner} alt="Loading..."></img></center>}

                {!isLoading && <section className="section dashboard">
                    <div className="row">

                        {/* Left side columns */}
                        <div className="col-lg-8">
                            <div className="row">

                                {/**Monthly Rentals Card --> */}
                                <div className="col-12">
                                    <div className="card recent-sales overflow-auto">

                                        <div className="card-body">
                                            <h5 className="card-title">Rentals <span>{"| " + new Date().getFullYear()}</span><button onClick={monthRentalsOpen} style={{ borderWidth: 0, marginLeft: 515, height: 15, width: 15, backgroundColor: "#ffffff" }}><FontAwesomeIcon icon="fa-solid fa-plus" /></button><button onClick={monthRentalsClose} style={{ borderWidth: 0, marginLeft: 20, backgroundColor: "#ffffff" }}><FontAwesomeIcon icon="fa-solid fa-minus" /></button></h5>

                                            {monthRentals && <Bar data={barData} options={barOptions} />}
                                        </div>
                                    </div>
                                </div>
                                {/**End Monthly Rentals Card*/}

                                {/**Graph monthly income */}

                                <div className="col-12">
                                    <div className="card recent-sales overflow-auto">

                                        <div className="card-body">
                                            <h5 className="card-title">Revenue <span>{"| " + new Date().getFullYear()}</span><button onClick={monthRevenueOpen} style={{ borderWidth: 0, marginLeft: 500, height: 15, width: 15, backgroundColor: "#ffffff" }}><FontAwesomeIcon icon="fa-solid fa-plus" /></button><button onClick={monthRevenueClose} style={{ borderWidth: 0, marginLeft: 20, backgroundColor: "#ffffff" }}><FontAwesomeIcon icon="fa-solid fa-minus" /></button></h5>

                                            {monthRevenue && <Line data={lineData} options={lineOptions} />}
                                        </div>
                                    </div>
                                </div>
                                {/**End Graph monthly income */}

                                {/*Recent Sales*/}
                                <div className="col-12">
                                    <div className="card recent-sales overflow-auto">

                                        <div className="card-body">
                                            <h5 className="card-title">Rentals <span>| Today</span><button onClick={rentalsOpen} style={{ borderWidth: 0, marginLeft: 500, height: 15, width: 15, backgroundColor: "#ffffff" }}><FontAwesomeIcon icon="fa-solid fa-plus" /></button><button onClick={rentalsClose} style={{ borderWidth: 0, marginLeft: 20, backgroundColor: "#ffffff" }}><FontAwesomeIcon icon="fa-solid fa-minus" /></button></h5>

                                            {openRentals && <table className="table table-borderless datatable">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Customer</th>
                                                        <th scope="col">Vehicle</th>
                                                        <th scope="col">Cost</th>
                                                        <th scope="col">Return Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {todaysRentals.map((rental, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <th scope="row" style={{ color: "#163A7C" }}>{rental.rent_id}</th>
                                                                <td style={{ paddingRight: -40 }}>{rental.user_name}</td>
                                                                <td className="text-primary">{rental.vehicle_make + " " + rental.vehicle_model}</td>
                                                                <td>{"R" + rental.income}</td>
                                                                <td><span style={{ color: "#163A7C" }}>{new Date(rental.dropoff).toDateString()}</span></td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>}

                                        </div>

                                    </div>
                                </div> {/**End Recent Sales */}

                                {/*Overdue Vehicles*/}
                                <div className="col-12">
                                    <div className="card recent-sales overflow-auto">

                                        <div className="card-body">
                                            <h5 className="card-title">Overdue Vehicles <span>| Currently</span><div style={{ marginTop: -20 }}><button onClick={overdueOpen} style={{ borderWidth: 0, marginLeft: 610, height: 15, width: 15, backgroundColor: "#ffffff" }}><FontAwesomeIcon icon="fa-solid fa-plus" /></button><button onClick={overdueClose} style={{ height: 15, width: 15, borderWidth: 0, marginLeft: 20, backgroundColor: "#ffffff" }}><FontAwesomeIcon icon="fa-solid fa-minus" /></button></div></h5>

                                            {openOverdue && <table className="table table-borderless datatable">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Customer</th>
                                                        <th scope="col">Vehicle</th>
                                                        <th scope="col">Return Date</th>
                                                        <th scope="col">Days Overdue</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {overdue.map((car, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <th scope="row" style={{ color: "#163A7C" }}>{car.rent_id}</th>
                                                                <td>{car.user_name}</td>
                                                                <td className="text-primary">{car.vehicle_make + " " + car.vehicle_model}</td>
                                                                <td><span style={{ color: "#163A7C" }}>{new Date(car.dropoff).toDateString()}</span></td>
                                                                <td><span className="badge bg-danger">{car.overdue_days + " day/s"}</span></td>
                                                            </tr>

                                                        )
                                                    })}

                                                </tbody>
                                            </table>}

                                        </div>

                                    </div>
                                </div> {/**End Overdue Vehicles */}

                                {/**Top Selling -->*/}
                                <div className="col-12">
                                    <div className="card top-selling overflow-auto">

                                        <div className="card-body pb-0">
                                            <h5 className="card-title">Top Rentals <span>| Overall</span><button onClick={topRentalsOpen} style={{ borderWidth: 0, marginLeft: 460, height: 15, width: 15, backgroundColor: "#ffffff" }}><FontAwesomeIcon icon="fa-solid fa-plus" /></button><button onClick={topRentalsClose} style={{ borderWidth: 0, marginLeft: 20, backgroundColor: "#ffffff" }}><FontAwesomeIcon icon="fa-solid fa-minus" /></button></h5>

                                            {openTopRentals && <table className="table table-borderless">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Preview</th>
                                                        <th scope="col">Vehicle</th>
                                                        <th scope="col">Price</th>
                                                        <th scope="col">Category</th>
                                                        <th scope="col">Rented</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {topVehicles.map((car, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <th scope="row"><img src={`https://xclusive-service.onrender.com/vehicles/image/${car.vehicle_id}`} alt="" /></th>
                                                                <td className="text-primary fw-bold">{car.vehicle_make + " " + car.vehicle_model}</td>
                                                                <td>{car.vehicle_cost}</td>
                                                                <td>{car.vehicle_cat}</td>
                                                                <td className="fw-bold">{car.times + " times"}</td>
                                                            </tr>
                                                        )

                                                    })}

                                                </tbody>
                                            </table>}

                                        </div>

                                    </div>
                                </div>{/**End Top Selling -->*/}
                            </div>
                        </div>{/**End Left side columns -->*/}

                        {/*} Right side columns */}
                        <div className="col-lg-4">

                            {/*Popular Makes */}
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Most Popular Makes</h5>

                                    <div className="activity">
                                        <Doughnut data={data} options={options} />
                                    </div>
                                </div>
                            </div>

                            {/**Frequent Customers Report */}
                            <div className="card">


                                <div className="card-body pb-0">
                                    <h5 className="card-title">Frequent Customers<span></span></h5>
                                    <div className="activity">

                                        <table className="table table-borderless">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Customer</th>
                                                    <th scope="col">Rented</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {frequent.map((client, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{client.customer_id}</td>
                                                            <td className="text-primary fw-bold">{client.user_name}</td>
                                                            <td className="fw-bold">{client.times + " times"}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>

                                    </div>


                                </div>                            </div>
                            {/**End Frequent Customers*/}

                            {/**Categories Report */}
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Popular Categories<span></span></h5>
                                    <div className="activity">

                                        <Doughnut data={catData} options={catOption} />

                                    </div>


                                </div>
                            </div>
                            {/**End Categories Report*/}
                        </div> {/**End Right side columns */}

                    </div>
                </section>}

            </main>
            {/**End #main*/}

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

export default Dashboard;