const express = require("express")
const app = express()


// call model for level
const level = require("../models/index").level

// middleware for allow the request from body
app.use(express.urlencoded({ extended: true }))

const verifyToken = require("./verifyToken")
app.use(verifyToken)

// authorization

app.get("/", async (req, res) => {
    level.findAll({
        include: ["admin"]
    })
        .then(result => {
            res.json(result)
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.post("/", async (req, res) => {
    // tampung data request yang akan di masukkan
    let data = {
        nama_level: req.body.nama_level
    }

    // execute insert data
    level.create(data)
        .then(result => {
            res.json({
                message: "Data has been inserted",
                data: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.put("/", async (req, res) => {
    // tampung data request yang akan di ubah
    let data = {
        nama_level: req.body.nama_level
    }
    // key yg menunjukkan data yg akan diubah
    let parameter = {
        id_level: req.body.id_level
    }

    //execute update data
    level.update(data, { where: parameter })
        .then(result => {
            res.json({
                message: "data has been updated",
                data: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.delete("/:id_level", async (req, res) => {
    let id_level = req.params.id_level // variable

    // object
    let parameter = {
        id_level: id_level
    }

    // execute delete data
    level.destroy({ where: parameter })
        .then(result => {
            res.json({
                message: "Data has been destroyed",
                data: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

module.exports = app
