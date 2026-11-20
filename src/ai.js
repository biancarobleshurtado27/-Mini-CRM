async function generarMensaje({ prospecto }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const error = new Error("La IA no está configurada. Definí ANTHROPIC_API_KEY en el archivo .env.");
    error.statusCode = 503;
    throw error;
  }

  const prompt = `Redactá un mensaje breve, amable y accionable para un prospecto ficticio de FWD.\n\nEtapa actual: ${prospecto.etapa}\nSede: ${prospecto.sede}\nCanal de origen: ${prospecto.canal}\n\nNo inventes descuentos, fechas ni requisitos. No uses datos personales. Devolvé solamente el mensaje listo para enviar, en español de Costa Rica.`;

  let respuesta;
  try {
    respuesta = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
        max_tokens: 180,
        messages: [{ role: "user", content: prompt }]
      })
    });
  } catch {
    const error = new Error("No fue posible conectar con el servicio de IA. Intentá de nuevo más tarde.");
    error.statusCode = 502;
    throw error;
  }

  const cuerpo = await respuesta.json();
  if (!respuesta.ok) {
    const detalle = cuerpo?.error?.message || "Error no especificado por el proveedor.";
    const error = new Error(`La IA no pudo redactar el mensaje: ${detalle}`);
    error.statusCode = 502;
    throw error;
  }

  const mensaje = cuerpo.content?.find((bloque) => bloque.type === "text")?.text;
  if (!mensaje) {
    const error = new Error("La IA respondió sin un mensaje utilizable.");
    error.statusCode = 502;
    throw error;
  }

  return { mensaje, prompt };
}

module.exports = { generarMensaje };
