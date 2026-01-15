import express from "express"
import client from "../dbconnection.js"

const route = express.Router()

//Add make 
route.post("/", (req, res) => {

    //First Check if brand already exists
    client.query("Select * from brands where make = $1", [req.body.make], (err1, result1) => {
        if (err1) {
            res.send("Error in server")
        } else if (result1.rowCount === 1) {
            res.send("Exists")
        } else {
            client.query("INSERT INTO public.brands(make) VALUES ($1)", [req.body.make], (err, result) => {
                if (err) {
                    res.send("Error in server")
                } else if (result.rowCount === 1) {
                    res.send("Success")
                } else {
                    res.send("Failure")
                }
            })
        }
    })




})

//get the brands
route.get("/", (req, res) => {
    client.query("SELECT make FROM brands ORDER BY make ASC", (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount >= 1) {
            res.send(result.rows)
        } else {
            res.send([{ status: "None", make: "" }])
        }
    })
})

//get features
route.get("/features", (req, res) => {

    client.query("SELECT feat from features ORDER BY feat ASC", (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount >= 1) {
            res.send(result.rows)
        } else {
            res.send([{ status: "None" }])
        }
    })
})

//add features
route.post("/features", (req, res) => {

    let exists = false  //whether feature exists or not
    let error = false

    //First Check if feature already exists
    client.query("Select * from features where feat = $1", [req.body.feat], (err1, result1) => {
        if (err1) {
            res.send("Error in server")
        } else if (result1.rowCount === 1) {
            res.send("Exists")
        } else {
            client.query("INSERT INTO public.features(feat) VALUES ($1)", [req.body.feat], (err, result) => {
                if (err) {
                    res.send("Error in server")
                } else if (result.rowCount === 1) {
                    res.send("Success")
                } else {
                    res.send("Failure")
                }
            })
        }
    })

})




export default route;