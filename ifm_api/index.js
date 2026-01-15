//Dependency Imports
import express from "express"
import client from "./dbconnection.js"
import bodyParser from "body-parser"
import cors from "cors"

//Page Imports
import userRoute from "./routes/user.js"
import vehicleRoute from "./routes/vehicle.js"
import bookingRoute from "./routes/booking.js"
import reportsRoute from "./routes/reports.js"
import serviceRoute from "./routes/maintenance.js"
import makeRoute from "./routes/makes.js"


const app = express()
const port = 5000

const setup = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
    methods: '*'
}

app.use(cors(setup))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//Page Routes
app.use("/user", userRoute)
app.use("/vehicles", vehicleRoute)
app.use("/booking", bookingRoute)
app.use("/reports", reportsRoute)
app.use("/service", serviceRoute)
app.use("/make", makeRoute)

client.connect((err, result) => {
    if (err) {
        console.log("Database Error: " + err)
    }
})

//Route for when api starts
app.get("/", async (req, res) => {
    res.send("API UP AND RUNNING")
})

//Start Server
app.listen(port, () => console.log(`Server: http://localhost:${port}`))