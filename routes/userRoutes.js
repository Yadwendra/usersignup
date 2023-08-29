const express = require("express")
const bcrypt = require("bcrypt")
const passwordValidator = require('password-validator');

const User =  require("../model/userModel")

const schema = new passwordValidator();

schema
.is().min(6)                                    // Minimum length 8
.is().max(20)                                  // Maximum length 100
.has().uppercase(1)                              // Must have uppercase letters
.has().lowercase(1)                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Password', 'Password123']); // Blacklist these values

const router = express.Router()



router.post("/", async (req, res) => {

    var data = new User(req.body)
    if (schema.validate(req.body.password)) {
        bcrypt.hash(req.body.password, 12, async (error, hash) => {
            if (error)
                res.send({ result: "Fail", message: "Internal Server Error While Creating Hash Password" })
            else {
                data.password = hash
                try {
                    await data.save()
                    res.send({ result: "Done", message: "Record is Created!!!", data: data })
                }
                catch (error) {
                    if (error.keyValue)
                        res.status(400).send({ result: "Fail", message: "Name Must Be Unique" })
                    else if (error.errors.name)
                        res.status(400).send({ result: "Fail", message: error.errors.name.message })
                    else if (error.errors.email)
                        res.status(400).send({ result: "Fail", message: error.errors.email.message })
                    else if (error.errors.phone)
                        res.status(400).send({ result: "Fail", message: error.errors.phone.message })
                    else if (error.errors.password)
                        res.status(400).send({ result: "Fail", message: error.errors.password.message })
                    else
                        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
                }
            }
        })
    }
    else {
        res.status(400).send({ result: "Fail", message: "Invalid Password Length Must Be on Minimum 8 and Maximum 100 also include 1 upper case,1 lower case character and not include any space" })
    }
})
router.get("/", async(req,res)=>{
    try{

        var data = await User.find().sort({_id:-1})
        res.send({result:"Done",total:data.length, data:data})


    }catch(error){
        res.status(500).send({result:"Fail",message:"Internal Server Error !!"})
    }
})

router.get("/:_id", async(req,res)=>{
    try{

        var data = await User.findOne({_id: req.params._id })
        if(data)
        res.send({result:"Done", data:data})
       else
       res.status(404).send({result:"Fail",message:"No Recrod Found !!"})

    }catch(error){
        res.status(500).send({result:"Fail",message:"Internal Server Error !!"})
    }
})

router.put("/:_id", async(req,res)=>{
    try{

        var data = await User.findOne({_id: req.params._id })
        if(data){
            data.name = req.body.name ?? data.name
            data.email = req.body.email ?? data.email
            data.phone = req.body.phone ?? data.phone
            data.password = req.body.password ?? data.password
            data.status = req.body.status ?? data.status

            await data.save()
            res.send({result:"Done", data:data})
        }

       else
       res.status(404).send({result:"Fail",message:"No Recrod Found !!"})

    }catch(error){
        res.status(500).send({result:"Fail",message:"Internal Server Error !!"})
    }
})

router.delete("/:_id", async(req,res)=>{
    try{
        var data = await User.findOne({_id: req.params._id})
        await data.deleteOne()
        res.send({result:"Done",message:"Record is Deleted !!"})

    }catch(error){
        res.status(500).send({ result: "Fail", message: "Internal Server Error" })
    
    }
})



router.post("/login", async (req, res) => {
    try {
        var data = await User.findOne({ email: req.body.email })
        if (data) {
            if (await bcrypt.compare(req.body.password, data.password)) {
                
              res.send({result:"Done",message:"Login successfully ",data:data})
            }
            else
                res.status(400).send({ result: "Fail", message: "Email and Password Incorrect!!!" })
        }
        else {
            res.status(400).send({ result: "Fail", message: "Email and Password Incorrect!!!" })
        }
    }
    catch (error) {
        res.status(500).send({ result: "Fail", message: "Internal Server Error!!!" })
    }
})




module.exports = router;