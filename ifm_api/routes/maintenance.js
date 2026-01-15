import express from "express"
import client from "../dbconnection.js"

const route = express.Router()

//Add Vehicles to service list
route.post("/", (req, res) => {

    let id = req.body.vehicle_id
    let service = [new Date(req.body.service_date), req.body.service_interval, req.body.vehicle_id]

    client.query("INSERT INTO maintenance(service_date,service_interval,vehicle_id) VALUES($1,$2,$3)", service, (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount === 1) {

            client.query("Update vehicles Set service = 'Yes' where vehicle_id = $1", [id], (err1, result1) => {
                if (err) {
                    res.send("Error in server")
                } else if (result.rowCount === 1) {
                    res.send("Success")
                } else {
                    res.send("Failure")
                }
            })

        } else {
            res.send("Failure")
        }
    })
})

//Get Vehicles Being Serviced
route.get("/", (req, res) => {
    client.query("Select service_interval,service_id,service_date,vehicles.vehicle_id,vehicle_model,vehicle_make,vehicle_year,vehicle_cat from maintenance inner join vehicles on maintenance.vehicle_id = vehicles.vehicle_id where service_date = Current_Date", (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount >= 1) {
            res.send(result.rows)
        } else {
            res.send([{ status: "None", service_interval: "", service_id: 0, service_date: new Date(), vehicle_id: 0, vehicle_model: "", vehicle_make: "", vehicle_year: "", vehicle_cat: "" }])
        }
    })
})

//Get Vehicles that are pending so they are not serviced
route.get("/:id", (req, res) => {
    let id = req.params.id

    client.query("select * from rentals where status = 'Pending' and vehicle_id = $1", [id], (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount >= 1) {
            res.send("Unavailable")
        } else {
            res.send("Available")
        }


    })
})

export default route;