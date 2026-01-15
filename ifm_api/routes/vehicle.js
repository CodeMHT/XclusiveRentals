import express from "express";
import client from "../dbconnection.js";
import multer from "multer";

//Get A router
const route = express.Router()

//storage for images
const siteimages = multer.memoryStorage()
const save = multer({ siteimages })

//Add New Vehicle
route.post("/", save.single('image'), (req, res) => {

    let cost = 0

    //set the vehicle price
    switch (req.body.category) {
        //Luxury
        case "Luxury":
            cost = 6500
            break;

        case "Pickup Truck":
            cost = 6000
            break;

        case "SUV":
            cost = 5500
            break;

        case "Convertible":
            cost = 5000
            break;
        case "Coupe":
            cost = 4500
            break;
        case "Estate":
            cost = 4500
            break;

        case "Sedan":
            cost = 4000
            break;

        case "Hatchback":
            cost = 3500
            break;

    }

    const { originalname, buffer } = req.file
    const vehicle = [req.body.model, req.body.make, req.body.year, req.body.category, req.body.color, req.body.seats, req.body.mileage, req.body.feats, cost, buffer, new Date()]


    client.query("INSERT INTO public.vehicles( vehicle_model, vehicle_make, vehicle_year, vehicle_cat, vehicle_color, vehicle_seats, vehicle_mileage, vehicle_feat,vehicle_cost, vehicle_image,added) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11);", vehicle, (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount === 1) {
            res.send("Success")
        } else {

            res.send("Failure")
        }
    })
})

//Get All Vehicles
route.get("/", (req, res) => {
    const query = "select vehicle_id,vehicle_model,vehicle_make,vehicle_year,vehicle_cat,vehicle_color,vehicle_seats,vehicle_mileage,vehicle_feat,vehicle_cost,added,isnew,service from vehicles where deleted ='No' order by vehicle_id DESC"
    client.query(query, (err, result) => {
        if (err) {
            res.send("Error in Server")
        } else if (result.rowCount > 1) {
            res.send(result.rows)
        } else { res.send("Failure") }
    })
})

//Get vehicles based on  user input
route.post("/search", (req, res) => {

    let car = req.body
    //make,category and feature
    if (car.vehicle_make !== "" && car.vehicle_cat !== "" && car.vehicle_feat !== "") {

        client.query("SELECT vehicle_id,vehicle_model,vehicle_make,vehicle_year,vehicle_cat,vehicle_color,vehicle_seats,vehicle_mileage,vehicle_feat,vehicle_cost from vehicles where vehicle_make = $1 and vehicle_cat = $2 and vehicle_feat = $3 and deleted='No'", [car.vehicle_make, car.vehicle_cat, car.vehicle_feat], (err, result) => {
            if (err) {
                res.send("Error in server")
            } else if (result.rowCount >= 1) {
                res.send(result.rows)
            } else {
                res.send([{ status: "None" }])
            }
        })

        //category and features only
    } else if (car.vehicle_make === "" && car.vehicle_cat !== "" && car.vehicle_feat !== "") {
        client.query("SELECT vehicle_id,vehicle_model,vehicle_make,vehicle_year,vehicle_cat,vehicle_color,vehicle_seats,vehicle_mileage,vehicle_feat,vehicle_cost from vehicles where vehicle_cat = $1 and vehicle_feat = $2 and deleted ='No'", [car.vehicle_cat, car.vehicle_feat], (err1, result1) => {
            if (err1) {
                res.send("Error in server")
            } else if (result1.rowCount >= 1) {
                res.send(result1.rows)
            } else {
                res.send([{ status: "None" }])
            }
        })

        //Make and Feature only
    } else if (car.vehicle_make !== "" && car.vehicle_cat === "" && car.vehicle_feat !== "") {
        client.query("SELECT vehicle_id,vehicle_model,vehicle_make,vehicle_year,vehicle_cat,vehicle_color,vehicle_seats,vehicle_mileage,vehicle_feat,vehicle_cost from vehicles where vehicle_make =$1 and vehicle_feat = $2 and deleted='No'", [car.vehicle_make, car.vehicle_feat], (err2, result2) => {
            if (err2) {
                res.send("Error in server")
            } else if (result2.rowCount >= 1) {
                res.send(result2.rows)
            } else {
                res.send([{ status: "None" }])
            }
        })

        //Make And Category 
    } else if (car.vehicle_make !== "" && car.vehicle_cat !== "" && car.vehicle_feat === "") {
        client.query("SELECT vehicle_id,vehicle_model,vehicle_make,vehicle_year,vehicle_cat,vehicle_color,vehicle_seats,vehicle_mileage,vehicle_feat,vehicle_cost from vehicles where vehicle_make =$1 and vehicle_cat = $2 and deleted='No'", [car.vehicle_make, car.vehicle_cat], (err3, result3) => {
            if (err3) {
                res.send("Error in server")
            } else if (result3.rowCount >= 1) {
                res.send(result3.rows)
            } else {
                res.send([{ status: "None" }])
            }
        })

    } else {
        //For the ones where only one selection was made
        GetCars(car).then(resp => res.send(resp))

    }

})

//get specific car for bookings
route.get("/booking/car/:id", (req, res) => {
    const id = req.params.id  //vehicle id

    const query = "SELECT vehicle_id,vehicle_model,vehicle_make,vehicle_year,vehicle_cat,vehicle_color,vehicle_seats,vehicle_mileage,vehicle_feat,vehicle_cost FROM vehicles where vehicle_id = '" + id + "'"
    client.query(query, (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount >= 1) {
            res.send(result.rows[0])
        } else {
            res.send("Failure")
        }
    })

})

//Delete a vehicle from database
route.delete("/:id", (req, res) => {

    let id = req.params.id


    //soft delete to vehicle
    client.query("Update vehicles SET deleted = 'Yes'where vehicle_id = $1", [id], (err1, result1) => {
        if (err1) {
            res.send("Error in vehicle server " + err1)
        } else if (result1.rowCount === 1) {
            res.send("Success")
        } else {
            res.send("Failure in Rentals")
        }
    })

})




route.put("/", (req, res) => {
    let details = req.body

    const query = "UPDATE vehicles SET vehicle_mileage = " + details.mileage + ",service='No' WHERE vehicle_id = " + details.id

    client.query(query, (err, result) => {
        if (err) {
            res.send("Error in server")
        } else if (result.rowCount === 1) {
            res.send("Success")
        } else {
            res.send("Failure")
        }
    })
})

//Route to get Images for each car
route.get("/image/:id", (req, res) => {
    const id = req.params.id //vehicle id

    const query = "Select vehicle_image from vehicles where vehicle_id = " + id
    client.query(query, (err, result) => {
        if (err) {
            res.send("Error: " + err)
        } else if (result.rows.length > 0 && result.rows[0].vehicle_image !== null) {
            var image = result.rows[0].vehicle_image
            var imageBuff = Buffer.from(image, 'binary')
            res.send(imageBuff)

        } else {
            res.send("Image Not Found")
        }
    })
})

//Functions for modular coding
//if user only selected one of the three 
const GetCars = (vehicles) => {


    //for asynchronous action as you have o wait for all vehicles to be fetched before sending
    return new Promise((resolve, reject) => {
        if (vehicles.vehicle_make !== "") {
            client.query("SELECT vehicle_id, vehicle_model, vehicle_make, vehicle_year, vehicle_cat, vehicle_color, vehicle_seats, vehicle_mileage, vehicle_feat, vehicle_cost FROM vehicles WHERE vehicle_make = $1 and deleted='No'", [vehicles.vehicle_make], (err, result) => {
                if (err) {
                    reject("Error in server");
                } else if (result.rowCount >= 1) {
                    resolve(result.rows);
                } else {
                    resolve([{ status: "None" }]);
                }
            }
            );
        } else if (vehicles.vehicle_cat !== "") {
            client.query("SELECT vehicle_id, vehicle_model, vehicle_make, vehicle_year, vehicle_cat, vehicle_color, vehicle_seats, vehicle_mileage, vehicle_feat, vehicle_cost FROM vehicles WHERE vehicle_cat = $1 and deleted='No'", [vehicles.vehicle_cat], (err, result) => {
                if (err) {
                    reject("Error in server");
                } else if (result.rowCount >= 1) {
                    resolve(result.rows);
                } else {
                    resolve([{ status: "None" }]);
                }
            }
            );
        } else if (vehicles.vehicle_feat !== "") {
            client.query("SELECT vehicle_id, vehicle_model, vehicle_make, vehicle_year, vehicle_cat, vehicle_color, vehicle_seats, vehicle_mileage, vehicle_feat, vehicle_cost FROM vehicles WHERE vehicle_feat = $1 and deleted='No'", [vehicles.vehicle_feat], (err, result) => {
                if (err) {
                    reject("Error in server");
                } else if (result.rowCount >= 1) {
                    resolve(result.rows);
                } else {
                    resolve([{ status: "None" }]);
                }
            }
            );
        }
    });
}

export default route;

