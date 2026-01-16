import express from "express";
import client from "../dbconnection.js";
import crypto from "crypto";
import multer from "multer";

const route = express.Router()

//storage for images
const siteimages = multer.memoryStorage()
const save = multer({ siteimages })

//Add a new User
route.post("/", save.single("image"), (req, res) => { //fix image insertion

    let { originalname, buffer } = {}

    if (req.file) {
        originalname = req.file.originalname
        buffer = req.file.buffer
    } else {
        originalname = null
        buffer = null
    }

    let temp = req.body


    //creating hash object 
    var hash = crypto.createHash('sha256');
    var password = hash.update(temp.user_pass, 'utf-8');
    var encrypted = password.digest('hex');

    let user = [temp.user_name, temp.user_phone, temp.user_email, buffer, temp.user_type, temp.user_address, temp.user_code, encrypted, temp.lcode, temp.lnumber]

    client.query("select user_id from ifm_users where user_email = $1", [temp.user_email], (err1, ans) => {
        if (err1) {
            res.send("Something Went wrong in server")
        } else if (ans.rowCount < 1) {
            client.query("INSERT INTO public.ifm_users(user_name, user_phone, user_email, user_image, user_type, user_address, user_code, user_pass,lcode,lnumber) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", user, (err, result) => {
                if (err) {
                    res.send("Something Went wrong in server")
                } else if (result.rowCount === 1) {
                    res.send("Success")
                } else {
                    res.send("Error")
                }

            })
        } else {
            res.send("Exists")
        }
    })
})


//Log In 
route.get("/:email/:pass", (req, res) => {

    //accessing hashed password
    var hash = crypto.createHash('sha256');
    var password = hash.update(req.params.pass, 'utf-8');
    var encrypted = password.digest('hex');

    let user = [req.params.email, encrypted]

    //Send id data over to view profile

    client.query("Select customer_id from ifm_users where user_email = $1 and user_pass = $2", user, (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rows.length > 0) {
            res.send(result.rows[0].customer_id.toString())
        } else {
            res.send("User Not Found")
        }
    })
})

///get info about user
route.get("/:id", (req, res) => {
    let id = req.params.id

    client.query("Select user_name, user_phone, user_email, user_type, user_address, user_code, user_pass,customer_id,lcode,lnumber from ifm_users where customer_id = $1", [id], (err, result) => {
        if (err) {
            res.send("Error getting profile")
        } else if (result.rowCount === 1) {
            res.send(result.rows[0])
        } else {
            res.send("User Not Found")
        }
    })
})

//Get customer image
route.get("/profile/image/:id", (req, res) => {
    let id = req.params.id      //customer id

    const query = "Select user_image from ifm_users where customer_id = " + id
    client.query(query, (err, result) => {
        if (err) {
            res.send("Error: " + err)
        } else if (result.rows.length > 0 && result.rows[0].user_image !== null) {
            var image = result.rows[0].user_image
            var imageBuff = Buffer.from(image, 'binary')
            res.send(imageBuff)

        } else {
            res.send("Image Not Found")
        }
    })
})

//Get All users
route.get("/all/users/db", (req, res) => {

    client.query("select user_id,user_name,user_phone,user_email,customer_id,user_type,user_address,user_code,user_pass,lcode,lnumber,joined from ifm_users where user_type = 'C'", (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount >= 1) {
            res.send(result.rows)
        } else {
            res.send("Failure")
        }
    })
})

//update password
route.post("/password", (req, res) => {
    let content = req.body

    //accessing hashed password
    var hash = crypto.createHash('sha256');
    var password = hash.update(content.pass, 'utf-8');
    var encrypted = password.digest('hex');

    let data = [encrypted, req.body.c_id]

    client.query("UPDATE public.ifm_users SET user_pass=$1 WHERE customer_id = $2", data, (err, result) => {
        if (err) {
            res.send("Error in Server")
        } else if (result.rowCount === 1) {

            res.send("Success")

        } else {
            res.send("Failure")
        }
    })
})

//Update Other aspects of profile
route.post("/profile/update", (req, res) => {
    let id = req.body.c_id //separate the id from the user information as this will not be updated but will always be sent

    let columns = Object.keys(req.body)
    let data = Object.values(req.body)
    let success = true


    let c_length = columns.length - 1 //exclude the id

    for (let i = 0; i < c_length; i++) {
        if (data[i] === '0' || data[i] === '') {   //get values that are null        
        } else {
            //store queries for update
            let query = "UPDATE ifm_users SET " + columns[i] + " = '" + data[i] + "' where customer_id = " + id

            //Save to database
            client.query(query, (err, result) => {
                if (err) {
                    success = false
                } else if (result.rowCount === 1) {
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


})

//get infoabout single user
route.get('/personal/client/:id', (req, res) => {

    client.query("SELECT ifm_users.customer_id,user_phone, user_name,user_email,user_address,user_code, COUNT(rentals.customer_id) AS rentals FROM ifm_users LEFT JOIN rentals ON ifm_users.customer_id = rentals.customer_id WHERE ifm_users.customer_id  = $1 GROUP BY ifm_users.customer_id,user_name,user_email,user_address,user_code,user_phone ORDER BY rentals;", [req.params.id], (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount === 1) {
            res.send(result.rows[0])
        } else {
            res.send("Failure")
        }
    })


})

export default route;