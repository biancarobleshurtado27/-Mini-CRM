const { ETAPAS, SEDES_VALIDAS } = require("../constants");
const { prospectos } = require("../data");
const { generarMensaje } = require("../services/ai.service");

const responderError = (res, status, error) => res.status(status).json({ error });
const buscarPorId = (id) => prospectos.find((prospecto) => prospecto.id === Number(id));

function listar(req, res) {
  const termino = String(req.query.buscar || "").trim().toLowerCase();
  const { etapa, sede } = req.query;
  const resultados = prospectos.filter((prospecto) => {
    const coincideBusqueda = !termino || [prospecto.alias, prospecto.canal].some((valor) => valor.toLowerCase().includes(termino));
    return coincideBusqueda && (!etapa || prospecto.etapa === etapa) && (!sede || prospecto.sede === sede);
  });
  return res.json({ total: resultados.length, prospectos: resultados });
}

function crear(req, res) {
  const { alias, sede, canal = "No especificado" } = req.body;
  if (!alias || !sede) return responderError(res, 400, "alias y sede son obligatorios.");
  if (!SEDES_VALIDAS.includes(sede)) return responderError(res, 400, `sede debe ser una de: ${SEDES_VALIDAS.join(", ")}.`);

  const fecha = new Date().toISOString();
  const prospecto = { id: Math.max(0, ...prospectos.map((item) => item.id)) + 1, alias, sede, canal, etapa: "Prospecto", fechaIngreso: fecha, fechaUltimoAvance: fecha, historial: [{ etapa: "Prospecto", fecha, accion: "Prospecto registrado" }] };
  prospectos.push(prospecto);
  return res.status(201).json(prospecto);
}

function actualizarEtapa(req, res) {
  const prospecto = buscarPorId(req.params.id);
  if (!prospecto) return responderError(res, 404, "Prospecto no encontrado.");
  const { etapa } = req.body;
  if (!ETAPAS.includes(etapa)) return responderError(res, 400, `etapa debe ser una de: ${ETAPAS.join(", ")}.`);

  const fecha = new Date().toISOString();
  const etapaAnterior = prospecto.etapa;
  prospecto.etapa = etapa;
  prospecto.fechaUltimoAvance = fecha;
  prospecto.historial.push({ etapa, fecha, accion: `Movimiento desde ${etapaAnterior}` });
  return res.json(prospecto);
}

async function redactarMensaje(req, res) {
  const prospecto = buscarPorId(req.params.id);
  if (!prospecto) return responderError(res, 404, "Prospecto no encontrado.");
  try {
    const { mensaje } = await generarMensaje({ prospecto });
    return res.json({ prospectoId: prospecto.id, etapa: prospecto.etapa, mensaje });
  } catch (err) {
    return responderError(res, err.statusCode || 500, err.message || "Error inesperado al generar el mensaje.");
  }
}

module.exports = { listar, crear, actualizarEtapa, redactarMensaje };
