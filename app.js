const STORAGE_KEY = "equiposTI";

const $ = (id) => document.getElementById(id);

function getEquipos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveEquipos(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

function nextFormaNumero() {
  const lista = getEquipos();
  const max = lista.reduce((acc, e) => {
    const match = /(\d+)$/.exec(e.numeroForma || "");
    const n = match ? parseInt(match[1], 10) : 0;
    return Math.max(acc, n);
  }, 0);
  return `Forma-TI-${String(max + 1).padStart(3, "0")}`;
}

const FIELD_IDS = [
  "id", "empresa", "departamentoTI", "fechaRegistro", "numeroForma",
  "statusEquipo", "codigoEmpleado", "dpi",
  "nombreEquipoRed", "idEquipo", "uuid",
  "usuarioDominio", "nombreUsuario", "dominio", "correoUsuario",
  "ubicacion", "departamentoUsuario", "unidadNegocio",
  "tipoEquipo", "marcaEquipo", "modeloEquipo", "memoriaRam", "tamanoDisco",
  "serviceTag", "procesador", "monitor", "activoFijo",
  "datosImpresora", "serialImpresora", "tipoImpresora", "ipImpresora",
  "nombreDispositivo", "serialDispositivo",
  "accion", "nombreTecnico", "nombreJefe", "observaciones"
];

function abrirModal(equipo) {
  $("formEquipo").reset();
  if (equipo) {
    $("modalTitulo").textContent = "Editar registro de equipo";
    FIELD_IDS.forEach((f) => {
      if (equipo[f] !== undefined) $(f).value = equipo[f];
    });
  } else {
    $("modalTitulo").textContent = "Nuevo registro de equipo";
    $("id").value = "";
    $("empresa").value = "RIOL S.A.";
    $("departamentoTI").value = "Departamento de Tecnología de Información TI";
    $("numeroForma").value = nextFormaNumero();
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    $("fechaRegistro").value = new Date(now - tzOffset).toISOString().slice(0, 16);
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

  let lista = getEquipos();
  if (data.id) {
    lista = lista.map((eq) => (eq.id === data.id ? data : eq));
  } else {
    data.id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    lista.push(data);
  }
  saveEquipos(lista);
  cerrarModal();
  render();
}

function eliminar(id) {
  if (!confirm("¿Eliminar este registro de forma permanente?")) return;
  saveEquipos(getEquipos().filter((e) => e.id !== id));
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

function render() {
  const lista = getEquipos();
  const texto = $("buscador").value.toLowerCase();
  const statusFiltro = $("filtroStatus").value;

  const filtrados = lista.filter((e) => {
    const coincideTexto =
      !texto ||
      [e.nombreUsuario, e.nombreEquipoRed, e.codigoEmpleado, e.serviceTag, e.activoFijo, e.marcaEquipo, e.modeloEquipo]
        .join(" ")
        .toLowerCase()
        .includes(texto);
    const coincideStatus = !statusFiltro || e.statusEquipo === statusFiltro;
    return coincideTexto && coincideStatus;
  });

  const cont = $("listado");
  cont.innerHTML = "";

  if (filtrados.length === 0) {
    cont.innerHTML = `<div class="empty-state">No hay equipos registrados. Usa "+ Nuevo registro" para agregar el primero.</div>`;
    return;
  }

  filtrados
    .slice()
    .reverse()
    .forEach((e) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <span class="badge">${e.statusEquipo || "Sin status"}</span>
        <h3>${e.nombreEquipoRed || "(sin nombre de equipo)"}</h3>
        <p><strong>Usuario:</strong> ${e.nombreUsuario || "N/A"}</p>
        <p><strong>Marca/Modelo:</strong> ${e.marcaEquipo || ""} ${e.modeloEquipo || ""}</p>
        <p><strong>Service Tag:</strong> ${e.serviceTag || "N/A"}</p>
        <p><strong>Activo Fijo:</strong> ${e.activoFijo || "N/A"}</p>
        <p><strong>Forma:</strong> ${e.numeroForma || "N/A"}</p>
        <div class="card-actions">
          <button class="editar">Editar</button>
          <button class="imprimir">Imprimir</button>
          <button class="danger eliminar">Eliminar</button>
        </div>
      `;
      card.querySelector(".editar").addEventListener("click", () => abrirModal(e));
      card.querySelector(".imprimir").addEventListener("click", () => imprimir(e));
      card.querySelector(".eliminar").addEventListener("click", () => eliminar(e.id));
      cont.appendChild(card);
    });
}

function esc(v) {
  return v && String(v).trim() !== "" ? v : "N/A";
}

function imprimir(equipo) {
  const declarante = equipo.nombreUsuario || "___________________________";
  const accion = equipo.accion === "Devuelvo" ? "Devuelvo" : "Recibo";

  $("printArea").innerHTML = `
    <div class="hoja">
      <div class="hoja-top">
        <div>
          <div class="empresa-label">Empresa:</div>
          <div class="empresa-nombre">${esc(equipo.empresa)}</div>
        </div>
        <div><div class="depto">${esc(equipo.departamentoTI)}</div></div>
        <div>
          <div class="fecha">${formatearFecha(equipo.fechaRegistro)}</div>
          <div>Fecha de Registro</div>
        </div>
        <div><div class="forma">${esc(equipo.numeroForma)}</div></div>
      </div>

      <div class="hoja-content">
        <div class="datos-izq">
          ${fila("Status de Equipo", equipo.statusEquipo)}
          ${fila("Código Empleado", equipo.codigoEmpleado)}
          ${fila("DPI/No. Pasaporte", equipo.dpi)}
          ${fila("Nombre Equipo en Red", equipo.nombreEquipoRed)}
          ${fila("Id de Equipo / uuid", `${esc(equipo.idEquipo)} / ${esc(equipo.uuid)}`)}
          ${fila("Usuario de Dominio", equipo.usuarioDominio)}
          ${fila("Nombre de Usuario", equipo.nombreUsuario)}
          ${fila("Dominio", equipo.dominio)}
          ${fila("Correo de Usuario", equipo.correoUsuario)}
          ${fila("Ubicación", equipo.ubicacion)}
          ${fila("Departamento", equipo.departamentoUsuario)}
          ${fila("Unidad de Negocio", equipo.unidadNegocio)}
          ${fila("Tipo de Equipo", equipo.tipoEquipo)}
          ${fila("Marca de Equipo", equipo.marcaEquipo)}
          ${fila("Modelo Equipo", equipo.modeloEquipo)}
          ${fila("Memoria Ram (GB)", equipo.memoriaRam)}
          ${fila("Tamaño Disco (GB)", equipo.tamanoDisco)}
          ${fila("Service Tag", equipo.serviceTag)}
          ${fila("Descripción Procesador", equipo.procesador)}
          ${fila("Monitor", equipo.monitor)}
          ${fila("Activo Fijo", equipo.activoFijo)}
          ${fila("Datos Impresora Asig.", equipo.datosImpresora)}
          ${fila("Serial Impresora Asig.", equipo.serialImpresora)}
          ${fila("Tipo Impresora Asig.", equipo.tipoImpresora)}
          ${fila("Ip Impresora Asig.", equipo.ipImpresora)}
          ${fila("Nombre Dispositivo", equipo.nombreDispositivo)}
          ${fila("Serial Dispositivo", equipo.serialDispositivo)}
        </div>
        <div class="formulario-derecha">
          <div class="formulario-box">
            <h2>Formulario Equipo de Cómputo</h2>
            <p>Yo, <strong>${esc(declarante)}</strong> declaro que:</p>
            <ul>
              <li><strong>a.</strong> ${accion} el equipo de cómputo consistente <strong>${esc(equipo.nombreEquipoRed)}</strong> en perfecto estado de funcionamiento y en buen estado de conservación, sin golpes que impidan su buen funcionamiento.</li>
              <li><strong>b.</strong> Me hago responsable de darle a este equipo únicamente el uso profesional que mi puesto de trabajo requiere.</li>
              <li><strong>c.</strong> Utilizaré este equipo con el debido cuidado en su manejo, tanto en el hardware como en el software, no navegando ni descargando archivos, aplicaciones o páginas cuya naturaleza no tenga relación con el puesto laboral que desempeño.</li>
              <li><strong>d.</strong> Conozco que este equipo tiene un seguro con cobertura básica, pensada en el uso profesional y prudente del mismo en relación a mi puesto de trabajo, y por lo tanto indemnizaré personal.</li>
            </ul>
            ${equipo.observaciones ? `<p><strong>Observaciones:</strong> ${equipo.observaciones}</p>` : ""}

            <div class="firmas">
              <div>
                <div class="firma-linea">${esc(equipo.nombreTecnico)}<br>Nombre y firma de Técnico de Soporte</div>
              </div>
              <div>
                <div class="firma-linea">Nombre y firma de Usuario</div>
              </div>
            </div>
            <div class="firmas">
              <div></div>
              <div>
                <div class="firma-linea">${esc(equipo.nombreJefe)}<br>Nombre y firma de Jefe de Operaciones TI</div>
              </div>
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

function fila(etiqueta, valor) {
  return `<div class="fila"><div class="etiqueta">${etiqueta}</div><div class="valor">${esc(valor)}</div></div>`;
}

$("btnNuevo").addEventListener("click", () => abrirModal(null));
$("btnCerrarModal").addEventListener("click", cerrarModal);
$("btnCancelar").addEventListener("click", cerrarModal);
$("modalOverlay").addEventListener("click", (e) => {
  if (e.target === $("modalOverlay")) cerrarModal();
});
$("formEquipo").addEventListener("submit", onSubmit);
$("buscador").addEventListener("input", render);
$("filtroStatus").addEventListener("change", render);

render();
