# Checklist de requisitos - Mini-CRM de admisiones con IA

Este documento compara el proyecto con el miniproyecto solicitado en la presentación.

## Estado general

| Área | Estado |
| --- | --- |
| API REST con Express | ✅ Hecho |
| 9 etapas del embudo | ✅ Hecho |
| 40 prospectos ficticios | ✅ Hecho |
| 5 rutas obligatorias | ✅ Hecho |
| Métricas de conversión y fuga | ✅ Hecho |
| Endpoint de IA | ✅ Hecho, requiere clave de Anthropic para responder con IA real |
| Manejo de claves y errores | ✅ Hecho |
| README y análisis de fuga | ✅ Hecho |
| Repositorio remoto / entrega | ⏳ Pendiente de crear o subir por el estudiante |

## Rutas obligatorias

| Requisito | Ruta | Estado | Evidencia |
| --- | --- | --- | --- |
| Registrar un prospecto nuevo en `Prospecto` | `POST /prospectos` | ✅ | Valida `alias` y `sede`; asigna la etapa y guarda las fechas. |
| Mover prospecto y guardar fecha | `PATCH /prospectos/:id/etapa` | ✅ | Actualiza etapa, `fechaUltimoAvance` e historial. |
| Contar por etapa, conversión y fuga | `GET /embudo` | ✅ | Devuelve cantidad, meta, conversión y fuga frente a la meta. |
| Mostrar a quién atender hoy | `GET /atencion?dias=7` | ✅ | Lista y ordena por días sin avance. |
| Redactar mensaje con IA | `POST /prospectos/:id/mensaje` | ✅ | El prompt recibe etapa, sede y canal. |

## Reglas de datos

| Requisito | Estado | Nota |
| --- | --- | --- |
| Usar prospectos ficticios | ✅ | Se usan alias como `Prospecto-01`; no hay nombres ni cédulas reales. |
| Incluir 40 prospectos | ✅ | `src/data.js` genera 40 registros iniciales. |
| Mantener las 9 etapas | ✅ | Están definidas en `src/constants.js`. |
| Fechas distintas | ✅ | Los datos iniciales usan distintas fechas de ingreso y avance. |

## IA, claves y errores

| Requisito | Estado | Nota |
| --- | --- | --- |
| Clave en variable de entorno | ✅ | Usa `ANTHROPIC_API_KEY`; `.env` está ignorado por Git. |
| Prompt con etapa y sede | ✅ | También incorpora el canal de origen. |
| Error claro si la IA falla | ✅ | Devuelve error `503` sin clave y `502` ante error del proveedor. |
| Probar IA real | ⏳ | Falta configurar una clave válida en `.env` y hacer un `POST /prospectos/1/mensaje`. |

## Organización del backend

| Elemento | Estado |
| --- | --- |
| Rutas separadas | ✅ `src/routes/` |
| Controladores separados | ✅ `src/controllers/` |
| Servicio de IA separado | ✅ `src/services/ai.service.js` |
| Datos de prueba separados | ✅ `src/data.js` |
| Configuración de Express | ✅ `src/app.js` y `src/server.js` |

## Pendiente antes de entregar

- [ ] Crear `.env` a partir de `.env.example`.
- [ ] Agregar una `ANTHROPIC_API_KEY` válida si se requiere demostrar la IA funcionando en vivo.
- [ ] Ejecutar `npm install` y `npm run dev` en la computadora de entrega.
- [ ] Probar las cinco rutas con Postman, Thunder Client o PowerShell.
- [ ] Confirmar que el README se vea correctamente y explique cómo ejecutar el proyecto.
- [ ] Subir la carpeta a un repositorio o entregarla por el canal indicado por el profesor.

## Bonus opcional

La presentación propone como bonus una ruta de campaña que reciba un objetivo y genere tres textos para redes, con estado `pendiente de aprobación`.

- [ ] Implementar `POST /campanas`.
- [ ] Recibir `objetivo` y, opcionalmente, presupuesto o sede.
- [ ] Generar tres textos para redes mediante IA.
- [ ] Devolver `estado: "pendiente de aprobación"`.

> El bonus no es parte de las cinco rutas obligatorias. El proyecto base ya cubre la rúbrica principal.
