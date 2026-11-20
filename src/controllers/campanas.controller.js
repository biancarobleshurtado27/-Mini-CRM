const campanas = [];

function crear(req, res) {
  const { objetivo, sede = "Ambas sedes", presupuesto = "No definido" } = req.body;
  if (!objetivo || objetivo.trim().length < 8) return res.status(400).json({ error: "objetivo debe tener al menos 8 caracteres." });
  const campana = {
    id: campanas.length + 1,
    objetivo: objetivo.trim(), sede, presupuesto, estado: "pendiente de aprobación",
    piezas: [
      `¿Querés dar el siguiente paso? Conocé FWD en ${sede}. ${objetivo.trim()}`,
      `Tu futuro puede empezar hoy. Sumate a FWD: ${objetivo.trim()}`,
      `Aprendé, creá y construí oportunidades. FWD te acompaña en ${sede}.`
    ],
    creadaEn: new Date().toISOString()
  };
  campanas.unshift(campana);
  return res.status(201).json(campana);
}

function listar(_req, res) { return res.json({ total: campanas.length, campanas }); }
module.exports = { crear, listar };
