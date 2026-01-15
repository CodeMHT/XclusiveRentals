import express from "express";
import client from "../dbconnection.js";

const route = express.Router()


//Make The booking
route.post("/", (req, res) => {
    //Store how much vehicle will cost to rent

    let collection = new Date(req.body.collection)
    let dropoff = new Date(req.body.return)

    let income = req.body.cost * ((dropoff - collection) / (1000 * 60 * 60 * 24)) //Money for the days booked

    let vat = income * 0.15

    let booking = [req.body.collection, req.body.return, req.body.avail, income, req.body.customer_id, req.body.make, req.body.cat, req.body.id, vat]

    client.query("INSERT INTO public.rentals(pickup, dropoff, status,income, customer_id,make,category, vehicle_id,vat) VALUES ($1, $2, $3, $4, $5,$6,$7,$8,$9)", booking, (err, result) => {
        if (err) {
            res.send("Error in server " + err)
        } else if (result.rowCount === 1) {
            res.send("Success")
        } else {
            res.send("Failure")
        }
    })
})

//Get Current Vehicles that are currently booked
route.get("/", (req, res) => {


    client.query("select vehicles.vehicle_id,vehicle_model,vehicle_make,vehicle_year,vehicle_cat,vehicle_color,vehicle_seats,vehicle_mileage,vehicle_feat,vehicle_cost,rent_id,income,dropoff,user_name,collected,ifm_users.customer_id from vehicles inner join rentals  on vehicles.vehicle_id=rentals.vehicle_id inner join ifm_users on rentals.customer_id = ifm_users.customer_id where status = 'Pending'", (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount >= 1) {
            res.send(result.rows)
        } else {
            res.send([{ status: "No rentals found", vehicle_id: 0, vehicle_make: "", vehicle_model: "", vehicle_year: "", vehicle_cat: "", vehicle_color: "", vehicle_seats: "", vehicle_mileage: 0, vehicle_feat: "", vehicle_cost: "", rent_id: "", income: "", dropoff: new Date(), user_name: "", customer_id: 0 }])
        }
    })
})

//Update Upcoming bookings 
route.post("/update", (req, res) => {

    client.query("Update rentals SET status= 'Pending' where pickup = CURRENT_DATE", (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount >= 0) {
            res.send("Success")
        } else {
            res.send("Failure")
        }
    })

})



//Get previous rentals for customer
route.get("/history/:id", (req, res) => {
    let id = req.params.id

    client.query('SELECT rentals.rent_id, rentals.pickup, rentals.dropoff, rentals.status, rentals.income, rentals.customer_id, vehicles.vehicle_id, vehicles.vehicle_model, vehicles.vehicle_make, vehicles.vehicle_year, vehicles.vehicle_cat, vehicles.vehicle_color, vehicles.vehicle_seats, vehicles.vehicle_mileage, vehicles.vehicle_feat, vehicles.vehicle_cost,collected FROM rentals INNER JOIN vehicles ON rentals.vehicle_id = vehicles.vehicle_id WHERE rentals.customer_id = $1 order by pickup DESC', [id]
        , (err, result) => {
            if (err) {
                res.send("Error in server")
            } else if (result.rowCount >= 1) {
                res.send(result.rows)
            } else {
                res.send("No rentals")
            }
        })
})

//Update Rental Status
route.put("/", (req, res) => {

    //update status in rentals
    client.query("Update rentals SET status = 'Completed' where rent_id =$1", [req.body.rent_id], (err, result1) => {
        if (err) {
            res.send("Error in server")
        } else if (result1.rowCount === 1) {
            res.send("Success")
        } else {
            res.send("Rental Failure")
        }
    })

})

//Set Days overdue if vehicle hasnt been checked in 
route.put("/overdue", (req, res) => {

    //set todays date 
    let today = new Date()
    today.setHours(0, 0, 0, 0)



    //get all the rentend vehicles that are still pending 
    client.query("Select * from rentals where status = 'Pending'", (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount >= 1) {
            let rentals = result.rows

            let success = true

            for (let i = 0; i < rentals.length; i++) {
                let returnDate = new Date(rentals[i].dropoff)
                if (today > returnDate) {

                    //Amount of days the vehicle is overdue by 
                    let overdue = (today - returnDate) / (1000 * 60 * 60 * 24)
                    //User will be charged R500 for everyday vehicle is overdue by
                    let fees = 500 * overdue

                    //set overdue days in database
                    client.query("UPDATE rentals SET overdue_days=$1, fees=$2 WHERE rent_id = $3", [overdue, fees, rentals[i].rent_id], (err1, result1) => {
                        if (err1) {
                            success = false
                        } else if (result1.rowCount === 1) {
                            success = true
                        } else {
                            success = false
                        }
                    })

                }
                if (!success) {
                    break;
                }
            }

            //send over response
            if (success) {
                res.send("Success")
            } else {
                res.send("Failure")
            }

        } else {
            res.send("No pending rentals")
        }
    })

})

//get days booked for a particular vehicle
route.get("/dates/:id", (req, res) => {

    let id = req.params.id
    client.query("SELECT pickup,dropoff from rentals where status != 'Completed' and status != 'Cancelled' and vehicle_id = $1", [id], (err, result) => {
        if (err) {
            res.send(err).Date
        } else if (result.rowCount >= 1) {
            res.send(result.rows)
        } else {
            res.send([{ status: "None", pickup: "", dropoff: "" }])
        }
    })
})

//filter rentals
route.get("/:id/:status", (req, res) => {
    const search = [req.params.id, req.params.status]

    client.query("SELECT rentals.rent_id, rentals.pickup, rentals.dropoff, rentals.status, rentals.income, rentals.customer_id, vehicles.vehicle_id, vehicles.vehicle_model, vehicles.vehicle_make, vehicles.vehicle_year, vehicles.vehicle_cat, vehicles.vehicle_color, vehicles.vehicle_seats, vehicles.vehicle_mileage, vehicles.vehicle_feat, vehicles.vehicle_cost,collected FROM rentals INNER JOIN vehicles ON rentals.vehicle_id = vehicles.vehicle_id WHERE rentals.customer_id = $1 and status = $2 order by pickup DESC", search, (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount >= 1) {
            res.send(result.rows)
        } else {
            res.send([{ status: "No rentals found", vehicle_id: 0, vehicle_make: "", vehicle_model: "", vehicle_year: "", vehicle_cat: "", vehicle_color: "", vehicle_seats: "", vehicle_mileage: 0, vehicle_feat: "", vehicle_cost: "", rent_id: "", income: "", dropoff: new Date() }])

        }
    })
})

route.put("/collect/:id", (req, res) => {
    let id = req.params.id

    client.query("Update rentals SET collected = 'Yes' where rent_id = $1", [id], (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount === 1) {
            res.send("Success")
        } else {
            res.send("Failure")
        }
    })
})

route.put("/cancel", async (req, res) => {
    try {
        // Fetch rentals with Pending status and pickup date of yesterday
        const { rows } = await client.query(
            "SELECT rent_id FROM rentals WHERE status = 'Pending' AND pickup = CURRENT_DATE - INTERVAL '1 day' and collected='NO '"
        );

        // Check if any rentals found
        if (rows.length === 0) {
            return res.send("None");
        }

        // Update each rental to "Cancelled"
        const updatePromises = rows.map(({ rent_id }) =>
            client.query("UPDATE rentals SET status = 'Cancelled' WHERE rent_id = $1", [rent_id])
        );

        // Execute all updates in parallel
        await Promise.all(updatePromises);

        // If everything succeeded
        res.send("Success");
    } catch (error) {
        res.status(500).send("Error in server");
    }
})



export default route