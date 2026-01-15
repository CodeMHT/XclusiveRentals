import { useEffect, useState } from "react"
import axios from "axios"
import profile from "./profile.png"
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import spinner from './spinner.svg'


const Invoices = () => {

    //User ID
    const id = localStorage.getItem("customer_id")

    const [pay, setPay] = useState([])

    //store user
    const [user, setUser] = useState({})

    //store information about completed rentals
    const [invoice, setInvoice] = useState([])

    //Control The loading icon
    const [isLoading, setIsLoading] = useState(false)

    //Which buttons are allowed to be viewed
    const [view, setView] = useState(true)

    //if there are no invoices
    const [viewInvoice, setViewInvoice] = useState(true)

    const [error, setError] = useState("") //If there are no invoices

    //get car to access it
    const [car, setCar] = useState({})
    const [total, setTotal] = useState(0)

    //controls Modal for user prompt
    const [open, setOpen] = useState(false)  //Controls the modal for change mileage

    const Open = (event, index) => {
        event.preventDefault()

        setCar(invoice[index])
        setTotal(invoice[index].fees + invoice[index].income + invoice[index].vat)
        setOpen(true)
    }//Open Modal
    const Close = () => {

        setOpen(false)
    } //Close Modal

    //get info about invoices
    const GetInvoices = () => {
        setIsLoading(true)
        let isOwed = []  //stores whether each invoice has been paid or not

        axios.get(`https://two024uj.onrender.com/reports/invoices/${id}`)
            .then(res => {
                if (res.data === "Error in server" || res.data[0].status === "None") {
                    setViewInvoice(false)
                    setError("No invoices for user")
                } else {
                    setError("")
                    let temp = res.data

                    //Show user whether the invoice has been paid or not
                    for (let i = 0; i < temp.length; i++) {
                        if (temp[i].paid === "Owed") {
                            temp[i].paid = <strong style={{ marginLeft: 100, color: "red" }} >{temp[i].paid}</strong>
                            isOwed.push(true)
                        } else if (temp[i].paid === "Paid") {
                            temp[i].paid = <strong style={{ marginLeft: 100, color: "green" }} >{temp[i].paid}</strong>
                            isOwed.push(false)
                        }
                    }

                    setInvoice(temp)

                }
                setPay(isOwed)
                setIsLoading(false)
            })

    }

    //Pay Invoice
    const Pay = (event, id) => {
        event.preventDefault()

        axios.put(`https://two024uj.onrender.com/reports`, { rent_id: id })
            .then(res => {
                if (res.data === "Success") {
                    alert("Invoice #" + id + " has been succesfully paid")
                    window.location.reload()
                } else {
                    alert("Invoice #" + id + " payment has failed")
                }
            })
    }

    useEffect(() => {
        //get User


        axios.get(`https://two024uj.onrender.com/user/${id}`)
            .then(res => {
                setUser(res.data)
                if (res.data.user_type === "C") {
                    setView(false)
                }

            })

        GetInvoices()

        // eslint-disable-next-line
    }, [id])

    return (
        <>
            {/**Modal for Password Change */}
            <Modal show={open} onHide={Close}>

                <Modal.Body >
                    <div className="row mb-5">
                        <div className="col-md-12">
                            <h2 className="h3 mb-3 text-black">{"Invoice No: " + car.rent_id} </h2>
                            <div className="p-3 p-lg-5 border bg-white">
                                <table className="table site-block-order-table mb-5">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Amount</th>
                                        </tr>

                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{car.make + " " + car.vehicle_model}</td>
                                            <td>{"R" + car.vehicle_cost}</td>
                                        </tr>
                                        <tr>
                                            <td>Days Rented <strong className="mx-2">x</strong>{car.income / car.vehicle_cost}</td>
                                            <td></td>

                                        </tr>
                                        <tr>
                                            <td className="text-black font-weight-bold"><strong>Subtotal</strong></td>
                                            <td className="text-black"><strong>{"R" + car.income}</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Overdue <strong className="mx-2">x</strong> {car.overdue_days}</td>
                                            <td>{"R" + car.fees}</td>
                                        </tr>
                                        <tr>
                                            <td>VAT <strong className="mx-2">x</strong> 15%</td>
                                            <td>{"R" + car.vat}</td>
                                        </tr>

                                        <tr>
                                            <td className="text-black font-weight-bold"><strong>Order Total</strong></td>
                                            <td className="text-black font-weight-bold"><strong>{"R" + total}</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={Close}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/**Header */}
            < header id="header" className="header fixed-top d-flex align-items-center" >

                <div className="d-flex align-items-center justify-content-between">
                    <div className="logo d-flex align-items-center">

                        <span className="d-none d-lg-block">Xclusive Rentals</span>
                    </div>
                    <i className="bi bi-list toggle-sidebar-btn"></i>
                </div>

                <nav className="header-nav ms-auto">
                    <div className="d-flex align-items-center">

                        <div className="nav-item dropdown pe-3">

                            <a className="nav-link nav-profile d-flex align-items-center pe-0" data-bs-toggle="dropdown" href="/profile">
                                <img src={profile} alt="Profile" className="rounded-circle" />
                                <span className="d-none d-md-block ps-2">{user.user_name}</span>
                            </a> {/**End Profile Image Icon --> */}

                        </div>{/** End Profile Nav -->*/}

                    </div>
                </nav > {/**End Icons Navigation --> */}

            </header >
            {/**End Header --> */}

            {/**SideBar */}
            <aside id="sidebar" className="sidebar">

                <ul className="sidebar-nav" id="sidebar-nav">

                    {view && <li className="nav-item" key="Dashboard">
                        <a className="nav-link " href="/dash">
                            <i className="bi bi-grid"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>} {/**End Dashboard Nav */}

                    {view && <li className="nav-heading">Vehicles</li>}


                    {view && <li className="nav-item" key="Add-Vehicle">
                        <a className="nav-link collapsed" href="/add">
                            <i className="bi bi-person"></i>
                            <span>Add Vehicle</span>
                        </a>
                    </li>}{/**End Add Vehicle Page Nav*/}

                    {view && <li className="nav-item" key="Vehicles">
                        <a className="nav-link collapsed" href="/vehicles">
                            <i className="bi bi-person"></i>
                            <span>Vehicles</span>
                        </a>
                    </li>}{/**End Vehicle Page Nav*/}

                    {view && <li className="nav-item" key="Rentals">
                        <a className="nav-link collapsed" href="/rentals">
                            <i className="bi bi-person"></i>
                            <span>Rentals</span>
                        </a>
                    </li>}
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


                    <li className="nav-item" key="Profile">
                        <a className="nav-link collapsed" href="/profile">
                            <i className="bi bi-person"></i>
                            <span>Profile</span>
                        </a>
                    </li>{/**End Profile Page Nav*/}

                    <li className="nav-item" key="Logout">
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
                    <h1>Your Invoices</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/profile">Profile</a></li>
                            <li className="breadcrumb-item active">Invoices</li>
                        </ol>
                    </nav>
                </div>
                {/**End Page Title */}
                <center><h4 style={{ color: "#163A7C" }}><strong>{error && error}</strong></h4></center>
                {isLoading && <center><img src={spinner} alt="Loading..."></img></center>}

                {/**Invoices */}
                {viewInvoice && !isLoading && invoice.map((rent, index) => {

                    return (
                        <div className="card-invoice" key={index}>
                            <div className="card-body">
                                <h5 className="card-title"><strong>{"#" + rent.rent_id}</strong>{rent.paid}</h5>
                                <h6 className="card-subtitle mb-2" style={{ color: "blue" }}>{rent.make + " " + rent.vehicle_model}</h6>
                                <p className="card-text"><strong>Rented On: </strong>{new Date(rent.pickup).toDateString()}</p>
                                <p className="card-text"><strong>Overdue: </strong>{rent.overdue_days + " Days"}</p>
                                <center><button className="btn btn-primary" onClick={(event) => Open(event, index)}>View Invoice</button> {pay[index] && <button style={{ marginLeft: 10 }} className="btn btn-primary" onClick={(event) => Pay(event, rent.rent_id)}>Pay</button>}
                                </center>

                            </div>
                        </div>
                    )
                })}

                {/**End Invoices */}

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

export default Invoices