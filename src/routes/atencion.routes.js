const router = require("express").Router();
const { listarPendientes } = require("../controllers/atencion.controller");

router.get("/", listarPendientes);

module.exports = router;
