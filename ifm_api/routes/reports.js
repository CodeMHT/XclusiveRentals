import express from "express"
import client from "../dbconnection.js"

const route = express.Router()

//get all rentals from today
route.get("/today", (req, res) => {
    client.query("SELECT rentals.rent_id, rentals.pickup,rentals.income,ifm_users.user_name,vehicles.vehicle_id,vehicle_model,vehicle_make,dropoff FROM rentals INNER JOIN vehicles ON rentals.vehicle_id = vehicles.vehicle_id INNER JOIN ifm_users ON rentals.customer_id = ifm_users.customer_id WHERE CURRENT_DATE = rentals.pickup", (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount >= 1) {
            res.send(result.rows)
        } else {
            res.send([{ rent_id: "", pickup: "", income: "0", user_name: "", vehicle_id: "", vehicle_make: "No", vehicle_model: "Rentals", dropoff: new Date() }])
        }
    })
})

//get total revenue for each month
route.get("/month", (req, res) => {
    client.query("SELECT EXTRACT(MONTH FROM pickup) AS month,SUM(income) AS total FROM rentals where EXTRACT(YEAR FROM pickup) = EXTRACT(YEAR FROM CURRENT_DATE) and status != 'Cancelled' GROUP BY EXTRACT(YEAR FROM pickup), EXTRACT(MONTH FROM pickup) ORDER BY month", (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount >= 1) {
            res.send(result.rows)
        } else {
            res.send({ month: 0, total: 0 })
        }
    })
})

//get number of rentals this month
route.get("/monthly/rentals", (req, res) => {
    client.query("SELECT EXTRACT(MONTH FROM pickup) AS month,Count(*) as rented FROM rentals where EXTRACT(YEAR FROM pickup) = EXTRACT(YEAR FROM CURRENT_DATE) and status != 'Cancelled' GROUP BY EXTRACT(YEAR FROM pickup), EXTRACT(MONTH FROM pickup) ORDER BY month", (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount >= 1) {

            res.send(result.rows)
        } else {

            res.send([{ month: 0, rented: 0 }])
        }
    })

})

//get information about vehicles overdue
route.get("/month/overdue", (req, res) => {
    client.query("SELECT rent_id,dropoff,vehicle_make,vehicle_model,user_name,overdue_days FROM rentals INNER JOIN vehicles ON rentals.vehicle_id = vehicles.vehicle_id  INNER JOIN ifm_users ON rentals.customer_id = ifm_users.customer_id WHERE status = 'Pending' and overdue_days >= 1", (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount >= 1) {
            res.send(result.rows)
        } else {
            res.send([{ rent_id: "", dropoff: new Date(), vehicle_make: "No overdue", vehicle_model: "vehicles", user_name: "", overdue_days: "" }])
        }
    })
})

//get the top 5 selling values overall
route.get("/top/selling", (req, res) => {
    client.query("select rentals.vehicle_id,vehicle_make,vehicle_model,vehicle_cost,vehicle_cat, Count(*) as times FROM rentals inner join vehicles on rentals.vehicle_id = vehicles.vehicle_id group by rentals.vehicle_id,vehicle_make,vehicle_model,vehicle_cost,vehicle_cat order by times DESC limit 5;", (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount >= 1) {
            res.send(result.rows)
        } else {
            res.send([{ vehicle_id: "", vehicle_make: "", vehicle_model: "" }])
        }
    })

})

//get most frequent users
route.get("/frequent/customers", (req, res) => {
    client.query("select ifm_users.customer_id,user_name,Count(*) as times from rentals inner join ifm_users on rentals.customer_id = ifm_users.customer_id where status != 'Cancelled' group by ifm_users.customer_id,user_name order by times DESC Limit 5;", (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount >= 1) {
            res.send(result.rows)
        } else {
            res.send([{ customer_id: "", user_name: "", times: "" }])
        }
    })
})

//GET TOP BRANDS 
route.get("/brands", (req, res) => {
    client.query("SELECT make,COUNT(*) AS times FROM rentals GROUP BY make ORDER BY times DESC LIMIT 5;", (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount >= 1) {
            res.send(result.rows)
        } else {
            res.send([{ make: "", times: 0 }])
        }
    })
})

//Get top categories
route.get("/category", (req, res) => {
    client.query("select category,COUNT(*) as times from rentals group by category order by times DESC Limit 5;", (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount >= 1) {
            res.send(result.rows)
        } else {
            res.send([{ category: "", times: 0 }])
        }
    })
})

//Get the customers past rentals for invoices
route.get("/invoices/:id", (req, res) => {

    client.query("SELECT rentals.vehicle_id,rent_id,make,vehicles.vehicle_model,category,vehicle_cost,income,overdue_days,fees,user_name,pickup,paid,vat FROM rentals INNER JOIN vehicles ON rentals.vehicle_id = vehicles.vehicle_id INNER JOIN ifm_users ON rentals.customer_id = ifm_users.customer_id WHERE rentals.customer_id = $1 AND status = 'Completed' ORDER BY pickup DESC", [req.params.id], (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount >= 1) {
            res.send(result.rows)
        } else {
            res.send([{ status: "None", vehicle_id: 0, rent_id: 0, make: "", vehicle_model: "", category: "", vehicle_cost: 0, income: 0, overdue_days: 0, fees: 0, user_name: "", pickup: new Date().toDateString(), vat: 0 }])
        }
    })


})

//When invoices are paid
route.put("/", (req, res) => {

    let id = req.body.rent_id

    client.query("Update rentals Set paid = 'Paid' where rent_id = $1", [id], (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount) {
            res.send("Success")
        } else {
            res.send("Failure")
        }
    })
})

export default route;