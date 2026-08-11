const STORAGE_KEY = "equiposTI_v2";
const CONTADOR_KEY = "actaContador_v1";
const PAGE_SIZE = 50;

const $ = (id) => document.getElementById(id);

let TECNICO_ACTUAL = "";
window.establecerTecnicoActual = (nombre) => {
  TECNICO_ACTUAL = nombre || "";
};

const FIELD_IDS = [
  "id", "nombreRed", "ubicaciones", "entidad", "empresa", "nombreEmpleado",
  "usuarioDominio", "departamento", "unidadNegocio", "codigoEmpleado",
  "tipoUsuario", "comentarios",
  "status", "tipoEquipo", "fabricante", "modelo", "numeroSerial",
  "numeroInventario", "correo", "idGlpi", "uuid", "contratos", "dpi", "ip", "ipImpresora",
  "dominio",
  "procesador", "memoria", "tipoDisco", "firmwareInventario",
  "soVersion", "soNucleo", "soSerial", "subentidades", "proyecto",
  "monitor", "tamanoDisco", "datosImpresora", "serialImpresora",
  "tipoImpresora", "nombreDispositivo", "serialDispositivo",
  "puesto", "fechaIngresoEquipo", "codigoRam", "memoriaDescripcion",
];

let equipos = [];
let paginaActual = 1;

function cargarDatos() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      equipos = JSON.parse(raw);
      fusionarContratosDesdeSeed();
      return;
    } catch {
      equipos = [];
    }
  }
  equipos = typeof SEED_DATA !== "undefined" && Array.isArray(SEED_DATA) ? SEED_DATA.slice() : [];
  guardarDatos();
}

function fusionarContratosDesdeSeed() {
  // Trae datos de "contratos" agregados a SEED_DATA después de que este navegador
  // ya había guardado su propia copia en localStorage, sin pisar nada que el
  // usuario haya capturado manualmente. También agrega equipos nuevos que se
  // hayan sumado a SEED_DATA (por ejemplo, altas importadas desde un contrato)
  // y que este navegador todavía no tenga.
  if (typeof SEED_DATA === "undefined" || !Array.isArray(SEED_DATA)) return;
  const seedPorId = new Map(SEED_DATA.map((s) => [s.id, s]));
  const idsActuales = new Set(equipos.map((e) => e.id));
  let cambio = false;

  equipos.forEach((e) => {
    if (nonEmpty(e.contratos)) return;
    const seed = seedPorId.get(e.id);
    if (seed && nonEmpty(seed.contratos)) {
      e.contratos = seed.contratos;
      cambio = true;
    }
  });

  const IDS_ALTAS_NUEVAS_SEED = ["pendiente-pcriolsa005", "pendiente-bascula1"];
  SEED_DATA.forEach((seed) => {
    if (!idsActuales.has(seed.id)) {
      equipos.push({ ...seed });
      cambio = true;
      if (IDS_ALTAS_NUEVAS_SEED.includes(seed.id)) sincronizarEquipo(seed);
    }
  });

  if (limpiarPendientesDuplicados()) cambio = true;
  if (corregirFechaContrato8030028059()) cambio = true;
  if (corregirSerialesTipeados()) cambio = true;
  if (sincronizarComentariosCronograma()) cambio = true;
  if (eliminarDuplicadoP025194()) cambio = true;
  if (eliminarChatarraConfirmada()) cambio = true;
  if (quitarMarcaRevisionConfirmados()) cambio = true;
  if (corregirEmpresasMalCapturadas()) cambio = true;
  if (corregirTipoEquipoMalClasificado()) cambio = true;
  if (corregirComentariosUsoRiolsa()) cambio = true;

  if (cambio) guardarDatos();
}

function eliminarDuplicadoP025194() {
  // "P02-5194 bod2" se agregó por error como equipo nuevo del cronograma AD,
  // pero es el mismo equipo físico que ya existía como "P02-5194". Si un
  // navegador ya lo tenía guardado en localStorage antes de esta corrección,
  // SEED_DATA ya no lo trae, así que hay que quitarlo explícitamente.
  const antes = equipos.length;
  equipos = equipos.filter((e) => e.id !== "cronograma-4");
  const cambio = equipos.length !== antes;
  if (cambio) sincronizarEliminacion("cronograma-4");
  return cambio;
}

const IDS_CHATARRA_CONFIRMADA = [
  // Documentacion_Chatarra_300424.pdf
  "seed-30", "seed-394", "seed-432", "seed-755",
  // Listado_Equipos_Chatarra_200226.pdf
  "seed-8", "seed-21", "seed-26", "seed-32", "seed-34", "seed-433", "seed-434",
  "seed-441", "seed-443", "seed-445", "seed-452", "seed-453", "seed-454",
  "seed-455", "seed-458", "seed-459", "seed-497", "seed-500", "seed-511",
  "seed-512", "seed-734", "seed-752", "seed-758", "seed-773", "seed-797", "seed-799",
  // Registro_todo.pdf: equipos sin uso por fallas (bateria, pantalla, teclado, etc.)
  "seed-65", "seed-68", "seed-71", "seed-98", "seed-107", "seed-114", "seed-115",
  "seed-119", "seed-342", "seed-361",
  // Registro_todo1.pdf: "LAPTOS DE BODEGA" no funcionales
  "seed-99", "seed-108", "seed-112", "seed-345", "seed-346", "seed-357", "seed-367",
  "seed-376", "seed-380", "seed-383", "seed-386", "seed-439", "seed-771", "seed-795",
  // Status "Devolucion > Baja de Equipo" dentro de los equipos en revision
  "seed-1", "seed-5", "seed-12", "seed-13", "seed-60", "seed-347", "seed-365",
  "seed-399", "seed-400", "seed-403", "seed-504", "seed-505", "seed-517", "seed-772",
  // PENDIENTE- del contrato 8030028059: las 5 laptops ya se entregaron y
  // tienen su registro real con nombre/empleado, estos placeholders sobran
  "pendiente-pf6686wt", "pendiente-pf662c4r", "pendiente-pf65l51z",
  "pendiente-pf66acc4", "pendiente-pf661gjy",
];

function eliminarChatarraConfirmada() {
  // Confirmados contra los listados de chatarra proporcionados (coincidencia
  // exacta de serial o activo fijo). Al igual que con el duplicado P02-5194,
  // hay que quitarlos explícitamente de cualquier navegador que ya los
  // tuviera guardados, ya que SEED_DATA dejó de traerlos.
  const antes = equipos.length;
  equipos = equipos.filter((e) => !IDS_CHATARRA_CONFIRMADA.includes(e.id));
  const cambio = equipos.length !== antes;
  if (cambio) IDS_CHATARRA_CONFIRMADA.forEach((id) => sincronizarEliminacion(id));
  return cambio;
}

const IDS_CONFIRMADOS_ACTIVOS = [
  // laptop.pdf: equipos por sede que siguen activos, se les quita "en revision"
  "seed-18", "seed-27", "seed-49", "seed-50", "seed-118", "seed-354",
  "seed-379", "seed-405", "seed-461", "seed-766", "seed-774",
  // deskmark.pdf: desktops por sede confirmados activos
  "seed-402", "seed-456", "seed-739",
  // dsk.pdf: desktops de Riolsa/Mixco/San Rafael confirmados activos
  "seed-42", "seed-393", "seed-733", "seed-735", "seed-736", "seed-737",
  "seed-738", "seed-742", "seed-743", "seed-770", "seed-775",
  // LAPLNV283: confirmado activo, es una de las 5 laptops LAPLNV283-287
  // entregadas y ya sincronizadas desde la computadora de la oficina
  "seed-335",
];

function quitarMarcaRevisionConfirmados() {
  // Estos equipos aparecían marcados como "no aparece en el cronograma AD",
  // pero un registro de equipos activos por sede confirmó que sí siguen en
  // uso. Se les quita la marca sin tocar el resto del comentario, y se
  // actualiza la fecha para que la corrección se propague a otros
  // navegadores/Firestore.
  const MARCA_CRONOGRAMA_COMPLETA = "Pendiente validar: no aparece en el cronograma de migracion AD 2026; posible equipo sin dar de baja.";
  let cambio = false;
  equipos.forEach((e) => {
    if (!IDS_CONFIRMADOS_ACTIVOS.includes(e.id)) return;
    const actual = e.comentarios || "";
    if (!actual.includes(MARCA_CRONOGRAMA_COMPLETA)) return;
    e.comentarios = actual
      .replace(MARCA_CRONOGRAMA_COMPLETA, "")
      .replace(/^\s*\|\s*/, "")
      .replace(/\s*\|\s*$/, "")
      .trim();
    // No se toca ultimaModificacion ni se empuja a Firestore aqui: forzar una
    // fecha "reciente" podia hacer que una copia local vieja/incompleta le
    // ganara en la fusion a una edicion real mas nueva de otro navegador,
    // borrando esa informacion. Esta correccion solo arregla la vista local;
    // si el equipo ya tiene datos buenos en la nube, esos prevalecen.
    cambio = true;
  });
  return cambio;
}

const CORRECCIONES_EMPRESA = {
  "seed-201": "Breemer",
  "seed-494": "Tennat",
  "seed-599": "MALVERTH S.A",
  "seed-667": "Tennat",
  "seed-739": "RIOL S.A.",
};

function corregirEmpresasMalCapturadas() {
  // Estos 4 equipos tenian un departamento (Informatica, Textil > Engomadora,
  // Inmobiliaria > Administración Flores Del Lago) o un typo (Tenant) en el
  // campo empresa. Forzamos la correccion aunque el campo ya tenga un valor
  // guardado, igual que con los seriales tipeados. No se toca
  // ultimaModificacion ni se empuja a Firestore (ver nota en
  // quitarMarcaRevisionConfirmados): esto es solo un arreglo de la vista
  // local, para no arriesgar sobrescribir una edicion real mas nueva.
  let cambio = false;
  equipos.forEach((e) => {
    const nueva = CORRECCIONES_EMPRESA[e.id];
    if (!nueva || (e.empresa || "").trim() === nueva) return;
    e.empresa = nueva;
    cambio = true;
  });
  return cambio;
}

const CORRECCIONES_COMENTARIO_USO = {
  "seed-735": "Uso reportado (archivo de equipos activos RIOLSA): Mantenimiento de riegos.",
  "seed-770": "Uso reportado (archivo de equipos activos RIOLSA): Monitoreo de velocidades de cosechadoras.",
};

function corregirComentariosUsoRiolsa() {
  // PCRIOL016 y RIOLSA016 estan asignados a Saulo Rendon en GLPI, pero su
  // usuarioDominio/correo son cuentas funcionales compartidas (Mantenimiento
  // Riegos, monitoreovelocidades@riolcorp.com). El archivo de equipos activos
  // de RIOLSA los describe por su uso y no por una persona, asi que se deja
  // constancia en comentarios sin tocar nombreEmpleado (no hay certeza de
  // cual nombre es el correcto, y sobrescribirlo arriesgaria perder el dato
  // real). No se toca ultimaModificacion ni se empuja a Firestore, igual que
  // las demas correcciones locales de esta lista.
  let cambio = false;
  equipos.forEach((e) => {
    const nota = CORRECCIONES_COMENTARIO_USO[e.id];
    if (!nota || (e.comentarios || "").includes(nota)) return;
    e.comentarios = nota;
    cambio = true;
  });
  return cambio;
}

const CORRECCIONES_TIPO_EQUIPO = {
  "seed-598": "Mini PC",
  "seed-800": "Mini PC",
  "pendiente-mj0h51jj": "Mini PC",
};

function corregirTipoEquipoMalClasificado() {
  // PCLNV087 y UNIFILARDELCAMPO son ThinkCentre M70q/M75q Gen 2 (linea "Tiny"
  // de Lenovo, un Mini PC), y PENDIENTE-MJ0H51JJ es el mismo modelo segun su
  // comentario, pero los 3 estaban clasificados como Desktop. Forzamos la
  // correccion aunque el campo ya tenga un valor guardado. No se toca
  // ultimaModificacion ni se empuja a Firestore (ver nota en
  // quitarMarcaRevisionConfirmados): un registro como PENDIENTE-MJ0H51JJ
  // puede haberse completado con datos reales en otro navegador, y forzar
  // aqui una fecha "reciente" le haria ganar a esa edicion real y borrarla.
  let cambio = false;
  equipos.forEach((e) => {
    const nuevo = CORRECCIONES_TIPO_EQUIPO[e.id];
    if (!nuevo || (e.tipoEquipo || "").trim() === nuevo) return;
    e.tipoEquipo = nuevo;
    cambio = true;
  });
  return cambio;
}

function corregirSerialesTipeados() {
  // PCLNV125 y PCLNV228 se capturaron con el serial mal digitado, por lo que
  // nunca coincidieron con su contrato al importar. Forzamos la corrección
  // aunque el campo ya tenga un valor guardado.
  const CORRECCIONES = {
    PCLNV125: { viejo: "MJH051N0", nuevo: "MJ0H51N0" },
    PCLNV228: { viejo: "MZ01XHXH", nuevo: "MZ01XHX" },
  };
  let cambio = false;
  equipos.forEach((e) => {
    const c = CORRECCIONES[(e.nombreRed || "").trim()];
    if (c && (e.numeroSerial || "").trim() === c.viejo) {
      e.numeroSerial = c.nuevo;
      cambio = true;
    }
  });
  return cambio;
}

function limpiarPendientesDuplicados() {
  // Un "PENDIENTE-<serie>" que se agregó automáticamente puede resultar ser el
  // mismo equipo físico que un registro real que el usuario ya tenía capturado
  // con nombre propio (por ejemplo, un equipo dado de alta antes de importar
  // contratos). Si comparten número de serial, nos quedamos con el real.
  const seriesReales = new Set(
    equipos
      .filter((e) => nonEmpty(e.numeroSerial) && !(e.nombreRed || "").startsWith("PENDIENTE-"))
      .map((e) => e.numeroSerial.trim().toUpperCase())
  );
  const antes = equipos.length;
  equipos = equipos.filter((e) => {
    const esPendiente = (e.nombreRed || "").startsWith("PENDIENTE-");
    const serial = (e.numeroSerial || "").trim().toUpperCase();
    return !(esPendiente && serial && seriesReales.has(serial));
  });
  return equipos.length !== antes;
}

function corregirFechaContrato8030028059() {
  // El contrato 8030028059 se guardó una vez con una fecha de vencimiento
  // equivocada (30/10/2029) antes de corregirla a la real (01/01/2027).
  // Forzamos la corrección aunque el campo ya tenga un valor guardado.
  const VIEJO = "8030028059 (vence 30/10/2029)";
  const NUEVO = "8030028059 (vence 01/01/2027)";
  let cambio = false;
  equipos.forEach((e) => {
    if ((e.contratos || "").trim() === VIEJO) {
      e.contratos = NUEVO;
      cambio = true;
    }
  });
  return cambio;
}

function sincronizarComentariosCronograma() {
  // La marca "Pendiente validar: no aparece en el cronograma..." se agregó a
  // SEED_DATA después de que muchos navegadores ya tenían su propia copia en
  // localStorage, así que nunca la recibieron. La sincronizamos anexándola
  // al comentario existente, sin pisar nada que el usuario haya escrito. No
  // se toca ultimaModificacion ni se empuja a Firestore: forzar una fecha
  // "reciente" podia hacer que una copia local vieja le gane en la fusion a
  // una edicion real mas nueva de ese mismo equipo (le paso a
  // PENDIENTE-MJ0H51JJ), borrando esa informacion.
  if (typeof SEED_DATA === "undefined" || !Array.isArray(SEED_DATA)) return false;
  const MARCA_CRONOGRAMA = "Pendiente validar: no aparece en el cronograma de migracion AD 2026; posible equipo sin dar de baja.";
  const idsConMarca = new Set(
    SEED_DATA.filter((s) => (s.comentarios || "").includes(MARCA_CRONOGRAMA)).map((s) => s.id)
  );
  let cambio = false;
  equipos.forEach((e) => {
    if (!idsConMarca.has(e.id)) return;
    const actual = (e.comentarios || "").trim();
    if (actual.includes(MARCA_CRONOGRAMA)) return;
    e.comentarios = actual ? `${actual} | ${MARCA_CRONOGRAMA}` : MARCA_CRONOGRAMA;
    cambio = true;
  });
  return cambio;
}

function guardarDatos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(equipos));
}

/* ---------- Sincronización en línea (Firestore, ver firestore-sync.js) ---------- */
/* Estas funciones las usa firestore-sync.js para leer/reemplazar el arreglo
   "equipos" desde un módulo aparte, y para reflejar en línea cada cambio que
   se hace aquí, sin depender de que ese servicio esté disponible. */

function obtenerEquiposActuales() {
  return equipos;
}

function establecerEquiposDesdeSync(remotos) {
  // No reemplazamos sin más: si esta computadora tiene equipos que Firestore
  // todavía no conoce (porque se capturaron antes de sincronizar, o mientras
  // estaba sin internet), los conservamos y los subimos, en vez de perderlos.
  const remotosPorId = new Map(remotos.map((e) => [e.id, e]));
  const combinados = [];
  const idsVistos = new Set();

  equipos.forEach((local) => {
    idsVistos.add(local.id);
    const remoto = remotosPorId.get(local.id);
    if (!remoto || (local.ultimaModificacion || "") > (remoto.ultimaModificacion || "")) {
      combinados.push(local);
      sincronizarEquipo(local);
    } else {
      combinados.push(remoto);
    }
  });

  remotos.forEach((remoto) => {
    if (!idsVistos.has(remoto.id)) combinados.push(remoto);
  });

  equipos = combinados;
  eliminarDuplicadoP025194();
  eliminarChatarraConfirmada();
  quitarMarcaRevisionConfirmados();
  corregirEmpresasMalCapturadas();
  corregirTipoEquipoMalClasificado();
  corregirComentariosUsoRiolsa();
  guardarDatos();
  poblarFiltrosYDatalists();
  render();
  refrescarVistasSecundarias();
}

function sincronizarEquipo(equipo) {
  if (window.FirestoreSync && typeof window.FirestoreSync.guardarEquipo === "function") {
    window.FirestoreSync.guardarEquipo(equipo);
  }
}

function sincronizarEliminacion(id) {
  if (window.FirestoreSync && typeof window.FirestoreSync.eliminarEquipo === "function") {
    window.FirestoreSync.eliminarEquipo(id);
  }
}

/* ---------- Exportar / Importar datos entre computadoras ---------- */
/* Los datos viven en el localStorage de cada navegador, así que lo que se
   captura en una computadora no aparece en otra automáticamente. Estas
   funciones permiten mover manualmente esa información entre equipos. */

function exportarDatosJSON() {
  const blob = new Blob([JSON.stringify(equipos, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const fecha = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `Inventario_TI_backup_${fecha}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importarDatosJSON(archivo) {
  const lector = new FileReader();
  lector.onload = () => {
    let importados;
    try {
      importados = JSON.parse(lector.result);
    } catch (err) {
      alert("El archivo no es un JSON válido de este sistema.");
      return;
    }
    if (!Array.isArray(importados)) {
      alert("El archivo no tiene el formato esperado (debe ser el exportado desde este mismo programa).");
      return;
    }

    const porId = new Map(equipos.map((e) => [e.id, e]));
    let nuevos = 0;
    let actualizados = 0;
    importados.forEach((imp) => {
      if (!imp || !imp.id) return;
      const local = porId.get(imp.id);
      if (!local) {
        equipos.push(imp);
        porId.set(imp.id, imp);
        nuevos++;
        sincronizarEquipo(imp);
      } else if ((imp.ultimaModificacion || "") > (local.ultimaModificacion || "")) {
        Object.assign(local, imp);
        actualizados++;
        sincronizarEquipo(local);
      }
    });

    guardarDatos();
    poblarFiltrosYDatalists();
    render();
    refrescarVistasSecundarias();
    alert(`Importación completa: ${nuevos} equipo(s) nuevo(s), ${actualizados} actualizado(s).`);
  };
  lector.readAsText(archivo);
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
    "dl-usuarioDominio": "usuarioDominio",
    "dl-nombreRedEquipo": "nombreRed",
    "dl-modelo": "modelo",
    "dl-numeroSerial": "numeroSerial",
    "dl-correo": "correo",
    "dl-dpi": "dpi",
    "dl-dominio": "dominio",
    "dl-monitor": "monitor",
    "dl-tamanoDisco": "tamanoDisco",
    "dl-datosImpresora": "datosImpresora",
    "dl-serialImpresora": "serialImpresora",
    "dl-tipoImpresora": "tipoImpresora",
    "dl-nombreDispositivo": "nombreDispositivo",
    "dl-serialDispositivo": "serialDispositivo",
    "dl-contratos": "contratos",
    "dl-numeroInventario": "numeroInventario",
    "dl-procesador": "procesador",
    "dl-memoria": "memoria",
    "dl-tipoDisco": "tipoDisco",
    "dl-firmwareInventario": "firmwareInventario",
    "dl-soVersion": "soVersion",
    "dl-soNucleo": "soNucleo",
    "dl-soSerial": "soSerial",
    "dl-subentidades": "subentidades",
    "dl-proyecto": "proyecto",
    "dl-puesto": "puesto",
    "dl-codigoRam": "codigoRam",
    "dl-memoriaDescripcion": "memoriaDescripcion",
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

  ["dl-nombreRedActa", "dl-nombreRedIngreso"].forEach((dlId) => {
    const dlNombreRed = $(dlId);
    dlNombreRed.innerHTML = "";
    valoresUnicos("nombreRed").forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      dlNombreRed.appendChild(opt);
    });
  });
}

function esc(v) {
  return v && String(v).trim() !== "" ? v : "N/A";
}

function enlaceIp(ip) {
  const v = (ip || "").trim();
  if (!v || !/^\d{1,3}(\.\d{1,3}){3}$/.test(v)) return esc(ip);
  return `<a href="http://${v}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">${v}</a>`;
}

function nonEmpty(v) {
  return v && String(v).trim() !== "" && String(v).trim().toUpperCase() !== "N/A";
}

function coincideTexto(e, texto) {
  if (!texto) return true;
  const campos = [
    "nombreRed", "nombreEmpleado", "correo", "empresa", "departamento",
    "modelo", "numeroSerial", "numeroInventario", "ubicaciones",
    "fabricante", "usuarioDominio", "codigoEmpleado", "dpi", "idGlpi", "uuid", "contratos",
  ];
  const haystack = campos.map((c) => e[c] || "").join(" ").toLowerCase();
  return haystack.includes(texto);
}

let filtroCampoVacio = null;
let filtroEnRevision = false;
let filtroPropios = false;

function obtenerFiltrados() {
  const texto = $("buscador").value.trim().toLowerCase();
  const empresa = $("filtroEmpresa").value;
  const status = $("filtroStatus").value;
  const tipo = $("filtroTipo").value;

  return equipos.filter((e) => {
    if (filtroEnRevision && !esEnRevisionCronograma(e)) return false;
    if (filtroPropios && (esServidor(e) || esEnRevisionCronograma(e) || nonEmpty(e.contratos))) return false;
    if (filtroCampoVacio && nonEmpty(e[filtroCampoVacio])) return false;
    if ((filtroCampoVacio === "empresa" || filtroCampoVacio === "status") && esServidor(e)) return false;
    if (empresa && e.empresa !== empresa) return false;
    if (status && e.status !== status) return false;
    if (tipo) {
      const grupoTipo = tipo === "Notebook" ? ["Notebook", "Laptop"] : [tipo];
      if (!grupoTipo.includes(e.tipoEquipo)) return false;
    }
    return coincideTexto(e, texto);
  });
}

const NOMBRES_CAMPO_VACIO = {
  empresa: "Empresa", status: "Status", tipoEquipo: "Tipo de Equipo", fabricante: "Fabricante",
};

function render() {
  const avisoVacio = $("filtroVacioAviso");
  if (filtroEnRevision) {
    avisoVacio.textContent = `Mostrando los ${equipos.filter(esEnRevisionCronograma).length} equipos en revisión (no aparecen en el cronograma de migración AD 2026; valida si ya fueron dados de baja y no se quitaron del sistema). Haz clic aquí para quitar este filtro.`;
    avisoVacio.style.display = "";
  } else if (filtroPropios) {
    avisoVacio.textContent = `Mostrando equipos propios (sin contrato de renta activo). Haz clic aquí para quitar este filtro.`;
    avisoVacio.style.display = "";
  } else if (filtroCampoVacio) {
    avisoVacio.textContent = `Mostrando equipos sin dato de ${NOMBRES_CAMPO_VACIO[filtroCampoVacio] || filtroCampoVacio}. Haz clic aquí para quitar este filtro.`;
    avisoVacio.style.display = "";
  } else {
    avisoVacio.style.display = "none";
  }

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

  if ($("vista-computadoras").classList.contains("vista-active")) {
    $("contadorTotal").textContent = `${filtrados.length} equipo(s)`;
  }
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
    if (!$("idGlpi").value.trim()) {
      $("idGlpi").value = siguienteIdGlpi();
    }
    $("btnEliminarModal").style.display = "";
  } else {
    $("modalTitulo").textContent = "Nuevo equipo";
    $("id").value = "";
    $("entidad").value = "Root Entity";
    $("status").value = "Asignada";
    $("idGlpi").value = siguienteIdGlpi();
    $("btnEliminarModal").style.display = "none";
  }
  $("nombreRedAviso").style.display = "none";
  $("modalOverlay").classList.add("open");
}

function cerrarModal() {
  $("modalOverlay").classList.remove("open");
}

function equipoDuplicadoPorNombreRed(nombre, idActual) {
  const n = (nombre || "").trim().toLowerCase();
  if (!n) return null;
  return equipos.find((e) => e.id !== idActual && (e.nombreRed || "").trim().toLowerCase() === n) || null;
}

function onCambioNombreRedEquipo() {
  const aviso = $("nombreRedAviso");
  const idActual = $("id").value;
  const encontrado = equipoDuplicadoPorNombreRed($("nombreRed").value, idActual);

  if (encontrado) {
    // Ya existe ese equipo: cargamos todos sus datos y pasamos a modo edición sobre ese registro.
    FIELD_IDS.forEach((f) => {
      if (encontrado[f] !== undefined) $(f).value = encontrado[f];
    });
    if (!$("idGlpi").value.trim()) {
      $("idGlpi").value = siguienteIdGlpi();
    }
    $("modalTitulo").textContent = `Editar equipo — ${encontrado.nombreRed || ""}`;
    $("btnEliminarModal").style.display = "";
    aviso.textContent = `Se cargaron los datos del equipo existente (${encontrado.empresa || "N/A"} · ${encontrado.nombreEmpleado || "sin usuario"}). Revisa/edita lo que necesites y da clic en Guardar.`;
    aviso.className = "acta-estado";
    aviso.style.display = "";
  } else {
    aviso.style.display = "none";
    aviso.textContent = "";
  }
}

function onSubmit(e) {
  e.preventDefault();
  const data = {};
  FIELD_IDS.forEach((f) => (data[f] = $(f).value.trim()));

  if (equipoDuplicadoPorNombreRed(data.nombreRed, data.id)) {
    alert("Ya existe otro equipo con este Nombre en Red. Cambia el nombre o busca y edita el equipo existente en vez de crear uno duplicado.");
    return;
  }

  data.ultimaModificacion = new Date().toISOString().slice(0, 16);

  let guardado;
  if (data.id) {
    const idx = equipos.findIndex((eq) => eq.id === data.id);
    if (idx !== -1) equipos[idx] = { ...equipos[idx], ...data };
    guardado = equipos[idx];
  } else {
    data.id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    equipos.push(data);
    guardado = data;
  }
  guardarDatos();
  sincronizarEquipo(guardado);
  cerrarModal();
  poblarFiltrosYDatalists();
  render();
  refrescarVistasSecundarias();
}

function eliminarActual() {
  const id = $("id").value;
  if (!id) return;
  if (!confirm("¿Eliminar este registro de forma permanente?")) return;
  equipos = equipos.filter((e) => e.id !== id);
  guardarDatos();
  sincronizarEliminacion(id);
  cerrarModal();
  poblarFiltrosYDatalists();
  render();
  refrescarVistasSecundarias();
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

function siguienteIdGlpi() {
  const max = equipos.reduce((acc, e) => {
    const n = parseInt((e.idGlpi || "").trim(), 10);
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 0);
  return String(max + 1);
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

function firmaTecnicoPara(nombre) {
  const n = (nombre || "").trim().toLowerCase();
  if (n === "victor morales" && typeof FIRMA_TECNICO_B64 !== "undefined") return FIRMA_TECNICO_B64;
  if (n === "eder rosales" && typeof FIRMA_EDER_B64 !== "undefined") return FIRMA_EDER_B64;
  return "";
}

function formatearFechaSimple(valor) {
  if (!valor) return "N/A";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(valor).trim());
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  return valor;
}

function actaHTML(equipo, transaccion) {
  const declarante = transaccion.declarante || equipo.nombreEmpleado || "___________________________";
  const accion = transaccion.accion === "Devolucion" ? "Devuelvo" : "Recibo";

  return `
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
          ${filaActa("Contratos:", soloNumeroContrato(equipo.contratos))}
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
            <p>Yo, <strong class="destacado">${esc(declarante)}</strong> declaro que:</p>
            <ul>
              <li><strong>a.</strong> ${accion} el equipo de cómputo consistente <strong class="destacado">${esc(equipo.nombreRed)}</strong> en perfecto estado de funcionamiento y en buen estado de conservación, sin golpes que impidan su buen funcionamiento.</li>
              <li><strong>b.</strong> Me hago responsable de darle a este equipo únicamente el uso profesional que mi puesto de trabajo requiere.</li>
              <li><strong>c.</strong> Utilizaré este equipo con el debido cuidado en su manejo, tanto en el hardware como en el software, no navegando ni descargando archivos, aplicaciones o páginas cuya naturaleza no tenga relación con el puesto laboral que desempeño.</li>
              <li><strong>d.</strong> Conozco que este equipo tiene un seguro con cobertura básica, pensada en el uso profesional y prudente del mismo en relación a mi puesto de trabajo, y por lo tanto indemnizaré personal.</li>
            </ul>
            ${transaccion.observaciones ? `<p><strong>Observaciones:</strong> ${transaccion.observaciones}</p>` : ""}

            <div class="firmas">
              <div class="firma-bloque">
                ${firmaTecnicoPara(transaccion.tecnico) ? `<img class="firma-img" src="${firmaTecnicoPara(transaccion.tecnico)}" alt="Firma técnico">` : ""}
                <div class="firma-linea">${esc(transaccion.tecnico)}<br>Nombre y firma de Técnico de Soporte</div>
              </div>
              <div><div class="firma-linea">Nombre y firma de Usuario</div></div>
            </div>
            <div class="firmas">
              <div></div>
              <div class="firma-bloque">
                ${typeof FIRMA_JEFE_B64 !== "undefined" ? `<img class="firma-img" src="${FIRMA_JEFE_B64}" alt="Firma jefe de operaciones">` : ""}
                <div class="firma-linea">${esc(transaccion.jefe)}<br>Nombre y firma de Jefe de Operaciones TI</div>
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
}

function renderActa(equipo, transaccion) {
  $("printArea").innerHTML = actaHTML(equipo, transaccion);
  window.print();
}

function imprimirDesdeEdicion() {
  const equipo = {};
  FIELD_IDS.forEach((f) => (equipo[f] = $(f).value.trim()));
  renderActa(equipo, {
    accion: (equipo.status || "").toLowerCase().includes("devol") ? "Devolucion" : "Entrega",
    declarante: equipo.nombreEmpleado,
    tecnico: TECNICO_ACTUAL || "Sin identificar",
    jefe: "Gustavo Garcia",
    observaciones: equipo.comentarios || "",
    numeroForma: siguienteNumeroForma(),
  });
}

/* ---------- Generación de la Tarjeta de Responsabilidad (Nuevo Ingreso) ---------- */

function soloNumeroContrato(valor) {
  if (!valor) return valor;
  return String(valor).trim().split(/\s*\(/)[0].trim();
}

function fechaLarga(valor) {
  if (!valor) return "N/A";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(valor).trim());
  if (!m) return valor;
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return `${parseInt(m[3], 10)} de ${MESES[parseInt(m[2], 10) - 1]} de ${m[1]}`;
}

function tarjetaHTML(equipo, transaccion) {
  const esDesktop = equipo.tipoEquipo === "Desktop";
  const colDescripcion = esDesktop ? "DESCRIPCION DESKTOP - MONITOR" : "DESCRIPCION LAPTOP";
  const colSerial = esDesktop ? "S/N DESKTOP" : "S/N LAPTOP";
  const colAccesorio = esDesktop ? "S/N MONITOR" : "CODIGO RAM";
  const valorAccesorio = esDesktop ? equipo.monitor : equipo.codigoRam;

  return `
    <div class="tarjeta">
      <div class="tarjeta-titulo">TARJETA DE RESPONSABILIDAD</div>

      <table class="tarjeta-info">
        <tr>
          <td class="tlabel">NOMBRE:</td><td class="tvalue">${esc(equipo.nombreEmpleado)}</td>
          <td class="tlabel">DEPARTAMENTO:</td><td class="tvalue">${esc(equipo.departamento)}</td>
        </tr>
        <tr>
          <td class="tlabel">PUESTO:</td><td class="tvalue">${esc(equipo.puesto)}</td>
          <td class="tlabel">AREA:</td><td class="tvalue">${esc(equipo.unidadNegocio)}</td>
        </tr>
        <tr>
          <td class="tlabel">AGENCIA:</td><td class="tvalue plano">${esc(equipo.ubicaciones)}</td>
          <td class="tlabel">CODIGO SAP:</td><td class="tvalue plano">${esc(equipo.codigoEmpleado)}</td>
        </tr>
        <tr>
          <td class="tlabel">FECHA DE INGRESO:</td><td class="tvalue plano subrayado">${fechaLarga(equipo.fechaIngresoEquipo)}</td>
          <td class="tlabel">CONTRATO:</td><td class="tvalue plano">${esc(soloNumeroContrato(equipo.contratos))}</td>
        </tr>
      </table>

      <p class="tarjeta-clausula">
        La entidad <span class="tvalue-inline">_____________Tecnoelect___________________</span> hace entrega al trabajador de bienes del inventario
        propiedad de la empresa que aparece marcado con una X del listado abajo enumerado, el cual le es confiado para que sea
        utilizado exclusivamente para la ejecución de su trabajo en calidad de depósito estando obligado por ende a rendir
        cuentas de su uso así como a devolverlo en cualquier momento a su requerimiento, aceptando el trabajador que la
        inobservancia a lo antes estipulado, constituirá falta, sujeta a la aplicación de medidas disciplinarias, sin perjuicio
        de las demás responsabilidades, civiles, penales y de cualquier otra índole, en las que pueda incurrir el trabajador
        por incumplimiento de lo antes estipulado.
      </p>

      <table class="tarjeta-tabla">
        <thead>
          <tr><th>CANTIDAD</th><th>${colDescripcion}</th><th>${colSerial}</th><th>${colAccesorio}</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td class="tvalue">${esc(equipo.modelo)}</td>
            <td class="tvalue">${esc(equipo.numeroSerial)}</td>
            <td class="tvalue">${!esDesktop ? "" : esc(valorAccesorio)}</td>
          </tr>
          <tr>
            <td></td>
            <td class="tvalue">${nonEmpty(equipo.memoriaDescripcion) ? esc(equipo.memoriaDescripcion) : ""}</td>
            <td></td>
            <td class="tvalue">${esDesktop ? "" : esc(valorAccesorio)}</td>
          </tr>
          <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
          <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
        </tbody>
      </table>

      <table class="tarjeta-pie">
        <tr>
          <td class="tarjeta-pie-firma">FIRMA: <span class="linea-firma"></span></td>
          <td></td>
        </tr>
        <tr>
          <td class="tlabel">DPI: <span class="tvalue">${esc(equipo.dpi)}</span></td>
          <td></td>
        </tr>
        <tr>
          <td class="tlabel">Activo Fijo: <span class="tvalue">${esc(equipo.numeroInventario)}</span></td>
          <td></td>
        </tr>
        <tr>
          <td class="tlabel">Fecha de Entrega: <span class="tvalue subrayado">${fechaLarga(transaccion.fechaEntrega)}</span></td>
          <td class="tarjeta-pie-entrego">Entrego: <span class="tvalue subrayado">${esc(transaccion.tecnico)}</span></td>
        </tr>
      </table>
    </div>
  `;
}

/* ---------- Modal "Generar Acta" ---------- */

function abrirModalActa() {
  poblarFiltrosYDatalists();
  $("actaNombreRed").value = "";
  $("actaAccion").value = "Entrega";
  $("actaDeclarante").value = "";
  $("actaObservaciones").value = "";
  $("actaTecnico").value = TECNICO_ACTUAL || "Sin identificar";
  $("actaJefe").value = "Gustavo Garcia";
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
    if ((equipo.status || "").toLowerCase().includes("devol")) $("actaAccion").value = "Devolucion";
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

/* ---------- Modal "Nuevo Ingreso" (recepción de equipo de bodega) ---------- */

const CAMPOS_INGRESO_EQUIPO = {
  ingresoNombreRed: "nombreRed",
  ingresoTipoEquipo: "tipoEquipo",
  ingresoFabricante: "fabricante",
  ingresoModelo: "modelo",
  ingresoContrato: "contratos",
  ingresoSerial: "numeroSerial",
  ingresoInventario: "numeroInventario",
  ingresoMemoria: "memoria",
  ingresoMonitor: "monitor",
  ingresoCodigoRam: "codigoRam",
  ingresoMemoriaDescripcion: "memoriaDescripcion",
  ingresoNombreEmpleado: "nombreEmpleado",
  ingresoPuesto: "puesto",
  ingresoDepartamento: "departamento",
  ingresoArea: "unidadNegocio",
  ingresoEmpresa: "empresa",
  ingresoAgencia: "ubicaciones",
  ingresoCodigoSap: "codigoEmpleado",
  ingresoDpi: "dpi",
  ingresoFechaIngresoEquipo: "fechaIngresoEquipo",
};

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

function abrirModalIngreso() {
  poblarFiltrosYDatalists();
  Object.keys(CAMPOS_INGRESO_EQUIPO).forEach((id) => ($(id).value = ""));
  $("ingresoFabricante").value = "LENOVO";
  $("ingresoAgencia").value = "Bodega 2";
  $("ingresoFechaEntrega").value = hoyISO();
  $("ingresoTecnico").value = TECNICO_ACTUAL || "Sin identificar";
  $("ingresoObservaciones").value = "";
  $("ingresoEstado").textContent = "Escribe el Nombre en Red: si ya existe en el inventario se actualizará, si no, se creará como equipo nuevo.";
  $("ingresoEstado").className = "acta-estado";
  $("modalIngresoOverlay").classList.add("open");
  $("ingresoNombreRed").focus();
}

function cerrarModalIngreso() {
  $("modalIngresoOverlay").classList.remove("open");
}

function onCambioNombreRedIngreso() {
  const equipo = buscarEquipoPorNombreRed($("ingresoNombreRed").value);
  if (equipo) {
    Object.entries(CAMPOS_INGRESO_EQUIPO).forEach(([campoId, campoEquipo]) => {
      if (campoId === "ingresoNombreRed" || campoId === "ingresoAgencia") return;
      $(campoId).value = equipo[campoEquipo] || "";
    });
    $("ingresoEstado").textContent = `Ya existe un equipo con este Nombre en Red (${equipo.empresa || "N/A"} · ${equipo.status || "N/A"}). Se cargaron sus datos actuales; edita solo lo que cambió.`;
    $("ingresoEstado").className = "acta-estado";
  } else if ($("ingresoNombreRed").value.trim()) {
    $("ingresoEstado").textContent = "No existe todavía: se creará como un equipo nuevo en el inventario.";
    $("ingresoEstado").className = "acta-estado";
  } else {
    $("ingresoEstado").textContent = "Escribe el Nombre en Red: si ya existe en el inventario se actualizará, si no, se creará como equipo nuevo.";
    $("ingresoEstado").className = "acta-estado";
  }
}

function generarIngresoCompleto() {
  const nombreRed = $("ingresoNombreRed").value.trim();
  const numeroSerial = $("ingresoSerial").value.trim();
  const nombreEmpleado = $("ingresoNombreEmpleado").value.trim();
  const dpi = $("ingresoDpi").value.trim();

  if (!nombreRed || !numeroSerial) {
    alert("Escribe al menos el Nombre en Red y el Número de Serial del equipo.");
    return;
  }
  if (!nombreEmpleado || !dpi) {
    alert("Escribe el nombre y el DPI de la persona que recibirá el equipo.");
    return;
  }

  let equipo = buscarEquipoPorNombreRed(nombreRed);
  const esNuevo = !equipo;
  if (!equipo) {
    equipo = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), entidad: "Root Entity" };
  }

  Object.entries(CAMPOS_INGRESO_EQUIPO).forEach(([campoId, campoEquipo]) => {
    equipo[campoEquipo] = $(campoId).value.trim();
  });
  equipo.status = equipo.status && !esNuevo ? equipo.status : "Nuevo > Asignado";
  equipo.comentarios = $("ingresoObservaciones").value.trim() || equipo.comentarios || "";
  equipo.ultimaModificacion = new Date().toISOString().slice(0, 16);

  if (esNuevo) {
    equipos.push(equipo);
  } else {
    const idx = equipos.findIndex((e) => e.id === equipo.id);
    if (idx !== -1) equipos[idx] = equipo;
  }
  guardarDatos();
  sincronizarEquipo(equipo);

  const tecnico = $("ingresoTecnico").value.trim();
  const transaccion = {
    accion: "Entrega",
    declarante: nombreEmpleado,
    tecnico,
    jefe: "Gustavo Garcia",
    observaciones: $("ingresoObservaciones").value.trim(),
    numeroForma: siguienteNumeroForma(),
    fechaEntrega: $("ingresoFechaEntrega").value,
  };

  $("printArea").innerHTML = `${actaHTML(equipo, transaccion)}${tarjetaHTML(equipo, transaccion)}`;
  window.print();

  cerrarModalIngreso();
  poblarFiltrosYDatalists();
  render();
  refrescarVistasSecundarias();
}

/* ---------- Navegación de vistas (sidebar) ---------- */

function refrescarVistasSecundarias() {
  renderTablero();
  vistaUsuarios.render();
  vistaMonitores.render();
  vistaCatalogoMonitores.render();
  vistaImpresoras.render();
  vistaCatalogoImpresoras.render();
  vistaDispositivos.render();
  vistaContratos.render();
}

function cambiarVista(nombre) {
  document.querySelectorAll(".vista").forEach((v) => v.classList.remove("vista-active"));
  const destino = $(`vista-${nombre}`);
  if (destino) destino.classList.add("vista-active");

  document.querySelectorAll(".nav-item").forEach((b) => b.classList.remove("active"));
  const boton = document.querySelector(`.nav-item[data-vista="${nombre}"]`);
  if (boton) {
    boton.classList.add("active");
    $("breadcrumbActual").textContent = boton.dataset.titulo || nombre;
  }

  if (nombre === "tablero") renderTablero();
  else if (nombre === "computadoras") render();
  else if (nombre === "usuarios") vistaUsuarios.render();
  else if (nombre === "monitores") {
    vistaMonitores.render();
    vistaCatalogoMonitores.render();
  }
  else if (nombre === "impresoras") {
    vistaImpresoras.render();
    vistaCatalogoImpresoras.render();
  }
  else if (nombre === "dispositivos") vistaDispositivos.render();
  else if (nombre === "contratos") vistaContratos.render();
}

document.querySelectorAll(".nav-item").forEach((btn) => {
  btn.addEventListener("click", () => cambiarVista(btn.dataset.vista));
});

/* ---------- Tablero ---------- */

const TIPOS_SERVIDOR = [
  "VMware", "Xen", "Hyper-V", "PRD-VIRTUAL", "DESA-VIRTUAL",
  "Rack Mount Chassis", "Main System Chassis",
];

function esServidor(e) {
  return TIPOS_SERVIDOR.includes((e.tipoEquipo || "").trim());
}

const MARCA_CRONOGRAMA = "no aparece en el cronograma de migracion AD";

function esEnRevisionCronograma(e) {
  return (e.comentarios || "").includes(MARCA_CRONOGRAMA);
}

const ALIAS_TIPO_EQUIPO = { Laptop: "Notebook" };

function contarPor(campo, { excluirServidores, soloServidores, excluirEnRevision, agruparTipoEquipo } = {}) {
  const conteo = {};
  equipos.forEach((e) => {
    if (excluirServidores && esServidor(e)) return;
    if (soloServidores && !esServidor(e)) return;
    if (excluirEnRevision && esEnRevisionCronograma(e)) return;
    let v = (e[campo] || "").trim() || "Sin dato";
    if (agruparTipoEquipo) v = ALIAS_TIPO_EQUIPO[v] || v;
    conteo[v] = (conteo[v] || 0) + 1;
  });
  return Object.entries(conteo).sort((a, b) => b[1] - a[1]);
}

function irAListaEquiposFiltrada(campo, valor) {
  $("buscador").value = "";
  $("filtroEmpresa").value = "";
  $("filtroStatus").value = "";
  $("filtroTipo").value = "";
  filtroCampoVacio = null;
  filtroEnRevision = false;
  filtroPropios = false;
  if (valor === "Sin dato") {
    filtroCampoVacio = campo;
  } else if (campo === "empresa") $("filtroEmpresa").value = valor;
  else if (campo === "status") $("filtroStatus").value = valor;
  else if (campo === "tipoEquipo") $("filtroTipo").value = valor;
  else $("buscador").value = valor;
  paginaActual = 1;
  cambiarVista("computadoras");
  render();
}

function irAEquiposPropios() {
  $("buscador").value = "";
  $("filtroEmpresa").value = "";
  $("filtroStatus").value = "";
  $("filtroTipo").value = "";
  filtroCampoVacio = null;
  filtroEnRevision = false;
  filtroPropios = true;
  paginaActual = 1;
  cambiarVista("computadoras");
  render();
}

function irARevisionCronograma() {
  $("buscador").value = "";
  $("filtroEmpresa").value = "";
  $("filtroStatus").value = "";
  $("filtroTipo").value = "";
  filtroCampoVacio = null;
  filtroEnRevision = true;
  filtroPropios = false;
  paginaActual = 1;
  cambiarVista("computadoras");
  render();
}

document.addEventListener("click", (ev) => {
  const fila = ev.target.closest(".tablero-fila[data-campo]");
  if (fila) irAListaEquiposFiltrada(fila.dataset.campo, fila.dataset.valor);
  if (ev.target.closest("#tarjetaEnRevision")) irARevisionCronograma();
  if (ev.target.closest("#tarjetaPropios")) irAEquiposPropios();
  if (ev.target.closest(".tablero-fila-secundaria")) irARevisionCronograma();
});

function renderTablero() {
  let cambioPurga = false;
  if (eliminarDuplicadoP025194()) cambioPurga = true;
  if (eliminarChatarraConfirmada()) cambioPurga = true;
  if (quitarMarcaRevisionConfirmados()) cambioPurga = true;
  if (corregirEmpresasMalCapturadas()) cambioPurga = true;
  if (corregirTipoEquipoMalClasificado()) cambioPurga = true;
  if (corregirComentariosUsoRiolsa()) cambioPurga = true;
  if (cambioPurga) guardarDatos();

  const equiposUsuario = equipos.filter((e) => !esServidor(e));
  const equiposUsuarioValidados = equiposUsuario.filter((e) => !esEnRevisionCronograma(e));

  const totalEmpresas = new Set(equiposUsuarioValidados.map((e) => (e.empresa || "").trim()).filter(Boolean)).size;
  const equiposLenovo = equiposUsuarioValidados.filter((e) => (e.fabricante || "").trim().toUpperCase() === "LENOVO").length;

  const propios = equiposUsuario.filter((e) => !nonEmpty(e.contratos));
  const propiosEnRevision = propios.filter(esEnRevisionCronograma).length;
  const equiposPropios = propios.length - propiosEnRevision;

  if ($("vista-tablero").classList.contains("vista-active")) {
    $("contadorTotal").textContent = `${equipos.length} equipo(s)`;
  }

  const impresoras = typeof CATALOGO_IMPRESORAS !== "undefined" && Array.isArray(CATALOGO_IMPRESORAS) ? CATALOGO_IMPRESORAS : [];
  const totalServidores = equipos.filter(esServidor).length;

  $("statCards").innerHTML = `
    <div class="stat-card"><div class="numero">${equiposUsuarioValidados.length}</div><div class="etiqueta">Equipos totales</div></div>
    <div class="stat-card"><div class="numero">${equiposLenovo}</div><div class="etiqueta">Equipos Lenovo</div></div>
    <div id="tarjetaPropios" class="stat-card clickable"><div class="numero">${equiposPropios}</div><div class="etiqueta">Equipos propios — clic para ver el listado</div></div>
    <div class="stat-card"><div class="numero">${totalEmpresas}</div><div class="etiqueta">Empresas</div></div>
    <div class="stat-card"><div class="numero">${impresoras.length}</div><div class="etiqueta">Impresoras Canon</div></div>
    <div class="stat-card"><div class="numero">${totalServidores}</div><div class="etiqueta">Servidores</div></div>
    <div id="tarjetaEnRevision" class="stat-card stat-card-secundaria clickable"><div class="numero">${propiosEnRevision}</div><div class="etiqueta">En revisión (no está en cronograma AD) — clic para revisar</div></div>
  `;

  const filaHtml = (nombre, cantidad, campo) => {
    const clickable = !!campo;
    const atributos = clickable ? ` data-campo="${campo}" data-valor="${String(nombre).replace(/"/g, "&quot;")}"` : "";
    return `<div class="tablero-fila${clickable ? " clickable" : ""}"${atributos}><span>${esc(nombre)}</span><span class="valor">${cantidad}</span></div>`;
  };

  const totalHtml = (total) => `<div class="tablero-total"><span>Total</span><span class="valor">${total}</span></div>`;

  const statusSinServidores = contarPor("status", { excluirServidores: true, excluirEnRevision: true });
  const totalStatusSinServidores = statusSinServidores.reduce((s, [, c]) => s + c, 0);
  $("tableroStatus").innerHTML =
    (statusSinServidores.slice(0, 8).map(([n, c]) => filaHtml(n, c, "status")).join("") || "<p>Sin datos.</p>") + totalHtml(totalStatusSinServidores);

  const empresaSinServidores = contarPor("empresa", { excluirServidores: true, excluirEnRevision: true });
  const totalSinServidores = empresaSinServidores.reduce((s, [, c]) => s + c, 0);
  $("tableroEmpresa").innerHTML =
    (empresaSinServidores.slice(0, 8).map(([n, c]) => filaHtml(n, c, "empresa")).join("") || "<p>Sin datos.</p>") + totalHtml(totalSinServidores);

  const tipoSinServidores = contarPor("tipoEquipo", { excluirServidores: true, excluirEnRevision: true, agruparTipoEquipo: true });
  $("tableroTipo").innerHTML =
    (tipoSinServidores.slice(0, 8).map(([n, c]) => filaHtml(n, c, "tipoEquipo")).join("") || "<p>Sin datos.</p>") + totalHtml(totalSinServidores);

  const fabricanteSinServidores = contarPor("fabricante", { excluirServidores: true, excluirEnRevision: true });
  $("tableroFabricante").innerHTML =
    (fabricanteSinServidores.slice(0, 8).map(([n, c]) => filaHtml(n, c, "fabricante")).join("") || "<p>Sin datos.</p>") + totalHtml(totalSinServidores);


  const servidorPorTipo = contarPor("tipoEquipo", { soloServidores: true });
  $("tableroServidoresTipo").innerHTML =
    servidorPorTipo.map(([n, c]) => filaHtml(n, c)).join("") + totalHtml(totalServidores);
  const servidorPorEmpresa = contarPor("empresa", { soloServidores: true });
  $("tableroServidoresEmpresa").innerHTML =
    servidorPorEmpresa.slice(0, 8).map(([n, c]) => filaHtml(n, c)).join("") + totalHtml(totalServidores);
  const servidorPorStatus = contarPor("status", { soloServidores: true });
  $("tableroServidoresStatus").innerHTML =
    servidorPorStatus.slice(0, 8).map(([n, c]) => filaHtml(n, c)).join("") + totalHtml(totalServidores);

  const contarImpresorasPor = (campo) => {
    const conteo = {};
    impresoras.forEach((p) => {
      const v = (p[campo] || "").trim() || "Sin dato";
      conteo[v] = (conteo[v] || 0) + 1;
    });
    return Object.entries(conteo).sort((a, b) => b[1] - a[1]);
  };

  const filaHtmlImpresora = (nombre, cantidad, campo) => {
    const atributos = ` data-campo-imp="${campo}" data-valor="${String(nombre).replace(/"/g, "&quot;")}"`;
    return `<div class="tablero-fila clickable"${atributos}><span>${esc(nombre)}</span><span class="valor">${cantidad}</span></div>`;
  };

  $("tableroImpresorasTipo").innerHTML =
    contarImpresorasPor("tipo").map(([n, c]) => filaHtmlImpresora(n, c, "tipo")).join("") || "<p>Sin datos.</p>";
  $("tableroImpresorasEmpresa").innerHTML =
    contarImpresorasPor("empresa").map(([n, c]) => filaHtmlImpresora(n, c, "empresa")).join("") || "<p>Sin datos.</p>";
  $("tableroImpresorasDepartamento").innerHTML =
    contarImpresorasPor("departamento").slice(0, 8).map(([n, c]) => filaHtmlImpresora(n, c, "departamento")).join("") || "<p>Sin datos.</p>";
}

function irACatalogoImpresorasFiltrado(campo, valor) {
  $("buscador_catalogoImpresoras").value = valor === "Sin dato" ? "" : valor;
  cambiarVista("impresoras");
  vistaCatalogoImpresoras.render();
}

document.addEventListener("click", (ev) => {
  const filaImp = ev.target.closest(".tablero-fila[data-campo-imp]");
  if (filaImp) irACatalogoImpresorasFiltrado(filaImp.dataset.campoImp, filaImp.dataset.valor);
});

function actualizarConteoRapido() {
  const original = $("conteoRapidoInput").value.trim();
  const texto = original.toLowerCase();
  const resultado = $("conteoRapidoResultado");
  if (!texto) {
    resultado.textContent = "";
    resultado.style.display = "none";
    return;
  }
  const coincidencias = equipos.filter((e) => (e.fabricante || "").toLowerCase().includes(texto));
  resultado.textContent = `${coincidencias.length} equipo(s) coinciden con "${original}" en Fabricante`;
  resultado.className = "acta-estado";
  resultado.style.display = "";
}

/* ---------- Vistas de listas derivadas (Usuarios / Monitores / Impresoras / Dispositivos) ---------- */

function crearVistaLista({ prefix, columnas, obtenerFilas, filtrar, alClicFila }) {
  let pagina = 1;
  function render() {
    const texto = $(`buscador_${prefix}`).value.trim().toLowerCase();
    const todas = obtenerFilas();
    const filtradas = texto ? todas.filter((f) => filtrar(f, texto)) : todas;
    const totalPag = Math.max(1, Math.ceil(filtradas.length / PAGE_SIZE));
    if (pagina > totalPag) pagina = totalPag;
    if (pagina < 1) pagina = 1;
    const inicio = (pagina - 1) * PAGE_SIZE;
    const pageItems = filtradas.slice(inicio, inicio + PAGE_SIZE);

    const tbody = $(`tbody_${prefix}`);
    tbody.innerHTML = "";
    if (pageItems.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${columnas}" class="empty-state">Sin resultados. Estos datos se completan al capturarlos en cada equipo.</td></tr>`;
    } else {
      pageItems.forEach((item) => {
        const tr = document.createElement("tr");
        tr.innerHTML = item.celdas;
        if (alClicFila) tr.addEventListener("click", () => alClicFila(item));
        tbody.appendChild(tr);
      });
    }

    $(`infoPagina_${prefix}`).textContent = `Página ${pagina} de ${totalPag} — ${filtradas.length} registro(s)`;
    const vistaAsociada = $(`vista-${prefix}`);
    if (vistaAsociada && vistaAsociada.classList.contains("vista-active")) {
      $("contadorTotal").textContent = `${filtradas.length} registro(s)`;
    }
    $(`btnPrimero_${prefix}`).disabled = pagina === 1;
    $(`btnAnterior_${prefix}`).disabled = pagina === 1;
    $(`btnSiguiente_${prefix}`).disabled = pagina === totalPag;
    $(`btnUltimo_${prefix}`).disabled = pagina === totalPag;
  }

  $(`buscador_${prefix}`).addEventListener("input", () => {
    pagina = 1;
    render();
  });
  $(`btnPrimero_${prefix}`).addEventListener("click", () => {
    pagina = 1;
    render();
  });
  $(`btnAnterior_${prefix}`).addEventListener("click", () => {
    pagina--;
    render();
  });
  $(`btnSiguiente_${prefix}`).addEventListener("click", () => {
    pagina++;
    render();
  });
  $(`btnUltimo_${prefix}`).addEventListener("click", () => {
    pagina = Math.max(1, Math.ceil(obtenerFilas().length / PAGE_SIZE));
    render();
  });

  return { render };
}

function obtenerUsuarios() {
  const mapa = new Map();
  equipos.forEach((e) => {
    if (!nonEmpty(e.nombreEmpleado) && !nonEmpty(e.usuarioDominio)) return;
    const clave = `${(e.nombreEmpleado || "").trim().toLowerCase()}|${(e.usuarioDominio || "").trim().toLowerCase()}`;
    if (!mapa.has(clave)) {
      mapa.set(clave, {
        nombreEmpleado: e.nombreEmpleado,
        usuarioDominio: e.usuarioDominio,
        correo: e.correo,
        empresa: e.empresa,
        departamento: e.departamento,
        equipos: [],
      });
    }
    mapa.get(clave).equipos.push(e.nombreRed);
  });
  return [...mapa.values()]
    .map((u) => ({
      ...u,
      celdas: `
        <td>${esc(u.nombreEmpleado)}</td>
        <td>${esc(u.usuarioDominio)}</td>
        <td>${esc(u.correo)}</td>
        <td>${esc(u.empresa)}</td>
        <td>${esc(u.departamento)}</td>
        <td>${u.equipos.filter(Boolean).join(", ") || "N/A"}</td>
      `,
    }))
    .sort((a, b) =>
      (a.nombreEmpleado || a.usuarioDominio || "").localeCompare(b.nombreEmpleado || b.usuarioDominio || "", "es")
    );
}

const vistaUsuarios = crearVistaLista({
  prefix: "usuarios",
  columnas: 6,
  obtenerFilas: obtenerUsuarios,
  filtrar: (u, t) =>
    [u.nombreEmpleado, u.usuarioDominio, u.correo, u.departamento, u.empresa].join(" ").toLowerCase().includes(t),
  alClicFila: (u) => {
    cambiarVista("computadoras");
    $("buscador").value = u.nombreEmpleado || u.usuarioDominio || "";
    paginaActual = 1;
    render();
  },
});

function obtenerMonitores() {
  return equipos
    .filter((e) => nonEmpty(e.monitor))
    .map((e) => ({
      equipo: e,
      celdas: `
        <td>${esc(e.monitor)}</td>
        <td>${esc(e.nombreRed)}</td>
        <td>${esc(e.nombreEmpleado)}</td>
        <td>${esc(e.empresa)}</td>
        <td>${esc(e.ubicaciones)}</td>
      `,
    }));
}

const vistaMonitores = crearVistaLista({
  prefix: "monitores",
  columnas: 5,
  obtenerFilas: obtenerMonitores,
  filtrar: (r, t) =>
    [r.equipo.monitor, r.equipo.nombreRed, r.equipo.nombreEmpleado, r.equipo.empresa].join(" ").toLowerCase().includes(t),
  alClicFila: (r) => abrirModal(r.equipo),
});

function obtenerCatalogoMonitores() {
  const lista = typeof CATALOGO_MONITORES !== "undefined" && Array.isArray(CATALOGO_MONITORES) ? CATALOGO_MONITORES : [];
  return lista.map((m) => ({
    monitor: m,
    celdas: `
      <td>${esc(m.serial)}</td>
      <td>${esc(m.modelo)}</td>
      <td>${esc(m.descripcion)}</td>
      <td>${esc(m.contrato)}</td>
      <td>${esc(m.fechaFin)}</td>
    `,
  }));
}

const vistaCatalogoMonitores = crearVistaLista({
  prefix: "catalogoMonitores",
  columnas: 5,
  obtenerFilas: obtenerCatalogoMonitores,
  filtrar: (r, t) => [r.monitor.serial, r.monitor.modelo, r.monitor.descripcion, r.monitor.contrato].join(" ").toLowerCase().includes(t),
});

function obtenerCatalogoImpresoras() {
  const lista = typeof CATALOGO_IMPRESORAS !== "undefined" && Array.isArray(CATALOGO_IMPRESORAS) ? CATALOGO_IMPRESORAS : [];
  return lista.map((p) => ({
    impresora: p,
    celdas: `
      <td>${esc(p.tipoEquipoImp)}</td>
      <td>${enlaceIp(p.ip)}</td>
      <td>${esc(p.gpr)}</td>
      <td>${esc(p.serial)}</td>
      <td>${esc(p.modelo)}</td>
      <td>${esc(p.tipo)}</td>
      <td>${esc(p.codigoPrinter)}</td>
      <td>${esc(p.departamento)}</td>
      <td>${esc(p.ubicacion)}</td>
      <td>${esc(p.empresa)}</td>
      <td>${esc(p.activoFijo)}</td>
    `,
  }));
}

const vistaCatalogoImpresoras = crearVistaLista({
  prefix: "catalogoImpresoras",
  columnas: 11,
  obtenerFilas: obtenerCatalogoImpresoras,
  filtrar: (r, t) =>
    [r.impresora.ip, r.impresora.serial, r.impresora.modelo, r.impresora.departamento, r.impresora.ubicacion, r.impresora.empresa, r.impresora.tipo]
      .join(" ")
      .toLowerCase()
      .includes(t),
});

function obtenerImpresoras() {
  return equipos
    .filter(
      (e) => nonEmpty(e.datosImpresora) || nonEmpty(e.serialImpresora) || nonEmpty(e.tipoImpresora) || nonEmpty(e.ipImpresora)
    )
    .map((e) => ({
      equipo: e,
      celdas: `
        <td>${esc(e.datosImpresora)}</td>
        <td>${esc(e.serialImpresora)}</td>
        <td>${esc(e.tipoImpresora)}</td>
        <td>${esc(e.ipImpresora)}</td>
        <td>${esc(e.nombreRed)}</td>
        <td>${esc(e.nombreEmpleado)}</td>
      `,
    }));
}

const vistaImpresoras = crearVistaLista({
  prefix: "impresoras",
  columnas: 6,
  obtenerFilas: obtenerImpresoras,
  filtrar: (r, t) =>
    [r.equipo.datosImpresora, r.equipo.serialImpresora, r.equipo.tipoImpresora, r.equipo.ipImpresora, r.equipo.nombreRed]
      .join(" ")
      .toLowerCase()
      .includes(t),
  alClicFila: (r) => abrirModal(r.equipo),
});

function obtenerDispositivos() {
  return equipos
    .filter((e) => nonEmpty(e.nombreDispositivo) || nonEmpty(e.serialDispositivo))
    .map((e) => ({
      equipo: e,
      celdas: `
        <td>${esc(e.nombreDispositivo)}</td>
        <td>${esc(e.serialDispositivo)}</td>
        <td>${esc(e.nombreRed)}</td>
        <td>${esc(e.nombreEmpleado)}</td>
        <td>${esc(e.empresa)}</td>
      `,
    }));
}

const vistaDispositivos = crearVistaLista({
  prefix: "dispositivos",
  columnas: 5,
  obtenerFilas: obtenerDispositivos,
  filtrar: (r, t) => [r.equipo.nombreDispositivo, r.equipo.serialDispositivo, r.equipo.nombreRed].join(" ").toLowerCase().includes(t),
  alClicFila: (r) => abrirModal(r.equipo),
});

function obtenerContratos() {
  return equipos
    .filter((e) => nonEmpty(e.contratos))
    .map((e) => ({
      equipo: e,
      celdas: `
        <td>${esc(e.contratos)}</td>
        <td>${esc(e.nombreRed)}</td>
        <td>${esc(e.nombreEmpleado)}</td>
        <td>${esc(e.empresa)}</td>
      `,
    }));
}

const vistaContratos = crearVistaLista({
  prefix: "contratos",
  columnas: 4,
  obtenerFilas: obtenerContratos,
  filtrar: (r, t) => [r.equipo.contratos, r.equipo.nombreRed, r.equipo.nombreEmpleado, r.equipo.empresa].join(" ").toLowerCase().includes(t),
  alClicFila: (r) => abrirModal(r.equipo),
});

$("btnNuevo").addEventListener("click", () => abrirModal(null));
$("btnSugerirIdGlpi").addEventListener("click", () => {
  $("idGlpi").value = siguienteIdGlpi();
});
$("nombreRed").addEventListener("input", onCambioNombreRedEquipo);
$("btnCerrarModal").addEventListener("click", cerrarModal);
$("btnCancelar").addEventListener("click", cerrarModal);
$("btnEliminarModal").addEventListener("click", eliminarActual);
$("btnImprimirDesdeModal").addEventListener("click", imprimirDesdeEdicion);
$("formEquipo").addEventListener("submit", onSubmit);

$("btnGenerarActa").addEventListener("click", abrirModalActa);
$("btnCerrarModalActa").addEventListener("click", cerrarModalActa);
$("btnCancelarActa").addEventListener("click", cerrarModalActa);
$("btnGenerarEImprimir").addEventListener("click", generarEImprimirActa);
$("actaNombreRed").addEventListener("input", onCambioNombreRedActa);

$("btnDashboard").addEventListener("click", () => {
  window.open("dashboard.html?v=20260811h", "dashboardInventarioTI", "width=1280,height=900,noopener");
});

$("btnNuevoIngreso").addEventListener("click", abrirModalIngreso);
$("btnCerrarModalIngreso").addEventListener("click", cerrarModalIngreso);
$("btnCancelarIngreso").addEventListener("click", cerrarModalIngreso);
$("btnGenerarIngreso").addEventListener("click", generarIngresoCompleto);
$("ingresoNombreRed").addEventListener("input", onCambioNombreRedIngreso);

$("conteoRapidoInput").addEventListener("input", actualizarConteoRapido);

$("filtroVacioAviso").addEventListener("click", () => { filtroCampoVacio = null; filtroEnRevision = false; filtroPropios = false; paginaActual = 1; render(); });

$("buscador").addEventListener("input", () => { filtroCampoVacio = null; filtroEnRevision = false; filtroPropios = false; paginaActual = 1; render(); });
$("filtroEmpresa").addEventListener("change", () => { filtroCampoVacio = null; filtroEnRevision = false; filtroPropios = false; paginaActual = 1; render(); });
$("filtroStatus").addEventListener("change", () => { filtroCampoVacio = null; filtroEnRevision = false; filtroPropios = false; paginaActual = 1; render(); });
$("filtroTipo").addEventListener("change", () => { filtroCampoVacio = null; filtroEnRevision = false; filtroPropios = false; paginaActual = 1; render(); });

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
renderTablero();
