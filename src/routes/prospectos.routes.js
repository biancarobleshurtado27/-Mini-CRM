const router = require("express").Router();
const controller = require("../controllers/prospectos.controller");

router.get("/", controller.listar);
router.post("/", controller.crear);
router.patch("/:id/etapa", controller.actualizarEtapa);
router.post("/:id/mensaje", controller.redactarMensaje);

module.exports = router;
