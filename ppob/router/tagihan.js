const express = require("express")
const { removeAllListeners } = require("nodemon")
const app = express()
const md5 = require("md5")

//pemanggilan model
const tagihan = require("../models/index").tagihan
const penggunaan = require('../models/index').penggunaan

app.use(express.urlencoded({extended : true}))

//authentication
const verifyToken = require("./verifyToken")
app.use(verifyToken)

app.get("/", async(req, res) => {
    tagihan.findAll({
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
    let param = { id_penggunaan: req.body.id_penggunaan }

    // Penjumlahan jumlah_meter
    let dataPenggunaan = await penggunaan.findOne({ where: param })
    let jumlahMeter = dataPenggunaan.meter_akhir - dataPenggunaan.meter_awal

    let data = {
        id_penggunaan : req.body.id_penggunaan,
        bulan : req.body.bulan,
        tahun : req.body.tahun,
        jumlah_meter : jumlahMeter,
        status : req.body.status
    }
    tagihan.create(data)
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

app.put("/", async(req, res) =>{
    let data = {
        id_penggunaan : req.body.id_penggunaan,
        bulan : req.body.bulan,
        tahun : req.body.tahun,
        jumlah_meter : req.body.jumlah_meter,
        status : req.body.status
    }
    let param = {
        id_tagihan : req.body.id_tagihan
    }
    tagihan.update(data, {where: param})
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
app.delete("/:id_tagihan", async(req, res) => {
    let id_tagihan = req.params.id_tagihan
    let param = {
        id_tagihan : id_tagihan
    }
    tagihan.destroy({where:param})
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