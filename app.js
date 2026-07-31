const STORAGE_KEY = "equiposTI_v2";
const FIRMANTES_KEY = "actaFirmantes_v1";
const CONTADOR_KEY = "actaContador_v1";
const PAGE_SIZE = 50;

const $ = (id) => document.getElementById(id);

const FIELD_IDS = [
  "id", "nombreRed", "ubicaciones", "entidad", "empresa", "nombreEmpleado",
  "usuarioDominio", "departamento", "unidadNegocio", "codigoEmpleado",
  "tipoUsuario", "comentarios",
  "status", "tipoEquipo", "fabricante", "modelo", "numeroSerial",
  "numeroInventario", "correo", "idGlpi", "uuid", "dpi", "ip", "ipImpresora",
  "dominio",
  "procesador", "memoria", "tipoDisco", "firmwareInventario",
  "soVersion", "soNucleo", "soSerial", "subentidades", "proyecto",
  "monitor", "tamanoDisco", "datosImpresora", "serialImpresora",
  "tipoImpresora", "nombreDispositivo", "serialDispositivo",
];

let equipos = [];
let paginaActual = 1;

function cargarDatos() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      equipos = JSON.parse(raw);
      return;
    } catch {
      equipos = [];
    }
  }
  equipos = typeof SEED_DATA !== "undefined" && Array.isArray(SEED_DATA) ? SEED_DATA.slice() : [];
  guardarDatos();
}

function guardarDatos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(equipos));
}

function poblarSelect(select, valores, placeholder) {
  const actual = select.value;
  select.innerHTML = `<option value="">${placeholder}</option>`;
  valores.forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    select.appendChild(opt);
  });
  select.value = actual;
}

function valoresUnicos(campo) {
  return [...new Set(equipos.map((e) => (e[campo] || "").trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "es")
  );
}

function poblarFiltrosYDatalists() {
  poblarSelect($("filtroEmpresa"), valoresUnicos("empresa"), "Todas las empresas");
  poblarSelect($("filtroStatus"), valoresUnicos("status"), "Todos los status");
  poblarSelect($("filtroTipo"), valoresUnicos("tipoEquipo"), "Todos los tipos");

  const datalistMap = {
    "dl-ubicaciones": "ubicaciones",
    "dl-empresa": "empresa",
    "dl-departamento": "departamento",
    "dl-unidadNegocio": "unidadNegocio",
    "dl-status": "status",
    "dl-tipoEquipo": "tipoEquipo",
    "dl-fabricante": "fabricante",
  };
  Object.entries(datalistMap).forEach(([dlId, campo]) => {
    const dl = $(dlId);
    dl.innerHTML = "";
    valoresUnicos(campo).forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      dl.appendChild(opt);
    });
  });

  const dlNombreRed = $("dl-nombreRedActa");
  dlNombreRed.innerHTML = "";
  valoresUnicos("nombreRed").forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v;
    dlNombreRed.appendChild(opt);
  });
}

function esc(v) {
  return v && String(v).trim() !== "" ? v : "N/A";
}

function coincideTexto(e, texto) {
  if (!texto) return true;
  const campos = [
    "nombreRed", "nombreEmpleado", "correo", "empresa", "departamento",
    "modelo", "numeroSerial", "numeroInventario", "ubicaciones",
    "fabricante", "usuarioDominio", "codigoEmpleado", "dpi", "idGlpi", "uuid",
  ];
  const haystack = campos.map((c) => e[c] || "").join(" ").toLowerCase();
  return haystack.includes(texto);
}

function obtenerFiltrados() {
  const texto = $("buscador").value.trim().toLowerCase();
  const empresa = $("filtroEmpresa").value;
  const status = $("filtroStatus").value;
  const tipo = $("filtroTipo").value;

  return equipos.filter((e) => {
    if (empresa && e.empresa !== empresa) return false;
    if (status && e.status !== status) return false;
    if (tipo && e.tipoEquipo !== tipo) return false;
    return coincideTexto(e, texto);
  });
}

function render() {
  const filtrados = obtenerFiltrados();
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  if (paginaActual > totalPaginas) paginaActual = totalPaginas;
  if (paginaActual < 1) paginaActual = 1;

  const inicio = (paginaActual - 1) * PAGE_SIZE;
  const pagina = filtrados.slice(inicio, inicio + PAGE_SIZE);

  const tbody = $("tbodyEquipos");
  tbody.innerHTML = "";

  if (pagina.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" class="empty-state">No se encontraron equipos con los filtros aplicados.</td></tr>`;
  } else {
    pagina.forEach((e) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${esc(e.nombreRed)}</td>
        <td><span class="badge">${esc(e.status)}</span></td>
        <td>${esc(e.nombreEmpleado)}</td>
        <td>${esc(e.empresa)}</td>
        <td>${esc(e.departamento)}</td>
        <td>${esc(e.fabricante)}</td>
        <td>${esc(e.modelo)}</td>
        <td>${esc(e.numeroSerial)}</td>
        <td>${esc(e.numeroInventario)}</td>
        <td>${esc(e.ubicaciones)}</td>
        <td class="fila-acciones"><button type="button" class="ver">Ver / Editar</button></td>
      `;
      tr.addEventListener("click", () => abrirModal(e));
      tbody.appendChild(tr);
    });
  }

  $("contadorTotal").textContent = `${filtrados.length} equipo(s)`;
  $("infoPagina").textContent = `Página ${paginaActual} de ${totalPaginas}`;
  $("btnPrimero").disabled = paginaActual === 1;
  $("btnAnterior").disabled = paginaActual === 1;
  $("btnSiguiente").disabled = paginaActual === totalPaginas;
  $("btnUltimo").disabled = paginaActual === totalPaginas;
}

function abrirModal(equipo) {
  poblarFiltrosYDatalists();
  $("formEquipo").reset();
  if (equipo) {
    $("modalTitulo").textContent = `Editar equipo — ${equipo.nombreRed || ""}`;
    FIELD_IDS.forEach((f) => {
      if (equipo[f] !== undefined) $(f).value = equipo[f];
    });
    $("btnEliminarModal").style.display = "";
  } else {
    $("modalTitulo").textContent = "Nuevo equipo";
    $("id").value = "";
    $("entidad").value = "Root Entity";
    $("status").value = "Asignada";
    $("btnEliminarModal").style.display = "none";
  }
  $("modalOverlay").classList.add("open");
}

function cerrarModal() {
  $("modalOverlay").classList.remove("open");
}

function onSubmit(e) {
  e.preventDefault();
  const data = {};
  FIELD_IDS.forEach((f) => (data[f] = $(f).value.trim()));
  data.ultimaModificacion = new Date().toISOString().slice(0, 16);

  if (data.id) {
    const idx = equipos.findIndex((eq) => eq.id === data.id);
    if (idx !== -1) equipos[idx] = { ...equipos[idx], ...data };
  } else {
    data.id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    equipos.push(data);
  }
  guardarDatos();
  cerrarModal();
  poblarFiltrosYDatalists();
  render();
}

function eliminarActual() {
  const id = $("id").value;
  if (!id) return;
  if (!confirm("¿Eliminar este registro de forma permanente?")) return;
  equipos = equipos.filter((e) => e.id !== id);
  guardarDatos();
  cerrarModal();
  poblarFiltrosYDatalists();
  render();
}

function formatearFecha(iso) {
  if (!iso) return "N/A";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  const pad = (n) => String(n).padStart(2, "0");
  const hora = d.getHours();
  const h12 = hora % 12 === 0 ? 12 : hora % 12;
  const ampm = hora >= 12 ? "p.m." : "a.m.";
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(h12)}:${pad(d.getMinutes())} ${ampm}`;
}

function siguienteNumeroForma() {
  const n = parseInt(localStorage.getItem(CONTADOR_KEY) || "0", 10) + 1;
  localStorage.setItem(CONTADOR_KEY, String(n));
  return `Forma-TI-${String(n).padStart(3, "0")}`;
}

function cargarFirmantes() {
  try {
    return JSON.parse(localStorage.getItem(FIRMANTES_KEY)) || {};
  } catch {
    return {};
  }
}

function guardarFirmantes(tecnico, jefe) {
  localStorage.setItem(FIRMANTES_KEY, JSON.stringify({ tecnico, jefe }));
}

function buscarEquipoPorNombreRed(nombre) {
  const n = (nombre || "").trim().toLowerCase();
  if (!n) return null;
  return equipos.find((e) => (e.nombreRed || "").trim().toLowerCase() === n) || null;
}

/* ---------- Generación del Acta impresa (Forma-TI-001) ---------- */

function filaActa(etiqueta, valor) {
  return `<div class="acta-fila"><div class="etiqueta">${etiqueta}</div><div class="valor">${esc(valor)}</div></div>`;
}

function renderActa(equipo, transaccion) {
  const declarante = transaccion.declarante || equipo.nombreEmpleado || "___________________________";
  const accion = transaccion.accion === "Devuelvo" ? "Devuelvo" : "Recibo";

  $("printArea").innerHTML = `
    <div class="acta">
      <div class="acta-header">
        <div>
          <div class="empresa-label">Empresa:</div>
          <div class="empresa-nombre">${esc(equipo.empresa)}</div>
        </div>
        <div><div class="depto-nombre">Departamento de Tecnología de Información TI</div></div>
        <div>
          <div class="fecha-valor">${formatearFecha(new Date().toISOString())}</div>
          <div class="fecha-label">Fecha de Registro</div>
        </div>
        <div><div class="forma-valor">${transaccion.numeroForma}</div></div>
        <div><span class="logo">&#128269; Data Analytics TI</span></div>
      </div>

      <div class="acta-top3">
        <div class="etiqueta">Status de Equipo:</div>
        <div class="valor">${esc(equipo.status)}</div>
        <div class="etiqueta">Datos Impresora Asig:</div>
        <div class="valor">${esc(equipo.datosImpresora)}</div>
        <div class="etiqueta">Ip Impresora Asig:</div>
        <div class="valor">${esc(equipo.ipImpresora)}</div>

        <div class="etiqueta">Código Empleado:</div>
        <div class="valor">${esc(equipo.codigoEmpleado)}</div>
        <div class="etiqueta">Serial Impresora Asig:</div>
        <div class="valor">${esc(equipo.serialImpresora)}</div>
        <div class="etiqueta">Tipo Impresora Asig:</div>
        <div class="valor">${esc(equipo.tipoImpresora)}</div>

        <div class="etiqueta">DPI/No. Pasaporte:</div>
        <div class="valor">${esc(equipo.dpi)}</div>
        <div class="etiqueta">Nombre Dispositivo:</div>
        <div class="valor">${esc(equipo.nombreDispositivo)}</div>
        <div class="etiqueta">Serial Dispositivo:</div>
        <div class="valor">${esc(equipo.serialDispositivo)}</div>
      </div>

      <div class="acta-content">
        <div class="acta-datos">
          ${filaActa("Nombre Equipo en Red:", equipo.nombreRed)}
          <div class="acta-fila combo">
            <div class="etiqueta">Id de Equipo:</div>
            <div class="valor">${esc(equipo.idGlpi)}</div>
            <div class="etiqueta">uuid:</div>
            <div class="valor">${esc(equipo.uuid)}</div>
          </div>
          ${filaActa("Usuario de Dominio:", equipo.usuarioDominio)}
          ${filaActa("Nombre de Usuario:", equipo.nombreEmpleado)}
          ${filaActa("Dominio:", equipo.dominio)}
          ${filaActa("Correo de Usuario:", equipo.correo)}
          ${filaActa("Ubicación:", equipo.ubicaciones)}
          ${filaActa("Departamento:", equipo.departamento)}
          ${filaActa("Unidad de Negocio:", equipo.unidadNegocio)}
          ${filaActa("Empresa:", equipo.empresa)}
          ${filaActa("Tipo de Equipo:", equipo.tipoEquipo)}
          ${filaActa("Marca de Equipo:", equipo.fabricante)}
          ${filaActa("Modelo Equipo:", equipo.modelo)}
          ${filaActa("Memoria Ram (GB):", equipo.memoria)}
          ${filaActa("Tamaño Disco (GB):", equipo.tamanoDisco)}
          ${filaActa("Service Tag:", equipo.numeroSerial)}
          ${filaActa("Descripción Procesador:", equipo.procesador)}
          ${filaActa("Monitor:", equipo.monitor)}
          ${filaActa("Activo Fijo:", equipo.numeroInventario)}
        </div>
        <div class="formulario-derecha">
          <div class="formulario-box">
            <h2>Formulario Equipo de Cómputo</h2>
            <p>Yo, <strong>${esc(declarante)}</strong> declaro que:</p>
            <ul>
              <li><strong>a.</strong> ${accion} el equipo de cómputo consistente <strong>${esc(equipo.nombreRed)}</strong> en perfecto estado de funcionamiento y en buen estado de conservación, sin golpes que impidan su buen funcionamiento.</li>
              <li><strong>b.</strong> Me hago responsable de darle a este equipo únicamente el uso profesional que mi puesto de trabajo requiere.</li>
              <li><strong>c.</strong> Utilizaré este equipo con el debido cuidado en su manejo, tanto en el hardware como en el software, no navegando ni descargando archivos, aplicaciones o páginas cuya naturaleza no tenga relación con el puesto laboral que desempeño.</li>
              <li><strong>d.</strong> Conozco que este equipo tiene un seguro con cobertura básica, pensada en el uso profesional y prudente del mismo en relación a mi puesto de trabajo, y por lo tanto indemnizaré personal.</li>
            </ul>
            ${transaccion.observaciones ? `<p><strong>Observaciones:</strong> ${transaccion.observaciones}</p>` : ""}

            <div class="firmas">
              <div><div class="firma-linea">${esc(transaccion.tecnico)}<br>Nombre y firma de Técnico de Soporte</div></div>
              <div><div class="firma-linea">Nombre y firma de Usuario</div></div>
            </div>
            <div class="firmas">
              <div></div>
              <div><div class="firma-linea">${esc(transaccion.jefe)}<br>Nombre y firma de Jefe de Operaciones TI</div></div>
            </div>
          </div>
          <div class="clausula">
            La entidad hace entrega al trabajador de bienes del inventario, propiedad de la empresa que aparece detallada
            en este documento, el cual le es confiado para que sea utilizado exclusivamente para la ejecución de su
            trabajo en calidad de depósito, estando obligado por ende a rendir cuentas de su uso, así como a devolverlo
            en cualquier momento a su requerimiento, aceptando el trabajador que la inobservancia a lo antes estipulado,
            constituirá falta, sujeta a la aplicación de medidas disciplinarias, sin perjuicio de las demás
            responsabilidades, civiles, penales y de cualquier otra índole, en las que pueda incurrir el trabajador por
            incumplimiento de lo antes estipulado.
          </div>
        </div>
      </div>
    </div>
  `;

  window.print();
}

function imprimirDesdeEdicion() {
  const equipo = {};
  FIELD_IDS.forEach((f) => (equipo[f] = $(f).value.trim()));
  const firmantes = cargarFirmantes();
  renderActa(equipo, {
    accion: (equipo.status || "").toLowerCase().includes("devol") ? "Devuelvo" : "Recibo",
    declarante: equipo.nombreEmpleado,
    tecnico: firmantes.tecnico || "",
    jefe: firmantes.jefe || "",
    observaciones: equipo.comentarios || "",
    numeroForma: siguienteNumeroForma(),
  });
}

/* ---------- Modal "Generar Acta" ---------- */

function abrirModalActa() {
  poblarFiltrosYDatalists();
  $("actaNombreRed").value = "";
  $("actaAccion").value = "Recibo";
  $("actaDeclarante").value = "";
  $("actaObservaciones").value = "";
  const firmantes = cargarFirmantes();
  $("actaTecnico").value = firmantes.tecnico || "";
  $("actaJefe").value = firmantes.jefe || "";
  $("actaEstado").textContent = "Escribe o selecciona el Nombre en Red de un equipo ya registrado para autocompletar el acta.";
  $("actaEstado").className = "acta-estado";
  $("modalActaOverlay").classList.add("open");
  $("actaNombreRed").focus();
}

function cerrarModalActa() {
  $("modalActaOverlay").classList.remove("open");
}

function onCambioNombreRedActa() {
  const equipo = buscarEquipoPorNombreRed($("actaNombreRed").value);
  if (equipo) {
    $("actaEstado").textContent = `Equipo encontrado: ${equipo.empresa || "N/A"} · ${equipo.status || "N/A"} · ${equipo.nombreEmpleado || "sin usuario asignado"}. Se autocompletarán todos los datos del acta.`;
    $("actaEstado").className = "acta-estado";
    if (!$("actaDeclarante").value) $("actaDeclarante").value = equipo.nombreEmpleado || "";
    if ((equipo.status || "").toLowerCase().includes("devol")) $("actaAccion").value = "Devuelvo";
  } else if ($("actaNombreRed").value.trim()) {
    $("actaEstado").textContent = "No se encontró ningún equipo con ese Nombre en Red. Puedes registrarlo primero con \"+ Nuevo equipo\", o generar el acta solo con este nombre.";
    $("actaEstado").className = "acta-estado no-encontrado";
  } else {
    $("actaEstado").textContent = "Escribe o selecciona el Nombre en Red de un equipo ya registrado para autocompletar el acta.";
    $("actaEstado").className = "acta-estado";
  }
}

function generarEImprimirActa() {
  const nombreRed = $("actaNombreRed").value.trim();
  if (!nombreRed) {
    alert("Escribe el Nombre en Red del equipo.");
    return;
  }
  const equipo = buscarEquipoPorNombreRed(nombreRed) || { nombreRed };
  const tecnico = $("actaTecnico").value.trim();
  const jefe = $("actaJefe").value.trim();
  guardarFirmantes(tecnico, jefe);

  renderActa(equipo, {
    accion: $("actaAccion").value,
    declarante: $("actaDeclarante").value.trim(),
    tecnico,
    jefe,
    observaciones: $("actaObservaciones").value.trim(),
    numeroForma: siguienteNumeroForma(),
  });
  cerrarModalActa();
}

$("btnNuevo").addEventListener("click", () => abrirModal(null));
$("btnCerrarModal").addEventListener("click", cerrarModal);
$("btnCancelar").addEventListener("click", cerrarModal);
$("btnEliminarModal").addEventListener("click", eliminarActual);
$("btnImprimirDesdeModal").addEventListener("click", imprimirDesdeEdicion);
$("modalOverlay").addEventListener("click", (e) => {
  if (e.target === $("modalOverlay")) cerrarModal();
});
$("formEquipo").addEventListener("submit", onSubmit);

$("btnGenerarActa").addEventListener("click", abrirModalActa);
$("btnCerrarModalActa").addEventListener("click", cerrarModalActa);
$("btnCancelarActa").addEventListener("click", cerrarModalActa);
$("btnGenerarEImprimir").addEventListener("click", generarEImprimirActa);
$("actaNombreRed").addEventListener("input", onCambioNombreRedActa);
$("modalActaOverlay").addEventListener("click", (e) => {
  if (e.target === $("modalActaOverlay")) cerrarModalActa();
});

$("buscador").addEventListener("input", () => { paginaActual = 1; render(); });
$("filtroEmpresa").addEventListener("change", () => { paginaActual = 1; render(); });
$("filtroStatus").addEventListener("change", () => { paginaActual = 1; render(); });
$("filtroTipo").addEventListener("change", () => { paginaActual = 1; render(); });

$("btnPrimero").addEventListener("click", () => { paginaActual = 1; render(); });
$("btnAnterior").addEventListener("click", () => { paginaActual--; render(); });
$("btnSiguiente").addEventListener("click", () => { paginaActual++; render(); });
$("btnUltimo").addEventListener("click", () => {
  paginaActual = Math.ceil(obtenerFiltrados().length / PAGE_SIZE);
  render();
});

cargarDatos();
poblarFiltrosYDatalists();
render();
