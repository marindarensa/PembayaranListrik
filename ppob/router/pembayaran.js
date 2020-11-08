const express = require("express")
const { removeAllListeners } = require("nodemon")
const app = express()
const md5 = require("md5")

//penanggalan
let tanggal = new Date()

//pemanggilan model pembayaran
const pembayaran = require("../models/index").pembayaran
const tagihan = require('../models/index').tagihan

app.use(express.urlencoded({ extended: true }))

// call library multer
const multer = require("multer")
// digunakan untuk membaca data request dari form-data
const path = require("path")
// digunakan untuk mengatur direktori file
const fs = require("fs")
const { error } = require('console')
// digunakan untuk mengatur file

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./image/bukti")
    },
    filename: (req, file, cb) => {
        cb(null, "bukti-" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

//authentication
const verifyToken = require("./verifyToken")
app.use(verifyToken)

app.get("/", async (req, res) => {
    pembayaran.findAll({
        include: [{ all: true, nested: true }]
    })
        .then(result => {
            res.json(result)
        })
        .catch(error => {
            res.json({
                massage: error.massage
            })
        })
})

app.post("/", upload.single("bukti"), async (req, res) => {
    let data = {
        id_tagihan: req.body.id_tagihan,
        tanggal_pembayaran: tanggal,
        bulan_bayar: req.body.bulan_bayar,
        biaya_admin: req.body.biaya_admin,
        total_bayar: req.body.total_bayar,
        status: req.body.status,
        bukti: req.file.filename,
        id_admin: req.body.id_admin
    }
    // merubah status tagihan
    let idTagihan = { id_tagihan: data.id_tagihan }
    let status = { status: 1 }
    tagihan.update(status, { where: idTagihan })

    pembayaran.create(data)
        .then(result => {
            res.json({
                massage: "data berhasil ditambahkan",
                data: result
            })
                .catch(error => {
                    res.json({
                        massage: error.massage
                    })
                })
        })
})

app.put("/", upload.single("bukti"), async (req, res) => {
    let data = {
        id_tagihan: req.body.id_tagihan,
        tanggal_pembayaran: tanggal,
        bulan_bayar: req.body.bulan_bayar,
        biaya_admin: req.body.biaya_admin,
        total_bayar: req.body.total_bayar,
        status: req.body.status,
        bukti: req.file.filename,
        id_admin: req.body.id_admin
    }
    let param = {
        id_pembayaran: req.body.id_pembayaran
    }
    if (req.file) {
        let oldPembayaran = await pembayaran.findOne({ where: param })
        let oldBukti = oldPembayaran.bukti

        // delete oldBukti
        let pathFile = path.join(__dirname, "../image/bukti", oldBukti)
        fs.unlink(pathFile, error => console.log(error))

        data.bukti = req.file.filename // masukin data baru
    }
    pembayaran.update(data, { where: param })
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
app.delete("/:id_pembayaran", async (req, res) => {
    let id_pembayaran = req.params.id_pembayaran
    let param = {
        id_pembayaran: id_pembayaran
    }
    let oldPembayaran = await pembayaran.findOne({ where: param })
    let oldBukti = oldPembayaran.bukti

    // delete oldCover
    let pathFile = path.join(__dirname, "../image/bukti", oldBukti)
    fs.unlink(pathFile, error => console.log(error))

    pembayaran.destroy({ where: param })
        .then(result => {
            res.json({
                massage: "data berhasil dihapus",
                data: result
            })
        })
        .catch(error => {
            res.json({
                massage: error.massage
            })
        })
})
module.exports = app
