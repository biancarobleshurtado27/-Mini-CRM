const express = require("express");
const prospectosRouter = require("./routes/prospectos.routes");
const embudoRouter = require("./routes/embudo.routes");
const atencionRouter = require("./routes/atencion.routes");
const campanasRouter = require("./routes/campanas.routes");

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.json({ nombre: "Mini-CRM de admisiones", rutas: ["POST /prospectos", "PATCH /prospectos/:id/etapa", "GET /embudo", "GET /atencion", "POST /prospectos/:id/mensaje"] });
});

app.use("/prospectos", prospectosRouter);
app.use("/embudo", embudoRouter);
app.use("/atencion", atencionRouter);
app.use("/campanas", campanasRouter);

app.use((_req, res) => res.status(404).json({ error: "Ruta no encontrada." }));

module.exports = { app };
