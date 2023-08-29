const express = require("express")
const cors = require("cors")

require("./config/db")

const userRoutes = require("./routes/userRoutes")
const app = express()


app.use(cors())
app.use(express.json())
app.use("/api/user",userRoutes)


const port = 5000;
app.listen(port,"localhost",()=>{
    console.log("Server is Running at port 5000")
})