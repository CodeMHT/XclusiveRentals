import React from "react";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

//Import Pages
import Home from './Home';
import SignUp from "./SignUp";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import AddVehicle from "./AddVehicle";
import Vehicles from "./Vehicles";
import ClientCars from "./ClientCars";
import RentalHistory from "./RentalHistory";
import Booking from "./Booking";
import Rentals from "./Rentals";
import Invoices from "./Invoices";
import Clients from "./Clients";

function App() {
    return (

        <BrowserRouter basename="/">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dash" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/add" element={<AddVehicle />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/services" element={<ClientCars />} />
                <Route path="/history" element={<RentalHistory />} />
                <Route path="/bookings" element={<Booking />} />
                <Route path="/rentals" element={<Rentals />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="clients" element={<Clients />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
library.add(fab, far, fas)