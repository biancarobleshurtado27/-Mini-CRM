const { prospectos } = require("../data");

function listarPendientes(req, res) {
  const dias = Number(req.query.dias ?? 7);
  if (!Number.isInteger(dias) || dias < 1) return res.status(400).json({ error: "dias debe ser un entero mayor que 0." });
  const limite = Date.now() - dias * 86400000;
  const pendientes = prospectos.filter((prospecto) => new Date(prospecto.fechaUltimoAvance).getTime() < limite).map((prospecto) => ({ ...prospecto, diasSinAvance: Math.floor((Date.now() - new Date(prospecto.fechaUltimoAvance).getTime()) / 86400000) })).sort((a, b) => b.diasSinAvance - a.diasSinAvance);
  return res.json({ criterio: `Sin avance durante ${dias} días o más`, total: pendientes.length, prospectos: pendientes });
}

module.exports = { listarPendientes };
