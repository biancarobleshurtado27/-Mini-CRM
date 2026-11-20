const router = require("express").Router();
const { obtenerEmbudo } = require("../controllers/embudo.controller");

router.get("/", obtenerEmbudo);

module.exports = router;
