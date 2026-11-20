const { ETAPAS, SEDES_VALIDAS } = require("./constants");

const hoy = new Date();
const haceDias = (dias) => {
  const fecha = new Date(hoy);
  fecha.setDate(fecha.getDate() - dias);
  return fecha.toISOString();
};

const prospectos = Array.from({ length: 40 }, (_, indice) => {
  const etapa = ETAPAS[indice % ETAPAS.length];
  const sede = SEDES_VALIDAS[indice % SEDES_VALIDAS.length];
  const ingresoHace = (indice * 3) % 28;
  const avanceHace = (indice * 5) % 16;

  return {
    id: indice + 1,
    // Identificador ficticio; no representa a una persona real.
    alias: `Prospecto-${String(indice + 1).padStart(2, "0")}`,
    sede,
    canal: ["Redes sociales", "Referido", "Landing", "Evento"][indice % 4],
    etapa,
    fechaIngreso: haceDias(ingresoHace),
    fechaUltimoAvance: haceDias(avanceHace),
    historial: [
      {
        etapa,
        fecha: haceDias(avanceHace),
        accion: "Carga inicial de datos ficticios"
      }
    ]
  };
});

module.exports = { prospectos };
