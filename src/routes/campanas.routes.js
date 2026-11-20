const router = require("express").Router();
const controller = require("../controllers/campanas.controller");
router.get("/", controller.listar);
router.post("/", controller.crear);
module.exports = router;
