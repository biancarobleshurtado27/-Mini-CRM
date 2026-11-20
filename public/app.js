const etapas = ["Prospecto", "Candidato", "Agenda Campus Day", "Asiste Campus Day", "Prueba Técnica", "Entrevista", "Admitido", "Semana de Prueba", "Estudiante"];
const $ = (selector) => document.querySelector(selector);

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[char]);
}

async function request(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "No se pudo completar la operación.");
  return data;
}

function renderFunnel(datos) {
  const maximo = Math.max(...datos.etapas.map((item) => item.cantidad), 1);
  $("#funnel").innerHTML = datos.etapas.map((item) => {
    const detalle = item.conversion === null ? "Etapa final del recorrido" : `${item.conversion}% de conversión · meta ${item.metaConversion}% · fuga ${item.fugaFrenteAMeta} pp`;
    return `<div class="funnel-row"><span class="stage-name">${escapeHtml(item.etapa)}</span><div class="bar-bg"><div class="bar" style="width:${Math.max((item.cantidad / maximo) * 100, 3)}%"></div></div><span class="stage-count">${item.cantidad}</span><span class="stage-detail">${detalle}</span></div>`;
  }).join("");
  $("#totalProspectos").textContent = datos.totalProspectos;
  $("#totalEtapas").textContent = datos.etapas.length;
}

function renderAttention(datos, all = false) {
  const lista = all ? datos.prospectos : datos.prospectos.slice(0, 5);
  $("#totalAtencion").textContent = datos.total;
  $("#attentionList").innerHTML = lista.length ? lista.map((item) => `<div class="attention-row"><div class="attention-main"><strong>${escapeHtml(item.alias)}</strong><span>${escapeHtml(item.etapa)} · ${escapeHtml(item.sede)}</span></div><span class="days">${item.diasSinAvance} días</span></div>`).join("") : '<p class="empty">No hay seguimientos pendientes.</p>';
}

async function loadDashboard(all = false) {
  try {
    const [embudo, atencion] = await Promise.all([request("/embudo"), request("/atencion?dias=7")]);
    renderFunnel(embudo);
    renderAttention(atencion, all);
    $("#showAllButton").dataset.showing = String(all);
    $("#showAllButton").textContent = all ? "Ver menos" : "Ver todos";
  } catch (error) {
    $("#funnel").innerHTML = `<p class="empty">${escapeHtml(error.message)}</p>`;
  }
}

function showMessage(selector, message, isError = false) {
  const element = $(selector); element.textContent = message; element.classList.toggle("error", isError);
}

$("#prospectoForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const body = Object.fromEntries(new FormData(event.currentTarget));
  try { const creado = await request("/prospectos", { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify(body) }); showMessage("#formMessage", `${creado.alias} fue registrado en Prospecto.`); event.currentTarget.reset(); loadDashboard(); }
  catch (error) { showMessage("#formMessage", error.message, true); }
});

$("#etapaForm").addEventListener("submit", async (event) => {
  event.preventDefault(); const form = new FormData(event.currentTarget); const id = form.get("id");
  try { const actualizado = await request(`/prospectos/${id}/etapa`, { method:"PATCH", headers:{"content-type":"application/json"}, body:JSON.stringify({etapa:form.get("etapa")}) }); showMessage("#etapaMessage", `Prospecto ${actualizado.id} movido a ${actualizado.etapa}.`); loadDashboard(); }
  catch (error) { showMessage("#etapaMessage", error.message, true); }
});

$("#refreshButton").addEventListener("click", () => loadDashboard());
$("#showAllButton").addEventListener("click", (event) => loadDashboard(event.currentTarget.dataset.showing !== "true"));
$("#etapaSelect").innerHTML = '<option value="">Elegí la nueva etapa</option>' + etapas.map((etapa) => `<option>${etapa}</option>`).join("");
loadDashboard();

function renderProspects(datos) {
  $("#resultsCount").textContent = `${datos.total} resultados`;
  $("#prospectsList").innerHTML = datos.prospectos.length
    ? datos.prospectos.map((item) => `<div class="prospect-row"><strong>#${item.id} · ${escapeHtml(item.alias)}</strong><span>${escapeHtml(item.sede)}</span><span>${escapeHtml(item.canal)}</span><b class="tag">${escapeHtml(item.etapa)}</b></div>`).join("")
    : '<p class="empty">No hay prospectos con esos filtros.</p>';
}

async function loadProspects(query = "") {
  try { renderProspects(await request(`/prospectos?${query}`)); }
  catch (error) { $("#prospectsList").innerHTML = `<p class="empty">${escapeHtml(error.message)}</p>`; }
}

$("#filtersForm").addEventListener("submit", (event) => {
  event.preventDefault();
  loadProspects(new URLSearchParams(new FormData(event.currentTarget)).toString());
});

$("#campanaForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const campana = await request("/campanas", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) });
    showMessage("#campanaMessage", "Campaña creada para revisión humana.");
    $("#campaignResult").innerHTML = `<span class="approval">${campana.estado}</span>${campana.piezas.map((pieza, indice) => `<p class="campaign-piece"><b>Pieza ${indice + 1}</b><br>${escapeHtml(pieza)}</p>`).join("")}`;
  } catch (error) { showMessage("#campanaMessage", error.message, true); }
});

$("#filterEtapa").innerHTML += etapas.map((etapa) => `<option>${etapa}</option>`).join("");
loadProspects();

document.querySelectorAll(".flow-tab").forEach((button) => {
  button.addEventListener("click", () => {
    const isAdmisiones = button.dataset.flow === "admisiones";
    document.querySelectorAll(".flow-tab").forEach((tab) => {
      tab.classList.toggle("active", tab === button);
      tab.setAttribute("aria-selected", String(tab === button));
    });
    $("#flowAdmisiones").classList.toggle("hidden", !isAdmisiones);
    $("#flowMercadeo").classList.toggle("hidden", isAdmisiones);
  });
});
