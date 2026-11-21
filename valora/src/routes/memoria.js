var express = require("express");
var router = express.Router();

var memoriaController = require("../controllers/memoriaController");

router.post("/registrar", function (req, res) {
    memoriaController.registrar(req, res);
});

router.get("/estatisticas/:idUsuario", function (req, res) {
    memoriaController.buscarEstatisticas(req, res);
});

module.exports = router;
