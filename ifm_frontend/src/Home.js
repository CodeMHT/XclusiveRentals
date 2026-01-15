import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';




//Image Imports
import bmw from "./bmw7.png"
import cla from "./clacoupe.avif"



const Home = () => {

    return (

        < main >
            {/** 
* Bootstrap 5
* Template Name: Furni
* Template Author: Untree.co
* Template URI: https://untree.co/
* License: https://creativecommons.org/licenses/by/3.0/
*  */}

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
            <div className="hero">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-lg-5">
                            <div className="intro-excerpt">
                                <h1>Vehicle Rentals <span clsas="d-block">For all Preferences</span></h1>
                                <p className="mb-4">Whether its a holiday or a business trip, we have the perfect vehicles for every occasion</p>
                                <p><a href="/services" className="btn btn-secondary me-2">Reserve Now</a></p>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="hero-img-wrap">
                                <img src={bmw} alt="bmw 7 series" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/**End Hero Section*/}



            {/**Start Why Choose Us Section*/}
            <div className="why-choose-section">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-lg-6">
                            <h2 className="section-title">Why Choose Us</h2>
                            <p>We offer the newest and best maintained vehicles at an affordable price</p>

                            <div className="row my-5">
                                <div className="col-6 col-md-6">
                                    <div className="feature">
                                        <div className="icon">
                                            <FontAwesomeIcon icon="fa fa-car" className="imf-fluid" />
                                        </div>
                                        <h3>Fast &amp; Collection</h3>
                                        <p>We ensure your vehicle is available as soon as possible and if not we have alternatives to satisfy your every need</p>
                                    </div>
                                </div>

                                <div className="col-6 col-md-6">
                                    <div className="feature">
                                        <div className="icon">
                                            <FontAwesomeIcon icon="fa-solid fa-cart-shopping" className="imf-fluid" />
                                        </div>
                                        <h3>Easy To Rent</h3>
                                        <p>The process to rent a vehicle has never been easier</p>
                                    </div>
                                </div>

                                <div className="col-6 col-md-6">
                                    <div className="feature">
                                        <div className="icon">
                                            <FontAwesomeIcon icon="fa-solid fa-headset" className="imf-fluid" />
                                        </div>
                                        <h3>24/7 Support</h3>
                                        <p>Our staff is one email or call away if you need any assistance.</p>
                                    </div>
                                </div>

                                <div className="col-6 col-md-6">
                                    <div className="feature">
                                        <div className="icon">
                                            <FontAwesomeIcon icon="fa-solid fa-rotate-left" />
                                        </div>
                                        <h3>Hassle Free Returns</h3>
                                        <p>The vehicle returns are made simple and as efficient as possible</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/**End Why Choose Us Section*/}

            {/**Start Footer Section*/}
            <footer className="footer-section">
                <div className="container relative">

                    <div className="sofa-img">
                        <img src={cla} alt="mercedes cla" className="img-fluid" />
                    </div>

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
                                        <li><a href="/signup">Sign Up/Log In</a></li>
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

export default Home