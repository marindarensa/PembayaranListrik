const express = require("express")
const app = express()
const jwt = require("jsonwebtoken") // npm install jsonwebtoken
const md5 = require("md5")

// model petugas
const pelanggan = require("../models/index").pelanggan
const admin = require("../models/index").admin
app.use(express.urlencoded({extended: true}))

app.post("/:user/:exp", async (req, res) => {
    let data = {
        username: req.body.username,
        password: md5(req.body.password)
    }
    let param = {
        user: req.params.user,
        exp: req.params.exp
    }

    let result = null
    if(param.user === "pelanggan"){
        result = await pelanggan.findOne({where: data})
    }else if(param.user === "admin"){
        result = await admin.findOne({where: data})
    }
    if(result === null){
        res.json({
            message: "Invalid Username or Password"
        })
    }else {
        // set jwt.sign
        let jwtHeader = {
            algorithm: 'HS256',
            expiresIn: '1d'
        }
        let payload = {data: result}
        let secretKey = "ppob"

        let token = jwt.sign(payload, secretKey, jwtHeader)
        res.json({
            data: result,
            token: token
        })
    }
}) 

module.exports = app
