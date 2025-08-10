// require("dotenv").config({path: "./env"})

import dotenv from "dotenv"
import app from "./app.js"
import connectDB from "./db/index.js"
dotenv.config({
    path: "./env"
})


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server in running at port: ${process.env.PORT}`);
        
    })
    app.on("error" ,(error) => {
        console.log(`MONGO DB connection FAILED : ${error}`);        
    })
}
)
.catch((error) => {
    console.log("MONGO DB connection FAILED ", error);
    
})

















/*
import express from "express"
const app = express()
; (async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        mongoose.connection.on('error', error => {
            console.error('Mongoose Connection Error:', error); })
        app.listen(process.env.PORT , () => {
            console.log(`process is listening on ${process.env.PORT}`);
        })
    } 
    catch (error) {
        console.error("ERROR", error)
        throw error
        
    }
})()
*/