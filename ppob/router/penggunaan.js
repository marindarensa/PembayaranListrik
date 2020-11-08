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
const penggunaan = require("../models/index").penggunaan

// middleware for allow the request from body
app.use(express.urlencoded({ extended: true }))

// authorization
const verifyToken = require("./verifyToken")
app.use(verifyToken)

app.get("/", async (req, res) => {
    pelanggan.findAll({
        include: ["pelanggan"]
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
        id_pelanggan: req.body.id_pelanggan,
        bulan: req.body.bulan,
        tahun: req.body.tahun,
        meter_awal: req.body.meter_awal,
        meter_akhir: req.body.meter_akhir
    }

    // execute insert data
    penggunaan.create(data)
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
        id_pelanggan: req.body.id_pelanggan,
        bulan: req.body.bulan,
        tahun: req.body.tahun,
        meter_awal: req.body.meter_awal,
        meter_akhir: req.body.meter_akhir
    }
    // key yg menunjukkan data yg akan diubah
    let parameter = {
        id_penggunaan: req.body.id_penggunaan
    }

    //execute update data
    penggunaan.update(data, { where: param })
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

app.delete("/:id_penggunaan", async (req, res) => {
    let id_penggunaan = req.params.id_penggunaan // variable

    // object
    let parameter = {
        id_penggunaan: id_penggunaan
    }

    // execute delete data
    penggunaan.destroy({ where: parameter })
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
