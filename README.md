# Mini-CRM de admisiones con IA

API REST en Express basada en el embudo de admisiones de FWD. Trabaja únicamente con 40 prospectos ficticios, distribuidos entre las 9 etapas del embudo.

## Estructura backend

```text
src/
  controllers/  # recibe la petición y devuelve la respuesta HTTP
  routes/       # define cada endpoint
  services/     # integra servicios externos, como Claude
  data.js       # datos ficticios en memoria
  app.js        # configura Express y monta las rutas
  server.js     # inicia el servidor
```

## Ejecutar

```bash
npm install
Copy-Item .env.example .env
npm run dev
```

La API queda disponible en `http://localhost:3000`. Para usar IA, agregá una clave válida de Anthropic en `.env`; la clave nunca se incluye en el código ni se sube al repositorio.

Al abrir `http://localhost:3000` también se muestra el frontend del panel: embudo, seguimientos pendientes, registro de prospectos y cambio de etapa.

## Rutas

| Método | Ruta | Función |
| --- | --- | --- |
| POST | `/prospectos` | Registra un prospecto en `Prospecto`. |
| GET | `/prospectos` | Lista y filtra prospectos por `buscar`, `etapa` o `sede`. |
| PATCH | `/prospectos/:id/etapa` | Cambia etapa y guarda fecha e historial. |
| GET | `/embudo` | Cuenta por etapa y calcula conversión, meta y fuga. |
| GET | `/atencion?dias=7` | Prioriza los prospectos sin avance. |
| POST | `/prospectos/:id/mensaje` | Redacta el siguiente mensaje con IA según etapa y sede. |
| POST | `/campanas` | Bonus: crea una campaña con tres textos y estado pendiente de aprobación. |

### Ejemplos

```powershell
Invoke-RestMethod http://localhost:3000/embudo
Invoke-RestMethod http://localhost:3000/atencion?dias=7
Invoke-RestMethod -Method Post http://localhost:3000/prospectos -ContentType 'application/json' -Body '{"alias":"Prospecto-41","sede":"Desamparados","canal":"Landing"}'
Invoke-RestMethod -Method Patch http://localhost:3000/prospectos/1/etapa -ContentType 'application/json' -Body '{"etapa":"Candidato"}'
Invoke-RestMethod -Method Post http://localhost:3000/prospectos/1/mensaje
```

## Análisis de la fuga

Con los datos iniciales hay una distribución uniforme de personas, por lo que las conversiones reales entre etapas no reflejan la meta. La etapa con mayor fuga es **Agenda Campus Day**: la meta es que 75% de quienes agendan asistan, pero el embudo inicial permite detectar cuando ese avance no ocurre. Atender primero a quienes llevan varios días sin avance ayuda a reducir esa fuga. La acción propuesta es enviar un recordatorio personalizado con sede y próxima acción, y luego medir asistencia por canal de origen.

## Decisiones de diseño

- Cada cambio de etapa conserva su fecha en `historial`.
- La fuga se expresa como puntos porcentuales faltantes respecto a la meta de esa etapa.
- Si la IA no tiene clave, falla o responde inválido, el endpoint devuelve un error claro y no expone la clave.
