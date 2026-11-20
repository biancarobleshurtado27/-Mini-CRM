const ETAPAS = [
  "Prospecto",
  "Candidato",
  "Agenda Campus Day",
  "Asiste Campus Day",
  "Prueba Técnica",
  "Entrevista",
  "Admitido",
  "Semana de Prueba",
  "Estudiante"
];

// Meta de avance hacia la siguiente etapa. La última etapa no tiene siguiente paso.
const METAS_CONVERSION = {
  "Prospecto": 0.7,
  "Candidato": 0.65,
  "Agenda Campus Day": 0.75,
  "Asiste Campus Day": 0.7,
  "Prueba Técnica": 0.65,
  "Entrevista": 0.6,
  "Admitido": 0.8,
  "Semana de Prueba": 0.9,
  "Estudiante": null
};

const SEDES_VALIDAS = ["Desamparados", "Puntarenas"];

module.exports = { ETAPAS, METAS_CONVERSION, SEDES_VALIDAS };
