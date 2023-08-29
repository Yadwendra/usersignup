const mongoose = require("mongoose")

 async function getDataApi(){
    try{
    await mongoose.connect(`mongodb://localhost:27017/CQLSYS`)
    console.log("Database is connected !!")

    }catch(error){
        console.log(error)
    }
}

getDataApi()

