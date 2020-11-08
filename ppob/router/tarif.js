const express = require("express")
const { verify } = require("jsonwebtoken")
const app = express()

// call model for tarif
const tarif = require("../models/index").tarif

// middleware for allow the request from body
app.use(express.urlencoded({extended:true}))

const verifyToken = require("./verifyToken")
app.use(verifyToken)

app.get("/", verifyToken, async(req, res) => {
    tarif.findAll()
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.post("/", async(req, res) => {
    // tampung data request yang akan di masukkan
    let data = {
        id_tarif: req.body.id_tarif,
        daya:req.body.daya,
        tarifperkwh: req.body.tarifperkwh
    }

    // execute insert data
    tarif.create(data)
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

app.put("/", verifyToken, async(req, res) => {
    // tampung data request yang akan di ubah
    let data = {
        id_tarif: req.body.id_tarif,
        daya:req.body.daya,
        tarifperkwh: req.body.tarifperkwh
    }

    // key yg menunjukkan data yg akan diubah
    let parameter = {
        id_tarif: req.body.id_tarif
    }


    // execute update data
    tarif.update(data,{where : parameter})
    .then(result => {
        res.json({
            message: "Data has been updated",
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.delete("/:id_tarif", verifyToken, async(req, res) => {
      let id_tarif = req.params.id_tarif // variable

      // object
      let parameter = {
          id_tarif: id_tarif
      }

      // execute delete data
    tarif.destroy({where : parameter})
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