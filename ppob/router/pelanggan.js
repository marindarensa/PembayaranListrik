const express = require("express")
const app = express()

// library untuk upload file
// ---------------------------------
const multer = require("multer")
// multer digunakan untuk membaca data request dari form-data
const path = require("path")
// path untuk manage alamat direktori file
const fs = require("fs")
// fs untuk manage file

// call model for pelanggan
const pelanggan = require("../models/index").pelanggan

// middleware for allow the request from body
app.use(express.urlencoded({ extended: true }))

// authorization
const verifyToken = require("./verifyToken")
app.use(verifyToken)

app.get("/", verifyToken, async (req, res) => {
    pelanggan.findAll({
        include: ["tarif"]
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
        username: req.body.username,
        password: req.body.password,
        nomor_kwh: req.body.nomor_kwh,
        nama_pelanggan: req.body.nama_pelanggan,
        alamat: req.body.alamat,
        id_tarif: req.body.id_tarif
    }

    // execute insert data
    pelanggan.create(data)
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

app.put("/", verifyToken, async (req, res) => {
    // tampung data request yang akan di ubah
    let data = {
        username: req.body.username,
        password: req.body.password,
        nomor_kwh: req.body.nomor_kwh,
        nama_pelanggan: req.body.nama_pelanggan,
        alamat: req.body.alamat,
        id_tarif: req.body.id_tarif
    }
    // key yg menunjukkan data yg akan diubah
    let parameter = {
        id_pelanggan: req.body.id_pelanggan
    }

    //execute update data
    pelanggan.update(data, { where: param })
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

app.delete("/:id_pelanggan", verifyToken, async (req, res) => {
    let id_pelanggan = req.params.id_pelanggan // variable

    // object
    let parameter = {
        id_pelanggan: id_pelanggan
    }

    // execute delete data
    pelanggan.destroy({ where: parameter })
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
