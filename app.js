const STORAGE_KEY = "equiposTI_v2";
const CONTADOR_KEY = "actaContador_v1";
const IMPRESORAS_STORAGE_KEY = "impresorasTI_v1";
const CODIGOS_STORAGE_KEY = "codigosImpresionTI_v1";
const CONTRATOS_MOVILES_STORAGE_KEY = "contratosMovilesTI_v1";
const LINEAS_MOVILES_STORAGE_KEY = "lineasMovilesTI_v1";
const PAGE_SIZE = 50;

const $ = (id) => document.getElementById(id);

const IMPRESORA_FIELD_IDS = [
  "impId", "impTipo", "impTipoEquipoImp", "impModelo", "impSerial", "impIp",
  "impGpr", "impCodigoPrinter", "impEmpresa", "impDepartamento", "impUbicacion", "impActivoFijo",
];
const IMPRESORA_CAMPO_POR_ID = {
  impId: "id", impTipo: "tipo", impTipoEquipoImp: "tipoEquipoImp", impModelo: "modelo",
  impSerial: "serial", impIp: "ip", impGpr: "gpr", impCodigoPrinter: "codigoPrinter",
  impEmpresa: "empresa", impDepartamento: "departamento", impUbicacion: "ubicacion", impActivoFijo: "activoFijo",
};

const CODIGO_FIELD_IDS = ["codId", "codIdUsuario", "codNombre", "codClave", "codAgregadoPor"];
const CODIGO_CAMPO_POR_ID = {
  codId: "id", codIdUsuario: "idUsuario", codNombre: "nombre", codClave: "clave",
  codAgregadoPor: "agregadoPor",
};

const CONTRATO_MOVIL_FIELD_IDS = [
  "cmId", "cmOperador", "cmEmpresa", "cmNit", "cmRepresentanteLegal", "cmCategoriaCliente",
  "cmTipoGestion", "cmPlanContratado", "cmCantidadLineas", "cmPlazoContrato", "cmTotalMensual",
  "cmFechaFirma", "cmEjecutivoVentas", "cmObservaciones",
];
const CONTRATO_MOVIL_CAMPO_POR_ID = {
  cmId: "id", cmOperador: "operador", cmEmpresa: "empresa", cmNit: "nit",
  cmRepresentanteLegal: "representanteLegal", cmCategoriaCliente: "categoriaCliente",
  cmTipoGestion: "tipoGestion", cmPlanContratado: "planContratado", cmCantidadLineas: "cantidadLineas",
  cmPlazoContrato: "plazoContrato", cmTotalMensual: "totalMensual", cmFechaFirma: "fechaFirma",
  cmEjecutivoVentas: "ejecutivoVentas", cmObservaciones: "observaciones",
};

const LINEA_MOVIL_FIELD_IDS = [
  "lmId", "lmNumero", "lmModelo", "lmImei", "lmIccidEsn", "lmPlan", "lmTarifaPlan",
  "lmUsuarioAsignado", "lmCorreoCorporativo", "lmEmpresa", "lmEstado",
];
const LINEA_MOVIL_CAMPO_POR_ID = {
  lmId: "id", lmNumero: "numero", lmModelo: "modelo", lmImei: "imei", lmIccidEsn: "iccidEsn",
  lmPlan: "plan", lmTarifaPlan: "tarifaPlan", lmUsuarioAsignado: "usuarioAsignado",
  lmCorreoCorporativo: "correoCorporativo", lmEmpresa: "empresa", lmEstado: "estado",
};

let impresorasData = [];
let codigosData = [];
let contratosMovilesData = [];
let lineasMovilesData = [];

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

/* ---------- Catálogo de impresoras (editable, ver impresoras-sync.js) ---------- */

function cargarImpresoras() {
  const raw = localStorage.getItem(IMPRESORAS_STORAGE_KEY);
  if (raw) {
    try {
      impresorasData = JSON.parse(raw);
      return;
    } catch {
      impresorasData = [];
    }
  }
  // Primera vez que corre en este navegador: se siembra desde el catálogo
  // estático (impresoras.js) para no perder los datos que ya existían ahí.
  const semilla = typeof CATALOGO_IMPRESORAS !== "undefined" && Array.isArray(CATALOGO_IMPRESORAS) ? CATALOGO_IMPRESORAS : [];
  impresorasData = semilla.map((p, i) => ({ ...p, id: p.id || `semilla-${i}` }));
  guardarImpresoras();
}

function guardarImpresoras() {
  localStorage.setItem(IMPRESORAS_STORAGE_KEY, JSON.stringify(impresorasData));
}

function obtenerImpresorasActuales() {
  return impresorasData;
}

function establecerImpresorasDesdeSync(remotas) {
  const remotasPorId = new Map(remotas.map((p) => [p.id, p]));
  const combinadas = [];
  const idsVistos = new Set();

  impresorasData.forEach((local) => {
    idsVistos.add(local.id);
    const remota = remotasPorId.get(local.id);
    if (!remota || (local.ultimaModificacion || "") > (remota.ultimaModificacion || "")) {
      combinadas.push(local);
      sincronizarImpresora(local);
    } else {
      combinadas.push(remota);
    }
  });

  remotas.forEach((remota) => {
    if (!idsVistos.has(remota.id)) combinadas.push(remota);
  });

  impresorasData = combinadas;
  guardarImpresoras();
  poblarFiltrosYDatalists();
  refrescarVistasSecundarias();
}

function sincronizarImpresora(impresora) {
  if (window.FirestoreSyncImpresoras && typeof window.FirestoreSyncImpresoras.guardarImpresora === "function") {
    window.FirestoreSyncImpresoras.guardarImpresora(impresora);
  }
}

function sincronizarEliminacionImpresora(id) {
  if (window.FirestoreSyncImpresoras && typeof window.FirestoreSyncImpresoras.eliminarImpresora === "function") {
    window.FirestoreSyncImpresoras.eliminarImpresora(id);
  }
}

/* ---------- Códigos de usuario para impresión/escaneo/copia (ver codigos-impresion-sync.js) ---------- */
/* El ID de usuario y la clave NO son únicos por diseño (el mismo nombre puede
   tener varios registros con distinto ID/clave en el Excel de origen), así
   que se usa un "id" interno aparte para identificar cada registro. */

function cargarCodigos() {
  const raw = localStorage.getItem(CODIGOS_STORAGE_KEY);
  if (raw) {
    try {
      codigosData = JSON.parse(raw);
      return;
    } catch {
      codigosData = [];
    }
  }
  const semilla = typeof CATALOGO_CODIGOS_IMPRESION !== "undefined" && Array.isArray(CATALOGO_CODIGOS_IMPRESION) ? CATALOGO_CODIGOS_IMPRESION : [];
  codigosData = semilla.map((c, i) => ({ ...c, id: c.id || `semilla-${i}` }));
  guardarCodigos();
}

function guardarCodigos() {
  localStorage.setItem(CODIGOS_STORAGE_KEY, JSON.stringify(codigosData));
}

function obtenerCodigosActuales() {
  return codigosData;
}

function establecerCodigosDesdeSync(remotos) {
  const remotosPorId = new Map(remotos.map((c) => [c.id, c]));
  const combinados = [];
  const idsVistos = new Set();

  codigosData.forEach((local) => {
    idsVistos.add(local.id);
    const remoto = remotosPorId.get(local.id);
    if (!remoto || (local.ultimaModificacion || "") > (remoto.ultimaModificacion || "")) {
      combinados.push(local);
      sincronizarCodigo(local);
    } else {
      combinados.push(remoto);
    }
  });

  remotos.forEach((remoto) => {
    if (!idsVistos.has(remoto.id)) combinados.push(remoto);
  });

  codigosData = combinados;
  guardarCodigos();
  refrescarVistasSecundarias();
}

function sincronizarCodigo(codigo) {
  if (window.FirestoreSyncCodigos && typeof window.FirestoreSyncCodigos.guardarCodigo === "function") {
    window.FirestoreSyncCodigos.guardarCodigo(codigo);
  }
}

function sincronizarEliminacionCodigo(id) {
  if (window.FirestoreSyncCodigos && typeof window.FirestoreSyncCodigos.eliminarCodigo === "function") {
    window.FirestoreSyncCodigos.eliminarCodigo(id);
  }
}

/* ---------- Contratos móviles (ver contratos-moviles-sync.js) ---------- */

const SEMILLA_CONTRATOS_MOVILES = [
  {
    operador: "Claro", empresa: "GENERADORAL SOL, SOCIEDAD ANONIMA", nit: "8538380-5",
    representanteLegal: "ANDRE EMANUEL LARIOS MURALLES", categoriaCliente: "Corporaciones",
    tipoGestion: "Traspaso", planContratado: "G-EMPRESAS SMART 25GB", cantidadLineas: 6,
    plazoContrato: "18 meses", totalMensual: 1254.00, fechaFirma: "2026-07-22",
    ejecutivoVentas: "Marinez Cahuec", observaciones: "Traspaso y renovación",
  },
];

function cargarContratosMoviles() {
  const raw = localStorage.getItem(CONTRATOS_MOVILES_STORAGE_KEY);
  if (raw) {
    try {
      contratosMovilesData = JSON.parse(raw);
      return;
    } catch {
      contratosMovilesData = [];
    }
  }
  contratosMovilesData = SEMILLA_CONTRATOS_MOVILES.map((c, i) => ({ ...c, id: c.id || `semilla-cm-${i}` }));
  guardarContratosMoviles();
}

function guardarContratosMoviles() {
  localStorage.setItem(CONTRATOS_MOVILES_STORAGE_KEY, JSON.stringify(contratosMovilesData));
}

function obtenerContratosMovilesActuales() {
  return contratosMovilesData;
}

function establecerContratosMovilesDesdeSync(remotos) {
  const remotosPorId = new Map(remotos.map((c) => [c.id, c]));
  const combinados = [];
  const idsVistos = new Set();

  contratosMovilesData.forEach((local) => {
    idsVistos.add(local.id);
    const remoto = remotosPorId.get(local.id);
    if (!remoto || (local.ultimaModificacion || "") > (remoto.ultimaModificacion || "")) {
      combinados.push(local);
      sincronizarContratoMovil(local);
    } else {
      combinados.push(remoto);
    }
  });

  remotos.forEach((remoto) => {
    if (!idsVistos.has(remoto.id)) combinados.push(remoto);
  });

  contratosMovilesData = combinados;
  guardarContratosMoviles();
  poblarFiltrosYDatalists();
  refrescarVistasSecundarias();
}

function sincronizarContratoMovil(contrato) {
  if (window.FirestoreSyncContratosMoviles && typeof window.FirestoreSyncContratosMoviles.guardarContratoMovil === "function") {
    window.FirestoreSyncContratosMoviles.guardarContratoMovil(contrato);
  }
}

function sincronizarEliminacionContratoMovil(id) {
  if (window.FirestoreSyncContratosMoviles && typeof window.FirestoreSyncContratosMoviles.eliminarContratoMovil === "function") {
    window.FirestoreSyncContratosMoviles.eliminarContratoMovil(id);
  }
}

/* ---------- Control de líneas móviles (ver lineas-moviles-sync.js) ---------- */

const SEMILLA_LINEAS_MOVILES = [
  { numero: "50241760441", modelo: "SAMSUNG A 17 256GB", plan: "G-EMPRESAS SMART 25GB", tarifaPlan: 209, empresa: "GENERADORAL SOL, SOCIEDAD ANONIMA", estado: "Activa" },
  { numero: "50247396226", modelo: "SAMSUNG A 17 256GB", plan: "G-EMPRESAS SMART 25GB", tarifaPlan: 209, empresa: "GENERADORAL SOL, SOCIEDAD ANONIMA", estado: "Activa" },
  { numero: "50254111683", modelo: "SAMSUNG A 17 256GB", plan: "G-EMPRESAS SMART 25GB", tarifaPlan: 209, empresa: "GENERADORAL SOL, SOCIEDAD ANONIMA", estado: "Activa" },
  { numero: "50254111824", modelo: "SAMSUNG A 17 256GB", plan: "G-EMPRESAS SMART 25GB", tarifaPlan: 209, empresa: "GENERADORAL SOL, SOCIEDAD ANONIMA", estado: "Activa" },
  { numero: "50256942785", modelo: "SAMSUNG A 17 256GB", plan: "G-EMPRESAS SMART 25GB", tarifaPlan: 209, empresa: "GENERADORAL SOL, SOCIEDAD ANONIMA", estado: "Activa" },
  { numero: "50256968642", modelo: "SAMSUNG A 17 256GB", plan: "G-EMPRESAS SMART 25GB", tarifaPlan: 209, empresa: "GENERADORAL SOL, SOCIEDAD ANONIMA", estado: "Activa" },
];

function cargarLineasMoviles() {
  const raw = localStorage.getItem(LINEAS_MOVILES_STORAGE_KEY);
  if (raw) {
    try {
      lineasMovilesData = JSON.parse(raw);
      return;
    } catch {
      lineasMovilesData = [];
    }
  }
  lineasMovilesData = SEMILLA_LINEAS_MOVILES.map((l, i) => ({ ...l, id: l.id || `semilla-lm-${i}` }));
  guardarLineasMoviles();
}

function guardarLineasMoviles() {
  localStorage.setItem(LINEAS_MOVILES_STORAGE_KEY, JSON.stringify(lineasMovilesData));
}

function obtenerLineasMovilesActuales() {
  return lineasMovilesData;
}

function establecerLineasMovilesDesdeSync(remotas) {
  const remotasPorId = new Map(remotas.map((l) => [l.id, l]));
  const combinadas = [];
  const idsVistos = new Set();

  lineasMovilesData.forEach((local) => {
    idsVistos.add(local.id);
    const remota = remotasPorId.get(local.id);
    if (!remota || (local.ultimaModificacion || "") > (remota.ultimaModificacion || "")) {
      combinadas.push(local);
      sincronizarLineaMovil(local);
    } else {
      combinadas.push(remota);
    }
  });

  remotas.forEach((remota) => {
    if (!idsVistos.has(remota.id)) combinadas.push(remota);
  });

  lineasMovilesData = combinadas;
  guardarLineasMoviles();
  poblarFiltrosYDatalists();
  refrescarVistasSecundarias();
}

function sincronizarLineaMovil(linea) {
  if (window.FirestoreSyncLineasMoviles && typeof window.FirestoreSyncLineasMoviles.guardarLineaMovil === "function") {
    window.FirestoreSyncLineasMoviles.guardarLineaMovil(linea);
  }
}

function sincronizarEliminacionLineaMovil(id) {
  if (window.FirestoreSyncLineasMoviles && typeof window.FirestoreSyncLineasMoviles.eliminarLineaMovil === "function") {
    window.FirestoreSyncLineasMoviles.eliminarLineaMovil(id);
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

function valoresUnicosImpresoras(campo) {
  return [...new Set(impresorasData.map((p) => (p[campo] || "").trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "es")
  );
}

function valoresUnicosContratosMoviles(campo) {
  return [...new Set(contratosMovilesData.map((c) => (c[campo] || "").trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "es")
  );
}

function valoresUnicosLineasMoviles(campo) {
  return [...new Set(lineasMovilesData.map((l) => (l[campo] || "").trim()).filter(Boolean))].sort((a, b) =>
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

  const datalistMapImpresoras = {
    "dl-impTipoEquipoImp": "tipoEquipoImp",
    "dl-impModelo": "modelo",
    "dl-impEmpresa": "empresa",
    "dl-impDepartamento": "departamento",
    "dl-impUbicacion": "ubicacion",
  };
  Object.entries(datalistMapImpresoras).forEach(([dlId, campo]) => {
    const dl = $(dlId);
    dl.innerHTML = "";
    valoresUnicosImpresoras(campo).forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      dl.appendChild(opt);
    });
  });

  const datalistMapContratosMoviles = {
    "dl-cmOperador": "operador",
    "dl-cmEmpresa": "empresa",
    "dl-cmPlanContratado": "planContratado",
  };
  Object.entries(datalistMapContratosMoviles).forEach(([dlId, campo]) => {
    const dl = $(dlId);
    dl.innerHTML = "";
    valoresUnicosContratosMoviles(campo).forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      dl.appendChild(opt);
    });
  });

  const datalistMapLineasMoviles = {
    "dl-lmModelo": "modelo",
    "dl-lmPlan": "plan",
    "dl-lmUsuarioAsignado": "usuarioAsignado",
    "dl-lmEmpresa": "empresa",
  };
  Object.entries(datalistMapLineasMoviles).forEach(([dlId, campo]) => {
    const dl = $(dlId);
    dl.innerHTML = "";
    valoresUnicosLineasMoviles(campo).forEach((v) => {
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
let filtroLenovo = false;
let filtroRiolsaTodos = false;

function obtenerFiltrados() {
  const texto = $("buscador").value.trim().toLowerCase();
  const empresa = $("filtroEmpresa").value;
  const status = $("filtroStatus").value;
  const tipo = $("filtroTipo").value;

  return equipos.filter((e) => {
    if (filtroEnRevision && !esEnRevisionCronograma(e)) return false;
    if (filtroPropios && (esServidor(e) || esEnRevisionCronograma(e) || nonEmpty(e.contratos))) return false;
    if (filtroLenovo && (esServidor(e) || esEnRevisionCronograma(e) || (e.fabricante || "").trim().toUpperCase() !== "LENOVO")) return false;
    if (filtroRiolsaTodos && (esServidor(e) || (e.empresa || "").trim().toUpperCase() !== "RIOL S.A.")) return false;
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
  } else if (filtroLenovo) {
    avisoVacio.textContent = `Mostrando equipos Lenovo validados. Haz clic aquí para quitar este filtro.`;
    avisoVacio.style.display = "";
  } else if (filtroRiolsaTodos) {
    avisoVacio.textContent = `Mostrando equipos de RIOL S.A. Haz clic aquí para quitar este filtro.`;
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

/* ---------- Modal de impresoras (nueva / editar) ---------- */

function abrirModalImpresora(impresora) {
  $("formImpresora").reset();
  if (impresora) {
    $("modalImpresoraTitulo").textContent = `Editar impresora — ${impresora.modelo || impresora.serial || ""}`;
    IMPRESORA_FIELD_IDS.forEach((idCampo) => {
      const campo = IMPRESORA_CAMPO_POR_ID[idCampo];
      if (impresora[campo] !== undefined) $(idCampo).value = impresora[campo];
    });
    $("btnEliminarModalImpresora").style.display = "";
  } else {
    $("modalImpresoraTitulo").textContent = "Nueva impresora";
    $("impId").value = "";
    $("impTipo").value = "B/N";
    $("btnEliminarModalImpresora").style.display = "none";
  }
  $("modalImpresoraOverlay").classList.add("open");
}

function cerrarModalImpresora() {
  $("modalImpresoraOverlay").classList.remove("open");
}

function onSubmitImpresora(e) {
  e.preventDefault();
  const data = {};
  IMPRESORA_FIELD_IDS.forEach((idCampo) => {
    data[IMPRESORA_CAMPO_POR_ID[idCampo]] = $(idCampo).value.trim();
  });
  data.ultimaModificacion = new Date().toISOString().slice(0, 16);

  let guardada;
  if (data.id) {
    const idx = impresorasData.findIndex((p) => p.id === data.id);
    if (idx !== -1) impresorasData[idx] = { ...impresorasData[idx], ...data };
    guardada = impresorasData[idx];
  } else {
    data.id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    impresorasData.push(data);
    guardada = data;
  }
  guardarImpresoras();
  sincronizarImpresora(guardada);
  cerrarModalImpresora();
  poblarFiltrosYDatalists();
  refrescarVistasSecundarias();
}

function eliminarImpresoraActual() {
  const id = $("impId").value;
  if (!id) return;
  if (!confirm("¿Eliminar esta impresora de forma permanente?")) return;
  impresorasData = impresorasData.filter((p) => p.id !== id);
  guardarImpresoras();
  sincronizarEliminacionImpresora(id);
  cerrarModalImpresora();
  poblarFiltrosYDatalists();
  refrescarVistasSecundarias();
}

/* ---------- Modal de códigos de usuario (nuevo / editar) ---------- */

function abrirModalCodigo(codigo) {
  $("formCodigo").reset();
  if (codigo) {
    $("modalCodigoTitulo").textContent = `Editar código — ${codigo.nombre || ""}`;
    CODIGO_FIELD_IDS.forEach((idCampo) => {
      const campo = CODIGO_CAMPO_POR_ID[idCampo];
      if (codigo[campo] !== undefined) $(idCampo).value = codigo[campo];
    });
    $("codAgregadoPor").value = codigo.agregadoPor || TECNICO_ACTUAL || "Sin identificar";
    $("btnEliminarModalCodigo").style.display = "";
  } else {
    $("modalCodigoTitulo").textContent = "Nuevo código de usuario";
    $("codId").value = "";
    $("codAgregadoPor").value = TECNICO_ACTUAL || "Sin identificar";
    $("btnEliminarModalCodigo").style.display = "none";
  }
  $("modalCodigoOverlay").classList.add("open");
}

function cerrarModalCodigo() {
  $("modalCodigoOverlay").classList.remove("open");
}

function codigoExistente(idUsuario, idActual) {
  const idU = (idUsuario || "").trim().toLowerCase();
  if (!idU) return null;
  return codigosData.find((c) => c.id !== idActual && (c.idUsuario || "").trim().toLowerCase() === idU) || null;
}

function onSubmitCodigo(e) {
  e.preventDefault();
  const esNuevo = !$("codId").value.trim();
  const data = {};
  CODIGO_FIELD_IDS.forEach((idCampo) => {
    data[CODIGO_CAMPO_POR_ID[idCampo]] = $(idCampo).value.trim();
  });

  // Solo se valida al crear un registro nuevo: el catalogo importado del
  // Excel ya trae miles de IDs repetidos de forma legitima (historial de
  // reasignaciones), asi que exigir unicidad al editar esos registros
  // bloquearia guardar cosas que llevan años asi sin ser un error real.
  if (esNuevo) {
    const existente = codigoExistente(data.idUsuario, data.id);
    if (existente) {
      alert(
        `El ID "${data.idUsuario}" ya está en uso por ${existente.nombre || "otro usuario"} (clave ${existente.clave || "N/A"}, ${existente.origen || "sin departamento"}). Usa otro ID o edita ese registro existente en vez de crear uno nuevo.`
      );
      return;
    }
  }

  data.ultimaModificacion = new Date().toISOString().slice(0, 16);

  let guardado;
  if (data.id) {
    const idx = codigosData.findIndex((c) => c.id === data.id);
    if (idx !== -1) codigosData[idx] = { ...codigosData[idx], ...data };
    guardado = codigosData[idx];
  } else {
    data.id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    codigosData.push(data);
    guardado = data;
  }
  guardarCodigos();
  sincronizarCodigo(guardado);
  cerrarModalCodigo();
  refrescarVistasSecundarias();
}

function eliminarCodigoActual() {
  const id = $("codId").value;
  if (!id) return;
  if (!confirm("¿Eliminar este código de forma permanente?")) return;
  codigosData = codigosData.filter((c) => c.id !== id);
  guardarCodigos();
  sincronizarEliminacionCodigo(id);
  cerrarModalCodigo();
  refrescarVistasSecundarias();
}

/* ---------- Modal de contratos móviles (nuevo / editar) ---------- */

function abrirModalContratoMovil(contrato) {
  $("formContratoMovil").reset();
  if (contrato) {
    $("modalContratoMovilTitulo").textContent = `Editar contrato móvil — ${contrato.empresa || ""}`;
    CONTRATO_MOVIL_FIELD_IDS.forEach((idCampo) => {
      const campo = CONTRATO_MOVIL_CAMPO_POR_ID[idCampo];
      if (contrato[campo] !== undefined) $(idCampo).value = contrato[campo];
    });
    $("btnEliminarModalContratoMovil").style.display = "";
  } else {
    $("modalContratoMovilTitulo").textContent = "Nuevo contrato móvil";
    $("cmId").value = "";
    $("btnEliminarModalContratoMovil").style.display = "none";
  }
  $("modalContratoMovilOverlay").classList.add("open");
}

function cerrarModalContratoMovil() {
  $("modalContratoMovilOverlay").classList.remove("open");
}

function onSubmitContratoMovil(e) {
  e.preventDefault();
  const data = {};
  CONTRATO_MOVIL_FIELD_IDS.forEach((idCampo) => {
    data[CONTRATO_MOVIL_CAMPO_POR_ID[idCampo]] = $(idCampo).value.trim();
  });
  data.ultimaModificacion = new Date().toISOString().slice(0, 16);

  let guardado;
  if (data.id) {
    const idx = contratosMovilesData.findIndex((c) => c.id === data.id);
    if (idx !== -1) contratosMovilesData[idx] = { ...contratosMovilesData[idx], ...data };
    guardado = contratosMovilesData[idx];
  } else {
    data.id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    contratosMovilesData.push(data);
    guardado = data;
  }
  guardarContratosMoviles();
  sincronizarContratoMovil(guardado);
  cerrarModalContratoMovil();
  poblarFiltrosYDatalists();
  refrescarVistasSecundarias();
}

function eliminarContratoMovilActual() {
  const id = $("cmId").value;
  if (!id) return;
  if (!confirm("¿Eliminar este contrato móvil de forma permanente?")) return;
  contratosMovilesData = contratosMovilesData.filter((c) => c.id !== id);
  guardarContratosMoviles();
  sincronizarEliminacionContratoMovil(id);
  cerrarModalContratoMovil();
  refrescarVistasSecundarias();
}

/* ---------- Modal de líneas móviles (nueva / editar) ---------- */

function abrirModalLineaMovil(linea) {
  $("formLineaMovil").reset();
  if (linea) {
    $("modalLineaMovilTitulo").textContent = `Editar línea — ${linea.numero || ""}`;
    LINEA_MOVIL_FIELD_IDS.forEach((idCampo) => {
      const campo = LINEA_MOVIL_CAMPO_POR_ID[idCampo];
      if (linea[campo] !== undefined) $(idCampo).value = linea[campo];
    });
    $("btnEliminarModalLineaMovil").style.display = "";
  } else {
    $("modalLineaMovilTitulo").textContent = "Nueva línea móvil";
    $("lmId").value = "";
    $("lmEstado").value = "Activa";
    $("btnEliminarModalLineaMovil").style.display = "none";
  }
  $("modalLineaMovilOverlay").classList.add("open");
}

function cerrarModalLineaMovil() {
  $("modalLineaMovilOverlay").classList.remove("open");
}

function onSubmitLineaMovil(e) {
  e.preventDefault();
  const data = {};
  LINEA_MOVIL_FIELD_IDS.forEach((idCampo) => {
    data[LINEA_MOVIL_CAMPO_POR_ID[idCampo]] = $(idCampo).value.trim();
  });
  data.ultimaModificacion = new Date().toISOString().slice(0, 16);

  let guardada;
  if (data.id) {
    const idx = lineasMovilesData.findIndex((l) => l.id === data.id);
    if (idx !== -1) lineasMovilesData[idx] = { ...lineasMovilesData[idx], ...data };
    guardada = lineasMovilesData[idx];
  } else {
    data.id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    lineasMovilesData.push(data);
    guardada = data;
  }
  guardarLineasMoviles();
  sincronizarLineaMovil(guardada);
  cerrarModalLineaMovil();
  poblarFiltrosYDatalists();
  refrescarVistasSecundarias();
}

function eliminarLineaMovilActual() {
  const id = $("lmId").value;
  if (!id) return;
  if (!confirm("¿Eliminar esta línea móvil de forma permanente?")) return;
  lineasMovilesData = lineasMovilesData.filter((l) => l.id !== id);
  guardarLineasMoviles();
  sincronizarEliminacionLineaMovil(id);
  cerrarModalLineaMovil();
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

/* ---------- Impresión: Anexo de Servicios Móviles (mismo formato que Claro) ---------- */
/* Solo los campos que el contrato realmente trae con datos quedan dinamicos
   (Informacion General, Facturacion, Planes de Telefonia Movil, Observaciones,
   Aceptacion, y el detalle de lineas). Las secciones que en el formulario de
   Claro casi siempre vienen vacias (Internet Movil, Navegacion AVL,
   Financiamiento de Equipos, Portal de Paquetes, Gestor de Comunicaciones,
   Coordinador ante Telgua) se dejan fijas/en blanco, igual que en el
   documento original. El texto de condiciones es el mismo en todos los
   contratos de Claro, transcrito tal cual del anexo oficial. */

function casilla(marcada, texto) {
  return `<span class="anexo-check"><span class="caja${marcada ? " marcada" : ""}">${marcada ? "✓" : ""}</span>${texto}</span>`;
}

// El formulario de Claro divide el correo en dos casillas separadas por un
// "@" literal impreso en el formato (usuario @ dominio); cuando esta vacio
// el dominio se marca con un guion "-", tal como viene en el documento.
function campoCorreo(etiqueta, correoCompleto) {
  const partes = (correoCompleto || "").split("@");
  const usuario = (partes[0] || "").trim();
  const dominio = (partes[1] || "").trim() || "-";
  return `<div class="anexo-campo"><span class="lbl">${etiqueta}</span><span class="val">${esc(usuario)}</span><span class="lbl">@</span><span class="val" style="flex:0 0 90px;">${esc(dominio)}</span></div>`;
}

function anexoServiciosMovilesHTML(contrato, lineas) {
  const sumaLineas = lineas.reduce((s, l) => s + (Number(l.tarifaPlan) || 0), 0);
  const totalMensual = contrato.totalMensual ? Number(contrato.totalMensual) : sumaLineas;

  const filasLineas = lineas
    .map(
      (l, i) => `
        <tr>
          <td class="centro">${i + 1}</td>
          <td>${esc(l.numero)}</td>
          <td>${esc(l.modelo)}</td>
          <td>${esc(l.imei)}</td>
          <td>${esc(l.iccidEsn)}</td>
          <td class="num">Q 0</td>
          <td>${esc(l.plan)}</td>
          <td class="num">${l.tarifaPlan ? "Q " + Number(l.tarifaPlan).toFixed(2) : ""}</td>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          <td class="num">${l.tarifaPlan ? "Q " + Number(l.tarifaPlan).toFixed(2) : ""}</td>
        </tr>`
    )
    .join("");

  return `
    <div class="anexo-movil">
      <div class="anexo-movil-header">
        <div class="anexo-movil-logo">${typeof LOGO_CLARO_B64 !== "undefined" ? `<img src="${LOGO_CLARO_B64}" alt="Claro">` : "Claro"}</div>
        <div class="anexo-movil-titulo">Anexo de servicios Móviles</div>
        <div class="anexo-movil-version">V 1.0</div>
      </div>

      <div class="anexo-cabecera">
        <span><strong>Categoría de Cliente:</strong> ${esc(contrato.categoriaCliente)}</span>
        <span><strong>Gestión:</strong> ${esc(contrato.tipoGestion)}</span>
        <span><strong>Tipo de Cliente:</strong> Existente</span>
      </div>

      <div class="anexo-seccion">Información General</div>
      <div class="anexo-campos">
        <div class="anexo-campo"><span class="lbl">Nombre Completo / Razón Social:</span><span class="val">${esc(contrato.empresa)}</span></div>
        <div class="anexo-campo"><span class="lbl">Nombre Comercial:</span><span class="val"></span></div>
        <div class="anexo-campo-doble">
          <div class="anexo-campo"><span class="lbl">Nombre Representante Legal:</span><span class="val">${esc(contrato.representanteLegal)}</span></div>
          <div class="anexo-campo"><span class="lbl">Cargo:</span><span class="val"></span></div>
        </div>
        <div class="anexo-campo-doble">
          <div class="anexo-campo"><span class="lbl">Salario:</span><span class="val"></span></div>
          <div class="anexo-campo"><span class="lbl">Antigüedad:</span><span class="val"></span></div>
        </div>
        <div class="anexo-campo-doble">
          <div class="anexo-campo"><span class="lbl">Documento de Identificación:</span><span class="val"></span></div>
          <div class="anexo-campo"><span class="lbl">NIT:</span><span class="val">${esc(contrato.nit)}</span></div>
        </div>
        <div class="anexo-campo"><span class="lbl">Dirección:</span><span class="val"></span></div>
        <div class="anexo-campo-doble">
          <div class="anexo-campo"><span class="lbl">Giro de Negocio:</span><span class="val"></span></div>
          <div class="anexo-campo"><span class="lbl">Departamento / Ciudad:</span><span class="val"></span></div>
        </div>
        <div class="anexo-checks">
          <span><strong>Presencia:</strong></span>
          ${casilla(false, "MX")} ${casilla(false, "GT")} ${casilla(false, "SV")} ${casilla(false, "HD")}
          ${casilla(false, "NIC")} ${casilla(false, "CR")} ${casilla(false, "PA")}
          <span><strong>Colaboradores:</strong> <span class="anexo-campo"><span class="val"></span></span></span>
          <span><strong>Sucursales / Oficinas:</strong> <span class="anexo-campo"><span class="val"></span></span></span>
        </div>
      </div>

      <div class="anexo-seccion">Datos de envío de Facturación</div>
      <div class="anexo-campos">
        <div class="anexo-campo-doble">
          <div class="anexo-campo"><span class="lbl">Nombre del Contacto:</span><span class="val"></span></div>
          <div class="anexo-campo"><span class="lbl">Teléfono:</span><span class="val"></span></div>
        </div>
        ${campoCorreo("Correo Electrónico:", "")}
      </div>

      <div class="anexo-seccion">Servicios Cloud</div>
      <div class="anexo-campos">
        <div class="anexo-checks">
          <span>${casilla(false, "Continúa con Claro Drive cargo a factura — SI")} ${casilla(false, "NO")}</span>
        </div>
        <div class="anexo-checks">
          <span>${casilla(false, "Dar Baja a servicio Claro Drive — SI")} ${casilla(false, "NO")}</span>
        </div>
        <div class="anexo-campo-doble">
          <div class="anexo-campo"><span class="lbl">Nombre:</span><span class="val"></span></div>
          <div class="anexo-campo"><span class="lbl">Teléfono:</span><span class="val"></span></div>
        </div>
        ${campoCorreo("Correo Electrónico:", "")}
      </div>

      <div class="anexo-seccion">Planes de Telefonía Móvil</div>
      <div class="anexo-campo-doble">
        <div class="anexo-campo"><span class="lbl">Plazo de Contrato:</span><span class="val">${esc(contrato.plazoContrato)}</span></div>
        <div class="anexo-campo"><span class="lbl">Otros a:</span><span class="val"></span></div>
      </div>
      <div class="anexo-checks">${casilla(false, "Claro Cloud")}</div>
      <table class="anexo-tabla">
        <thead>
          <tr><th>Cantidad</th><th>Descripción</th><th>Total Mensual</th></tr>
        </thead>
        <tbody>
          <tr>
            <td class="centro">${esc(contrato.cantidadLineas)}</td>
            <td>${esc(contrato.planContratado)}</td>
            <td class="num">Q ${totalMensual.toFixed(2)}</td>
          </tr>
          <tr><td class="centro"></td><td></td><td class="num"></td></tr>
          <tr><td class="centro"></td><td></td><td class="num"></td></tr>
        </tbody>
        <tfoot>
          <tr><td colspan="2">TOTAL</td><td class="num">Q ${totalMensual.toFixed(2)}</td></tr>
        </tfoot>
      </table>

      <div class="anexo-seccion">Planes de Internet Móvil</div>
      <div class="anexo-campo-doble">
        <div class="anexo-campo"><span class="lbl">Plazo de Contrato:</span><span class="val">Otros</span></div>
        <div class="anexo-campo"><span class="lbl">Otros a:</span><span class="val"></span></div>
      </div>
      <div class="anexo-checks">${casilla(false, "Claro Cloud")}</div>
      <table class="anexo-tabla">
        <thead><tr><th>Cantidad</th><th>Descripción</th><th>Total Mensual</th></tr></thead>
        <tbody>
          <tr><td class="centro"></td><td></td><td class="num">Q 0.00</td></tr>
          <tr><td class="centro"></td><td></td><td class="num">Q 0.00</td></tr>
          <tr><td class="centro"></td><td></td><td class="num">Q 0.00</td></tr>
        </tbody>
        <tfoot><tr><td colspan="2">TOTAL</td><td class="num">Q 0.00</td></tr></tfoot>
      </table>

      <div class="anexo-seccion">Planes de Navegación AVL / Telemetría</div>
      <div class="anexo-campo-doble">
        <div class="anexo-campo"><span class="lbl">Plazo de Contrato:</span><span class="val">-</span></div>
        <div class="anexo-campo"><span class="lbl">Otros a:</span><span class="val"></span></div>
      </div>
      <table class="anexo-tabla">
        <thead>
          <tr>
            <th>Cant.</th><th>Plan o paquete de Navegación</th><th>Cuota Mensual</th><th>Cuota Mensual Total</th>
            <th>Llamadas Entrantes AVL</th><th>Llamadas Salientes AVL</th><th>SMS Entrantes AVL</th><th>SMS Salientes AVL</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="centro"></td><td>-</td><td class="num">Q -</td><td class="num">Q 0.00</td><td class="centro">NO</td><td class="centro">NO</td><td class="centro">NO</td><td class="centro">NO</td></tr>
          <tr><td class="centro"></td><td>-</td><td class="num">Q -</td><td class="num">Q 0</td><td class="centro">NO</td><td class="centro">NO</td><td class="centro">NO</td><td class="centro">NO</td></tr>
          <tr><td class="centro"></td><td>-</td><td class="num">Q -</td><td class="num">Q 0</td><td class="centro">NO</td><td class="centro">NO</td><td class="centro">NO</td><td class="centro">NO</td></tr>
        </tbody>
        <tfoot><tr><td colspan="3">TOTAL</td><td class="num">Q 0.00</td><td colspan="4"></td></tr></tfoot>
      </table>

      <div class="anexo-seccion">Financiamiento de Equipos Móviles</div>
      <div class="anexo-checks">${casilla(false, "Aplica financiamiento equipo móvil")}</div>
      <table class="anexo-tabla">
        <thead>
          <tr><th>Cant.</th><th>Equipos a Financiar</th><th>Valor de Equipo a Financiar</th><th>Plazo de Pago de Equipos</th><th>Valor mensual a Pagar</th></tr>
        </thead>
        <tbody>
          <tr><td class="centro"></td><td></td><td class="num">Q 0</td><td class="centro">0</td><td class="num">Q 0.00</td></tr>
          <tr><td class="centro"></td><td></td><td class="num">Q 0</td><td class="centro">0</td><td class="num">Q 0.00</td></tr>
          <tr><td class="centro"></td><td></td><td class="num">Q 0</td><td class="centro">0</td><td class="num">Q 0.00</td></tr>
          <tr><td class="centro"></td><td></td><td class="num">Q 0</td><td class="centro">0</td><td class="num">Q 0.00</td></tr>
        </tbody>
        <tfoot><tr><td colspan="4">TOTAL</td><td class="num">Q 0</td></tr></tfoot>
      </table>

      <div class="anexo-seccion">Portal de Paquetes de Internet Adicional</div>
      <div class="anexo-checks">
        <span><strong>Cliente desea el servicio:</strong></span>
        ${casilla(true, "Sí")} ${casilla(false, "No")}
      </div>
      <div class="anexo-campo-doble">
        <div class="anexo-campo"><span class="lbl">Nombre responsable del Portal:</span><span class="val"></span></div>
        <div class="anexo-campo"><span class="lbl">Teléfono:</span><span class="val"></span></div>
      </div>
      ${campoCorreo("Correo Electrónico:", "")}

      <div class="anexo-seccion">Gestor de Comunicaciones / AVI</div>
      <div class="anexo-checks">
        ${casilla(false, "Contratará el Gestor de Comunicaciones")}
        <span><strong>Tarifa:</strong> Q <span class="anexo-campo"><span class="val"></span></span></span>
        <span><strong>No. Líneas:</strong> <span class="anexo-campo"><span class="val"></span></span></span>
        <span><strong>Total:</strong> Q <span class="anexo-campo"><span class="val"></span></span></span>
      </div>
      <div class="anexo-campo"><strong>Información del usuario Administrador</strong></div>
      <div class="anexo-campo-doble">
        <div class="anexo-campo"><span class="lbl">Nombre:</span><span class="val"></span></div>
        <div class="anexo-campo"><span class="lbl">Teléfono:</span><span class="val"></span></div>
      </div>
      ${campoCorreo("Correo Electrónico:", "")}

      <div class="anexo-seccion">Coordinador del Servicio ante Telgua</div>
      <div class="anexo-campo">Yo EL CLIENTE Designo a:</div>
      <div class="anexo-campo-doble">
        <div class="anexo-campo"><span class="lbl">Nombre:</span><span class="val"></span></div>
        <div class="anexo-campo"><span class="lbl">Cargo:</span><span class="val"></span></div>
      </div>
      <div class="anexo-campo-doble">
        <div class="anexo-campo"><span class="lbl">Documento de identificación:</span><span class="val"></span></div>
        <div class="anexo-campo"><span class="lbl">Teléfono:</span><span class="val"></span></div>
      </div>
      ${campoCorreo("Correo Electrónico:", "")}
      <p class="anexo-condiciones-texto">
        Con la finalidad de agilizar y facilitar la tramitación post venta que surja derivados del cumplimiento del
        presente Contrato, para que pueda gestionar los trámites como: Remplazo de sim, bloqueo de servicios por robo,
        agregar paquete de datos.
      </p>

      <div class="anexo-seccion">Observaciones</div>
      <div class="anexo-campo"><span class="val">${esc(contrato.observaciones)}</span></div>

      <div class="salto-pagina"></div>

      <div class="anexo-condiciones-titulo">Condiciones Aplicables al servicio de Telefonía Móvil</div>
      <p class="anexo-condiciones-texto">
        <strong>LLAMADAS ILIMITADAS:</strong> el paquete de llamadas ilimitadas que EL CLIENTE contrata, le permite hablar
        ilimitadamente todos los días y en cualquier horario a Líneas Fijas Residenciales CLARO y líneas móviles Claro.
        Al contratarlo, el servicio quedará activo 24 horas después de la activación del plan contratado. En caso no
        desee continuar con el servicio, puede solicitar la desactivación antes de su fecha de corte en nuestros
        Centros de Servicios al Cliente así también no se puede desactivar si están incluidos en el contrato o vienen
        incluidos en el plan contratado.
      </p>
      <p class="anexo-condiciones-texto">
        <strong>BENEFICIO SIN FRONTERAS CENTRO AMERICA Y NORTEAMERICA:</strong> Al contar con el beneficio de Sin
        Fronteras Centroamérica y Sin Fronteras Norteamérica, los servicios de voz, SMS y navegación contratados dentro
        del plan pueden ser utilizados desde Canadá hasta Panamá, sin incluir Belice para su uso desde (servicio roaming)
        y hacia (larga distancia internacional) los países con precios y tarifas de Guatemala. Para planes con servicios
        ilimitados de voz y SMS, se presta únicamente para el ámbito del uso personal del cliente conforme a la política
        de uso razonable incluida en la página Web de Claro en la parte Legal y Regulatorio. No incluye servicios
        ilimitados de navegación como redes sociales ilimitadas, música ilimitada entre otros.
      </p>
      <p class="anexo-condiciones-texto">
        <strong>BENEFICIO ROAMING SIN FRONTERAS AMÉRICA (SFA):</strong> Todos los planes con el beneficio SFA cuentan
        con un bolsón asignado de mensajes de texto SMS y el uso del paquete de datos durante la estadía en los países
        de cobertura (servicio roaming). No incluye llamadas ni mensajes de texto de larga distancia internacional, es
        decir generados desde Guatemala hacia los países de cobertura del beneficio SFA.
      </p>
      <p class="anexo-condiciones-texto">
        <strong>GROUP CALLING - VPN:</strong> Group Calling: VPN (Virtual Private Network) permite al cliente realizar
        llamadas a los números CLARO contratados, a nombre de la misma Empresa / Corporación (móviles y fijos), de
        forma gratuita, sin consumir minutos de su bolsón del plan contratado. Este plan de llamadas ilimitadas entre
        los móviles contratados se habilitará y comenzará a aplicar 48 hrs. después de activado el servicio de
        telefonía móvil.
      </p>
      <p class="anexo-condiciones-texto">
        <strong>PLANES POSTPAGO DE VOZ:</strong> Servicio de telefonía móvil Postpago de voz que le brinda a EL CLIENTE
        una bolsa de minutos definida, de acuerdo al plan contratado por una renta mensual específica.
      </p>
      <p class="anexo-condiciones-texto">
        <strong>MENSAJES DE TEXTO:</strong> Paquete de SMS que adquiere el cliente que le permite el envío de mensajes
        de texto desde su móvil hacia otro de la red CLARO. Aplica únicamente y exclusivamente para consumo nacional y
        regional (No incluyen marcaciones cortas o promociones).
      </p>
      <p class="anexo-condiciones-texto">
        <strong>INTERNET MÓVIL:</strong> La Navegación en la red que EL CLIENTE haga a nivel Regional se facturará a
        tarifa local en los países de México, Guatemala, El Salvador, Honduras, Nicaragua, Costa Rica y Panamá. La
        Navegación Internacional se limita a los países incluidos en la Región más los países incluidos en el plan
        elegido. Todo el plan con paquete de navegación al llegar a su límite del plan contratado se bloqueará,
        pudiendo EL CLIENTE comprar paquete de datos adicionales en nuestros diferentes portales para seguir navegando.
      </p>

      <div class="anexo-condiciones-titulo">Condiciones Aplicables a Roaming/Larga Distancia</div>
      <p class="anexo-condiciones-texto">
        EL CLIENTE Corporativo que por su buen récord como CLIENTE, TELGUA le asigna el rango "VIP" y que acepte el
        cargo mensual de una cuota adicional al servicio de plan de voz PostPago, conforme al tarifario establecido por
        TELGUA, gozará de tarifas preferenciales de Roaming por un plazo inicial de prestación del servicio de 18 MESES,
        contado a partir de la firma del contrato. Si El Cliente decide dar por terminado en forma anticipada el plazo
        inicial, deberá pagar a TELGUA, el monto que falte por cancelar hasta el total cumplimiento del plazo. El
        Cliente acepta y solicita que, vencido el plazo inicial del contrato, TELGUA le siga proporcionando el servicio
        sin necesidad de solicitar su prórroga por escrito. Si posteriormente desea dar de baja el servicio EL CLIENTE
        deberá solicitarlo por escrito a TELGUA debiendo cancelar hasta la última cuota de servicio efectivamente
        prestado. El servicio de Roaming preferencial aplicará en Centroamérica, Estados Unidos y en los países con
        presencia CLARO que se le indique en el momento de la cotización.
      </p>

      <div class="anexo-condiciones-titulo">Condiciones Aplicables a la Compra-Venta de Equipos a Plazos</div>
      <p class="anexo-condiciones-texto">
        <strong>FORMA DE PAGO.</strong> Las cuotas de los equipos financiados que adquiera EL CLIENTE se cargarán
        mensualmente, adicional al monto del servicio telefónico, conforme al plan que el cliente haya adquirido. EL
        CLIENTE en forma expresa, voluntaria y unilateral manifiesta RECONOCERSE LISO Y LLANO DEUDOR DE TELGUA hasta
        por el monto total del precio del aparato telefónico y cuotas mensuales vencidas por concepto de servicio
        telefónico y otros servicios varios de telecomunicaciones. <strong>GARANTÍA.</strong> En el caso de la garantía
        se procederá conforme a lo indicado en el Anexo de prestación de Servicios que a cada equipo corresponda.
        <strong>CANCELACIÓN.</strong> Si el comprador desea dar baja al servicio antes del vencimiento del plazo
        estipulado en este contrato, deberá cancelar la totalidad del valor del equipo para que su solicitud proceda.
        Si desea cancelar anticipadamente las cuotas faltantes podrá realizarlo dependiendo del caso. En el caso de
        compra de equipo adquirido a plazos en pospago deberá realizar el pago, después de la primera facturación.
        <strong>INCUMPLIMIENTO.</strong> En caso de incumplimiento en el pago, e independiente de la facultad de TELGUA
        de exigirle al comprador el pago del saldo total del equipo, más el de la tasa de interés por mora, a través de
        las acciones legales que corresponda, por este acto el comprador se compromete a devolver a TELGUA en perfecto
        estado de funcionamiento, el equipo financiado, por el impago de al menos DOS (2) cuotas vencidas y
        consecutivas, autorizando expresamente a TELGUA a recoger el equipo a través del personal o empresa que estime
        conveniente o bien mediante entrega voluntaria que deberá hacer el comprador desee en agencias "Claro".
        <strong>FACTURA DEL EQUIPO FINANCIADO.</strong> La factura del equipo se entrega al cliente al momento que este
        recibe el mismo. Esta factura se emite por el monto total de la terminal móvil (incluye IVA), posteriormente
        dentro de la factura mensual del servicio se detallará la cuota del financiamiento de la terminal llevando un
        control de número de pagos y el nombre de la terminal financiada, tomar en cuenta que esta cuota cargada es NO
        IVA.
      </p>

      <div class="anexo-condiciones-titulo">Condiciones Aplicables al Servicio de INTERNET MÓVIL</div>
      <p class="anexo-condiciones-texto">
        <strong>CARACTERÍSTICAS DEL SERVICIO Y PLAN INTERNET MÓVIL:</strong> El servicio de Internet Móvil que por este
        acto contrato, Le permite a través de la configuración de un MODEM en una computadora portátil, el acceso a
        Internet con velocidades de hasta 2 Mbps en 3G y hasta 5Mbps en 4G, en cualquier momento, sujeto a cobertura.
        Acepto expresamente que dicho servicio puede adquirir paquetes adicionales desde el portal de compra de
        paquetes adicionales (PCRF), los cuales serán cargados a mi factura mensual. Tiene únicamente cobertura de
        datos en México, Guatemala, El Salvador, Honduras, Nicaragua, Costa Rica y Panamá. En caso EL CLIENTE desee
        navegar en otro país, acepta que deberá pagar la totalidad de la transmisión de datos de acuerdo a la tarifa
        vigente por Mb transmitido en roaming. <strong>Tarjeta SIM:</strong> (Subscriber Identity Module). La tarjeta
        inteligente desmontable con un número específico asignado a TELGUA, puede ser adquirida por EL CLIENTE para su
        utilización en un MODEM USB de su propiedad, en servicio pospago. Al contratarla, EL CLIENTE recibirá todas las
        promociones y ofertas vigentes en el momento de su adquisición. De igual manera, le aplica lo relativo a las
        condiciones generales del servicio, plazo mínimo inicial, cláusula indemnizatoria, intereses moratorios y
        garantía de la tarjeta SIM conforme a los Términos y Condiciones de Telgua.
      </p>

      <div class="anexo-condiciones-titulo">Condiciones Aplicables al servicio de Navegación AVL / Telemetría</div>
      <p class="anexo-condiciones-texto">
        <strong>PLAN REGIONAL DE INTERNET MÓVIL AVL:</strong> El servicio de Internet Móvil AVL es un servicio con
        acceso a Internet restringido, tasación de transacciones por byte, bloqueo del servicio al consumir el 100% de
        la bolsa de megabytes (MB), a excepción del plan ilimitado, y perfil de velocidad 128kbps de subida y 64kbps de
        bajada. <strong>NAVEGACIÓN:</strong> Internet Móvil AVL puede ser utilizado para carga y descarga de datos en
        Guatemala, El Salvador, Honduras, Nicaragua y Costa Rica. <strong>RESTRICCIONES:</strong> Los planes de
        Internet Móvil AVL tienen los servicios de telefonía, llamadas entrantes y salientes, y los servicios de
        mensajería SMS entrantes y salientes, deshabilitados, se habilitará únicamente si se necesitaran con cargo
        adicional en las llamadas y mensajes salientes como entrantes de acuerdo a las tarifas vigentes en el país. Los
        kilobytes (KB) consumidos en países no incluidos tendrán un costo por KB según tarifario. EL CLIENTE deberá
        proporcionar las direcciones IP y URL a las que desea que sus líneas se reporten para que TELGUA las configure
        en su plataforma. La configuración de la dirección IP y URL, así como cualquier cambio de éstas, que se
        soliciten a TELGUA se aplicarán un tiempo estimado de una semana. <strong>PAQUETE MÉXICO PANAMÁ:</strong> La
        contratación del paquete México y Panamá agrega una bolsa de diez (10) megabytes al plan de Internet Móvil AVL
        que puede ser utilizada para carga y descarga de datos en estos dos países. La transmisión de datos después de
        consumir los 10MB tendrá costo por KB según tarifario HABILITACIÓN DE SERVICIOS RESTRINGIDOS En caso sea
        requerido puede habilitarse los servicios de telefonía y mensajería en las líneas contratadas. Las llamadas
        entrantes y salientes tendrán costo de acuerdo a tarifa vigente en el país; los mensajes salientes tendrán
        costo de acuerdo a tarifa vigente en el país. CLARO no se responsabiliza por los consumos realizados en estas
        líneas de estos servicios.
      </p>

      <div class="anexo-condiciones-titulo">Condiciones Aplicables a Gestor de Comunicación AVI</div>
      <p class="anexo-condiciones-texto">
        EL CLIENTE acepta mediante la firma de este documento, el servicio de gestión y control de las líneas
        digitales, fijas o móviles que le permite, según la categoría que elija, integrar sus líneas (las cuales se
        detallan en hoja adjunta al presente contrato), cursar el tráfico entre sus propias líneas sin costo, tener
        marcación abreviada personalizada, distribuir los minutos en forma personalizada (siempre que las líneas estén
        dentro del mismo plan) y aplicar controles de llamadas por destino y horario, a través de una herramienta en
        Internet. Para hacer uso del servicio TELGUA asignará un usuario y una contraseña a EL CLIENTE, a efecto de
        poder ingresar al portal Web https://avi.claro.com.gt, desde cualquier terminal con exión a Internet. Los
        servicios objeto del presente contrato pueden ser catalogados de la siguiente manera: 1. Estándar: Permite
        administrar todas las características del servicio de Acceso Empresarial, y/o Líneas Fijas, y/o líneas móviles
        (no posee controles, no recibe acceso a la definición de perfiles ni modificación de restricciones). 2.
        Premium: Contiene las funciones estándar, y además permite controlar, el consumo (aplicable solo en los casos
        de telefonía móvil con desvío a teléfonos prepago), destino y horario de las llamadas. <strong>VIGENCIA:</strong>
        El servicio de valor agregado AVI, permanecerá vigente en tanto esté vigente el servicio de Acceso Empresarial
        contratado y tenga líneas móviles, a pesar de ello lo podré dar por terminado en cualquier momento sin sanción
        alguna, debiendo acudir previamente con el Ejecutivo de Ventas de TELGUA para suscribir los documentos
        necesarios de terminación.
      </p>

      <div class="anexo-condiciones-titulo">Aceptación</div>
      <p class="anexo-condiciones-texto">
        <strong>ACEPTACIÓN:</strong> EL CLIENTE, al firmar este documento acepta expresamente: a) Ser de los datos de
        identificación consignados en este anexo; b) que TELGUA pueda corroborar la veracidad de toda la información
        proporcionada por su persona, por cualquier medio legal, siendo responsable de lo relativo al delito de
        perjurio en caso se llegara a constar que la información relacionada es falsa parcial o totalmente; c)
        Autoriza expresa y voluntariamente a TELGUA para que sus datos personales o cualquier información recopilada
        y/o proporcionada por su persona ante entidades públicas o privadas o la generada de relaciones contractuales,
        crediticias o comerciales sean compartidas, difundidas, comercializadas o reportadas con empresas de cobro,
        centrales de riesgo o con aquellas que distribuyen o comercializan con datos personales a efecto de verificar
        la información proporcionada por su persona o bien para ser tratada, almacenada o transferida; d) que el
        presente ANEXO DE SERVICIO incorpora los TÉRMINOS Y CONDICIONES GENERALES DE CONTRATACIÓN DE TELGUA ("TCG
        CLIENTES"), los cuales he recibido de parte de TELGUA en este acto y que constituyen los aplicables de manera
        general a la prestación de servicios de telecomunicaciones brindados por TELGUA; y e) haber leído el presente
        anexo del servicio y bien impuesto de su contenido, objeto, validez y efectos legales, lo acepta, ratifica y
        firma.
      </p>

      <div class="anexo-campo anexo-firma-fila">
        <span class="lbl"><strong>Lugar y Fecha:</strong></span>
        <span class="val">Guatemala</span>
        <span class="val">${esc(contrato.fechaFirma)}</span>
      </div>
      <div class="anexo-campo-doble anexo-firma-fila">
        <div class="anexo-campo"><span class="lbl"><strong>Nombre de Ejecutivo:</strong></span><span class="val">${esc(contrato.ejecutivoVentas)}</span></div>
        <div class="anexo-campo"><span class="lbl"><strong>Firma del Cliente:</strong></span><span class="val"></span></div>
      </div>

      <div class="salto-pagina anexo-lineas-pagina">
        <div class="anexo-campo"><strong>${esc(contrato.empresa)}</strong></div>
        <div class="anexo-campo"><span class="lbl" style="font-size:0.62rem;">NOMBRE EMPRESA/NOMBRE TITULAR</span></div>
        <table class="anexo-tabla anexo-tabla-chica">
          <thead>
            <tr>
              <th>#</th><th>No. de Teléfono</th><th>Modelo Aparato</th><th>IMEI</th><th>ESN</th><th>Costo del Equipo</th>
              <th>Plan de Voz / Internet / AVL's</th><th>Tarifa del Plan</th><th>Tipo de servicio Cloud</th>
              <th>Servicio Cloud</th><th>Correo Spacesuite</th><th>Spacesuite</th><th>Correo Empresarial</th>
              <th>Apps Corp</th><th>Navegación de Apps</th><th>Suitcase</th><th>Pentcloud</th>
              <th>Llamadas Ilimitadas Claro</th><th>Paquete Preferencial Roaming</th><th>Claro Directo</th>
              <th>VPN</th><th>AVI/Desvío a Prepago</th><th>Descuento Automático</th><th>Tarifa Total</th>
            </tr>
          </thead>
          <tbody>${filasLineas || '<tr><td colspan="24" class="centro">Sin líneas registradas para esta empresa.</td></tr>'}</tbody>
          <tfoot>
            <tr><td colspan="23">SUB TOTAL</td><td class="num">Q ${sumaLineas.toFixed(2)}</td></tr>
            <tr><td colspan="23">NEGOCIACIÓN</td><td class="num"></td></tr>
            <tr><td colspan="23">TOTAL</td><td class="num">Q ${sumaLineas.toFixed(2)}</td></tr>
          </tfoot>
        </table>
        <div class="anexo-aceptacion">
          <span class="anexo-firma-linea">Nombre Empresa / Nombre Titular — Firma</span>
          <span class="anexo-firma-linea">Gerencia Mercado Corporativo País</span>
        </div>
      </div>
    </div>
  `;
}

function imprimirContratoMovil() {
  const data = {};
  CONTRATO_MOVIL_FIELD_IDS.forEach((idCampo) => (data[CONTRATO_MOVIL_CAMPO_POR_ID[idCampo]] = $(idCampo).value.trim()));
  const empresa = (data.empresa || "").trim().toLowerCase();
  const lineas = lineasMovilesData.filter((l) => (l.empresa || "").trim().toLowerCase() === empresa);
  $("printArea").innerHTML = anexoServiciosMovilesHTML(data, lineas);
  window.print();
}

function imprimirDesdeEdicion() {
  const equipo = {};
  FIELD_IDS.forEach((f) => (equipo[f] = $(f).value.trim()));
  renderActa(equipo, {
    accion: (equipo.status || "").toLowerCase().includes("devol") ? "Devolucion" : "Entrega",
    declarante: equipo.nombreEmpleado,
    tecnico: TECNICO_ACTUAL || "Sin identificar",
    jefe: "Gustavo A. García Avila",
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
  $("actaJefe").value = "Gustavo A. García Avila";
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
    jefe: "Gustavo A. García Avila",
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
  vistaCodigos.render();
  vistaDispositivos.render();
  vistaContratos.render();
  vistaContratosMoviles.render();
  vistaLineasMoviles.render();
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
  else if (nombre === "contratosMoviles") vistaContratosMoviles.render();
  else if (nombre === "lineasMoviles") vistaLineasMoviles.render();
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
  filtroLenovo = false;
  filtroRiolsaTodos = false;
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
  filtroLenovo = false;
  filtroRiolsaTodos = false;
  paginaActual = 1;
  cambiarVista("computadoras");
  render();
}

function irAEquiposLenovo() {
  $("buscador").value = "";
  $("filtroEmpresa").value = "";
  $("filtroStatus").value = "";
  $("filtroTipo").value = "";
  filtroCampoVacio = null;
  filtroEnRevision = false;
  filtroPropios = false;
  filtroLenovo = true;
  filtroRiolsaTodos = false;
  paginaActual = 1;
  cambiarVista("computadoras");
  render();
}

function irAEquiposRiolsaTodos() {
  $("buscador").value = "";
  $("filtroEmpresa").value = "";
  $("filtroStatus").value = "";
  $("filtroTipo").value = "";
  filtroCampoVacio = null;
  filtroEnRevision = false;
  filtroPropios = false;
  filtroLenovo = false;
  filtroRiolsaTodos = true;
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
  filtroLenovo = false;
  filtroRiolsaTodos = false;
  paginaActual = 1;
  cambiarVista("computadoras");
  render();
}

document.addEventListener("click", (ev) => {
  const fila = ev.target.closest(".tablero-fila[data-campo]");
  if (fila) irAListaEquiposFiltrada(fila.dataset.campo, fila.dataset.valor);
  if (ev.target.closest("#tarjetaEnRevision")) irARevisionCronograma();
  if (ev.target.closest("#tarjetaPropios")) irAEquiposPropios();
  if (ev.target.closest("#tarjetaTotales")) irATodosLosEquipos();
  if (ev.target.closest("#tarjetaLenovo")) irAEquiposLenovo();
  if (ev.target.closest("#tarjetaEmpresas")) irAEmpresasPanel();
  if (ev.target.closest("#tarjetaImpresoras")) irAImpresorasVista();
  if (ev.target.closest(".tablero-fila-secundaria")) irARevisionCronograma();
});

let statCardsAnimadas = false;

function animarNumeroStatCard(el) {
  const valorFinal = Number(el.dataset.valorFinal || 0);
  const duracion = 700;
  const t0 = performance.now();
  function paso(ahora) {
    const p = Math.min(1, (ahora - t0) / duracion);
    const suavizado = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(valorFinal * suavizado);
    if (p < 1) requestAnimationFrame(paso);
    else el.textContent = valorFinal;
  }
  requestAnimationFrame(paso);
}

const ICONOS_STAT_CARD = {
  pc: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="1"></rect><line x1="8" y1="20" x2="16" y2="20"></line><line x1="12" y1="16" x2="12" y2="20"></line></svg>`,
  laptop: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="10" rx="1"></rect><line x1="2" y1="19" x2="22" y2="19"></line></svg>`,
  impresora: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7,8 7,3 17,3 17,8"></polyline><rect x="5" y="8" width="14" height="7" rx="1"></rect><rect x="8" y="15" width="8" height="5"></rect></svg>`,
  edificio: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18"></rect><rect x="8" y="6" width="3" height="3"></rect><rect x="13" y="6" width="3" height="3"></rect><rect x="8" y="11" width="3" height="3"></rect><rect x="13" y="11" width="3" height="3"></rect></svg>`,
  servidor: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="6" rx="1"></rect><rect x="4" y="10" width="16" height="6" rx="1"></rect><rect x="4" y="17" width="16" height="4" rx="1"></rect></svg>`,
  alerta: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="6"></circle><line x1="21" y1="21" x2="15" y2="15"></line></svg>`,
};

function construirStatCard(valor, etiqueta, opts = {}) {
  const { id = "", claseColor = "", clickable = false, secundaria = false, icono = "", titulo = "" } = opts;
  const clases = ["stat-card", claseColor, clickable ? "clickable" : "", secundaria ? "stat-card-secundaria" : ""]
    .filter(Boolean)
    .join(" ");
  const idAttr = id ? ` id="${id}"` : "";
  const tituloAttr = titulo ? ` title="${titulo}"` : "";
  const valorMostrado = statCardsAnimadas ? valor : 0;
  const iconoHtml = icono ? `<div class="icono">${ICONOS_STAT_CARD[icono] || ""}</div>` : "";
  return `<div${idAttr} class="${clases}"${tituloAttr}>${iconoHtml}<div class="numero" data-valor-final="${valor}">${valorMostrado}</div><div class="etiqueta">${etiqueta}</div></div>`;
}

function irATodosLosEquipos() {
  $("buscador").value = "";
  $("filtroEmpresa").value = "";
  $("filtroStatus").value = "";
  $("filtroTipo").value = "";
  filtroCampoVacio = null;
  filtroEnRevision = false;
  filtroPropios = false;
  filtroLenovo = false;
  filtroRiolsaTodos = false;
  paginaActual = 1;
  cambiarVista("computadoras");
  render();
}

function irAEmpresasPanel() {
  cambiarVista("tablero");
  requestAnimationFrame(() => {
    $("tableroEmpresa")?.closest(".tablero-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function irAImpresorasVista() {
  cambiarVista("impresoras");
}

/* ---------- Donas de los paneles del tablero (Status/Empresa/Tipo/Fabricante) ---------- */

function hexARgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbAHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

function hslAHex(h, s, l) {
  h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r, g, b;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Paleta contrastada: paso fijo por indice (no dividido entre el total de
// categorias), asi la 2da y 3ra categoria ya se distinguen de la primera
// aunque haya muchas categorias chiquitas despues.
function generarPaletaDona(hex, n) {
  const { h, s, l } = rgbAHsl(hexARgb(hex).r, hexARgb(hex).g, hexARgb(hex).b);
  const colores = [];
  for (let i = 0; i < n; i++) {
    colores.push(hslAHex(h + i * 18, Math.max(42, s - i * 5), Math.min(80, l + i * 11)));
  }
  return colores;
}

function porcentajesRealesDona(valores, total) {
  return valores.map((v) => (v / total) * 100);
}

// Ancho minimo por categoria (Opcion B): las categorias muy chicas reciben
// un porcentaje minimo visible, y las grandes ceden ese espacio entre ellas.
function porcentajesConMinimoDona(valores, total, minPct = 6) {
  let pcts = porcentajesRealesDona(valores, total);
  const chicas = pcts.filter((p) => p < minPct);
  if (!chicas.length) return pcts;
  const sumaChicasObjetivo = chicas.length * minPct;
  const sumaGrandesOriginal = pcts.filter((p) => p >= minPct).reduce((s, p) => s + p, 0);
  const sumaGrandesObjetivo = 100 - sumaChicasObjetivo;
  const factor = sumaGrandesOriginal > 0 ? sumaGrandesObjetivo / sumaGrandesOriginal : 0;
  return pcts.map((p) => (p < minPct ? minPct : p * factor));
}

function pintarPanelConDona({ idDona, idLista, datosTop, total, hex, modo, campo, atributoCampo = "data-campo" }) {
  if (!datosTop.length) {
    $(idDona).innerHTML = "";
    $(idLista).innerHTML = "<p>Sin datos.</p>";
    return;
  }
  const sumaVisible = datosTop.reduce((s, [, v]) => s + v, 0);
  const otros = Math.max(0, total - sumaVisible);
  const segmentos = otros > 0 ? [...datosTop, ["Otros", otros]] : datosTop;
  const valores = segmentos.map(([, v]) => v);
  const pcts = modo === "B" ? porcentajesConMinimoDona(valores, total) : porcentajesRealesDona(valores, total);
  const paleta = generarPaletaDona(hex, segmentos.length);

  let acc = 0;
  const paradas = pcts.map((p, i) => {
    const desde = acc;
    acc += p;
    return `${paleta[i]} ${desde}% ${acc}%`;
  });

  $(idDona).innerHTML = `
    <div class="dona-wrap">
      <div class="dona" style="--dona-gradient: ${paradas.join(", ")}"></div>
      <div class="dona-total"><span class="num">${total}</span></div>
    </div>
  `;

  $(idLista).innerHTML = datosTop
    .map(([nombre, cantidad], i) => {
      const atributos = campo ? ` ${atributoCampo}="${campo}" data-valor="${String(nombre).replace(/"/g, "&quot;")}"` : "";
      return `<div class="tablero-fila fila-dona clickable" data-idx="${i}"${atributos}>
        <span class="punto-dona" style="background:${paleta[i]}"></span>
        <span class="nombre-dona">${esc(nombre)}</span>
        <span class="valor">${cantidad}</span>
      </div>`;
    })
    .join("");
}

document.addEventListener("mouseover", (ev) => {
  const fila = ev.target.closest(".fila-dona");
  if (!fila) return;
  const contenedor = fila.closest(".panel-cuerpo");
  if (!contenedor) return;
  contenedor.querySelectorAll(".fila-dona").forEach((f) => f.classList.toggle("atenuada", f !== fila));
});
document.addEventListener("mouseout", (ev) => {
  const fila = ev.target.closest(".fila-dona");
  if (!fila) return;
  const contenedor = fila.closest(".panel-cuerpo");
  if (!contenedor) return;
  contenedor.querySelectorAll(".fila-dona").forEach((f) => f.classList.remove("atenuada"));
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

  const impresoras = impresorasData;

  $("statCards").innerHTML =
    construirStatCard(equiposUsuarioValidados.length, "Equipos totales", { id: "tarjetaTotales", claseColor: "color-azul", clickable: true, icono: "pc", titulo: "Ver el listado completo" }) +
    construirStatCard(equiposLenovo, "Equipos Lenovo", { id: "tarjetaLenovo", claseColor: "color-indigo", clickable: true, icono: "laptop", titulo: "Ver equipos Lenovo" }) +
    construirStatCard(equiposPropios, "Equipos propios", { id: "tarjetaPropios", claseColor: "color-verde", clickable: true, icono: "pc", titulo: "Ver equipos propios" }) +
    construirStatCard(totalEmpresas, "Empresas", { id: "tarjetaEmpresas", claseColor: "color-fucsia", clickable: true, icono: "edificio", titulo: "Ver desglose por empresa" }) +
    construirStatCard(impresoras.length, "Impresoras Canon", { id: "tarjetaImpresoras", claseColor: "color-teal", clickable: true, icono: "impresora", titulo: "Ver catálogo de impresoras" }) +
    construirStatCard(propiosEnRevision, "En revisión (no está en cronograma AD)", { id: "tarjetaEnRevision", clickable: true, secundaria: true, icono: "alerta", titulo: "Ver equipos en revisión" });

  if (!statCardsAnimadas) {
    statCardsAnimadas = true;
    $("statCards").classList.add("animar");
    document.querySelectorAll("#statCards .numero").forEach(animarNumeroStatCard);
  }

  const filaHtml = (nombre, cantidad, campo) => {
    const clickable = !!campo;
    const atributos = clickable ? ` data-campo="${campo}" data-valor="${String(nombre).replace(/"/g, "&quot;")}"` : "";
    return `<div class="tablero-fila${clickable ? " clickable" : ""}"${atributos}><span>${esc(nombre)}</span><span class="valor">${cantidad}</span></div>`;
  };

  const totalHtml = (total) => `<div class="tablero-total"><span>Total</span><span class="valor">${total}</span></div>`;

  const statusSinServidores = contarPor("status", { excluirServidores: true, excluirEnRevision: true });
  const totalStatusSinServidores = statusSinServidores.reduce((s, [, c]) => s + c, 0);
  pintarPanelConDona({
    idDona: "tableroStatusDona", idLista: "tableroStatus", campo: "status",
    datosTop: statusSinServidores.slice(0, 8), total: totalStatusSinServidores, hex: "#1c3d6e", modo: "A",
  });
  $("tableroStatus").innerHTML += totalHtml(totalStatusSinServidores);

  const empresaSinServidores = contarPor("empresa", { excluirServidores: true, excluirEnRevision: true });
  const totalSinServidores = empresaSinServidores.reduce((s, [, c]) => s + c, 0);
  pintarPanelConDona({
    idDona: "tableroEmpresaDona", idLista: "tableroEmpresa", campo: "empresa",
    datosTop: empresaSinServidores.slice(0, 8), total: totalSinServidores, hex: "#a3336f", modo: "A",
  });
  $("tableroEmpresa").innerHTML += totalHtml(totalSinServidores);

  const tipoSinServidores = contarPor("tipoEquipo", { excluirServidores: true, excluirEnRevision: true, agruparTipoEquipo: true });
  pintarPanelConDona({
    idDona: "tableroTipoDona", idLista: "tableroTipo", campo: "tipoEquipo",
    datosTop: tipoSinServidores.slice(0, 8), total: totalSinServidores, hex: "#15803d", modo: "B",
  });
  $("tableroTipo").innerHTML += totalHtml(totalSinServidores);

  const fabricanteSinServidores = contarPor("fabricante", { excluirServidores: true, excluirEnRevision: true });
  pintarPanelConDona({
    idDona: "tableroFabricanteDona", idLista: "tableroFabricante", campo: "fabricante",
    datosTop: fabricanteSinServidores.slice(0, 8), total: totalSinServidores, hex: "#4338ca", modo: "B",
  });
  $("tableroFabricante").innerHTML += totalHtml(totalSinServidores);


  const contarImpresorasPor = (campo) => {
    const conteo = {};
    impresoras.forEach((p) => {
      const v = (p[campo] || "").trim() || "Sin dato";
      conteo[v] = (conteo[v] || 0) + 1;
    });
    return Object.entries(conteo).sort((a, b) => b[1] - a[1]);
  };

  pintarPanelConDona({
    idDona: "tableroImpresorasTipoDona", idLista: "tableroImpresorasTipo", campo: "tipo", atributoCampo: "data-campo-imp",
    datosTop: contarImpresorasPor("tipo"), total: impresoras.length, hex: "#0f766e", modo: "A",
  });
  pintarPanelConDona({
    idDona: "tableroImpresorasEmpresaDona", idLista: "tableroImpresorasEmpresa", campo: "empresa", atributoCampo: "data-campo-imp",
    datosTop: contarImpresorasPor("empresa"), total: impresoras.length, hex: "#b45309", modo: "A",
  });
  const departamentosImpresoras = contarImpresorasPor("departamento");
  pintarPanelConDona({
    idDona: "tableroImpresorasDepartamentoDona", idLista: "tableroImpresorasDepartamento", campo: "departamento", atributoCampo: "data-campo-imp",
    datosTop: departamentosImpresoras.slice(0, 8), total: impresoras.length, hex: "#334155", modo: "B",
  });
  $("btnVerTodosDepartamentos").textContent = `Ver los ${departamentosImpresoras.length} departamentos →`;
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
  const ordenada = [...impresorasData].sort((a, b) => (a.departamento || "").localeCompare(b.departamento || ""));
  return ordenada.map((p) => ({
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
  alClicFila: (r) => abrirModalImpresora(r.impresora),
});

function obtenerCodigos() {
  return codigosData.map((c) => ({
    codigo: c,
    celdas: `
      <td>${esc(c.idUsuario)}</td>
      <td>${esc(c.nombre)}</td>
      <td>${esc(c.clave)}</td>
      <td>${esc(c.observacion)}</td>
      <td>${esc(c.origen)}</td>
      <td>${esc(c.agregadoPor)}</td>
    `,
  }));
}

const vistaCodigos = crearVistaLista({
  prefix: "codigos",
  columnas: 6,
  obtenerFilas: obtenerCodigos,
  // Busqueda amigable: cada palabra escrita (nombre, apellido, ID o clave, en
  // cualquier orden) tiene que aparecer en algun lado del registro, no
  // necesariamente en ese orden ni todo junto.
  filtrar: (r, t) => {
    const texto = [r.codigo.idUsuario, r.codigo.nombre, r.codigo.clave, r.codigo.observacion, r.codigo.origen, r.codigo.agregadoPor]
      .join(" ")
      .toLowerCase();
    return t.split(/\s+/).filter(Boolean).every((palabra) => texto.includes(palabra));
  },
  alClicFila: (r) => abrirModalCodigo(r.codigo),
});

function obtenerContratosMoviles() {
  return contratosMovilesData.map((c) => ({
    contrato: c,
    celdas: `
      <td>${esc(c.empresa)}</td>
      <td>${esc(c.operador)}</td>
      <td>${esc(c.tipoGestion)}</td>
      <td>${esc(c.planContratado)}</td>
      <td>${esc(c.plazoContrato)}</td>
      <td>${esc(c.cantidadLineas)}</td>
      <td>${c.totalMensual ? "Q " + Number(c.totalMensual).toFixed(2) : ""}</td>
      <td>${esc(c.fechaFirma)}</td>
    `,
  }));
}

const vistaContratosMoviles = crearVistaLista({
  prefix: "contratosMoviles",
  columnas: 8,
  obtenerFilas: obtenerContratosMoviles,
  filtrar: (r, t) => {
    const texto = [r.contrato.empresa, r.contrato.operador, r.contrato.nit, r.contrato.planContratado, r.contrato.tipoGestion, r.contrato.representanteLegal]
      .join(" ")
      .toLowerCase();
    return t.split(/\s+/).filter(Boolean).every((palabra) => texto.includes(palabra));
  },
  alClicFila: (r) => abrirModalContratoMovil(r.contrato),
});

function obtenerLineasMoviles() {
  return lineasMovilesData.map((l) => ({
    linea: l,
    celdas: `
      <td>${esc(l.numero)}</td>
      <td>${esc(l.modelo)}</td>
      <td>${esc(l.plan)}</td>
      <td>${l.tarifaPlan ? "Q " + Number(l.tarifaPlan).toFixed(2) : ""}</td>
      <td>${esc(l.usuarioAsignado)}</td>
      <td>${esc(l.empresa)}</td>
      <td>${esc(l.estado)}</td>
    `,
  }));
}

const vistaLineasMoviles = crearVistaLista({
  prefix: "lineasMoviles",
  columnas: 7,
  obtenerFilas: obtenerLineasMoviles,
  filtrar: (r, t) => {
    const texto = [r.linea.numero, r.linea.modelo, r.linea.usuarioAsignado, r.linea.empresa, r.linea.plan, r.linea.imei, r.linea.iccidEsn]
      .join(" ")
      .toLowerCase();
    return t.split(/\s+/).filter(Boolean).every((palabra) => texto.includes(palabra));
  },
  alClicFila: (r) => abrirModalLineaMovil(r.linea),
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

$("btnNuevaImpresora").addEventListener("click", () => abrirModalImpresora(null));
$("btnCerrarModalImpresora").addEventListener("click", cerrarModalImpresora);
$("btnCancelarImpresora").addEventListener("click", cerrarModalImpresora);
$("btnEliminarModalImpresora").addEventListener("click", eliminarImpresoraActual);
$("formImpresora").addEventListener("submit", onSubmitImpresora);

$("btnNuevoCodigo").addEventListener("click", () => abrirModalCodigo(null));
$("btnCerrarModalCodigo").addEventListener("click", cerrarModalCodigo);
$("btnCancelarCodigo").addEventListener("click", cerrarModalCodigo);
$("btnEliminarModalCodigo").addEventListener("click", eliminarCodigoActual);
$("formCodigo").addEventListener("submit", onSubmitCodigo);

$("btnNuevoContratoMovil").addEventListener("click", () => abrirModalContratoMovil(null));
$("btnImprimirContratoMovil").addEventListener("click", imprimirContratoMovil);
$("btnCerrarModalContratoMovil").addEventListener("click", cerrarModalContratoMovil);
$("btnCancelarContratoMovil").addEventListener("click", cerrarModalContratoMovil);
$("btnEliminarModalContratoMovil").addEventListener("click", eliminarContratoMovilActual);
$("formContratoMovil").addEventListener("submit", onSubmitContratoMovil);

$("btnNuevaLineaMovil").addEventListener("click", () => abrirModalLineaMovil(null));
$("btnCerrarModalLineaMovil").addEventListener("click", cerrarModalLineaMovil);
$("btnCancelarLineaMovil").addEventListener("click", cerrarModalLineaMovil);
$("btnEliminarModalLineaMovil").addEventListener("click", eliminarLineaMovilActual);
$("formLineaMovil").addEventListener("submit", onSubmitLineaMovil);

$("btnGenerarActa").addEventListener("click", abrirModalActa);
$("btnCerrarModalActa").addEventListener("click", cerrarModalActa);
$("btnCancelarActa").addEventListener("click", cerrarModalActa);
$("btnGenerarEImprimir").addEventListener("click", generarEImprimirActa);
$("actaNombreRed").addEventListener("input", onCambioNombreRedActa);

$("btnDashboard").addEventListener("click", () => {
  window.open("dashboard.html?v=20260811k", "dashboardInventarioTI", "width=1280,height=900");
});

$("btnVerTodosDepartamentos").addEventListener("click", () => irACatalogoImpresorasFiltrado(null, ""));

$("btnPbiActa").addEventListener("click", abrirModalActa);

$("btnNuevoIngreso").addEventListener("click", abrirModalIngreso);
$("btnCerrarModalIngreso").addEventListener("click", cerrarModalIngreso);
$("btnCancelarIngreso").addEventListener("click", cerrarModalIngreso);
$("btnGenerarIngreso").addEventListener("click", generarIngresoCompleto);
$("ingresoNombreRed").addEventListener("input", onCambioNombreRedIngreso);

$("conteoRapidoInput").addEventListener("input", actualizarConteoRapido);

$("filtroVacioAviso").addEventListener("click", () => { filtroCampoVacio = null; filtroEnRevision = false; filtroPropios = false; filtroLenovo = false; filtroRiolsaTodos = false; paginaActual = 1; render(); });

$("buscador").addEventListener("input", () => { filtroCampoVacio = null; filtroEnRevision = false; filtroPropios = false; filtroLenovo = false; filtroRiolsaTodos = false; paginaActual = 1; render(); });
$("filtroEmpresa").addEventListener("change", () => { filtroCampoVacio = null; filtroEnRevision = false; filtroPropios = false; filtroLenovo = false; filtroRiolsaTodos = false; paginaActual = 1; render(); });
$("filtroStatus").addEventListener("change", () => { filtroCampoVacio = null; filtroEnRevision = false; filtroPropios = false; filtroLenovo = false; filtroRiolsaTodos = false; paginaActual = 1; render(); });
$("filtroTipo").addEventListener("change", () => { filtroCampoVacio = null; filtroEnRevision = false; filtroPropios = false; filtroLenovo = false; filtroRiolsaTodos = false; paginaActual = 1; render(); });

$("btnPrimero").addEventListener("click", () => { paginaActual = 1; render(); });
$("btnAnterior").addEventListener("click", () => { paginaActual--; render(); });
$("btnSiguiente").addEventListener("click", () => { paginaActual++; render(); });
$("btnUltimo").addEventListener("click", () => {
  paginaActual = Math.ceil(obtenerFiltrados().length / PAGE_SIZE);
  render();
});

cargarDatos();
cargarImpresoras();
cargarCodigos();
cargarContratosMoviles();
cargarLineasMoviles();
poblarFiltrosYDatalists();
render();
renderTablero();
