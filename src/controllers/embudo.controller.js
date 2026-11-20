const { ETAPAS, METAS_CONVERSION } = require("../constants");
const { prospectos } = require("../data");

function obtenerEmbudo(_req, res) {
  const etapas = ETAPAS.map((etapa, indice) => {
    const cantidad = prospectos.filter((prospecto) => prospecto.etapa === etapa).length;
    const siguienteEtapa = ETAPAS[indice + 1];
    const siguienteCantidad = siguienteEtapa ? prospectos.filter((prospecto) => prospecto.etapa === siguienteEtapa).length : null;
    const conversion = siguienteEtapa && cantidad ? siguienteCantidad / cantidad : null;
    const meta = METAS_CONVERSION[etapa];
    const fuga = conversion === null || meta === null ? null : Math.max(0, meta - conversion);
    return { etapa, cantidad, siguienteEtapa: siguienteEtapa || null, conversion: conversion === null ? null : Number((conversion * 100).toFixed(1)), metaConversion: meta === null ? null : Number((meta * 100).toFixed(1)), fugaFrenteAMeta: fuga === null ? null : Number((fuga * 100).toFixed(1)) };
  });
  return res.json({ totalProspectos: prospectos.length, etapas });
}

module.exports = { obtenerEmbudo };
