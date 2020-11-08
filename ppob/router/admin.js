const express = require("express")
const app = express()
const md5 = require("md5")


// call model for pelanggan
const admin = require("../models/index").admin

// middleware for allow the request from body
app.use(express.urlencoded({ extended: true }))

// authorization
const verifyToken = require("./verifyToken")
app.use(verifyToken)

app.get("/", verifyToken, async(req, res) => {
    admin.findAll({
        include:[{ all: true, nested: true }]
    })
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json({
            massage : error.massage
        })
    })
})

app.post("/", async(req, res) => {
    let data = {
        username : req.body.username,
        password : md5(req.body.password),
        nama_admin : req.body.nama_admin,
        id_level : req.body.id_level
    }
    admin.create(data)
    .then(result => {
        res.json ({
            massage : "data berhasil ditambahkan",
            data : result
        })
    .catch(error => {
         res.json({
             massage: error.massage
        })
    })
})
})

app.put("/",verifyToken, async(req, res) =>{
    let data = {
        username : req.body.username,
        password : md5(req.body.password),
        nama_admin : req.body.nama_admin,
        id_level : req.body.id_level
    }
    let param = {
        id_admin : req.body.id_admin
    }
    admin.update(data, {where: param})
    .then(result => {
        res.json({
            massage: "data berhasil diupdate",
            data: result
        })
    .catch(error => {
        res.json({
            massage: error.massage
        })
    })
    })
})
app.delete("/:id_admin",verifyToken, async(req, res) => {
    let id_admin = req.params.id_admin
    let param = {
        id_admin: id_admin
    }
    admin.destroy({where:param})
    .then(result => {
        res.json({
            massage: "data berhasil dihapus",
            data : result
        })
    })
    .catch(error => {
        res.json({
            massage: error.massage
        })
    })
})
module.exports = app
