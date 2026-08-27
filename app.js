const STORAGE_KEY = "equiposTI_v2";
const CONTADOR_KEY = "actaContador_v1";
const IMPRESORAS_STORAGE_KEY = "impresorasTI_v1";
const CODIGOS_STORAGE_KEY = "codigosImpresionTI_v1";
const CONTRATOS_MOVILES_STORAGE_KEY = "contratosMovilesTI_v1";
const LINEAS_MOVILES_STORAGE_KEY = "lineasMovilesTI_v1";
const CONTRATOS_OFICINA_STORAGE_KEY = "contratosOficinaTI_v1";
const SERVICIOS_OFICINA_STORAGE_KEY = "serviciosOficinaTI_v1";
const DOCUMENTOS_ANEXO_MOVILES_STORAGE_KEY = "documentosAnexoMovilesTI_v1";
const DOCUMENTOS_ANEXO_OFICINA_STORAGE_KEY = "documentosAnexoOficinaTI_v1";
const TICKETS_GARANTIA_STORAGE_KEY = "ticketsGarantiaTI_v1";
const MANTENIMIENTO_EQUIPOS_STORAGE_KEY = "mantenimientoEquiposTI_v1";
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

const TICKET_GARANTIA_FIELD_IDS = [
  "tgId", "tgProveedor", "tgEquipo", "tgNumeroTicket", "tgFechaReporte",
  "tgEstado", "tgDescripcionFalla", "tgComentarios",
];
const TICKET_GARANTIA_CAMPO_POR_ID = {
  tgId: "id", tgProveedor: "proveedor", tgEquipo: "equipoRef", tgNumeroTicket: "numeroTicket",
  tgFechaReporte: "fechaReporte", tgEstado: "estado", tgDescripcionFalla: "descripcionFalla",
  tgComentarios: "comentarios",
};

const MANTENIMIENTO_EQUIPOS_FIELD_IDS = [
  "meId", "meEquipo", "meFechaIngreso", "meProblema",
  "meTecnico", "meObservaciones",
];
const MANTENIMIENTO_EQUIPOS_CAMPO_POR_ID = {
  meId: "id", meEquipo: "equipoRef", meFechaIngreso: "fechaIngreso",
  meProblema: "problema", meTecnico: "tecnico",
  meObservaciones: "observaciones",
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
  "lmId", "lmNumero", "lmModelo", "lmImei", "lmIccidEsn", "lmCostoEquipo", "lmPlan", "lmTarifaPlan",
  "lmTipoServicioCloud", "lmServicioCloud", "lmCorreoSpacesuite", "lmSpacesuite",
  "lmCorreoCorporativo", "lmAppsCorp", "lmNavegacionApps", "lmSuitcase",
  "lmPentcloud", "lmLlamadasIlimitadas", "lmPaqueteRoaming", "lmClaroDirecto", "lmVpn",
  "lmAviDesvioPrepago", "lmDescuentoAutomatico", "lmTarifaTotal", "lmEmpresa",
  "lmOperador", "lmMarca", "lmColor", "lmRam", "lmRom", "lmSerie",
  "lmEmpleadoNombre", "lmEmpleadoPuesto", "lmDpiPasaporte",
  "lmAnteriorMarca", "lmAnteriorModelo", "lmAnteriorColor", "lmAnteriorRam",
  "lmAnteriorRom", "lmAnteriorSerie", "lmAnteriorImei",
  "lmNumeroControl", "lmRevision", "lmNumeroMadre", "lmResponsableFacturacion",
  "lmCodSapUsuario", "lmNombreUsuario", "lmCargo", "lmDepartamentoUsuario", "lmSegmento",
  "lmAdOp", "lmServicio", "lmClasificacion", "lmPaqueteGprs", "lmFechaRenovacion",
  "lmFechaExpiracion", "lmHojaRespCodigo", "lmCodContrato",
  "lmObservaciones1", "lmObservaciones2", "lmObservaciones3",
];
const LINEA_MOVIL_CAMPO_POR_ID = {
  lmId: "id", lmNumero: "numero", lmModelo: "modelo", lmImei: "imei", lmIccidEsn: "iccidEsn",
  lmCostoEquipo: "costoEquipo", lmPlan: "plan", lmTarifaPlan: "tarifaPlan",
  lmTipoServicioCloud: "tipoServicioCloud", lmServicioCloud: "servicioCloud",
  lmCorreoSpacesuite: "correoSpacesuite", lmSpacesuite: "spacesuite",
  lmCorreoCorporativo: "correoCorporativo",
  lmAppsCorp: "appsCorp", lmNavegacionApps: "navegacionApps", lmSuitcase: "suitcase",
  lmPentcloud: "pentcloud", lmLlamadasIlimitadas: "llamadasIlimitadas",
  lmPaqueteRoaming: "paqueteRoaming", lmClaroDirecto: "claroDirecto", lmVpn: "vpn",
  lmAviDesvioPrepago: "aviDesvioPrepago", lmDescuentoAutomatico: "descuentoAutomatico",
  lmTarifaTotal: "tarifaTotal", lmEmpresa: "empresa",
  lmOperador: "operador", lmMarca: "marca", lmColor: "color", lmRam: "ram", lmRom: "rom", lmSerie: "serie",
  lmEmpleadoNombre: "empleadoNombre", lmEmpleadoPuesto: "empleadoPuesto", lmDpiPasaporte: "dpiPasaporte",
  lmAnteriorMarca: "anteriorMarca", lmAnteriorModelo: "anteriorModelo", lmAnteriorColor: "anteriorColor",
  lmAnteriorRam: "anteriorRam", lmAnteriorRom: "anteriorRom", lmAnteriorSerie: "anteriorSerie",
  lmAnteriorImei: "anteriorImei",
  lmNumeroControl: "numeroControl", lmRevision: "revision", lmNumeroMadre: "numeroMadre",
  lmResponsableFacturacion: "responsableFacturacion", lmCodSapUsuario: "codSapUsuario",
  lmNombreUsuario: "nombreUsuario", lmCargo: "cargo", lmDepartamentoUsuario: "departamentoUsuario",
  lmSegmento: "segmento", lmAdOp: "adOp", lmServicio: "servicio", lmClasificacion: "clasificacion",
  lmPaqueteGprs: "paqueteGprs", lmFechaRenovacion: "fechaRenovacion", lmFechaExpiracion: "fechaExpiracion",
  lmHojaRespCodigo: "hojaRespCodigo", lmCodContrato: "codContrato",
  lmObservaciones1: "observaciones1", lmObservaciones2: "observaciones2", lmObservaciones3: "observaciones3",
};

const CONTRATO_OFICINA_FIELD_IDS = [
  "coId", "coEmpresa", "coNombreComercial", "coNit", "coCategoriaCliente", "coTipoGestion",
  "coDireccion", "coDepartamentoCiudad", "coRepresentanteLegal", "coDocIdentificacion",
  "coAntiguedad", "coSalario", "coContactoNombre", "coContactoTelefono", "coContactoCorreo",
  "coPlazoContrato", "coTelefono", "coInstalacion1", "coInstalacion2", "coInstalacion3",
  "coInstalacion4", "coInstalacion5", "coPaqueteContratar", "coTipoRed", "coSubTotal",
  "coInstalacionCosto", "coRentaTotal", "coLineaFijaCantidad", "coLineaFijaDescripcion",
  "coInternetPyme", "coTvPyme", "coServicioAdicional", "coTelevisoresAdicionales", "coEmailIptv",
  "coActivarClaroDrive", "coActivarPagolo", "coIpPublica", "coDtaAdicional", "coDcxAdicional",
  "coEquipoDthAdicional", "coAplicaFinanciamiento", "coEjecutivoVentas", "coFechaFirma",
  "coCodigoMaestro", "coObservaciones",
];
const CONTRATO_OFICINA_CAMPO_POR_ID = {
  coId: "id", coEmpresa: "empresa", coNombreComercial: "nombreComercial", coNit: "nit",
  coCategoriaCliente: "categoriaCliente", coTipoGestion: "tipoGestion", coDireccion: "direccion",
  coDepartamentoCiudad: "departamentoCiudad", coRepresentanteLegal: "representanteLegal",
  coDocIdentificacion: "docIdentificacion", coAntiguedad: "antiguedad", coSalario: "salario",
  coContactoNombre: "contactoNombre", coContactoTelefono: "contactoTelefono",
  coContactoCorreo: "contactoCorreo", coPlazoContrato: "plazoContrato", coTelefono: "telefono",
  coInstalacion1: "instalacion1", coInstalacion2: "instalacion2", coInstalacion3: "instalacion3",
  coInstalacion4: "instalacion4", coInstalacion5: "instalacion5",
  coPaqueteContratar: "paqueteContratar", coTipoRed: "tipoRed", coSubTotal: "subTotal",
  coInstalacionCosto: "instalacionCosto", coRentaTotal: "rentaTotal",
  coLineaFijaCantidad: "lineaFijaCantidad", coLineaFijaDescripcion: "lineaFijaDescripcion",
  coInternetPyme: "internetPyme", coTvPyme: "tvPyme", coServicioAdicional: "servicioAdicional",
  coTelevisoresAdicionales: "televisoresAdicionales", coEmailIptv: "emailIptv",
  coActivarClaroDrive: "activarClaroDrive", coActivarPagolo: "activarPagolo",
  coIpPublica: "ipPublica", coDtaAdicional: "dtaAdicional", coDcxAdicional: "dcxAdicional",
  coEquipoDthAdicional: "equipoDthAdicional", coAplicaFinanciamiento: "aplicaFinanciamiento",
  coEjecutivoVentas: "ejecutivoVentas", coFechaFirma: "fechaFirma",
  coCodigoMaestro: "codigoMaestro", coObservaciones: "observaciones",
};

const SERVICIO_OFICINA_FIELD_IDS = ["soId", "soEmpresa", "soTipoServicio", "soCantidad", "soInstalacion", "soCuotaMensual"];
const SERVICIO_OFICINA_CAMPO_POR_ID = {
  soId: "id", soEmpresa: "empresa", soTipoServicio: "tipoServicio",
  soCantidad: "cantidad", soInstalacion: "instalacion", soCuotaMensual: "cuotaMensual",
};

let impresorasData = [];
let codigosData = [];
let contratosMovilesData = [];
let lineasMovilesData = [];
let contratosOficinaData = [];
let serviciosOficinaData = [];
let documentosAnexoMovilesData = [];
let documentosAnexoOficinaData = [];
let ticketsGarantiaData = [];
let mantenimientoEquiposData = [];
let equiposTIv2Data = [];

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
  "monitor", "numeroInventarioMonitor", "tamanoDisco", "datosImpresora", "serialImpresora",
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
  // Contratos generados a partir del maestro CONTROL_DE_LINEAS_TELEFONICAS.xlsx:
  // uno por cada sociedad distinta que aparece en el archivo, con la cantidad
  // de lineas y el total mensual sumado de esa hoja. El resto de datos del
  // contrato (NIT, representante legal, plazo, fecha de firma, etc.) no viene
  // en ese archivo y se deja en blanco hasta que se complete manualmente.
  { empresa: "ADMINISTRADORA EL OLIVO, S.A.", operador: "CLARO", cantidadLineas: 2, totalMensual: 400.0 },
  { empresa: "BREEMER, S.A.", operador: "CLARO", cantidadLineas: 71, totalMensual: 23875.0 },
  { empresa: "BROADCLOTH, S.A.", operador: "CLARO", cantidadLineas: 7, totalMensual: 2204.0 },
  { empresa: "COMERPAC. S.A.", operador: "TIGO", cantidadLineas: 36, totalMensual: 1896.0 },
  { empresa: "CONDOMINIO TIKAL FUTURA", operador: "CLARO", cantidadLineas: 1, totalMensual: 110.0 },
  { empresa: "CORPORACION GALA", operador: "CLARO", cantidadLineas: 3, totalMensual: 315.0 },
  { empresa: "ENERGIA DISPONIBLE", operador: "CLARO", cantidadLineas: 5, totalMensual: 1045.0 },
  { empresa: "ENERGIA INMEDIATA S.A.", operador: "CLARO", cantidadLineas: 11, totalMensual: 2189.0 },
  { empresa: "ENERGIA INMEDIATA, S.A.", operador: "TIGO", cantidadLineas: 4, totalMensual: 114.0 },
  { empresa: "ENERGÍA DISPONIBLE", operador: "CLARO", cantidadLineas: 4, totalMensual: 927.0 },
  { empresa: "HOTEL FUTURA, S.A", operador: "CLARO", cantidadLineas: 1, totalMensual: 53.0 },
  { empresa: "MALVERTH, S.A.", operador: "CLARO", cantidadLineas: 6, totalMensual: 1324.0 },
  { empresa: "PASAC", operador: "CLARO", cantidadLineas: 2, totalMensual: 252.0 },
  { empresa: "PERSONAS Y SERVICIOS, S.A.", operador: "CLARO", cantidadLineas: 10, totalMensual: 2748.0 },
  { empresa: "RECURSOS ENERGETICOS PASAC, S.A.", operador: "CLARO", cantidadLineas: 1, totalMensual: 199.0 },
  { empresa: "RIOL, S.A.", operador: "CLARO", cantidadLineas: 1, totalMensual: 209.0 },
  { empresa: "RIOLSA", operador: "TIGO", cantidadLineas: 1, totalMensual: 299.0 },
  { empresa: "ROYTEX S.A.", operador: "CLARO", cantidadLineas: 1, totalMensual: 1370.0 },
  { empresa: "ROYTEX, S.A.", operador: "CLARO", cantidadLineas: 6, totalMensual: 1194.0 },
  { empresa: "TAUNTON, S.A.", operador: "TIGO", cantidadLineas: 1, totalMensual: 379.0 },
  { empresa: "TECNOELECT, S.A.", operador: "CLARO", cantidadLineas: 1, totalMensual: 209.0 },
  { empresa: "TENNAT, S.A", operador: "CLARO", cantidadLineas: 12, totalMensual: 2640.0 },
  { empresa: "TEXTILES LIZTEX, S.A.", operador: "CLARO", cantidadLineas: 1, totalMensual: 105.0 },
  { empresa: "VARENNA, SOCIEDAD ANONIMA", operador: "CLARO", cantidadLineas: 2, totalMensual: 398.0 },
];

function cargarContratosMoviles() {
  const raw = localStorage.getItem(CONTRATOS_MOVILES_STORAGE_KEY);
  const semilla = SEMILLA_CONTRATOS_MOVILES.map((c, i) => ({ ...c, id: c.id || `semilla-cm-${i}` }));
  if (raw) {
    try {
      contratosMovilesData = JSON.parse(raw);
      // El navegador ya tenia datos guardados de una sesion anterior, asi que
      // la semilla no se vuelve a cargar sola (solo pasa si esta vacio). Si se
      // agregaron mas contratos a la semilla despues (import de un Excel
      // nuevo), se agregan aqui los que todavia no existan localmente, sin
      // tocar lo que ya se guardo o edito a mano.
      const idsExistentes = new Set(contratosMovilesData.map((c) => c.id));
      const nuevos = semilla.filter((c) => !idsExistentes.has(c.id));
      if (nuevos.length) {
        contratosMovilesData = contratosMovilesData.concat(nuevos);
        guardarContratosMoviles();
      }
      return;
    } catch {
      contratosMovilesData = [];
    }
  }
  contratosMovilesData = semilla;
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
  { numero: "50256968642", modelo: "SAMSUNG A 17 256GB", tarifaTotal: 209, empresa: "GENERADORAL SOL, SOCIEDAD ANONIMA", estado: "Activa" },

  // Lineas importadas del maestro CONTROL_DE_LINEAS_TELEFONICAS.xlsx
  // (hoja SEGUIMIENTO, 190 registros reales de 24 empresas).
  { numeroControl: 41, empresa: "RECURSOS ENERGETICOS PASAC, S.A.", numero: "56963424", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: "10004232 /10000524", nombreUsuario: "SERAPIO  COLOP Y COLOP / ERNESTO TRINIDAD CAMACHO SAQUIMUX", cargo: "Supervisor de proceso /Electricista Cuevamaría", departamentoUsuario: "EN-Cueva Maria", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 20 GB", paqueteGprs: "1084 - Internet 20GB Corp", tarifaPlan: 199, fechaRenovacion: "2024-12-27", fechaExpiracion: "2026-06-27", marca: "REDMI", modelo: 13, hojaRespCodigo: "2025-09" },
  { numeroControl: 70, empresa: "ADMINISTRADORA EL OLIVO, S.A.", revision: "Nueva administración se encuentra recuperandola", numero: "59221657", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10004890, nombreUsuario: "VICTOR ESTUARDO SANCHEZ MORALES", cargo: "telentry - Altos de victorias", departamentoUsuario: "IN-Victorias y Parques Industriales", segmento: "INMOBILIARIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea movil", plan: "llamadas ilimitadas + 22GB", paqueteGprs: "22GB", tarifaPlan: 200, fechaRenovacion: "2025-05-28", fechaExpiracion: "2026-11-27", marca: "N/A", modelo: "N/A", hojaRespCodigo: "2025-54" },
  { numeroControl: 71, empresa: "ADMINISTRADORA EL OLIVO, S.A.", revision: "Nueva administración se encuentra recuperandola", numero: "59221733", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10004890, nombreUsuario: "VICTOR ESTUARDO SANCHEZ MORALES", cargo: "telentry - garita peatonal Res. Las Victorias", departamentoUsuario: "IN-Victorias y Parques Industriales", segmento: "INMOBILIARIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea movil", plan: "llamadas ilimitadas + 22GB", paqueteGprs: "22GB", tarifaPlan: 200, fechaRenovacion: "2025-05-28", fechaExpiracion: "2026-11-27", marca: "N/A", modelo: "N/A", hojaRespCodigo: "2025-54" },
  { numeroControl: 3, empresa: "BREEMER, S.A.", numero: "14792788", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "GG", cargo: "CARRETERA AL SALVADOR RESIDENCIAL MONTE BELLO", departamentoUsuario: "GG", segmento: "CORPORATIVO", adOp: "AD", servicio: "Servicio recidencial", clasificacion: "Serv. Recidencial", plan: "Servicio Home", paqueteGprs: "TIGO PROMO", tarifaPlan: 499, fechaRenovacion: "2023-10-30", fechaExpiracion: "2021-02-24", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A", observaciones1: "SERV SIN CONTRATO" },
  { numeroControl: 5, empresa: "BREEMER, S.A.", numero: "1811796", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "GG", cargo: "CRT A EL SALVADOR, 007-001 ZONA 4, KM 9.2 OFICINA 11 RESIDENCIALES MONTE BELLO I, SANTA CATARINA PINULA,GUATEMALA", departamentoUsuario: "GG", segmento: "CORPORATIVO", adOp: "AD", servicio: "Servicio recidencial", clasificacion: "Serv. Recidencial", plan: "CASA CLARO TRIPLE", paqueteGprs: "CASA CLARO", tarifaPlan: 360, fechaRenovacion: "2020-02-18", fechaExpiracion: "2022-02-17", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A", observaciones1: "SERV SIN CONTRATO" },
  { numeroControl: 13, empresa: "BREEMER, S.A.", numero: "50337081", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "MSH", cargo: "GG", departamentoUsuario: "GG", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "Ilimitados+ 70GB", paqueteGprs: "70GB", tarifaPlan: 580, fechaRenovacion: "2023-11-01", fechaExpiracion: "2025-11-01", marca: "IPHONE", modelo: 11, hojaRespCodigo: "2023-74" },
  { numeroControl: 14, empresa: "BREEMER, S.A.", numero: "51828975", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "GG", cargo: "MODEM - GG", departamentoUsuario: "GG", segmento: "CORPORATIVO", adOp: "AD", servicio: "Internet movil", clasificacion: "Internet movil", plan: "30GB", paqueteGprs: "30GB", tarifaPlan: 349, fechaRenovacion: "2023-11-01", fechaExpiracion: "2025-11-01", hojaRespCodigo: "N/A" },
  { numeroControl: 15, empresa: "BREEMER, S.A.", numero: "52022700", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "MH", cargo: "GG", departamentoUsuario: "GG", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "Ilimitados+ 90GB", paqueteGprs: "90GB", tarifaPlan: 580, fechaRenovacion: "2023-11-01", fechaExpiracion: "2025-11-01", hojaRespCodigo: "N/A" },
  { numeroControl: 16, empresa: "BREEMER, S.A.", numero: "52051961", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "JOSE FABIAN GOMEZ", cargo: "S-GG", departamentoUsuario: "GG", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 25GB", paqueteGprs: "25GB", tarifaPlan: 315, fechaRenovacion: "2023-11-01", fechaExpiracion: "2025-11-01", marca: "SAMSUNG", modelo: "A23", hojaRespCodigo: "2024-09" },
  { numeroControl: 17, empresa: "BREEMER, S.A.", numero: "52053869", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "FEDERICO GUZMAN", cargo: "S-GG", departamentoUsuario: "GG", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 25GB", paqueteGprs: "25GB", tarifaPlan: 315, fechaRenovacion: "2023-11-01", fechaExpiracion: "2025-11-01", marca: "SAMSUNG", modelo: "A23", hojaRespCodigo: "2024-08" },
  { numeroControl: 18, empresa: "BREEMER, S.A.", numero: "53089551", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "PEDRO ELIAS", cargo: "S-GG", departamentoUsuario: "GG", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 25GB", paqueteGprs: "25GB", tarifaPlan: 315, fechaRenovacion: "2023-11-01", fechaExpiracion: "2025-11-01", marca: "SAMSUNG", modelo: "A23", hojaRespCodigo: "2024-22" },
  { numeroControl: 19, empresa: "BREEMER, S.A.", numero: "53183119", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "JUAN URIAS", cargo: "M-GG", departamentoUsuario: "GG", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 25GB", paqueteGprs: "25GB", tarifaPlan: 315, fechaRenovacion: "2023-11-01", fechaExpiracion: "2025-11-01", marca: "SAMSUNG", modelo: "A23", hojaRespCodigo: "2024-69", observaciones1: "usurio anterior: eynar pinto traslado de línea" },
  { numeroControl: 26, empresa: "BREEMER, S.A.", revision: "Nueva administración se encuentra recuperandola", numero: "42513554", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "VICTOR ESTUARDO SANCHEZ MORALES", cargo: "Telentry -Res. Las Victorias", departamentoUsuario: "Residenciales - inmobiliaria", segmento: "INMOBILIARIA", adOp: "AD", servicio: "Internet movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 20 GB", paqueteGprs: "1084 - Internet 20GB Corp", tarifaPlan: 199, fechaRenovacion: "2024-10-31", fechaExpiracion: "2026-04-30", marca: "N/A", modelo: "N/A", hojaRespCodigo: "2025-54" },
  { numeroControl: 27, empresa: "BREEMER, S.A.", numero: "39956920", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10005006, nombreUsuario: "MANUEL ALBERTO TELLO MARTINEZ", cargo: "Director de Logística y MP", departamentoUsuario: "CORP-AB- Logística y Materias Primas", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8081 - G-EMPRESAS ILIM 25GB", paqueteGprs: "1782 - Internet 25GB Corp", tarifaPlan: 299, fechaRenovacion: "2024-10-31", fechaExpiracion: "2026-04-30", marca: "SAMSUNG", modelo: "A15", hojaRespCodigo: "2025-06" },
  { numeroControl: 28, empresa: "BREEMER, S.A.", numero: "41548001", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "UH", cargo: "GG", departamentoUsuario: "GG", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8082 - G-EMPRESAS ILIM 30GB", paqueteGprs: "1496 - Internet 30GB Corp", tarifaPlan: 399, fechaRenovacion: "2024-10-31", fechaExpiracion: "2026-04-30", hojaRespCodigo: "N/A" },
  { numeroControl: 29, empresa: "BREEMER, S.A.", numero: "41548002", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "MIGUEL ESTUARDO LOPEZ RUIZ", cargo: "GERENTE DE RECLUTAMIENTO TEXTIL", departamentoUsuario: "TX-Reclutamiento", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 20 GB", paqueteGprs: "1084 - Internet 20GB Corp", tarifaPlan: 199, fechaRenovacion: "2024-10-31", fechaExpiracion: "2026-04-30", marca: "SAMSUNG", modelo: "A13", hojaRespCodigo: "2024-54" },
  { numeroControl: 30, empresa: "BREEMER, S.A.", numero: "42120088", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "MH", cargo: "GG", departamentoUsuario: "GG", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "6418 - G-EMPRESARIAL AV 600", paqueteGprs: "1432 - Internet 50GB /10GBAMX/10GBMUN", tarifaPlan: 1294, fechaRenovacion: "2024-10-31", fechaExpiracion: "2026-04-30", hojaRespCodigo: "N/A" },
  { numeroControl: 31, empresa: "BREEMER, S.A.", numero: "42510138", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10003560, nombreUsuario: "RUBEN  VAQUIAX GUAT", cargo: "Gerente de Auditoria", departamentoUsuario: "AU-Area Auditoria", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8081 - G-EMPRESAS ILIM 25GB", paqueteGprs: "1782 - Internet 25GB Corp", tarifaPlan: 299, fechaRenovacion: "2024-10-31", fechaExpiracion: "2026-04-30", marca: "SAMSUNG", modelo: "A25", hojaRespCodigo: "2025-71" },
  { numeroControl: 32, empresa: "BREEMER, S.A.", numero: "47145584", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10005687, nombreUsuario: "WILLIAM SAMUEL GUEVARA ORELLANA", cargo: "Director de Tecnologia e Información", departamentoUsuario: "IT - Tecnología e Información", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 20 GB", paqueteGprs: "1084 - Internet 20GB Corp", tarifaPlan: 200, fechaRenovacion: "2024-10-31", fechaExpiracion: "2026-04-30", marca: "IPHONE", modelo: 15, hojaRespCodigo: "2025-70", observaciones1: "usuario anterior: Luis Pusey baja: 30/1/23" },
  { numeroControl: 33, empresa: "BREEMER, S.A.", numero: "47148397", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10004717, nombreUsuario: "ORESTER MOISES PEÑA LOPEZ", cargo: "Especialista de Abastecimiento e Imp.", departamentoUsuario: "CORP-AB-LMP-AB e Importaciones", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 20 GB", paqueteGprs: "1084 - Internet 20GB Corp", tarifaPlan: 199, fechaRenovacion: "2024-10-31", fechaExpiracion: "2026-04-30", marca: "SAMSUNG", modelo: "A15", hojaRespCodigo: "2025-02" },
  { numeroControl: 34, empresa: "BREEMER, S.A.", numero: "54128722", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "AH", cargo: "GG", departamentoUsuario: "GG", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "6418 - G-EMPRESARIAL AV 600", paqueteGprs: "1432 - Internet 50GB /10GBAMX/10GBMUN", tarifaPlan: 1294, fechaRenovacion: "2024-10-31", fechaExpiracion: "2026-04-30", hojaRespCodigo: "N/A" },
  { numeroControl: 35, empresa: "BREEMER, S.A.", numero: "54811024", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "GG", cargo: "GG", departamentoUsuario: "GG", segmento: "CORPORATIVO", adOp: "AD", servicio: "Internet movil", clasificacion: "Modem", plan: "8541 - G-Corp Internet 20GB", paqueteGprs: "20 - Servicios GPRS", tarifaPlan: 200, fechaRenovacion: "2024-10-31", fechaExpiracion: "2026-04-30", hojaRespCodigo: "N/A" },
  { numeroControl: 36, empresa: "BREEMER, S.A.", numero: "55799533", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "DH", cargo: "GG", departamentoUsuario: "GG", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "6418 - G-EMPRESARIAL AV 600", paqueteGprs: "1432 - Internet 50GB /10GBAMX/10GBMUN", tarifaPlan: 1294, fechaRenovacion: "2024-10-31", fechaExpiracion: "2026-04-30", hojaRespCodigo: "N/A" },
  { numeroControl: 25, empresa: "BREEMER, S.A.", numero: "30300916", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "MODEM TI - GUSTAVO GARCÍA", cargo: "Comodin TI para dif. áreas", departamentoUsuario: "IT - Tecnología e Información", segmento: "CORPORATIVO", adOp: "AD", servicio: "Internet movil", clasificacion: "Internet movil", plan: "10GB", paqueteGprs: "10GB", tarifaPlan: 149, fechaRenovacion: "2024-10-31", fechaExpiracion: "2026-04-30", marca: "HUAWEI", modelo: "F30", hojaRespCodigo: "2023-17" },
  { numeroControl: 48, empresa: "BREEMER, S.A.", revision: "viene de Malverth ago25", numero: "59782495", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "DENIS JOSUE BAUTISTA", cargo: "Jefe de aplicaciones TI", departamentoUsuario: "IT - Tecnología e Información", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "7385 - G-CORP LTE 16GB V3", paqueteGprs: "1397 - Internet Corp Doble LTE 8GB", tarifaPlan: 199, fechaRenovacion: "2025-08-15", fechaExpiracion: "2026-08-15", marca: "SAMSUNG", modelo: "A06", hojaRespCodigo: "2025-62" },
  { numeroControl: 54, empresa: "BREEMER, S.A.", numero: "37570178", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 100005912, nombreUsuario: "SANDRA HERMINIA RODRIGUEZ", cargo: "Lider de pagos - CSC", departamentoUsuario: "FI- Centro de Servicios Compartidos", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 20 GB", paqueteGprs: "1084 - Internet 20GB Corp", tarifaPlan: 199, fechaRenovacion: "2025-03-15", fechaExpiracion: "2026-09-15", marca: "MOTOROLA", modelo: "G54", hojaRespCodigo: "2026-54", observaciones1: "usuario anterior: Fredy F. Aguilar tesoreria - baja 30/7/25" },
  { numeroControl: 55, empresa: "BREEMER, S.A.", numero: "37571143", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10005319, nombreUsuario: "MARIA RENEE GUARCAS PEREZ", cargo: "Analista de Tesoreria", departamentoUsuario: "FI-Tesoreria", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 20 GB", paqueteGprs: "1084 - Internet 20GB Corp", tarifaPlan: 199, fechaRenovacion: "2025-03-15", fechaExpiracion: "2026-09-15", marca: "MOTOROLA", modelo: "G54", hojaRespCodigo: "2025-36" },
  { numeroControl: 56, empresa: "BREEMER, S.A.", numero: "37574424", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10005913, nombreUsuario: "DANIEL ALEJANDRO DAVILA LECHE", cargo: "Analista de Tesoreria", departamentoUsuario: "CSC- Pedido a Cobro", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 20 GB", paqueteGprs: "1084 - Internet 20GB Corp", tarifaPlan: 199, fechaRenovacion: "2025-03-18", fechaExpiracion: "2026-09-18", marca: "MOTOROLA", modelo: "G54", hojaRespCodigo: "2025-33" },
  { numeroControl: 58, empresa: "BREEMER, S.A.", numero: "30884067", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "GG", cargo: "IPAD - GG", departamentoUsuario: "GG", segmento: "CORPORATIVO", adOp: "AD", servicio: "Internet movil", clasificacion: "Internet movil", plan: "40GB", paqueteGprs: "40GB", tarifaPlan: 399, fechaRenovacion: "2024-10-01", fechaExpiracion: "2026-10-01", hojaRespCodigo: "N/A" },
  { numeroControl: 57, empresa: "BREEMER, S.A.", numero: "30719623", operador: "TIGO", numeroMadre: "FAC UNICA", codSapUsuario: 10000842, nombreUsuario: "FRANCISCO JAVIER CONTRERAS BETANCOURTH", cargo: "Administrador de flota", departamentoUsuario: "FI- Centro de Servicios Compartidos", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 18GB", paqueteGprs: "18GB", tarifaPlan: 199, fechaRenovacion: "2024-10-01", fechaExpiracion: "2026-10-01", marca: "SAMSUNG", modelo: "A15", hojaRespCodigo: "2025-01" },
  { numeroControl: 59, empresa: "BREEMER, S.A.", numero: "31129916", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Federico Alexander Barrientos", cargo: "Analista de Importaciones Jr.", departamentoUsuario: "AB - Importaciones", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 18GB", paqueteGprs: "18GB", tarifaPlan: 199, fechaRenovacion: "2024-10-01", fechaExpiracion: "2026-10-01", marca: "SAMSUNG", modelo: "A15", hojaRespCodigo: "2026-25", observaciones1: "usuario anterior: Ruth Perez baja: 13/10/2025 2025-79" },
  { numeroControl: 60, empresa: "BREEMER, S.A.", numero: "31130084", operador: "TIGO", numeroMadre: "FAC UNICA", codSapUsuario: 10005508, nombreUsuario: "DAVID ESTUARDO CORONADO MORALES", cargo: "Analista de Importaciones Jr.", departamentoUsuario: "AB - Importaciones", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 18GB", paqueteGprs: "18GB", tarifaPlan: 199, fechaRenovacion: "2024-10-01", fechaExpiracion: "2026-10-01", marca: "SAMSUNG", modelo: "A15", hojaRespCodigo: "2025-14" },
  { numeroControl: 62, empresa: "BREEMER, S.A.", numero: "30150783", operador: "TIGO", numeroMadre: "FAC UNICA", codSapUsuario: 10000793, nombreUsuario: "FLORIDALMA  DEL CID LORENZANA", cargo: "Subgerente Monitoreo Y Seguridad", departamentoUsuario: "CORP - Seguridad y Monitoreo", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 25GB", paqueteGprs: "25GB", tarifaPlan: 315, fechaRenovacion: "2023-11-01", fechaExpiracion: "2026-11-01", marca: "IPHONE", modelo: "XR", hojaRespCodigo: 377 },
  { numeroControl: 61, empresa: "BREEMER, S.A.", numero: "30037162", operador: "TIGO", numeroMadre: "FAC UNICA", codSapUsuario: 10001332, nombreUsuario: "JESUS PALENCIA MONTEPEQUEZ", cargo: "Jefe de Dobladoras y Servicios Varios", departamentoUsuario: "TX-OP-DB- Dobladoras", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 40GB", paqueteGprs: "40GB", tarifaPlan: 350, fechaRenovacion: "2023-11-01", fechaExpiracion: "2026-11-01", marca: "SAMSUNG", modelo: "A25", hojaRespCodigo: "2025-03" },
  { numeroControl: 63, empresa: "BREEMER, S.A.", numero: "40560835", operador: "TIGO", numeroMadre: "FAC UNICA", codSapUsuario: 10003078, nombreUsuario: "ROBERTO AMILCAR VILLAGRAN POSADAS", cargo: "Asistente de Dirección de Operaciones", departamentoUsuario: "TX-Operaciones", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 25GB", paqueteGprs: "25GB", tarifaPlan: 315, fechaRenovacion: "2023-11-01", fechaExpiracion: "2026-11-01", marca: "SAMSUNG", modelo: "A23", hojaRespCodigo: "2024-23" },
  { numeroControl: 64, empresa: "BREEMER, S.A.", numero: "45234426", operador: "TIGO", numeroMadre: "FAC UNICA", codSapUsuario: 10001805, nombreUsuario: "MARCO ANTONIO POLANCO", cargo: "Director Financiero Corporativo", departamentoUsuario: "CORP-Finanzas", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 25GB", paqueteGprs: "25GB", tarifaPlan: 305, fechaRenovacion: "2023-11-01", fechaExpiracion: "2026-11-01", marca: "SAMSUNG", modelo: "IPHONE 16", hojaRespCodigo: "2026-19", observaciones1: "usuario anterior Marvin Chavez baja 24/04/2026" },
  { numeroControl: 65, empresa: "BREEMER, S.A.", numero: "45234468", operador: "TIGO", numeroMadre: "FAC UNICA", codSapUsuario: 10004306, nombreUsuario: "LUIS FERNANDO MONTERROSO SANTOS", cargo: "Director Auditoria Corporativo", departamentoUsuario: "CORP - Auditoría", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 25GB", paqueteGprs: "25GB", tarifaPlan: 315, fechaRenovacion: "2023-11-01", fechaExpiracion: "2026-11-01", marca: "IPHONE", modelo: "XR", hojaRespCodigo: 382 },
  { numeroControl: 72, empresa: "BREEMER, S.A.", numero: "52026136", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "REYES TRIGUEROS", cargo: "S-GG", departamentoUsuario: "GG", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 20GB", paqueteGprs: "25GB", tarifaPlan: 265, fechaRenovacion: "2025-03-15", fechaExpiracion: "2026-12-15", marca: "SAMSUNG", modelo: "A03s", hojaRespCodigo: "2025-37" },
  { numeroControl: 76, empresa: "BREEMER, S.A.", numero: "66336550", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "Planta Tel.", cargo: "Km. 30.5 Carretera a El Pacífico, Amatitlán", departamentoUsuario: "PBX - Tydfil - Parques del lago", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "LINEA FIJA", paqueteGprs: "5mil minutos", tarifaPlan: 1628.5, fechaRenovacion: "2026-03-26", fechaExpiracion: "2027-03-26", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 77, empresa: "BREEMER, S.A.", numero: "66409494", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "Planta Tel.", cargo: "Km. 30.5 Carretera a El Pacífico, Amatitlán", departamentoUsuario: "PBX - Tydfil - Parques del lago", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "Línea Fija", paqueteGprs: "5mil minutos", tarifaPlan: 1628.5, fechaRenovacion: "2026-03-26", fechaExpiracion: "2027-03-26", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 87, empresa: "BREEMER, S.A.", revision: "Vienen de Textiles Liztex", numero: "66338049", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", nombreUsuario: "Planta Tel.", cargo: "CRT AL PACIFICO, 000-000 KILOMETRO 30.5 AMATITLAN,GUATEMALA", departamentoUsuario: "PBX - Tydfil - Parques del lago", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "LINEA CENTREX + AVI", paqueteGprs: "N/A", tarifaPlan: 129, fechaRenovacion: "2026-04-06", fechaExpiracion: "2027-04-06", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 81, empresa: "BREEMER, S.A.", revision: "Vienen de Textiles Liztex", numero: "66330146", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", nombreUsuario: "Generadora del Este", cargo: "CRT AL PACIFICO, 008-022 URBANIZACION DEL SUR 000 KILOMETRO 29.5 AMATITLAN,GUATEMALA", departamentoUsuario: "lado de Inmob.", segmento: "ENERGIA", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "LINEA FIJA", paqueteGprs: "N/A", tarifaPlan: 53, fechaRenovacion: "2026-04-06", fechaExpiracion: "2027-04-06", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 88, empresa: "BREEMER, S.A.", numero: "35730854", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10005796, nombreUsuario: "MARVIN DAVID SANCHEZ LOPEZ", cargo: "Coordinador de Nóminas y Planillas", departamentoUsuario: "RH-Compensaciones y Beneficios", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 20 GB", paqueteGprs: "1084 - Internet 20GB Corp", tarifaPlan: 150, fechaRenovacion: "2025-05-27", fechaExpiracion: "2027-05-26", marca: "SAMSUNG", modelo: "A06", hojaRespCodigo: "2025-49" },
  { numeroControl: 89, empresa: "BREEMER, S.A.", numero: "35738565", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10004954, nombreUsuario: "VICTOR MANUEL MORALES BAMACA", cargo: "Gerente de Compensaciones y Beneficios", departamentoUsuario: "RH-Compensaciones y Beneficios", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 20 GB", paqueteGprs: "1084 - Internet 20GB Corp", tarifaPlan: 150, fechaRenovacion: "2025-05-27", fechaExpiracion: "2027-05-26", marca: "SAMSUNG", modelo: "A06", hojaRespCodigo: "2025-50" },
  { numeroControl: 78, empresa: "BREEMER, S.A.", revision: "Vienen de Textiles Liztex", numero: "23650382", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", nombreUsuario: "GG", cargo: "CRT A EL SALVADOR,RESIDENCIALES MONTE BELLO I KILOMETRO 9.2 SANTA CATARINA PINULA,GUATEMALA", departamentoUsuario: "GG", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "Línea Comercial", paqueteGprs: "N/A", tarifaPlan: 105, fechaRenovacion: "2026-06-25", fechaExpiracion: "2027-06-25", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 82, empresa: "BREEMER, S.A.", revision: "Vienen de Textiles Liztex", numero: "66330148", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", nombreUsuario: "Seguridad Industrial", cargo: "CRT AL PACIFICO, 008-022 URBANIZACION DEL SUR 000 KILOMETRO 29.5 AMATITLAN,GUATEMALA", departamentoUsuario: "Línea Emergencia S.I.", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "LINEA FIJA", paqueteGprs: "N/A", tarifaPlan: 105, fechaRenovacion: "2026-06-25", fechaExpiracion: "2027-06-25", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 79, empresa: "BREEMER, S.A.", revision: "Vienen de Textiles Liztex", numero: "23654289", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", nombreUsuario: "GG", cargo: "CRT A EL SALVADOR, 000-000 LOTIFICACION SAN RAFAEL II Z04 KILOMETRO 9 .5 SANTA CATARINA PINULA,GUATEMALA", departamentoUsuario: "GG", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "Línea Comercial", paqueteGprs: "N/A", tarifaPlan: 105, fechaRenovacion: "2026-06-26", fechaExpiracion: "2027-06-26", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 83, empresa: "BREEMER, S.A.", revision: "Vienen de Textiles Liztex", numero: "66335973", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", nombreUsuario: "Planta Tel.", cargo: "CRT AL PACIFICO, 008-022 URBANIZACION DEL SUR 000 KILOMETRO 29.5 AMATITLAN,GUATEMALA", departamentoUsuario: "PBX - Tydfil - Parques del lago", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "LINEA FIJA", paqueteGprs: "N/A", tarifaPlan: 105, fechaRenovacion: "2026-06-26", fechaExpiracion: "2027-06-26", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 80, empresa: "BREEMER, S.A.", revision: "Vienen de Textiles Liztex", numero: "23654644", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", nombreUsuario: "GG", cargo: "CRT A EL SALVADOR, 000-000 LOTIFICACION SAN RAFAEL II Z04 KILOMETRO 9 .5 SANTA CATARINA PINULA,GUATEMALA", departamentoUsuario: "GG", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "Línea Comercial", paqueteGprs: "N/A", tarifaPlan: 105, fechaRenovacion: "2026-06-27", fechaExpiracion: "2027-06-27", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 84, empresa: "BREEMER, S.A.", revision: "Vienen de Textiles Liztex", numero: "66336047", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", nombreUsuario: "Planta Tel.", cargo: "CRT AL PACIFICO, 000-000 KILOMETRO 27 AMATITLAN,GUATEMALA", departamentoUsuario: "PBX - Tydfil - Parques del lago", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "LINEA FIJA", paqueteGprs: "N/A", tarifaPlan: 105, fechaRenovacion: "2026-06-27", fechaExpiracion: "2027-06-27", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 85, empresa: "BREEMER, S.A.", revision: "Vienen de Textiles Liztex", numero: "66336412", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", nombreUsuario: "Planta Tel.", cargo: "CRT AL PACIFICO, 008-022 URBANIZACION DEL SUR 000 KILOMETRO 29.5 AMATITLAN,GUATEMALA", departamentoUsuario: "PBX - Tydfil - Parques del lago", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "LINEA FIJA", paqueteGprs: "N/A", tarifaPlan: 105, fechaRenovacion: "2026-06-28", fechaExpiracion: "2027-06-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 86, empresa: "BREEMER, S.A.", revision: "Vienen de Textiles Liztex", numero: "66336537", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", nombreUsuario: "Planta Tel.", cargo: "CRT AL PACIFICO, 008-022 URBANIZACION DEL SUR 000 KILOMETRO 29.5 AMATITLAN,GUATEMALA", departamentoUsuario: "PBX - Tydfil - Parques del lago", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "LINEA FIJA", paqueteGprs: "N/A", tarifaPlan: 105, fechaRenovacion: "2026-06-29", fechaExpiracion: "2027-06-29", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 4, empresa: "BREEMER, S.A.", numero: "22150419", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "GG", cargo: "Km 9.5 carretera al Salvador Montebello I Lote 6", departamentoUsuario: "GG", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "TV / modem", paqueteGprs: "CLARO TV BASICO HFC BASICO", tarifaPlan: 309, fechaRenovacion: "2026-07-01", fechaExpiracion: "2027-07-01", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A", observaciones1: "SERV SIN CONTRATO" },
  { numeroControl: 111, empresa: "BREEMER, S.A.", numero: "37572745", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10001537, nombreUsuario: "JORGE ERNESTO CONTRERAS QUAN", cargo: "Administrador de Servidores", departamentoUsuario: "IT - Tecnología e Información", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 25GB", paqueteGprs: "1084 - Internet 25GB Corp", tarifaPlan: 209, fechaRenovacion: "2026-03-16", fechaExpiracion: "2027-09-16", marca: "SAMSUNG", modelo: "A16", hojaRespCodigo: "2026-28" },
  { numeroControl: 112, empresa: "BREEMER, S.A.", numero: "37574569", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10004292, nombreUsuario: "CARLOS ENRIQUE RAMIREZ JEREZ", cargo: "Supervisor de Contabilidad y Rp", departamentoUsuario: "FI- Centro de Servicios Compartidos", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 20 GB", paqueteGprs: "1084 - Internet 25GB Corp", tarifaPlan: 209, fechaRenovacion: "2026-03-16", fechaExpiracion: "2027-09-16", marca: "MOTOROLA", modelo: "G54", hojaRespCodigo: "2025-34" },
  { numeroControl: 113, empresa: "BREEMER, S.A.", numero: "47396519", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "MODEM TI - GUSTAVO GARCÍA / RIOLSA", cargo: "Comodin TI para dif. áreas", departamentoUsuario: "IT - Tecnología e Información", segmento: "CORPORATIVO", adOp: "AD", servicio: "Internet movil", clasificacion: "Modem", plan: "8080 - G-EMPRESAS ILIM 15GB", paqueteGprs: "1083 - Internet 25GB Corp", tarifaPlan: 209, fechaRenovacion: "2026-03-16", fechaExpiracion: "2027-09-16", marca: "HUAWEI" },
  { numeroControl: 114, empresa: "BREEMER, S.A.", numero: "37714409", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "CRISTIAN LEONEL GOMEZ SAGASTUME", cargo: "Gerente de Planificación", departamentoUsuario: "FI-Inteligencia de Negocios", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8081 - G-EMPRESAS ILIM 50GB", paqueteGprs: "1782 - Internet 50GB Corp", tarifaPlan: 300, fechaRenovacion: "2026-03-16", fechaExpiracion: "2027-09-16", marca: "IPHONE", modelo: 11, hojaRespCodigo: "2025-43", observaciones1: "usuario anterior: Marco Polanco baja: 3/2025" },
  { numeroControl: 115, empresa: "BREEMER, S.A.", numero: "37714953", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "FREDY VINICIO PICEN", cargo: "Jefe de abastecimientos energia y corporativo", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8081 - G-EMPRESAS ILIM 50GB", paqueteGprs: "1782 - Internet 50GB Corp", tarifaPlan: 300, fechaRenovacion: "2026-03-16", fechaExpiracion: "2027-09-16", marca: "SAMSUNG", modelo: "A17", hojaRespCodigo: "2026-34", observaciones1: "usuario anterior: Zwingli Guevara baja: 4/11/24 2024-70" },
  { numeroControl: 116, empresa: "BREEMER, S.A.", numero: "37715713", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10004292, nombreUsuario: "CARLOS ENRIQUE RAMIREZ JEREZ", cargo: "Supervisor de Contabilidad y Rp TOKEN", departamentoUsuario: "FI- Centro de Servicios Compartidos", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8081 - G-EMPRESAS ILIM 50GB", paqueteGprs: "1782 - Internet 50GB Corp", tarifaPlan: 300, fechaRenovacion: "2026-03-16", fechaExpiracion: "2027-09-16", marca: "IPHONE", modelo: 11, hojaRespCodigo: "2025-38", observaciones1: "usuario anterior: Ingrid Jhonson baja: 15/10/24" },
  { numeroControl: 117, empresa: "BREEMER, S.A.", numero: "37572843", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10003579, nombreUsuario: "LUIS ENRIQUE ALACAM CUMATZ", cargo: "Administrador de Infraestructura", departamentoUsuario: "IT - Tecnología e Información", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 25GB", paqueteGprs: "1084 - Internet 25GB Corp", tarifaPlan: 209, fechaRenovacion: "2026-03-16", fechaExpiracion: "2027-09-16", marca: "SAMSUNG", modelo: "A16", hojaRespCodigo: "2026-26" },
  { numeroControl: 118, empresa: "BREEMER, S.A.", numero: "41545028", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10001005, nombreUsuario: "GUSTAVO ADOLFO GARCIA AVILA", cargo: "Jefe de Estructura", departamentoUsuario: "IT - Tecnología e Información", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8082 - G-EMPRESAS ILIM 50GB", paqueteGprs: "1496 - Internet 50GB Corp", tarifaPlan: 300, fechaRenovacion: "2026-03-16", fechaExpiracion: "2027-09-16", marca: "SAMSUNG", modelo: "A17", hojaRespCodigo: "2026-27" },
  { numeroControl: 119, empresa: "BREEMER, S.A.", numero: "42187007", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10006164, nombreUsuario: "MIGUEL ANGEL PEREZ LIMA", cargo: "Gerente IT", departamentoUsuario: "IT - Tecnología e Información", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8082 - G-EMPRESAS ILIM 50GB", paqueteGprs: "1496 - Internet 50GB Corp", tarifaPlan: 300, fechaRenovacion: "2026-03-16", fechaExpiracion: "2027-09-16", marca: "IPHONE", modelo: 12, hojaRespCodigo: 337 },
  { numeroControl: 120, empresa: "BREEMER, S.A.", numero: "42187070", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10000432, nombreUsuario: "ERIBERTO  MORALES LEMUS", cargo: "Mensajero", departamentoUsuario: "CSC- Pedido a Cobro", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8296 - G-Empresas Entry 20 GB", paqueteGprs: "1083 - Internet 20GB Corp", tarifaPlan: 159, fechaRenovacion: "2026-03-16", fechaExpiracion: "2027-09-16", marca: "HONOR", modelo: "X7A", hojaRespCodigo: "2024-12" },
  { numeroControl: 121, empresa: "BREEMER, S.A.", numero: "42187071", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10001484, nombreUsuario: "BERTIN ADEMIR DE LA CRUZ GONZALEZ", cargo: "Mensajero corporativo", departamentoUsuario: "CSC- Pedido a Cobro", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8296 - G-Empresas Entry 20GB", paqueteGprs: "1083 - Internet 20GB Corp", tarifaPlan: 159, fechaRenovacion: "2026-03-16", fechaExpiracion: "2027-09-16", marca: "HONOR", modelo: "Y7a", hojaRespCodigo: "2025-77", observaciones1: "usuario anterior: jonathan cordero baja 10/10/2025" },
  { numeroControl: 122, empresa: "BREEMER, S.A.", numero: "47404541", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10005161, nombreUsuario: "MARCO VINICIO MOTTA CASTILLO", cargo: "Mensajero", departamentoUsuario: "AB - Importaciones", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8296 - G-Empresas Entry 20 GB", paqueteGprs: "1083 - Internet 20GB Corp", tarifaPlan: 159, fechaRenovacion: "2026-03-16", fechaExpiracion: "2027-09-16", marca: "HONOR", modelo: "X7A", hojaRespCodigo: "2025-32" },
  { numeroControl: 123, empresa: "BREEMER, S.A.", numero: "56963421", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10005004, nombreUsuario: "VICTOR OBDULIO MORALES DIVAS", cargo: "Jefe de Soporte Técnico", departamentoUsuario: "IT - Tecnología e Información", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8296 - G-Empresas Entry 20 GB", paqueteGprs: "1083 - Internet 20GB Corp", tarifaPlan: 159, fechaRenovacion: "2026-03-16", fechaExpiracion: "2027-09-16", marca: "SAMSUNG", modelo: "A15", hojaRespCodigo: "2025-57" },
  { numeroControl: 124, empresa: "BREEMER, S.A.", numero: "58345070", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10001556, nombreUsuario: "JORGE LUIS LOPEZ CASTELLANOS", cargo: "Coordinador de Soporte Camaras", departamentoUsuario: "Seguridad Integral", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8296 - G-Empresas Entry 20 GB", paqueteGprs: "1083 - Internet 20GB Corp", tarifaPlan: 159, fechaRenovacion: "2026-03-16", fechaExpiracion: "2027-09-16", marca: "SAMSUNG", modelo: "A16", hojaRespCodigo: "2026-28" },
  { numeroControl: 134, empresa: "BREEMER, S.A.", revision: "viene de Tennat, S.A.", numero: "39977560", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", nombreUsuario: "WILMAR OBDULIO YUMAN", cargo: "Coordinador de ABAS ESTRAT", departamentoUsuario: "ABAS-Corporativo", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8081 - G-EMPRESAS ILIM 25GB", paqueteGprs: "1782 - Internet 25GB Corp", tarifaPlan: 300, fechaRenovacion: "2026-04-10", fechaExpiracion: "2027-10-10", marca: "SAMSUNG", modelo: "A16", hojaRespCodigo: "2026-53", observaciones1: "usuario anterior: Eduardo Coelí 01/2025 2023-78", observaciones2: "IPHONE - EN ARGENTINA", observaciones3: 11 },
  { numeroControl: 135, empresa: "BREEMER, S.A.", revision: "viene de Tennat, S.A.", numero: "42206451", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "CARLOS ANTONIO SARAVIA VASQUEZ", cargo: "Contador - Geneste", departamentoUsuario: "Cuentas por Cobrar", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 20 GB", paqueteGprs: "1084 - Internet 20GB Corp", tarifaPlan: 209, fechaRenovacion: "2026-04-10", fechaExpiracion: "2027-10-10", marca: "HONOR", modelo: "X7A", hojaRespCodigo: "2026-09", observaciones1: "usuario anterior: Juan carlos lopez comercial textil - baja 14/11/24", observaciones2: "Usuario anterior Estuardo Sanchez - 30/01/2026 - 2025-12" },
  { numeroControl: 136, empresa: "BREEMER, S.A.", revision: "viene de Tennat, S.A.", numero: "39977546", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: 0, nombreUsuario: "Mario Enrique Solares", cargo: "Especialista de compras - Textil", departamentoUsuario: "AB - compras textil", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8081 - G-EMPRESAS ILIM 25GB", paqueteGprs: "1782 - Internet 25GB Corp", tarifaPlan: 300, fechaRenovacion: "2026-04-10", fechaExpiracion: "2027-10-10", marca: "SAMSUNG", modelo: "A17", hojaRespCodigo: "2026-31", observaciones1: "usuario anterior: Carlos Mercado 31/05/2024 2023-28 y 2024-44", observaciones2: "Línea ofrecida en 10/2025 ganada por ABAS - Erick Cambranes", observaciones3: "usuario anterior Zaira Sandoval - baja de usuario 16/04/2026 en prestamo pendiente de nuevo ingreso" },
  { numeroControl: 140, empresa: "BREEMER, S.A.", numero: "45234483", operador: "TIGO", numeroMadre: "FAC UNICA", codSapUsuario: 10000342, nombreUsuario: "ELOISA  DIEGUEZ GARCIA", cargo: "Directora Corporativa de Talento y Cultu", departamentoUsuario: "CORP - Recursos Humanos", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 50GB", paqueteGprs: "50GB", tarifaPlan: 479, fechaRenovacion: "2025-10-15", fechaExpiracion: "2027-10-15", marca: "SAMSUNG", modelo: "S25", hojaRespCodigo: "2025-94" },
  { numeroControl: 174, empresa: "BREEMER, S.A.", numero: "31029557", operador: "TIGO", numeroMadre: "FAC UNICA", codSapUsuario: 10000483, nombreUsuario: "Ricardo Palma", cargo: "Director de Abastecimiento Estratégico", departamentoUsuario: "CORP-AB- Abastecimiento Estratégico", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 50GB", paqueteGprs: "50GB", tarifaPlan: 479, fechaRenovacion: "2025-11-01", fechaExpiracion: "2027-11-01", marca: "IPHONE", modelo: 16, hojaRespCodigo: "2026-06", observaciones1: "Usuario anterior - Erick cambranes, baja 12/02/2026" },
  { numeroControl: 175, empresa: "BREEMER, S.A.", numero: "46303391", operador: "TIGO", numeroMadre: "FAC UNICA", codSapUsuario: 10000238, nombreUsuario: "EDWIN ROBERTO AYALA MANRIQUE", cargo: "Director Legal", departamentoUsuario: "CORP - Legal", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 25GB", paqueteGprs: "50GB", tarifaPlan: 479, fechaRenovacion: "2025-11-01", fechaExpiracion: "2027-11-01", marca: "SAMSUNG", modelo: "S25", hojaRespCodigo: "2025-96" },
  { numeroControl: 138, empresa: "BREEMER, S.A.", revision: "Viene de Spalding", numero: "42152694", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", codSapUsuario: 10000400, nombreUsuario: "MILTON JAMES MONZON BARRIOS", cargo: "Jefe de Pagos y Disponibilidad", departamentoUsuario: "FI-Tesoreria", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8081 - G-EMPRESAS ILIM 25GB", paqueteGprs: "1782 - Internet 50GB Corp", tarifaPlan: 300, fechaRenovacion: "2026-06-16", fechaExpiracion: "2027-12-16", marca: "IPHONE", modelo: 15, hojaRespCodigo: "2026-18" },
  { numeroControl: 66, empresa: "BROADCLOTH, S.A.", numero: "45234615", operador: "TIGO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", codSapUsuario: 10004347, nombreUsuario: "EDIBERTO HAYDAR MARTINEZ", cargo: "Gerente Tecnico de Tintoreria", departamentoUsuario: "Textil", segmento: "TEXTIL", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 25GB", paqueteGprs: "25GB", tarifaPlan: 355, fechaRenovacion: "2023-11-01", fechaExpiracion: "2026-11-01", marca: "SAMSUNG", modelo: "A23", hojaRespCodigo: "2026-52", observaciones1: "usuario anterior: Mauricio Saldariaga baja:15/09/2024", observaciones2: "usuario anterior: Esteban Gonzalez baja:228/24", observaciones3: "Sergio Valdez" },
  { numeroControl: 125, empresa: "BROADCLOTH, S.A.", numero: "42186067", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", codSapUsuario: 10000017, nombreUsuario: "DAVIDE  PIAZZA", cargo: "Gerente de Desarrollo Textil", departamentoUsuario: "TX-Comercial", segmento: "TEXTIL", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8081 - G-EMPRESAS ILIM 25GB", paqueteGprs: "1782 - Internet 25GB Corp", tarifaPlan: 300, fechaRenovacion: "2025-10-01", fechaExpiracion: "2027-10-01", marca: "N/A", modelo: "N/A", hojaRespCodigo: 351 },
  { numeroControl: 126, empresa: "BROADCLOTH, S.A.", numero: "34820954", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", nombreUsuario: "CARLOS ENRIQUE MONTANARI", cargo: "Gerente de Calidad", departamentoUsuario: "Unidad Textil", segmento: "TEXTIL", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8081 - G-EMPRESAS ILIM 25GB", paqueteGprs: "1782 - Internet 25GB Corp", tarifaPlan: 300, fechaRenovacion: "2025-10-01", fechaExpiracion: "2027-10-01", marca: "SAMSUNG", modelo: "A13", hojaRespCodigo: "2026-17", observaciones1: "usuario anterior: Caudio motta baja: 27/10/23", observaciones2: "usuario anterior: Carlos Montanari baja: 10/10/2025" },
  { numeroControl: 127, empresa: "BROADCLOTH, S.A.", numero: "47687413", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", nombreUsuario: "JIOVANY DE JESUS MENESES CASTILLO", cargo: "Gerente de mantemiento textil", departamentoUsuario: "Textil", segmento: "TEXTIL", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8082 - G-EMPRESAS ILIM 30GB", paqueteGprs: "1496 - Internet 30GB Corp", tarifaPlan: 400, fechaRenovacion: "2025-10-01", fechaExpiracion: "2027-10-01", marca: "IPHONE", modelo: 13, hojaRespCodigo: "2025-71", observaciones1: "usuario anterior: marco de camargo baja: 25/9/23" },
  { numeroControl: 128, empresa: "BROADCLOTH, S.A.", numero: "50105038", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", nombreUsuario: "OSCAR JUNIOR DE LA CRUZ SOLORZANO", cargo: "Director Financiero Textil", departamentoUsuario: "TX - Calidad Textil", segmento: "TEXTIL", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8082 - G-EMPRESAS ILIM 30GB", paqueteGprs: "1496 - Internet 30GB Corp", tarifaPlan: 400, fechaRenovacion: "2025-10-01", fechaExpiracion: "2027-10-01", marca: "SAMSUNG", modelo: "S25", hojaRespCodigo: "2025-70", observaciones1: "usuario anterior: Israel Juarez" },
  { numeroControl: 129, empresa: "BROADCLOTH, S.A.", numero: "39955587", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", codSapUsuario: 10005825, nombreUsuario: "MARVIN GEOVANY COJOM ALVARADO", cargo: "Coordinador de Transporte", departamentoUsuario: "TX-OP-AL Y TRA-Transporte", segmento: "TEXTIL", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8071 - G-EMPRESAS CONTROL 10GB", paqueteGprs: "1081 - Internet 10GB Corp", tarifaPlan: 149, fechaRenovacion: "2025-10-01", fechaExpiracion: "2027-10-01", marca: "SAMSUNG", modelo: "A14", hojaRespCodigo: "2023-74" },
  { numeroControl: 130, empresa: "BROADCLOTH, S.A.", numero: "39977542", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", codSapUsuario: 10000023, nombreUsuario: "FREDY ROLANDO CURRUCHICHE", cargo: "Contralor Textil", departamentoUsuario: "TX-Financiera", segmento: "TEXTIL", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8081 - G-EMPRESAS ILIM 25GB", paqueteGprs: "1782 - Internet 25GB Corp", tarifaPlan: 300, fechaRenovacion: "2025-10-01", fechaExpiracion: "2027-10-01", marca: "IPHONE", modelo: 13, hojaRespCodigo: "2025-72", observaciones1: "usuario anterior: Oscar Jr de la Cruz", observaciones2: "usuario anterior:Dayri peralta promo interna: 15/9/2025" },
  { numeroControl: 73, empresa: "COMERPAC. S.A.", numero: "71484", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Enlace Energía", cargo: "CASERIO VILLA VERDE ZONA 0 SECTOR LOMA 1", departamentoUsuario: "Admon. Enrgía", segmento: "ENERGIA", adOp: "AD", servicio: "Internet local", clasificacion: "Internet recidencial", plan: "Enlace Internet - Energía", paqueteGprs: "1MB", tarifaPlan: "70$", fechaRenovacion: "2025-03-03", fechaExpiracion: "2027-03-03", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 74, empresa: "COMERPAC. S.A.", numero: "73980", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Enlace Energía", cargo: "CASERIO VILLA VERDE ZONA 0 SECTOR LOMA 1", departamentoUsuario: "Admon. Enrgía", segmento: "ENERGIA", adOp: "AD", servicio: "Internet local", clasificacion: "Internet recidencial", plan: "Enlace Internet - Energía", paqueteGprs: "512KB", tarifaPlan: "155$", fechaRenovacion: "2025-03-03", fechaExpiracion: "2027-03-03", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 105, empresa: "COMERPAC. S.A.", numero: "30200180", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2025-10-10", fechaExpiracion: "2027-06-10", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 106, empresa: "COMERPAC. S.A.", numero: "30200268", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2025-10-10", fechaExpiracion: "2027-06-10", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 107, empresa: "COMERPAC. S.A.", numero: "30201300", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2025-10-10", fechaExpiracion: "2027-06-10", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 108, empresa: "COMERPAC. S.A.", numero: "30201569", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2025-10-10", fechaExpiracion: "2027-06-10", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 109, empresa: "COMERPAC. S.A.", numero: "30201757", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2025-10-10", fechaExpiracion: "2027-06-10", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 145, empresa: "COMERPAC. S.A.", numero: "30080478", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 146, empresa: "COMERPAC. S.A.", numero: "30098808", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 147, empresa: "COMERPAC. S.A.", numero: "30138922", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 148, empresa: "COMERPAC. S.A.", numero: "30170815", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 149, empresa: "COMERPAC. S.A.", numero: "30306412", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "ESCUINTLA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 150, empresa: "COMERPAC. S.A.", numero: "30355845", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 151, empresa: "COMERPAC. S.A.", numero: "30361196", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "ESCUINTLA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 152, empresa: "COMERPAC. S.A.", numero: "30361736", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 153, empresa: "COMERPAC. S.A.", numero: "30362327", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 154, empresa: "COMERPAC. S.A.", numero: "30363976", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 155, empresa: "COMERPAC. S.A.", numero: "30365583", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "QUETZALTENANGO", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 156, empresa: "COMERPAC. S.A.", numero: "30367142", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 157, empresa: "COMERPAC. S.A.", numero: "30372411", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 158, empresa: "COMERPAC. S.A.", numero: "30374716", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 159, empresa: "COMERPAC. S.A.", numero: "30376563", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 160, empresa: "COMERPAC. S.A.", numero: "30631900", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 161, empresa: "COMERPAC. S.A.", numero: "30632768", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "NOT APPLICABLE", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 162, empresa: "COMERPAC. S.A.", numero: "30632830", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "QUETZALTENANGO", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 163, empresa: "COMERPAC. S.A.", numero: "30794531", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 164, empresa: "COMERPAC. S.A.", numero: "30796446", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 165, empresa: "COMERPAC. S.A.", numero: "30796488", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 166, empresa: "COMERPAC. S.A.", numero: "32537053", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 167, empresa: "COMERPAC. S.A.", numero: "32537085", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 168, empresa: "COMERPAC. S.A.", numero: "32537110", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "QUETZALTENANGO", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 169, empresa: "COMERPAC. S.A.", numero: "32590555", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "QUETZALTENANGO", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 173, empresa: "COMERPAC. S.A.", numero: "31077792", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Lector de contador (movil)", cargo: "GUATEMALA", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-29", fechaExpiracion: "2027-10-29", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 178, empresa: "COMERPAC. S.A.", numero: "47145536", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10000491, nombreUsuario: "LOURDES ADRIANA PADILLA", cargo: "KAM", departamentoUsuario: "EN-Comercialización", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 50 GB", paqueteGprs: "1084 - Internet 50GB Corp", tarifaPlan: 300, fechaRenovacion: "2026-06-03", fechaExpiracion: "2027-12-03", marca: "MOTOROLA", modelo: "G35", hojaRespCodigo: "2026-24", observaciones1: "línea trasladada de Breemer a Comerpac en mayo 2025", observaciones2: "Usuario anterior Ericka Patricia Morales - baja de usuario 16.03.2026 en prestamo", observaciones3: "Usuario anterior - Andre Larios - en prestamo" },
  { numeroControl: 179, empresa: "COMERPAC. S.A.", numero: "42954553", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10001188, nombreUsuario: "ANDRE EMANUEL LARIOS MURALLES", cargo: "Jefe de Operaciones Comerciales", departamentoUsuario: "EN-Comercialización", segmento: "ENERGIA", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8080 - G-EMPRESAS ILIM 25GB", paqueteGprs: "1083 - Internet 25GB Corp", tarifaPlan: 209, fechaRenovacion: "2026-06-03", fechaExpiracion: "2027-12-03", marca: "SAMSUNG", modelo: "A13", hojaRespCodigo: "2024-41", observaciones1: "usuario anterior: jorge gonzalez camb de usuarios" },
  { numeroControl: 180, empresa: "COMERPAC. S.A.", numero: "58349357", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10001190, nombreUsuario: "ANDREA CELESTE DAMACIO GARCIA", cargo: "KAM", departamentoUsuario: "EN-Comercialización", segmento: "ENERGIA", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8080 - G-EMPRESAS ILIM 25GB", paqueteGprs: "1083 - Internet 25GB Corp", tarifaPlan: 209, fechaRenovacion: "2026-06-03", fechaExpiracion: "2027-12-03", marca: "MOTOROLA", modelo: "G35", hojaRespCodigo: "2026-42" },
  { numeroControl: 143, empresa: "CONDOMINIO TIKAL FUTURA", numero: "24404030", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "Kiosko de información", cargo: "NIVEL 3 OFICINA 333", departamentoUsuario: "Hotel Tikal Futura", segmento: "INMOBILIARIA", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "CENTREX.450M.", paqueteGprs: "N/A", tarifaPlan: 110, fechaRenovacion: "2026-04-23", fechaExpiracion: "2027-10-23", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 9, empresa: "CORPORACION GALA", numero: "24376749", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "Garita de bodegas la Brigada", cargo: "Parque Industrial Mixco", departamentoUsuario: "Inmobiliaria", segmento: "INMOBILIARIA", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "Línea Comercial", paqueteGprs: "N/A", tarifaPlan: 105, fechaRenovacion: "2026-07-01", fechaExpiracion: "2027-07-01", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 10, empresa: "CORPORACION GALA", numero: "24376757", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "Ricardo Tecú (Asist. Admin.)", cargo: "Parque Industrial Mixco", departamentoUsuario: "Inmobiliaria", segmento: "INMOBILIARIA", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "Línea Comercial", paqueteGprs: "N/A", tarifaPlan: 105, fechaRenovacion: "2026-07-01", fechaExpiracion: "2027-07-01", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 11, empresa: "CORPORACION GALA", numero: "24376795", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "ISAIAS  AXPUAC CON", cargo: "Parque Industrial Mixco", departamentoUsuario: "Inmobiliaria", segmento: "INMOBILIARIA", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "Línea Comercial", paqueteGprs: "N/A", tarifaPlan: 105, fechaRenovacion: "2026-07-01", fechaExpiracion: "2027-07-01", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 182, empresa: "ENERGIA DISPONIBLE", numero: "35723745", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10002788, nombreUsuario: "JAIRON AARON CARRERA PERALTA", cargo: "Técnico de mediciones", departamentoUsuario: "EN-Mediciones y Subestaci", segmento: "ENERGIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 25 GB", paqueteGprs: "1084 - Internet 25GB Corp", tarifaPlan: 209, fechaRenovacion: "2026-06-03", fechaExpiracion: "2027-12-03", marca: "SAMSUNG", modelo: "A13", hojaRespCodigo: "2025-64", observaciones1: "cambio de equipo por daño - Ernesto Solares aut no desc." },
  { numeroControl: 183, empresa: "ENERGIA DISPONIBLE", numero: "35724182", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10002243, nombreUsuario: "JULIO CESAR GARCIA PARADA", cargo: "Técnico de mediciones", departamentoUsuario: "EN-Mediciones y Subestaci", segmento: "ENERGIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 25 GB", paqueteGprs: "1084 - Internet 25GB Corp", tarifaPlan: 209, fechaRenovacion: "2026-06-03", fechaExpiracion: "2027-12-03", marca: "HONOR", modelo: "X7A", hojaRespCodigo: "2023-82" },
  { numeroControl: 184, empresa: "ENERGIA DISPONIBLE", numero: "35724226", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10000120, nombreUsuario: "EDGAR AROLDO MARTINEZ CHEN", cargo: "Técnico de mediciones", departamentoUsuario: "EN-Mediciones y Subestaci", segmento: "ENERGIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 25 GB", paqueteGprs: "1084 - Internet 25GB Corp", tarifaPlan: 209, fechaRenovacion: "2026-06-03", fechaExpiracion: "2027-12-03", marca: "HONOR", modelo: "X7A", hojaRespCodigo: "2024-06" },
  { numeroControl: 185, empresa: "ENERGIA DISPONIBLE", numero: "35724275", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10000309, nombreUsuario: "ELMER ANTONIO FARFAN SOTOJ", cargo: "Técnico de mediciones", departamentoUsuario: "EN-Mediciones y Subestaci", segmento: "ENERGIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 25GB", paqueteGprs: "1084 - Internet 25GB Corp", tarifaPlan: 209, fechaRenovacion: "2026-06-03", fechaExpiracion: "2027-12-03", marca: "HONOR", modelo: "Y7a", hojaRespCodigo: "2024-05" },
  { numeroControl: 186, empresa: "ENERGIA DISPONIBLE", numero: "35725705", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10000231, nombreUsuario: "ANGEL ESAU ORELLANA ARENALES", cargo: "Técnico de mediciones", departamentoUsuario: "EN-Mediciones y Subestaci", segmento: "ENERGIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 25GB", paqueteGprs: "1084 - Internet 25GB Corp", tarifaPlan: 209, fechaRenovacion: "2026-06-03", fechaExpiracion: "2027-12-03", marca: "HONOR", modelo: "X7A", hojaRespCodigo: "2026-43" },
  { numeroControl: 181, empresa: "ENERGÍA DISPONIBLE", numero: "41286974", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10001302, nombreUsuario: "HUGO OSWALDO SICAL XITUMUL", cargo: "Especialista Lineas de Tr", departamentoUsuario: "EN-Lineas de transmisión", segmento: "ENERGIA", adOp: "OP", servicio: "Internet movil", clasificacion: "Modem", plan: "6840 - G-CORP LTE NAVEGACION 50GB", paqueteGprs: "20 - Servicios GPRS", tarifaPlan: 300, fechaRenovacion: "2026-06-03", fechaExpiracion: "2027-12-03", marca: "PCD", modelo: 401, hojaRespCodigo: "2023-77" },
  { numeroControl: 187, empresa: "ENERGÍA DISPONIBLE", numero: "35725786", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10005528, nombreUsuario: "OSCAR MANOLO CULAN NORIEGA", cargo: "Técnico de mediciones", departamentoUsuario: "EN-Mediciones y Subestaci", segmento: "ENERGIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 25 GB", paqueteGprs: "1084 - Internet 25GB Corp", tarifaPlan: 209, fechaRenovacion: "2026-06-03", fechaExpiracion: "2027-12-03", marca: "HONOR", modelo: "X7A", hojaRespCodigo: "2023-81" },
  { numeroControl: 188, empresa: "ENERGÍA DISPONIBLE", numero: "39981036", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10000477, nombreUsuario: "ERICK ESTUARDO TANCHEZ BARILLAS", cargo: "Contralor del Negocio de Energia", departamentoUsuario: "EN-Contraloria", segmento: "ENERGIA", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8081 - G-EMPRESAS ILIM 25GB", paqueteGprs: "1782 - Internet 25GB Corp", tarifaPlan: 209, fechaRenovacion: "2026-06-03", fechaExpiracion: "2027-12-03", marca: "IPHONE", modelo: 11, hojaRespCodigo: "2023-53" },
  { numeroControl: 189, empresa: "ENERGÍA DISPONIBLE", numero: "43883464", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "Ernesto José Solares Tellez", cargo: "Gerente General de Unidad de Energia", departamentoUsuario: "ENERGIA", segmento: "ENERGIA", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8081 - G-EMPRESAS ILIM 25GB", paqueteGprs: "1782 - Internet 25GB Corp", tarifaPlan: 209, fechaRenovacion: "2025-12-04", fechaExpiracion: "2027-12-04", marca: "IPHONE", modelo: 15, hojaRespCodigo: "2025-99" },
  { numeroControl: 47, empresa: "ENERGIA INMEDIATA S.A.", numero: "41765219", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10002413, nombreUsuario: "ABRAHAM  ORTIZ XILOJ", cargo: "Técnico de calidad", departamentoUsuario: "EN-Lineas de transmisión", segmento: "ENERGIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea Movil", plan: "8080 - G-EMPRESAS ILIM 15GB", paqueteGprs: "1083 - Internet 15GB Corp", tarifaPlan: 199, fechaRenovacion: "2025-01-29", fechaExpiracion: "2026-07-29", marca: "REDMI", modelo: 13, hojaRespCodigo: "2025-25" },
  { numeroControl: 91, empresa: "ENERGIA INMEDIATA S.A.", numero: "58341898", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10004702, nombreUsuario: "TOMAS  SOC AJCABUL", cargo: "Operador 2", departamentoUsuario: "EN-Lineas de transmisión", segmento: "ENERGIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea Movil", plan: "8080 - G-EMPRESAS ILIM 15GB", paqueteGprs: "1083 - Internet 15GB Corp", tarifaPlan: 199, fechaRenovacion: "2025-02-02", fechaExpiracion: "2027-06-02", marca: "REDMI", modelo: 13, hojaRespCodigo: "2025-31" },
  { numeroControl: 92, empresa: "ENERGIA INMEDIATA S.A.", numero: "41764897", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10001101, nombreUsuario: "DARIO IQUIC", cargo: "Electricista 1", departamentoUsuario: "EN-Lineas de transmisión", segmento: "ENERGIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea Movil", plan: "8080 - G-EMPRESAS ILIM 15GB", paqueteGprs: "1083 - Internet 15GB Corp", tarifaPlan: 199, fechaRenovacion: "2025-02-02", fechaExpiracion: "2027-06-02", marca: "REDMI", modelo: 13, hojaRespCodigo: "2026-32" },
  { numeroControl: 93, empresa: "ENERGIA INMEDIATA S.A.", numero: "58341769", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10001875, nombreUsuario: "CARLOS GUILLERMO LOPEZ BODE", cargo: "Jefe de lineas de transmi", departamentoUsuario: "EN-Lineas de transmisión", segmento: "ENERGIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea Movil", plan: "8080 - G-EMPRESAS ILIM 15GB", paqueteGprs: "1083 - Internet 15GB Corp", tarifaPlan: 199, fechaRenovacion: "2025-02-02", fechaExpiracion: "2027-06-02", marca: "REDMI", modelo: 13, hojaRespCodigo: "2025-17", observaciones1: "usuario anterior: Miguel Moran camb de usuarios" },
  { numeroControl: 94, empresa: "ENERGIA INMEDIATA S.A.", numero: "58341801", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10004521, nombreUsuario: "LUIS GERARDO CHOCOJ", cargo: "Supervisor de operaciones", departamentoUsuario: "EN-Mediciones y Subestaci", segmento: "ENERGIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea Movil", plan: "8080 - G-EMPRESAS ILIM 15GB", paqueteGprs: "1083 - Internet 15GB Corp", tarifaPlan: 199, fechaRenovacion: "2025-02-02", fechaExpiracion: "2027-06-02", marca: "REDMI", modelo: 13, hojaRespCodigo: "2025-27" },
  { numeroControl: 95, empresa: "ENERGIA INMEDIATA S.A.", numero: "58341802", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10005551, nombreUsuario: "JOSE ADONIAS JIMENEZ MEJIA", cargo: "Especialista Lineas de Tr", departamentoUsuario: "EN-Lineas de transmisión", segmento: "ENERGIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea Movil", plan: "8080 - G-EMPRESAS ILIM 15GB", paqueteGprs: "1083 - Internet 15GB Corp", tarifaPlan: 199, fechaRenovacion: "2025-02-02", fechaExpiracion: "2027-06-02", marca: "REDMI", modelo: 13, hojaRespCodigo: "2025-52", observaciones1: "usuario anterior: hugo oswaldo sical baja 30/05/2025 2024-24 y 2025-48" },
  { numeroControl: 96, empresa: "ENERGIA INMEDIATA S.A.", numero: "58341821", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10000453, nombreUsuario: "PEDRO  DE LEON CETINO", cargo: "Especialista Lineas de Tr", departamentoUsuario: "EN-Lineas de transmisión", segmento: "ENERGIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea Movil", plan: "8080 - G-EMPRESAS ILIM 15GB", paqueteGprs: "1083 - Internet 15GB Corp", tarifaPlan: 199, fechaRenovacion: "2025-02-02", fechaExpiracion: "2027-06-02", hojaRespCodigo: "2025-46 / 332", observaciones1: "equipo con: Daniel Reyes" },
  { numeroControl: 97, empresa: "ENERGIA INMEDIATA S.A.", numero: "58341908", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10001651, nombreUsuario: "JOSE ARSENIO GIRON REYES", cargo: "Supervisor de proceso", departamentoUsuario: "EN-Lineas de transmisión", segmento: "ENERGIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea Movil", plan: "8080 - G-EMPRESAS ILIM 15GB", paqueteGprs: "1083 - Internet 15GB Corp", tarifaPlan: 199, fechaRenovacion: "2025-02-02", fechaExpiracion: "2027-06-02", marca: "REDMI", modelo: 13, hojaRespCodigo: "2025-29" },
  { numeroControl: 98, empresa: "ENERGIA INMEDIATA S.A.", numero: "58342085", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10001245, nombreUsuario: "ANTONIO ALVARADO CAHUEC", cargo: "Supervisor de proceso", departamentoUsuario: "EN-Lineas de transmisión", segmento: "ENERGIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea Movil", plan: "8080 - G-EMPRESAS ILIM 15GB", paqueteGprs: "1083 - Internet 15GB Corp", tarifaPlan: 199, fechaRenovacion: "2025-02-02", fechaExpiracion: "2027-06-02", marca: "REDMI", modelo: 13, hojaRespCodigo: "2025-53", observaciones1: "primera asignación de línea 16/06/2025" },
  { numeroControl: 99, empresa: "ENERGIA INMEDIATA S.A.", numero: "58342107", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10002229, nombreUsuario: "CARLOS ROMEO SACACH CARDENAS", cargo: "Supervisor de proceso", departamentoUsuario: "EN-Lineas de transmisión", segmento: "ENERGIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea Movil", plan: "8080 - G-EMPRESAS ILIM 15GB", paqueteGprs: "1083 - Internet 15GB Corp", tarifaPlan: 199, fechaRenovacion: "2025-02-02", fechaExpiracion: "2027-06-02", marca: "REDMI", modelo: 13, hojaRespCodigo: "2025-30" },
  { numeroControl: 100, empresa: "ENERGIA INMEDIATA S.A.", numero: "58342167", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10000026, nombreUsuario: "ADONIAS ASAEL GOMEZ DE LEON", cargo: "Encargado de Grupo", departamentoUsuario: "EN-Lineas de transmisión", segmento: "ENERGIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea Movil", plan: "8080 - G-EMPRESAS ILIM 15GB", paqueteGprs: "1083 - Internet 15GB Corp", tarifaPlan: 199, fechaRenovacion: "2025-02-02", fechaExpiracion: "2027-06-02", marca: "REDMI", modelo: 13, hojaRespCodigo: "2025-23" },
  { numeroControl: 75, empresa: "ENERGIA INMEDIATA, S.A.", numero: "27535", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Enlace Energía", cargo: "KILOMETRO 30.5 CARRETERA AL PACIFICO, AMATITLÁN, G", departamentoUsuario: "Admon. Enrgía", segmento: "ENERGIA", adOp: "AD", servicio: "Internet local", clasificacion: "Internet recidencial", plan: "Enlace Internet - Energía", paqueteGprs: "4MB", tarifaPlan: "68$", fechaRenovacion: "2025-03-03", fechaExpiracion: "2027-03-03", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 170, empresa: "ENERGIA INMEDIATA, S.A.", numero: "32222705", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Enlace Generadoras - Subestaciones", cargo: "Energía", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 171, empresa: "ENERGIA INMEDIATA, S.A.", numero: "32223960", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Enlace Generadoras - Subestaciones", cargo: "Energía", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 172, empresa: "ENERGIA INMEDIATA, S.A.", numero: "32228410", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "Enlace Generadoras - Subestaciones", cargo: "Energía", departamentoUsuario: "enlace lectura - Energía", segmento: "ENERGIA", adOp: "OP", servicio: "enlace lectura", clasificacion: "Plan GPRS", plan: "PLAN GPRS", paqueteGprs: "6GB", tarifaPlan: 38, fechaRenovacion: "2026-04-28", fechaExpiracion: "2027-10-28", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 144, empresa: "HOTEL FUTURA, S.A", numero: "24404320", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "Tikalito", cargo: "NIVEL 3 OFICINA 332", departamentoUsuario: "Hotel Tikal Futura", segmento: "INMOBILIARIA", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "Línea Comercial", paqueteGprs: "N/A", tarifaPlan: 53, fechaRenovacion: "2026-04-23", fechaExpiracion: "2027-10-23", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 68, empresa: "MALVERTH, S.A.", numero: "30323916", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "MAURA GABRIELA MARTINEZ", cargo: "Administrador cc flores del lago", departamentoUsuario: "inmobiliaria", segmento: "INMOBILIARIA", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 40GB", paqueteGprs: "40GB", tarifaPlan: 379, fechaRenovacion: "2023-11-01", fechaExpiracion: "2026-11-01", marca: "SAMSUNG", modelo: "A23", hojaRespCodigo: "2026-13", observaciones1: "usuario anterior: Fredy Chapetón baja 06/02/2026 ref 2024-35" },
  { numeroControl: 69, empresa: "MALVERTH, S.A.", numero: "53271659", operador: "TIGO", numeroMadre: "FAC UNICA", codSapUsuario: 10001338, nombreUsuario: "ISAIAS  AXPUAC CON", cargo: "Administrador", departamentoUsuario: "IN-Parque Industrial Mixco", segmento: "INMOBILIARIA", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 25GB", paqueteGprs: "25GB", tarifaPlan: 329, fechaRenovacion: "2023-11-01", fechaExpiracion: "2026-11-01", marca: "SAMSUNG", modelo: "A50", hojaRespCodigo: 373 },
  { numeroControl: 101, empresa: "MALVERTH, S.A.", numero: "59781731", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "JUAN MANUEL CARCAMO", cargo: "Mercadeo cc flores del lago", departamentoUsuario: "Inmobiliaria", segmento: "INMOBILIARIA", adOp: "AD", servicio: "Internet movil", clasificacion: "línea Movil", plan: "8071 - G-EMPRESAS CONTROL 10GB", paqueteGprs: "1081 - Internet 10GB Corp", tarifaPlan: 149, fechaRenovacion: "2025-02-02", fechaExpiracion: "2027-06-02", marca: "SAMSUNG", modelo: "A04s", hojaRespCodigo: 194, observaciones1: "usuario anterior: Carlos Castañeda, la unidad no notifcó el cambio hasta 10/09/25" },
  { numeroControl: 131, empresa: "MALVERTH, S.A.", numero: "41540150", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "Astrid Alvarez Medina", cargo: "Coordinador Comercial", departamentoUsuario: "inmobiliaria", segmento: "INMOBILIARIA", adOp: "AD", servicio: "Internet movil", clasificacion: "línea Movil", plan: "8296 - G-Empresas Entry 20GB", paqueteGprs: "1083 - Internet 20GB Corp", tarifaPlan: 159, fechaRenovacion: "2026-04-09", fechaExpiracion: "2027-10-09", marca: "SAMSUNG", modelo: "A07", hojaRespCodigo: "2026-30", observaciones1: "Usuario Anterior - Estuardo Sanchez, admin. Las Victorias" },
  { numeroControl: 131, empresa: "MALVERTH, S.A.", numero: "55753458", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "Kevin Fernando Morales", cargo: "recidente de obra", departamentoUsuario: "Inmobiliaria", segmento: "INMOBILIARIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea movil", plan: "8071 - G-EMPRESAS CONTROL 10GB", paqueteGprs: "8071 - G-EMPRESAS CONTROL 10GB", tarifaPlan: 149, fechaRenovacion: "2022-07-25", fechaExpiracion: "2024-01-25" },
  { numeroControl: 141, empresa: "MALVERTH, S.A.", numero: "59669110", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10005058, nombreUsuario: "MANUEL FRANCISCO DUBON RAMIREZ", cargo: "Administrador", departamentoUsuario: "IN-Flor de Campo", segmento: "INMOBILIARIA", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8296 - G-Empresas Entry 20 GB", paqueteGprs: "1083 - Internet 20GB Corp", tarifaPlan: 159, fechaRenovacion: "2026-04-15", fechaExpiracion: "2027-10-15", marca: "SAMSUNG", modelo: "A07", hojaRespCodigo: "2026-29" },
  { numeroControl: 7, empresa: "PASAC", numero: "78309277", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "Pasac", cargo: "CRT A QUETZALTENANGO, CANTON PASAC I CANTEL,QUETZALTENANGO NIVEL 2 FABRICA CANTEL", departamentoUsuario: "Administración", segmento: "ENERGIA", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "Servicio Home", paqueteGprs: "10GB", tarifaPlan: 53, fechaRenovacion: "2023-11-01", fechaExpiracion: "2025-10-21", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 42, empresa: "PASAC", numero: "47404574", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: "10003409 / 10001822", nombreUsuario: "LUIS DAVID RACANCOJ ELIAS / JOSE RAMIRO SALANIC GARCIA", cargo: "Operador 3 / Supervisor de proceso", departamentoUsuario: "EN-Cueva Maria", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 20 GB", paqueteGprs: "1084 - Internet 20GB Corp", tarifaPlan: 199, fechaRenovacion: "2024-12-27", fechaExpiracion: "2026-06-27", marca: "REDMI", modelo: 13, hojaRespCodigo: "2025-08" },
  { numeroControl: 6, empresa: "PERSONAS Y SERVICIOS, S.A.", numero: "30159190", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "SILVIA HERNANDEZ", cargo: "modem ventas", departamentoUsuario: "Comercial Inmobiliaria", segmento: "INMOBILIARIA", adOp: "AD", servicio: "Internet movil", clasificacion: "Internet movil", plan: "55GB", paqueteGprs: "55GB", tarifaPlan: 249, fechaRenovacion: "2021-06-07", fechaExpiracion: "2023-06-12", marca: "ALCATEL", hojaRespCodigo: "2026-21" },
  { numeroControl: 20, empresa: "PERSONAS Y SERVICIOS, S.A.", numero: "53088374", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "BYRON PAREDES CHACON", cargo: "Gerente operativo inmobiliaria", departamentoUsuario: "inmobiliaria", segmento: "INMOBILIARIA", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 25GB", paqueteGprs: "25GB", tarifaPlan: 315, fechaRenovacion: "2023-11-20", fechaExpiracion: "2025-11-12", marca: "SAMSUNG", modelo: "A23", hojaRespCodigo: "2024-03" },
  { numeroControl: 21, empresa: "PERSONAS Y SERVICIOS, S.A.", numero: "57097435", operador: "TIGO", numeroMadre: "FAC UNICA", codSapUsuario: 10002151, nombreUsuario: "CARLOS ROBERTO RIVERA LOPEZ", cargo: "gerente comercial", departamentoUsuario: "inmobiliaria", segmento: "INMOBILIARIA", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 50GB", paqueteGprs: "50GB", tarifaPlan: 479, fechaRenovacion: "2023-11-20", fechaExpiracion: "2025-11-12", marca: "SAMSUNG", modelo: "A23", hojaRespCodigo: "2026-11", observaciones1: "Cambio de equipo por daño nueva hoja de responsabilidad - no se realizara cobro" },
  { numeroControl: 23, empresa: "PERSONAS Y SERVICIOS, S.A.", numero: "42201969", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", codSapUsuario: 10004019, nombreUsuario: "JUAN CRUZ ZACARIAS GOMEZ", cargo: "recidente de obra", departamentoUsuario: "Inmobiliaria", segmento: "INMOBILIARIA", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 20 GB", paqueteGprs: "1084 - Internet 20GB Corp", tarifaPlan: 199, fechaRenovacion: "2024-10-25", fechaExpiracion: "2026-04-25", marca: "SAMSUNG", modelo: "A15", hojaRespCodigo: "2026-35", observaciones1: "USUARIO ANTERIOR - SAUL MISHAN" },
  { numeroControl: 102, empresa: "PERSONAS Y SERVICIOS, S.A.", revision: "PASAR A BREEMER", numero: "59667731", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10005946, nombreUsuario: "NATHALY GONZALEZ ESCOBAR", cargo: "Coordinadora de Reclutamiento y Selec.", departamentoUsuario: "RH-Reclutamiento y Selección", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8081 - G-EMPRESAS ILIM 25GB", paqueteGprs: "1782 - Internet 25GB Corp", tarifaPlan: 299, fechaRenovacion: "2025-02-02", fechaExpiracion: "2027-06-02", marca: "HONOR", modelo: "X7A", hojaRespCodigo: "2025-55", observaciones1: "usuario anterior: Mereling Chen - 2024-66" },
  { numeroControl: 103, empresa: "PERSONAS Y SERVICIOS, S.A.", revision: "TRASLADO A TENNAT", numero: "59239780", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "Luis Alberto Saban", cargo: "Comodin TI para dif. áreas", departamentoUsuario: "IT - Tecnología e Información", segmento: "INMOBILIARIA", adOp: "AD", servicio: "Internet movil", clasificacion: "Modem", plan: "6840 - G-CORP LTE NAVEGACION 8GB", paqueteGprs: "20 - Servicios GPRS", tarifaPlan: 199, fechaRenovacion: "2025-02-02", fechaExpiracion: "2027-06-02", marca: "HUAWEI", modelo: "e3531", hojaRespCodigo: "2025-60" },
  { numeroControl: 110, empresa: "PERSONAS Y SERVICIOS, S.A.", numero: "37670639", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10005907, nombreUsuario: "DANIEL  PEREZ CORDERO", cargo: "Contralor del Negocio de Inmobiliaria", departamentoUsuario: "IN-Contraloría", segmento: "INMOBILIARIA", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8081 - G-EMPRESAS ILIM 25GB", paqueteGprs: "1782 - Internet 25GB Corp", tarifaPlan: 299, fechaRenovacion: "2025-10-15", fechaExpiracion: "2027-06-15", marca: "SAMSUNG", modelo: "A16", hojaRespCodigo: "2025-89" },
  { numeroControl: 142, empresa: "PERSONAS Y SERVICIOS, S.A.", revision: "Juan Ramón Jiménez Jimenez", numero: "47694501", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "JUAN RAMON JIMENEZ", cargo: "recidente de obra", departamentoUsuario: "Inmobiliaria", segmento: "INMOBILIARIA", adOp: "AD", servicio: "Internet movil", clasificacion: "línea Movil", plan: "8296 - G-Empresas Entry 15 GB", paqueteGprs: "1083 - Internet 20GB Corp", tarifaPlan: 159, fechaRenovacion: "2026-04-15", fechaExpiracion: "2027-10-15", marca: "SAMSUNG", modelo: "A07", hojaRespCodigo: "PENDIENTE" },
  { numeroControl: 176, empresa: "PERSONAS Y SERVICIOS, S.A.", numero: "45223885", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "LUIS AMADEO CORDON POSADAS", cargo: "Gerente de unidad inmobiliaria", departamentoUsuario: "inmobiliaria", segmento: "INMOBILIARIA", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 25GB", paqueteGprs: "25GB", tarifaPlan: 350, fechaRenovacion: "2025-11-01", fechaExpiracion: "2027-11-01", marca: "SAMSUNG", modelo: "S25", hojaRespCodigo: "2025-95", observaciones1: "usiario anterior: Martín Lizarraga Baja: 01/03/2025", observaciones2: "usuario anterior: Luis Cordon baja: 23/04/2025", observaciones3: "usuario anterior: Fernando Erales baja: 16/10/2025" },
  { numeroControl: 177, empresa: "PERSONAS Y SERVICIOS, S.A.", numero: "41545085", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "HENRY OTONIEL RAMIREZ DE LA CRUZ", cargo: "jefe de proyectos", departamentoUsuario: "inmobiliaria", segmento: "INMOBILIARIA", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8071 - G-EMPRESAS CONTROL 10GB", paqueteGprs: "1081 - Internet 10GB Corp", tarifaPlan: 200, fechaRenovacion: "2025-05-20", fechaExpiracion: "2027-11-02", marca: "SAMSUNG", modelo: "A15", hojaRespCodigo: "2025-85" },
  { numeroControl: 137, empresa: "RIOL, S.A.", numero: "37679356", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10006146, nombreUsuario: "YESENIA MARIBEL CHACON YANES", cargo: "Gerente Administrativo Fi", departamentoUsuario: "Gerencia Administrativa Financiera RIOLSA", segmento: "AGRICOLA", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8080 - G-EMPRESAS ILIM 25GB", paqueteGprs: "1083 - Internet 25GB Corp", tarifaPlan: 209, fechaRenovacion: "2026-04-10", fechaExpiracion: "2027-10-10", marca: "SAMSUNG", modelo: "A16", hojaRespCodigo: "2026-33" },
  { numeroControl: 67, empresa: "RIOLSA", numero: "45234436", operador: "TIGO", numeroMadre: "FAC UNICA", nombreUsuario: "TOMAS PORTOCARRERO", cargo: "Director Agricola", departamentoUsuario: "Riolsa", segmento: "AGRICOLA", adOp: "AD", servicio: "Internet movil", clasificacion: "Internet movil", plan: "15GB", paqueteGprs: "15GB", tarifaPlan: 299, fechaRenovacion: "2023-11-01", fechaExpiracion: "2026-11-01", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 8, empresa: "ROYTEX S.A.", numero: "73-0057", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "Roytex", cargo: "13 57 6.45 N, 90 47 38.36 O, P UERTO DE SAN JOSE, ESCUINTLA", departamentoUsuario: "Internet Local", segmento: "ENERGIA", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "Enlace Internet - Energía", paqueteGprs: "E1", tarifaPlan: 1370, fechaRenovacion: "2023-11-01", fechaExpiracion: "2025-10-21", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 39, empresa: "ROYTEX, S.A.", numero: "54111683", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: "10004541 / 10002071", nombreUsuario: "OLIVER ALEXANDER AJCAC PEREZ / JUAN LUIS ROJCHE TAMBRIZ", cargo: "Operador 4 / Operador 4", departamentoUsuario: "EN-Operaciones", segmento: "ENERGIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 20 GB", paqueteGprs: "1084 - Internet 20GB Corp", tarifaPlan: 199, fechaRenovacion: "2024-12-26", fechaExpiracion: "2026-06-26", marca: "REDMI", modelo: 13, hojaRespCodigo: "2025-22" },
  { numeroControl: 40, empresa: "ROYTEX, S.A.", numero: "54111824", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10005693, nombreUsuario: "WILLIAMS ESTUARDO MENDOZA TARACENA", cargo: "Especialista de operacion", departamentoUsuario: "EN-Operaciones", segmento: "ENERGIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 20 GB", paqueteGprs: "1084 - Internet 20GB Corp", tarifaPlan: 199, fechaRenovacion: "2024-12-26", fechaExpiracion: "2026-06-26", marca: "REDMI", modelo: 13, hojaRespCodigo: "2025-27B" },
  { numeroControl: 43, empresa: "ROYTEX, S.A.", numero: "47396226", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10002391, nombreUsuario: "ALLAN FRANCISCO COY LOPEZ", cargo: "Jefe de Instrumentacion", departamentoUsuario: "EN-Instrumentación eléctr", segmento: "ENERGIA", adOp: "AD", servicio: "Internet movil", clasificacion: "Modem", plan: "8541 - G-Corp Internet 20GB", paqueteGprs: "20 - Servicios GPRS", tarifaPlan: 199, fechaRenovacion: "2024-12-27", fechaExpiracion: "2026-06-27", marca: "HUAWEI", modelo: "B3", hojaRespCodigo: 462, observaciones1: "línea en planta solar" },
  { numeroControl: 44, empresa: "ROYTEX, S.A.", numero: "56942785", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: "10002040 / 10000891", nombreUsuario: "JUAN JOSE GARCIA LOPEZ / FREDY RAQUEL OROZCO RAMIREZ", cargo: "Encargado CC /Encargado CC", departamentoUsuario: "EN-Mantenimiento Turbina", segmento: "ENERGIA", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 20 GB", paqueteGprs: "1084 - Internet 20GB Corp", tarifaPlan: 199, fechaRenovacion: "2024-12-27", fechaExpiracion: "2026-06-27", marca: "REDMI", modelo: 13, hojaRespCodigo: "2025-07" },
  { numeroControl: 45, empresa: "ROYTEX, S.A.", numero: "56968642", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: "10005518 / 10004034", nombreUsuario: "MARLON OMAR ESCALANTE REYES / SAUL JONATHAN FLORES RODRIGUEZ", cargo: "Operador de bascula / Operador de bascula", departamentoUsuario: "EN-Almacenes y transporte", segmento: "ENERGIA", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 20 GB", paqueteGprs: "1084 - Internet 20GB Corp", tarifaPlan: 199, fechaRenovacion: "2024-12-27", fechaExpiracion: "2026-06-27", marca: "REDMI", modelo: 13, hojaRespCodigo: "2025-19" },
  { numeroControl: 104, empresa: "ROYTEX, S.A.", numero: "41760441", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10001579, nombreUsuario: "JORGE RIGOBERTO CRUZ PARAZZOLLI", cargo: "Jefe de logística y almacenes", departamentoUsuario: "EN-Almacenes y transporte", segmento: "ENERGIA", adOp: "OP", servicio: "línea movil", clasificacion: "línea Movil", plan: "8080 - G-EMPRESAS ILIM 15GB", paqueteGprs: "1083 - Internet 15GB Corp", tarifaPlan: 199, fechaRenovacion: "2025-02-02", fechaExpiracion: "2027-06-02", marca: "REDMI", modelo: 13, hojaRespCodigo: "2025-18" },
  { numeroControl: 90, empresa: "TAUNTON, S.A.", numero: "52049396", operador: "TIGO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", codSapUsuario: 10002106, nombreUsuario: "JUAN OSMIN HERNANDEZ MIRANDA", cargo: "Auxiliar Administrativo de Ventas", departamentoUsuario: "TX-CM-Ventas", segmento: "TEXTIL", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "llamadas ilimitadas + 25GB", paqueteGprs: "25GB", tarifaPlan: 379, fechaRenovacion: "2025-12-01", fechaExpiracion: "2027-06-01", marca: "SAMSUNG", modelo: "A36", hojaRespCodigo: "2026-08" },
  { numeroControl: 139, empresa: "TECNOELECT, S.A.", numero: "55603194", operador: "CLARO", numeroMadre: "FAC UNICA", codSapUsuario: 10001663, nombreUsuario: "JOSE DANIEL GOMEZ MARROQUIN", cargo: "Analista SAP MM/FIORI/PS", departamentoUsuario: "IT - Tecnología e Información", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8080 - G-EMPRESAS ILIM 25GB", paqueteGprs: "1083 - Internet 25GB Corp", tarifaPlan: 209, fechaRenovacion: "2026-04-13", fechaExpiracion: "2027-10-13", marca: "IPHONE", modelo: 12, hojaRespCodigo: "2026-16" },
  { numeroControl: 22, empresa: "TENNAT, S.A", revision: "pasa a BROADCLOTH, S.A.", numero: "35714164", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", nombreUsuario: "DIANA ALEXANDRA TOBON MARIN", cargo: "Ventas Textil", departamentoUsuario: "Comercial Textil", segmento: "TEXTIL", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 20 GB", paqueteGprs: "1084 - Internet 20GB Corp", tarifaPlan: 199, fechaRenovacion: "2024-10-15", fechaExpiracion: "2026-04-15", marca: "SAMSUNG", modelo: "A15", hojaRespCodigo: "2024-58" },
  { numeroControl: 24, empresa: "TENNAT, S.A", revision: "pasa a BROADCLOTH, S.A.", numero: "42205489", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", codSapUsuario: 10001475, nombreUsuario: "JUAN CARLOS TIÑO RAMIREZ", cargo: "Ejecutivo de Ventas Sr.", departamentoUsuario: "TX-CM-Ventas", segmento: "TEXTIL", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8297 - G-Empresas Ilim Entry 20 GB", paqueteGprs: "1084 - Internet 20GB Corp", tarifaPlan: 199, fechaRenovacion: "2024-10-25", fechaExpiracion: "2026-04-25", marca: "SAMSUNG", modelo: "A15", hojaRespCodigo: "2024-60", observaciones1: "USUARIO ANTERIOR - ABELARDO GARDUÑO" },
  { numeroControl: 37, empresa: "TENNAT, S.A", numero: "47688880", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", nombreUsuario: "JUAN EUGENIO MIRANDA", cargo: "Jefe de tejido de punto", departamentoUsuario: "Textil", segmento: "TEXTIL", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8081 - G-EMPRESAS ILIM 25GB", paqueteGprs: "1782 - Internet 25GB Corp", tarifaPlan: 299, fechaRenovacion: "2024-05-27", fechaExpiracion: "2026-05-27", marca: "SAMSUNG", modelo: "A15", hojaRespCodigo: "2025-20", observaciones1: "usuario anterior: Sergio Nieto B:7/02/25" },
  { numeroControl: 38, empresa: "TENNAT, S.A", revision: "Linea disponible para tennat", numero: "41506248", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", nombreUsuario: "Mirta Jeannette Muñoz Giron", cargo: "Jefe de laboratorio de color", departamentoUsuario: "Textil", segmento: "TEXTIL", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8081 - G-EMPRESAS ILIM 25GB", paqueteGprs: "1782 - Internet 25GB Corp", tarifaPlan: 299, fechaRenovacion: "2024-06-05", fechaExpiracion: "2026-06-05", marca: "SAMSUNG", modelo: "A05", hojaRespCodigo: "2024-46", observaciones1: "Usuario anterior: Hector Molina 26/06/2026 baja de usuario" },
  { numeroControl: 46, empresa: "TENNAT, S.A", numero: "42163069", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", nombreUsuario: "LILIANA CAICEDO VARON", cargo: "Jefe de tintoreria", departamentoUsuario: "textil", segmento: "TEXTIL", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8081 - G-EMPRESAS ILIM 25GB", paqueteGprs: "1782 - Internet 25GB Corp", tarifaPlan: 299, fechaRenovacion: "2024-06-27", fechaExpiracion: "2026-06-27", marca: "SAMSUNG", modelo: "A15", hojaRespCodigo: "2024-49" },
  { numeroControl: 49, empresa: "TENNAT, S.A", revision: "trasladar a BROATCLOTH", numero: "30105458", operador: "TIGO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", codSapUsuario: 10006013, nombreUsuario: "WILSON ALBERTO ALEMAN MORALES", cargo: "Monitoreo", departamentoUsuario: "SEG - Monitoreo GPS", segmento: "TEXTIL", adOp: "AD", servicio: "Internet movil", clasificacion: "Internet GPS", plan: "línea de interntet movil", paqueteGprs: "14GB", tarifaPlan: 149, fechaRenovacion: "2024-02-25", fechaExpiracion: "2026-08-25", marca: "N/A", modelo: "N/A", hojaRespCodigo: "2024-30" },
  { numeroControl: 50, empresa: "TENNAT, S.A", revision: "trasladar a BROATCLOTH", numero: "30105786", operador: "TIGO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", codSapUsuario: 10006013, nombreUsuario: "WILSON ALBERTO ALEMAN MORALES", cargo: "Monitoreo", departamentoUsuario: "SEG - Monitoreo GPS", segmento: "TEXTIL", adOp: "AD", servicio: "Internet movil", clasificacion: "Internet GPS", plan: "línea de interntet movil", paqueteGprs: "14GB", tarifaPlan: 149, fechaRenovacion: "2024-02-25", fechaExpiracion: "2026-08-25", marca: "N/A", modelo: "N/A", hojaRespCodigo: "2024-30" },
  { numeroControl: 51, empresa: "TENNAT, S.A", revision: "trasladar a BROATCLOTH", numero: "30109064", operador: "TIGO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", codSapUsuario: 10006013, nombreUsuario: "WILSON ALBERTO ALEMAN MORALES", cargo: "Monitoreo", departamentoUsuario: "SEG - Monitoreo GPS", segmento: "TEXTIL", adOp: "AD", servicio: "Internet movil", clasificacion: "Internet GPS", plan: "línea de interntet movil", paqueteGprs: "14GB", tarifaPlan: 149, fechaRenovacion: "2024-02-25", fechaExpiracion: "2026-08-25", marca: "N/A", modelo: "N/A", hojaRespCodigo: "2024-30" },
  { numeroControl: 52, empresa: "TENNAT, S.A", revision: "trasladar a BROATCLOTH", numero: "30109575", operador: "TIGO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", codSapUsuario: 10006013, nombreUsuario: "WILSON ALBERTO ALEMAN MORALES", cargo: "Monitoreo", departamentoUsuario: "SEG - Monitoreo GPS", segmento: "TEXTIL", adOp: "AD", servicio: "Internet movil", clasificacion: "Internet GPS", plan: "línea de interntet movil", paqueteGprs: "14GB", tarifaPlan: 149, fechaRenovacion: "2024-02-25", fechaExpiracion: "2026-08-25", marca: "N/A", modelo: "N/A", hojaRespCodigo: "2024-30" },
  { numeroControl: 53, empresa: "TENNAT, S.A", revision: "trasladar a BROATCLOTH", numero: "30109944", operador: "TIGO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", codSapUsuario: 10006013, nombreUsuario: "WILSON ALBERTO ALEMAN MORALES", cargo: "Monitoreo", departamentoUsuario: "SEG - Monitoreo GPS", segmento: "TEXTIL", adOp: "AD", servicio: "Internet movil", clasificacion: "Internet GPS", plan: "línea de interntet movil", paqueteGprs: "14GB", tarifaPlan: 149, fechaRenovacion: "2024-02-25", fechaExpiracion: "2026-08-25", marca: "N/A", modelo: "N/A", hojaRespCodigo: "2024-30" },
  { numeroControl: 132, empresa: "TENNAT, S.A", numero: "35700626", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", nombreUsuario: "CRISTIAN MANUEL FIGUEROA ALDANA", cargo: "Gerente de Plaeación Textil", departamentoUsuario: "Planeación", segmento: "TEXTIL", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8081 - G-EMPRESAS ILIM 50GB", paqueteGprs: "1782 - Internet 50GB Corp", tarifaPlan: 300, fechaRenovacion: "2026-04-09", fechaExpiracion: "2027-10-09", marca: "SAMSUNG", modelo: "A36", hojaRespCodigo: "2025-82", observaciones1: "usuario anterior: Julian andres Gonzalez 04/2025" },
  { numeroControl: 133, empresa: "TENNAT, S.A", numero: "43863470", operador: "CLARO", numeroMadre: "FAC UNICA", responsableFacturacion: "Brenda Pixcar", nombreUsuario: "Walfredo Gurdel Gomez de Rocha", cargo: "Gerente de hilatura", departamentoUsuario: "Textil", segmento: "TEXTIL", adOp: "AD", servicio: "línea movil", clasificacion: "línea Movil", plan: "8081 - G-EMPRESAS ILIM 50GB", paqueteGprs: "1782 - Internet 50GB Corp", tarifaPlan: 300, fechaRenovacion: "2026-04-09", fechaExpiracion: "2027-10-09", marca: "SAMSUNG", modelo: "A34", hojaRespCodigo: "2026-16", observaciones1: "usuario anterior: Walfredo Guarcel baja: 10/10/2025" },
  { numeroControl: 12, empresa: "TEXTILES LIZTEX, S.A.", numero: "66336403", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "Planta Tel.", cargo: "CRT AL PACIFICO, 008-022 URBANIZACION DEL SUR 000 KILOMETRO 29.5 AMATITLAN,GUATEMALA", departamentoUsuario: "PBX - Tydfil - Parques del lago", segmento: "CORPORATIVO", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "LINEA FIJA", paqueteGprs: "N/A", tarifaPlan: 105, fechaRenovacion: "2026-07-01", fechaExpiracion: "2027-07-01", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 1, empresa: "VARENNA, SOCIEDAD ANONIMA", numero: "66695274", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "C. C. Flores del lago", cargo: "KILOMETRO 29.6 C.C. FLORES DEL LAGO TOTEM CRT AL PACIFICO AMATITLAN,GUATEMALA", departamentoUsuario: "Admonistración", segmento: "INMOBILIARIA", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "Línea Fija", paqueteGprs: "N/A", tarifaPlan: 199, fechaRenovacion: "2026-07-03", fechaExpiracion: "2027-07-03", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
  { numeroControl: 2, empresa: "VARENNA, SOCIEDAD ANONIMA", numero: "66695275", operador: "CLARO", numeroMadre: "FAC UNICA", nombreUsuario: "C. C. Flores del lago", cargo: "KILOMETRO 29.6 C.C. FLORES DEL LAGO TOTEM CRT AL PACIFICO AMATITLAN,GUATEMALA", departamentoUsuario: "Admonistración", segmento: "INMOBILIARIA", adOp: "AD", servicio: "línea fija", clasificacion: "línea fija", plan: "Línea Fija", paqueteGprs: "N/A", tarifaPlan: 199, fechaRenovacion: "2026-07-03", fechaExpiracion: "2027-07-03", marca: "N/A", modelo: "N/A", hojaRespCodigo: "N/A" },
];

function cargarLineasMoviles() {
  const raw = localStorage.getItem(LINEAS_MOVILES_STORAGE_KEY);
  const semilla = SEMILLA_LINEAS_MOVILES.map((l, i) => ({ ...l, id: l.id || `semilla-lm-${i}` }));
  if (raw) {
    try {
      lineasMovilesData = JSON.parse(raw);
      // Igual que en cargarContratosMoviles: si ya habia datos guardados de
      // antes, se agregan las lineas nuevas de la semilla (import de Excel)
      // que todavia no existan localmente, sin tocar lo ya guardado/editado.
      const idsExistentes = new Set(lineasMovilesData.map((l) => l.id));
      const nuevas = semilla.filter((l) => !idsExistentes.has(l.id));
      if (nuevas.length) {
        lineasMovilesData = lineasMovilesData.concat(nuevas);
        guardarLineasMoviles();
      }
      return;
    } catch {
      lineasMovilesData = [];
    }
  }
  lineasMovilesData = semilla;
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

/* ---------- Contratos de oficina (ver contratos-oficina-sync.js) ---------- */

const SEMILLA_CONTRATOS_OFICINA = [
  {
    empresa: "BREEMER, SOCIEDAD ANONIMA", nombreComercial: "BREEMER", nit: "8538380-5",
    categoriaCliente: "Corporaciones", tipoGestion: "Renovación",
    direccion: "CRT. AL PACIFICO KM 29.5, 8-22 URBANIZACION DEL SUR, AMATITLAN, GUATEMALA",
    departamentoCiudad: "Guatemala", representanteLegal: "MARVIN DAVID SANCHEZ LOPEZ",
    docIdentificacion: "2119 62066 0114",
    contactoNombre: "ESTEFANI FLORES", contactoTelefono: "6633-6550 Ext. 108",
    contactoCorreo: "Eflores@breemer.com.gt",
    plazoContrato: "12 meses", telefono: "66338049",
    instalacion1: "CRT. AL PACIFICO KM 30.5, AMATITLAN, GUATEMALA",
    paqueteContratar: "Claro_PYME_One_Play", tipoRed: "COBRE",
    subTotal: 105.00, instalacionCosto: 0, rentaTotal: 105.00,
    lineaFijaCantidad: 1, lineaFijaDescripcion: "Ilimitadas a Claro",
    activarClaroDrive: "Sí", activarPagolo: "No",
    ejecutivoVentas: "Luis Barillas", fechaFirma: "2026-07-31",
    codigoMaestro: "10291", observaciones: "RENOVACION LINEA 66338049",
  },
];

function cargarContratosOficina() {
  const raw = localStorage.getItem(CONTRATOS_OFICINA_STORAGE_KEY);
  if (raw) {
    try {
      contratosOficinaData = JSON.parse(raw);
      return;
    } catch {
      contratosOficinaData = [];
    }
  }
  contratosOficinaData = SEMILLA_CONTRATOS_OFICINA.map((c, i) => ({ ...c, id: c.id || `semilla-co-${i}` }));
  guardarContratosOficina();
}

function guardarContratosOficina() {
  localStorage.setItem(CONTRATOS_OFICINA_STORAGE_KEY, JSON.stringify(contratosOficinaData));
}

function obtenerContratosOficinaActuales() {
  return contratosOficinaData;
}

function establecerContratosOficinaDesdeSync(remotos) {
  const remotosPorId = new Map(remotos.map((c) => [c.id, c]));
  const combinados = [];
  const idsVistos = new Set();

  contratosOficinaData.forEach((local) => {
    idsVistos.add(local.id);
    const remoto = remotosPorId.get(local.id);
    if (!remoto || (local.ultimaModificacion || "") > (remoto.ultimaModificacion || "")) {
      combinados.push(local);
      sincronizarContratoOficina(local);
    } else {
      combinados.push(remoto);
    }
  });

  remotos.forEach((remoto) => {
    if (!idsVistos.has(remoto.id)) combinados.push(remoto);
  });

  contratosOficinaData = combinados;
  guardarContratosOficina();
  poblarFiltrosYDatalists();
  refrescarVistasSecundarias();
}

function sincronizarContratoOficina(contrato) {
  if (window.FirestoreSyncContratosOficina && typeof window.FirestoreSyncContratosOficina.guardarContratoOficina === "function") {
    window.FirestoreSyncContratosOficina.guardarContratoOficina(contrato);
  }
}

function sincronizarEliminacionContratoOficina(id) {
  if (window.FirestoreSyncContratosOficina && typeof window.FirestoreSyncContratosOficina.eliminarContratoOficina === "function") {
    window.FirestoreSyncContratosOficina.eliminarContratoOficina(id);
  }
}

/* ---------- Servicios adicionales de oficina (ver servicios-oficina-sync.js) ---------- */

const SEMILLA_SERVICIOS_OFICINA = [];

function cargarServiciosOficina() {
  const raw = localStorage.getItem(SERVICIOS_OFICINA_STORAGE_KEY);
  if (raw) {
    try {
      serviciosOficinaData = JSON.parse(raw);
      return;
    } catch {
      serviciosOficinaData = [];
    }
  }
  serviciosOficinaData = SEMILLA_SERVICIOS_OFICINA.map((s, i) => ({ ...s, id: s.id || `semilla-so-${i}` }));
  guardarServiciosOficina();
}

function guardarServiciosOficina() {
  localStorage.setItem(SERVICIOS_OFICINA_STORAGE_KEY, JSON.stringify(serviciosOficinaData));
}

function obtenerServiciosOficinaActuales() {
  return serviciosOficinaData;
}

function establecerServiciosOficinaDesdeSync(remotos) {
  const remotosPorId = new Map(remotos.map((s) => [s.id, s]));
  const combinados = [];
  const idsVistos = new Set();

  serviciosOficinaData.forEach((local) => {
    idsVistos.add(local.id);
    const remoto = remotosPorId.get(local.id);
    if (!remoto || (local.ultimaModificacion || "") > (remoto.ultimaModificacion || "")) {
      combinados.push(local);
      sincronizarServicioOficina(local);
    } else {
      combinados.push(remoto);
    }
  });

  remotos.forEach((remoto) => {
    if (!idsVistos.has(remoto.id)) combinados.push(remoto);
  });

  serviciosOficinaData = combinados;
  guardarServiciosOficina();
  poblarFiltrosYDatalists();
  refrescarVistasSecundarias();
}

function sincronizarServicioOficina(servicio) {
  if (window.FirestoreSyncServiciosOficina && typeof window.FirestoreSyncServiciosOficina.guardarServicioOficina === "function") {
    window.FirestoreSyncServiciosOficina.guardarServicioOficina(servicio);
  }
}

function sincronizarEliminacionServicioOficina(id) {
  if (window.FirestoreSyncServiciosOficina && typeof window.FirestoreSyncServiciosOficina.eliminarServicioOficina === "function") {
    window.FirestoreSyncServiciosOficina.eliminarServicioOficina(id);
  }
}

/* ---------- Documentos firmados (Anexo Móvil / Anexo Oficina) ----------
   A diferencia de los demás catálogos, estos documentos no tienen semilla
   ni una copia local "por si acaso": el PDF pesa demasiado para guardarlo
   en localStorage, así que viven en Firebase Storage/Firestore (ver
   documentos-anexo-moviles-sync.js / documentos-anexo-oficina-sync.js) y
   aquí solo se guarda en caché la última lista conocida. */

function cargarDocumentosAnexoMoviles() {
  try {
    documentosAnexoMovilesData = JSON.parse(localStorage.getItem(DOCUMENTOS_ANEXO_MOVILES_STORAGE_KEY) || "[]");
  } catch {
    documentosAnexoMovilesData = [];
  }
}

function guardarDocumentosAnexoMoviles() {
  localStorage.setItem(DOCUMENTOS_ANEXO_MOVILES_STORAGE_KEY, JSON.stringify(documentosAnexoMovilesData));
}

function establecerDocumentosAnexoMovilesDesdeSync(remotos) {
  documentosAnexoMovilesData = remotos;
  guardarDocumentosAnexoMoviles();
  vistaDocumentosAnexoMoviles.render();
}

function cargarDocumentosAnexoOficina() {
  try {
    documentosAnexoOficinaData = JSON.parse(localStorage.getItem(DOCUMENTOS_ANEXO_OFICINA_STORAGE_KEY) || "[]");
  } catch {
    documentosAnexoOficinaData = [];
  }
}

function guardarDocumentosAnexoOficina() {
  localStorage.setItem(DOCUMENTOS_ANEXO_OFICINA_STORAGE_KEY, JSON.stringify(documentosAnexoOficinaData));
}

function establecerDocumentosAnexoOficinaDesdeSync(remotos) {
  documentosAnexoOficinaData = remotos;
  guardarDocumentosAnexoOficina();
  vistaDocumentosAnexoOficina.render();
}

/* ---------- Tickets de Garantía (reportes a GBM / Canella) ---------- */

function cargarTicketsGarantia() {
  const raw = localStorage.getItem(TICKETS_GARANTIA_STORAGE_KEY);
  try {
    ticketsGarantiaData = raw ? JSON.parse(raw) : [];
  } catch {
    ticketsGarantiaData = [];
  }
}

function guardarTicketsGarantia() {
  localStorage.setItem(TICKETS_GARANTIA_STORAGE_KEY, JSON.stringify(ticketsGarantiaData));
}

function obtenerTicketsGarantiaActuales() {
  return ticketsGarantiaData;
}

// Datos de solo lectura recolectados por el Agente de Inventario TI (PowerShell).
// No hay edicion desde la app, asi que no hace falta fusionar con nada local:
// se reemplaza directo con lo que llega de Firestore.
function establecerEquiposTIv2DesdeSync(remotos) {
  equiposTIv2Data = remotos || [];
  if (typeof vistaEquiposTIv2 !== "undefined") vistaEquiposTIv2.render();
}

function establecerTicketsGarantiaDesdeSync(remotos) {
  const remotosPorId = new Map(remotos.map((t) => [t.id, t]));
  const combinados = [];
  const idsVistos = new Set();

  ticketsGarantiaData.forEach((local) => {
    idsVistos.add(local.id);
    const remoto = remotosPorId.get(local.id);
    if (!remoto || (local.ultimaModificacion || "") > (remoto.ultimaModificacion || "")) {
      combinados.push(local);
      sincronizarTicketGarantia(local);
    } else {
      combinados.push(remoto);
    }
  });

  remotos.forEach((remoto) => {
    if (!idsVistos.has(remoto.id)) combinados.push(remoto);
  });

  ticketsGarantiaData = combinados;
  guardarTicketsGarantia();
  poblarFiltrosYDatalists();
  refrescarVistasSecundarias();
}

function sincronizarTicketGarantia(ticket) {
  if (window.FirestoreSyncTicketsGarantia && typeof window.FirestoreSyncTicketsGarantia.guardarTicketGarantia === "function") {
    window.FirestoreSyncTicketsGarantia.guardarTicketGarantia(ticket);
  }
}

function sincronizarEliminacionTicketGarantia(id) {
  if (window.FirestoreSyncTicketsGarantia && typeof window.FirestoreSyncTicketsGarantia.eliminarTicketGarantia === "function") {
    window.FirestoreSyncTicketsGarantia.eliminarTicketGarantia(id);
  }
}

/* ---------- Mantenimiento de Equipos ---------- */

function cargarMantenimientoEquipos() {
  mantenimientoEquiposData = JSON.parse(localStorage.getItem(MANTENIMIENTO_EQUIPOS_STORAGE_KEY)) || [];
}

function guardarMantenimientoEquipos() {
  localStorage.setItem(MANTENIMIENTO_EQUIPOS_STORAGE_KEY, JSON.stringify(mantenimientoEquiposData));
  sincronizarRegistroMantenimiento();
}

function establecerMantenimientoEquiposDesdeSync(registrosRemotos) {
  const remotosPorId = new Map(registrosRemotos.map((r) => [r.id, r]));
  const combinados = [];
  const idsVistos = new Set();

  mantenimientoEquiposData.forEach((local) => {
    idsVistos.add(local.id);
    const remoto = remotosPorId.get(local.id);
    if (!remoto || (local.ultimaModificacion || "") > (remoto.ultimaModificacion || "")) {
      combinados.push(local);
      sincronizarRegistroMantenimiento();
    } else {
      combinados.push(remoto);
    }
  });

  registrosRemotos.forEach((remoto) => {
    if (!idsVistos.has(remoto.id)) combinados.push(remoto);
  });

  mantenimientoEquiposData = combinados.sort((a, b) => (b.fechaIngreso || "").localeCompare(a.fechaIngreso || ""));
  guardarMantenimientoEquipos();
  if (vistaMantenimientoEquipos) vistaMantenimientoEquipos.render();
}

function sincronizarRegistroMantenimiento() {
  if (typeof window.FirestoreSyncMantenimientoEquipos !== "undefined" && mantenimientoEquiposActualId) {
    const registro = mantenimientoEquiposData.find((r) => r.id === mantenimientoEquiposActualId);
    if (registro) window.FirestoreSyncMantenimientoEquipos.guardarRegistroMantenimiento(registro);
  }
}

function sincronizarEliminacionRegistroMantenimiento(id) {
  if (typeof window.FirestoreSyncMantenimientoEquipos !== "undefined") {
    window.FirestoreSyncMantenimientoEquipos.eliminarRegistroMantenimiento(id);
  }
}

function obtenerRegistrosMantenimientoActuales() {
  return mantenimientoEquiposData;
}

let mantenimientoEquiposActualId = null;

function actualizarUsuarioEquipoMantenimiento() {
  const equipoRef = $("meEquipo").value;
  if (!equipoRef) return;
  if (!Array.isArray(equipos) || equipos.length === 0) {
    return;
  }
  const equipo = equipos.find((e) => e.nombreRed === equipoRef);
  if (equipo) {
    $("meUsuario").value = equipo.nombreEmpleado || "";
    $("meHwProcesador").textContent = equipo.procesador || "-";
    $("meHwRam").textContent = equipo.memoria || "-";
    $("meHwDisco").textContent = equipo.tipoDisco || "-";
    $("meHwTipo").textContent = equipo.tipoEquipo || "-";
  }
}

function abrirModalMantenimientoEquipos(registro) {
  mantenimientoEquiposActualId = registro ? registro.id : null;
  MANTENIMIENTO_EQUIPOS_FIELD_IDS.forEach((fieldId) => {
    const campo = MANTENIMIENTO_EQUIPOS_CAMPO_POR_ID[fieldId];
    $(fieldId).value = (registro && registro[campo]) || "";
  });

  document.querySelectorAll('input[name="solucion"]').forEach((cb) => (cb.checked = false));
  if (registro && registro.solucion) {
    const soluciones = registro.solucion.split(", ");
    document.querySelectorAll('input[name="solucion"]').forEach((cb) => {
      if (soluciones.includes(cb.value)) cb.checked = true;
    });
  }

  if (!registro) {
    $("meTecnico").value = TECNICO_ACTUAL || "";
    $("meHwProcesador").textContent = "-";
    $("meHwRam").textContent = "-";
    $("meHwDisco").textContent = "-";
    $("meHwTipo").textContent = "-";
  } else {
    actualizarUsuarioEquipoMantenimiento();
  }

  $("modalMantenimientoEquiposOverlay").style.display = "flex";
}

function cerrarModalMantenimientoEquipos() {
  mantenimientoEquiposActualId = null;
  MANTENIMIENTO_EQUIPOS_FIELD_IDS.forEach((fieldId) => ($(fieldId).value = ""));
  $("modalMantenimientoEquiposOverlay").style.display = "none";
}

function onSubmitMantenimientoEquipos(e) {
  e.preventDefault();
  const nuevoRegistro = {};
  MANTENIMIENTO_EQUIPOS_FIELD_IDS.forEach((fieldId) => {
    const campo = MANTENIMIENTO_EQUIPOS_CAMPO_POR_ID[fieldId];
    nuevoRegistro[campo] = $(fieldId).value;
  });

  const solucionesSeleccionadas = Array.from(document.querySelectorAll('input[name="solucion"]:checked'))
    .map((cb) => cb.value)
    .join(", ");
  nuevoRegistro.solucion = solucionesSeleccionadas;

  if (!nuevoRegistro.equipoRef) {
    alert("Selecciona un equipo");
    return;
  }
  if (!solucionesSeleccionadas) {
    alert("Selecciona al menos una solución aplicada");
    return;
  }

  if (!mantenimientoEquiposActualId) {
    nuevoRegistro.id = crypto.randomUUID();
    mantenimientoEquiposData.push(nuevoRegistro);
  } else {
    const idx = mantenimientoEquiposData.findIndex((r) => r.id === mantenimientoEquiposActualId);
    if (idx !== -1) mantenimientoEquiposData[idx] = { ...mantenimientoEquiposData[idx], ...nuevoRegistro };
  }
  guardarMantenimientoEquipos();
  refrescarVistasSecundarias();
  cerrarModalMantenimientoEquipos();
}

function eliminarRegistroMantenimientoActual() {
  if (!mantenimientoEquiposActualId) return;
  if (!confirm("¿Eliminar este registro?")) return;
  const idx = mantenimientoEquiposData.findIndex((r) => r.id === mantenimientoEquiposActualId);
  if (idx !== -1) {
    const id = mantenimientoEquiposData[idx].id;
    mantenimientoEquiposData.splice(idx, 1);
    guardarMantenimientoEquipos();
    sincronizarEliminacionRegistroMantenimiento(id);
    refrescarVistasSecundarias();
    cerrarModalMantenimientoEquipos();
  }
}

/* ---------- Modal de ticket de garantía (nuevo / editar) ---------- */

function actualizarCampoEquipoTicketGarantia() {
  const esCanella = $("tgProveedor").value === "Canella";
  $("tgEquipo").setAttribute("list", esCanella ? "dl-impresorasSerialCatalogo" : "dl-nombreRedEquipo");
  $("tgEquipo").placeholder = esCanella ? "Serial de la impresora..." : "Nombre en Red del equipo...";
}

function abrirModalTicketGarantia(ticket) {
  $("formTicketGarantia").reset();
  if (ticket) {
    $("modalTicketGarantiaTitulo").textContent = `Editar ticket — ${ticket.numeroTicket || ""}`;
    TICKET_GARANTIA_FIELD_IDS.forEach((idCampo) => {
      const campo = TICKET_GARANTIA_CAMPO_POR_ID[idCampo];
      if (ticket[campo] !== undefined) $(idCampo).value = ticket[campo];
    });
    $("btnEliminarModalTicketGarantia").style.display = "";
  } else {
    $("modalTicketGarantiaTitulo").textContent = "Nuevo ticket de garantía";
    $("tgId").value = "";
    $("tgProveedor").value = "GBM";
    $("tgEstado").value = "Abierto";
    $("tgFechaReporte").value = new Date().toISOString().slice(0, 10);
    $("btnEliminarModalTicketGarantia").style.display = "none";
  }
  actualizarCampoEquipoTicketGarantia();
  $("modalTicketGarantiaOverlay").classList.add("open");
}

function cerrarModalTicketGarantia() {
  $("modalTicketGarantiaOverlay").classList.remove("open");
}

function onSubmitTicketGarantia(e) {
  e.preventDefault();
  const data = {};
  TICKET_GARANTIA_FIELD_IDS.forEach((idCampo) => {
    data[TICKET_GARANTIA_CAMPO_POR_ID[idCampo]] = $(idCampo).value.trim();
  });
  data.ultimaModificacion = new Date().toISOString().slice(0, 16);

  let guardado;
  if (data.id) {
    const idx = ticketsGarantiaData.findIndex((t) => t.id === data.id);
    if (idx !== -1) ticketsGarantiaData[idx] = { ...ticketsGarantiaData[idx], ...data };
    guardado = ticketsGarantiaData[idx];
  } else {
    data.id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    data.reportadoPor = TECNICO_ACTUAL;
    ticketsGarantiaData.push(data);
    guardado = data;
  }
  guardarTicketsGarantia();
  sincronizarTicketGarantia(guardado);
  cerrarModalTicketGarantia();
  refrescarVistasSecundarias();
}

function eliminarTicketGarantiaActual() {
  const id = $("tgId").value;
  if (!id) return;
  if (!confirm("¿Eliminar este ticket de garantía de forma permanente?")) return;
  ticketsGarantiaData = ticketsGarantiaData.filter((t) => t.id !== id);
  guardarTicketsGarantia();
  sincronizarEliminacionTicketGarantia(id);
  cerrarModalTicketGarantia();
  refrescarVistasSecundarias();
}

function eliminarDocumentoAnexoMovil(id, boton) {
  const documento = documentosAnexoMovilesData.find((d) => d.id === id);
  if (!documento) return;
  if (boton && boton.disabled) return;
  if (!confirm(`¿Eliminar el documento "${documento.nombreArchivo}"? Esta acción no se puede deshacer.`)) return;
  if (!(window.DocumentosAnexoMovilesSync && typeof window.DocumentosAnexoMovilesSync.eliminarDocumento === "function")) {
    alert("No se pudo eliminar: la sincronización con Firebase todavía no está lista. Intenta de nuevo en unos segundos.");
    return;
  }
  if (boton) boton.disabled = true;
  window.DocumentosAnexoMovilesSync.eliminarDocumento(documento)
    .then(() => {
      documentosAnexoMovilesData = documentosAnexoMovilesData.filter((d) => d.id !== id);
      guardarDocumentosAnexoMoviles();
      vistaDocumentosAnexoMoviles.render();
    })
    .catch((err) => {
      console.error(err);
      if (boton) boton.disabled = false;
      alert("No se pudo eliminar el documento. Verifica tu conexión a internet e intenta de nuevo.");
    });
}

function eliminarDocumentoAnexoOficina(id, boton) {
  const documento = documentosAnexoOficinaData.find((d) => d.id === id);
  if (!documento) return;
  if (boton && boton.disabled) return;
  if (!confirm(`¿Eliminar el documento "${documento.nombreArchivo}"? Esta acción no se puede deshacer.`)) return;
  if (!(window.DocumentosAnexoOficinaSync && typeof window.DocumentosAnexoOficinaSync.eliminarDocumento === "function")) {
    alert("No se pudo eliminar: la sincronización con Firebase todavía no está lista. Intenta de nuevo en unos segundos.");
    return;
  }
  if (boton) boton.disabled = true;
  window.DocumentosAnexoOficinaSync.eliminarDocumento(documento)
    .then(() => {
      documentosAnexoOficinaData = documentosAnexoOficinaData.filter((d) => d.id !== id);
      guardarDocumentosAnexoOficina();
      vistaDocumentosAnexoOficina.render();
    })
    .catch((err) => {
      console.error(err);
      if (boton) boton.disabled = false;
      alert("No se pudo eliminar el documento. Verifica tu conexión a internet e intenta de nuevo.");
    });
}

/* ---------- Modal para guardar documentos firmados (Anexo Móvil) ----------
   El PDF firmado se sube a mano a Google Drive (Firebase Storage exige
   pasar al plan de pago); aquí solo se guarda el enlace ya compartido. */

function actualizarCampoReferenciaDocumentoAnexoMovil() {
  const esHojaResponsabilidad = $("damTipo").value === "hojaResponsabilidad";
  $("damCampoEmpresa").style.display = esHojaResponsabilidad ? "none" : "";
  $("damCampoNumero").style.display = esHojaResponsabilidad ? "" : "none";
}

function abrirModalDocumentoAnexoMovil() {
  $("formDocumentoAnexoMovil").reset();
  $("damTipo").value = "anexoMovil";
  actualizarCampoReferenciaDocumentoAnexoMovil();
  $("damEstado").style.display = "none";
  $("modalDocumentoAnexoMovilOverlay").classList.add("open");
}

function cerrarModalDocumentoAnexoMovil() {
  $("modalDocumentoAnexoMovilOverlay").classList.remove("open");
}

function onSubmitDocumentoAnexoMovil(e) {
  e.preventDefault();
  const tipo = $("damTipo").value;
  const referencia = (tipo === "hojaResponsabilidad" ? $("damNumero").value : $("damEmpresa").value).trim();
  const enlace = $("damEnlace").value.trim();
  const nombreArchivo = $("damNombre").value.trim() || `${ETIQUETA_TIPO_DOCUMENTO_ANEXO_MOVIL[tipo]} - ${referencia}`;
  const estado = $("damEstado");
  estado.style.display = "";

  if (!referencia) {
    estado.textContent = tipo === "hojaResponsabilidad" ? "Escribe el número de línea." : "Escribe la empresa.";
    return;
  }
  if (!/^https?:\/\//i.test(enlace)) {
    estado.textContent = "Pega el enlace de Google Drive del documento ya firmado.";
    return;
  }
  if (!(window.DocumentosAnexoMovilesSync && typeof window.DocumentosAnexoMovilesSync.guardarDocumento === "function")) {
    estado.textContent = "La sincronización con Firebase todavía no está lista. Intenta de nuevo en unos segundos.";
    return;
  }

  const boton = $("btnGuardarDocumentoAnexoMovil");
  boton.disabled = true;
  estado.textContent = "Guardando...";

  const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
  window.DocumentosAnexoMovilesSync.guardarDocumento({ id, tipo, referencia, nombreArchivo, url: enlace, subidoPor: TECNICO_ACTUAL })
    .then((metadata) => {
      if (!documentosAnexoMovilesData.some((d) => d.id === metadata.id)) {
        documentosAnexoMovilesData.push(metadata);
      }
      guardarDocumentosAnexoMoviles();
      vistaDocumentosAnexoMoviles.render();
      cerrarModalDocumentoAnexoMovil();
    })
    .catch((err) => {
      console.error(err);
      estado.textContent = "No se pudo guardar el documento. Verifica tu conexión a internet e intenta de nuevo.";
    })
    .finally(() => {
      boton.disabled = false;
    });
}

/* ---------- Modal para guardar documentos firmados (Anexo Oficina) ---------- */

function abrirModalDocumentoAnexoOficina() {
  $("formDocumentoAnexoOficina").reset();
  $("daoEstado").style.display = "none";
  $("modalDocumentoAnexoOficinaOverlay").classList.add("open");
}

function cerrarModalDocumentoAnexoOficina() {
  $("modalDocumentoAnexoOficinaOverlay").classList.remove("open");
}

function onSubmitDocumentoAnexoOficina(e) {
  e.preventDefault();
  const referencia = $("daoEmpresa").value.trim();
  const enlace = $("daoEnlace").value.trim();
  const nombreArchivo = $("daoNombre").value.trim() || `Anexo de Servicios Multimedia - ${referencia}`;
  const estado = $("daoEstado");
  estado.style.display = "";

  if (!referencia) {
    estado.textContent = "Escribe la empresa.";
    return;
  }
  if (!/^https?:\/\//i.test(enlace)) {
    estado.textContent = "Pega el enlace de Google Drive del documento ya firmado.";
    return;
  }
  if (!(window.DocumentosAnexoOficinaSync && typeof window.DocumentosAnexoOficinaSync.guardarDocumento === "function")) {
    estado.textContent = "La sincronización con Firebase todavía no está lista. Intenta de nuevo en unos segundos.";
    return;
  }

  const boton = $("btnGuardarDocumentoAnexoOficina");
  boton.disabled = true;
  estado.textContent = "Guardando...";

  const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
  window.DocumentosAnexoOficinaSync.guardarDocumento({ id, referencia, nombreArchivo, url: enlace, subidoPor: TECNICO_ACTUAL })
    .then((metadata) => {
      if (!documentosAnexoOficinaData.some((d) => d.id === metadata.id)) {
        documentosAnexoOficinaData.push(metadata);
      }
      guardarDocumentosAnexoOficina();
      vistaDocumentosAnexoOficina.render();
      cerrarModalDocumentoAnexoOficina();
    })
    .catch((err) => {
      console.error(err);
      estado.textContent = "No se pudo guardar el documento. Verifica tu conexión a internet e intenta de nuevo.";
    })
    .finally(() => {
      boton.disabled = false;
    });
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

function buscarMonitorCatalogo(serial) {
  const s = (serial || "").trim();
  if (!s) return null;
  const catalogo = typeof CATALOGO_MONITORES !== "undefined" && Array.isArray(CATALOGO_MONITORES) ? CATALOGO_MONITORES : [];
  return catalogo.find((m) => m.serial === s) || null;
}

function descripcionMonitorEquipo(equipo) {
  const valor = (equipo.monitor || "").trim();
  if (!valor) return "";
  const m = buscarMonitorCatalogo(valor);
  // Si no calza con el catalogo, es texto libre capturado antes de vincular al
  // catalogo (o un serial que ya no esta en el archivo de contratos) - se
  // muestra tal cual para no perder el dato.
  return m ? `${m.descripcion || m.modelo} (S/N ${m.serial})` : valor;
}

function actualizarAyudaMonitor() {
  const ayuda = $("monitorAyuda");
  const valor = $("monitor").value.trim();
  if (!valor) {
    ayuda.textContent = "";
    ayuda.classList.remove("sin-match");
    return;
  }
  const m = buscarMonitorCatalogo(valor);
  if (m) {
    ayuda.textContent = `✓ ${m.descripcion || m.modelo} · Contrato ${m.contrato} (vence ${m.fechaFin})`;
    ayuda.classList.remove("sin-match");
  } else {
    ayuda.textContent = "⚠ No coincide con un serial del catálogo (se guardará el texto tal cual)";
    ayuda.classList.add("sin-match");
  }
}

function renderSugerenciasMonitor(filtro) {
  const lista = $("monitorSugerencias");
  const catalogo = typeof CATALOGO_MONITORES !== "undefined" && Array.isArray(CATALOGO_MONITORES) ? CATALOGO_MONITORES : [];
  const t = (filtro || "").trim().toLowerCase();
  const resultados = (t ? catalogo.filter((m) => [m.serial, m.modelo, m.descripcion].join(" ").toLowerCase().includes(t)) : catalogo).slice(
    0,
    30
  );

  lista.innerHTML = "";
  if (!resultados.length) {
    lista.innerHTML = `<div class="autocomplete-item" style="cursor:default;color:#9ca3af;">Sin coincidencias en el catálogo</div>`;
    lista.classList.add("open");
    return;
  }

  resultados.forEach((m) => {
    const item = document.createElement("div");
    item.className = "autocomplete-item";
    item.innerHTML = `${esc(m.descripcion || m.modelo)}<small>S/N ${esc(m.serial)} · Contrato ${esc(m.contrato)}</small>`;
    // mousedown (no click) para que dispare antes del blur del input.
    item.addEventListener("mousedown", (e) => {
      e.preventDefault();
      $("monitor").value = m.serial;
      lista.classList.remove("open");
      actualizarAyudaMonitor();
    });
    lista.appendChild(item);
  });
  lista.classList.add("open");
}

function inicializarAutocompleteMonitor() {
  const input = $("monitor");
  const lista = $("monitorSugerencias");
  input.addEventListener("focus", () => renderSugerenciasMonitor(""));
  input.addEventListener("input", () => {
    renderSugerenciasMonitor(input.value);
    actualizarAyudaMonitor();
  });
  input.addEventListener("blur", () => {
    setTimeout(() => lista.classList.remove("open"), 150);
  });
}

function valoresUnicos(campo) {
  return [...new Set(equipos.map((e) => String(e[campo] || "").trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "es")
  );
}

function valoresUnicosImpresoras(campo) {
  return [...new Set(impresorasData.map((p) => String(p[campo] || "").trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "es")
  );
}

function valoresUnicosContratosMoviles(campo) {
  return [...new Set(contratosMovilesData.map((c) => String(c[campo] || "").trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "es")
  );
}

function valoresUnicosLineasMoviles(campo) {
  return [...new Set(lineasMovilesData.map((l) => String(l[campo] || "").trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "es")
  );
}

function valoresUnicosContratosOficina(campo) {
  return [...new Set(contratosOficinaData.map((c) => String(c[campo] || "").trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "es")
  );
}

function valoresUnicosServiciosOficina(campo) {
  return [...new Set(serviciosOficinaData.map((s) => String(s[campo] || "").trim()).filter(Boolean))].sort((a, b) =>
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
    "dl-numeroInventarioMonitor": "numeroInventarioMonitor",
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
    "dl-impresorasSerialCatalogo": "serial",
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
    "dl-lmEmpresa": "empresa",
    "dl-lmNumeroMadre": "numeroMadre",
    "dl-lmNombreUsuario": "nombreUsuario",
    "dl-lmDepartamentoUsuario": "departamentoUsuario",
    "dl-lmSegmento": "segmento",
    "dl-lmNumero": "numero",
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

  const datalistMapContratosOficina = {
    "dl-coEmpresa": "empresa",
    "dl-coPaqueteContratar": "paqueteContratar",
  };
  Object.entries(datalistMapContratosOficina).forEach(([dlId, campo]) => {
    const dl = $(dlId);
    dl.innerHTML = "";
    valoresUnicosContratosOficina(campo).forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      dl.appendChild(opt);
    });
  });

  const datalistMapServiciosOficina = {
    "dl-soEmpresa": "empresa",
  };
  Object.entries(datalistMapServiciosOficina).forEach(([dlId, campo]) => {
    const dl = $(dlId);
    dl.innerHTML = "";
    valoresUnicosServiciosOficina(campo).forEach((v) => {
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
  actualizarAyudaMonitor();
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
    actualizarAyudaMonitor();
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

// Sugiere el siguiente código de Hoja de Responsabilidad del año en curso
// (formato "AAAA-N"), para que no se repita ni se pierda la numeración
// cuando varios técnicos capturan líneas nuevas.
function siguienteCodigoHojaResponsabilidad() {
  const anio = new Date().getFullYear();
  let maximo = 0;
  lineasMovilesData.forEach((l) => {
    const m = /^(\d{4})-(\d+)$/.exec(String(l.hojaRespCodigo || "").trim());
    if (m && Number(m[1]) === anio) maximo = Math.max(maximo, Number(m[2]));
  });
  return `${anio}-${maximo + 1}`;
}

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
    $("lmHojaRespCodigo").value = siguienteCodigoHojaResponsabilidad();
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

/* ---------- Modal de contrato de oficina (nuevo / editar) ---------- */

function abrirModalContratoOficina(contrato) {
  $("formContratoOficina").reset();
  if (contrato) {
    $("modalContratoOficinaTitulo").textContent = `Editar contrato de oficina — ${contrato.empresa || ""}`;
    CONTRATO_OFICINA_FIELD_IDS.forEach((idCampo) => {
      const campo = CONTRATO_OFICINA_CAMPO_POR_ID[idCampo];
      if (contrato[campo] !== undefined) $(idCampo).value = contrato[campo];
    });
    $("btnEliminarModalContratoOficina").style.display = "";
  } else {
    $("modalContratoOficinaTitulo").textContent = "Nuevo contrato de oficina";
    $("coId").value = "";
    $("btnEliminarModalContratoOficina").style.display = "none";
  }
  $("modalContratoOficinaOverlay").classList.add("open");
}

function cerrarModalContratoOficina() {
  $("modalContratoOficinaOverlay").classList.remove("open");
}

function onSubmitContratoOficina(e) {
  e.preventDefault();
  const data = {};
  CONTRATO_OFICINA_FIELD_IDS.forEach((idCampo) => {
    data[CONTRATO_OFICINA_CAMPO_POR_ID[idCampo]] = $(idCampo).value.trim();
  });
  data.ultimaModificacion = new Date().toISOString().slice(0, 16);

  let guardado;
  if (data.id) {
    const idx = contratosOficinaData.findIndex((c) => c.id === data.id);
    if (idx !== -1) contratosOficinaData[idx] = { ...contratosOficinaData[idx], ...data };
    guardado = contratosOficinaData[idx];
  } else {
    data.id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    contratosOficinaData.push(data);
    guardado = data;
  }
  guardarContratosOficina();
  sincronizarContratoOficina(guardado);
  cerrarModalContratoOficina();
  poblarFiltrosYDatalists();
  refrescarVistasSecundarias();
}

function eliminarContratoOficinaActual() {
  const id = $("coId").value;
  if (!id) return;
  if (!confirm("¿Eliminar este contrato de oficina de forma permanente?")) return;
  contratosOficinaData = contratosOficinaData.filter((c) => c.id !== id);
  guardarContratosOficina();
  sincronizarEliminacionContratoOficina(id);
  cerrarModalContratoOficina();
  refrescarVistasSecundarias();
}

/* ---------- Modal de servicio adicional de oficina (nuevo / editar) ---------- */

function abrirModalServicioOficina(servicio) {
  $("formServicioOficina").reset();
  if (servicio) {
    $("modalServicioOficinaTitulo").textContent = `Editar servicio adicional — ${servicio.tipoServicio || ""}`;
    SERVICIO_OFICINA_FIELD_IDS.forEach((idCampo) => {
      const campo = SERVICIO_OFICINA_CAMPO_POR_ID[idCampo];
      if (servicio[campo] !== undefined) $(idCampo).value = servicio[campo];
    });
    $("btnEliminarModalServicioOficina").style.display = "";
  } else {
    $("modalServicioOficinaTitulo").textContent = "Nuevo servicio adicional";
    $("soId").value = "";
    $("btnEliminarModalServicioOficina").style.display = "none";
  }
  $("modalServicioOficinaOverlay").classList.add("open");
}

function cerrarModalServicioOficina() {
  $("modalServicioOficinaOverlay").classList.remove("open");
}

function onSubmitServicioOficina(e) {
  e.preventDefault();
  const data = {};
  SERVICIO_OFICINA_FIELD_IDS.forEach((idCampo) => {
    data[SERVICIO_OFICINA_CAMPO_POR_ID[idCampo]] = $(idCampo).value.trim();
  });
  data.ultimaModificacion = new Date().toISOString().slice(0, 16);

  let guardado;
  if (data.id) {
    const idx = serviciosOficinaData.findIndex((s) => s.id === data.id);
    if (idx !== -1) serviciosOficinaData[idx] = { ...serviciosOficinaData[idx], ...data };
    guardado = serviciosOficinaData[idx];
  } else {
    data.id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    serviciosOficinaData.push(data);
    guardado = data;
  }
  guardarServiciosOficina();
  sincronizarServicioOficina(guardado);
  cerrarModalServicioOficina();
  poblarFiltrosYDatalists();
  refrescarVistasSecundarias();
}

function eliminarServicioOficinaActual() {
  const id = $("soId").value;
  if (!id) return;
  if (!confirm("¿Eliminar este servicio adicional de forma permanente?")) return;
  serviciosOficinaData = serviciosOficinaData.filter((s) => s.id !== id);
  guardarServiciosOficina();
  sincronizarEliminacionServicioOficina(id);
  cerrarModalServicioOficina();
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

function obtenerMonitorDetectadoTIv2(equipo) {
  // El Agente de Inventario TI detecta el monitor fisico conectado (via EDID/
  // WmiMonitorID) y lo guarda en equiposTI_v2, buscado por nombre de equipo en
  // red. Se prefiere sobre el campo "monitor" capturado a mano, que puede
  // quedar desactualizado si el monitor cambio.
  const nombreRed = (equipo.nombreRed || "").trim().toLowerCase();
  if (!nombreRed || typeof equiposTIv2Data === "undefined") return "";
  const doc = equiposTIv2Data.find((e) => (e.computadora || e.equipoId || "").trim().toLowerCase() === nombreRed);
  if (!doc) return "";
  return formatearMonitorTIv2(doc.hardware || {});
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
          ${filaActa("Monitor:", descripcionMonitorEquipo(equipo))}
          ${filaActa("No. Inventario Monitor:", equipo.numeroInventarioMonitor)}
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

// A diferencia de esc() (que usan las demas tablas de la app y muestra "N/A"
// cuando el dato falta), el Anexo de Claro es un documento legal: los campos
// sin dato deben quedar en blanco (la casilla vacia con su subrayado), igual
// que en el Excel original, nunca con texto de relleno.
function av(v) {
  return v && String(v).trim() !== "" ? v : "";
}

// El formulario de Claro divide el correo en dos casillas separadas por un
// "@" literal impreso en el formato (usuario @ dominio); cuando esta vacio
// el dominio se marca con un guion "-", tal como viene en el documento.
function campoCorreo(etiqueta, correoCompleto) {
  const partes = (correoCompleto || "").split("@");
  const usuario = (partes[0] || "").trim();
  const dominio = (partes[1] || "").trim() || "-";
  return `<div class="anexo-campo"><span class="lbl">${etiqueta}</span><span class="val">${av(usuario)}</span><span class="lbl">@</span><span class="val" style="flex:0 0 90px;">${av(dominio)}</span></div>`;
}

function anexoServiciosMovilesHTML(contrato, lineas) {
  const sumaLineas = lineas.reduce((s, l) => s + (Number(l.tarifaTotal || l.tarifaPlan) || 0), 0);
  const totalMensual = contrato.totalMensual ? Number(contrato.totalMensual) : sumaLineas;

  const filasLineas = lineas
    .map(
      (l, i) => `
        <tr>
          <td class="centro">${i + 1}</td>
          <td>${av(l.numero)}</td>
          <td>${av(l.modelo)}</td>
          <td>${av(l.imei)}</td>
          <td>${av(l.iccidEsn)}</td>
          <td class="num">${l.costoEquipo ? "Q " + Number(l.costoEquipo).toFixed(2) : "Q -"}</td>
          <td>${av(l.plan)}</td>
          <td class="num">${l.tarifaPlan ? "Q " + Number(l.tarifaPlan).toFixed(2) : ""}</td>
          <td class="centro">${av(l.tipoServicioCloud)}</td>
          <td class="centro">${av(l.servicioCloud)}</td>
          <td class="centro">${av(l.correoSpacesuite)}</td>
          <td class="centro">${av(l.spacesuite)}</td>
          <td class="centro">${av(l.correoCorporativo)}</td>
          <td class="centro">${av(l.appsCorp)}</td>
          <td class="centro">${av(l.navegacionApps)}</td>
          <td class="centro">${av(l.suitcase)}</td>
          <td class="centro">${av(l.pentcloud)}</td>
          <td class="centro">${av(l.llamadasIlimitadas)}</td>
          <td class="centro">${av(l.paqueteRoaming)}</td>
          <td class="centro">${av(l.claroDirecto)}</td>
          <td class="centro">${av(l.vpn)}</td>
          <td class="centro">${av(l.aviDesvioPrepago)}</td>
          <td class="centro">${av(l.descuentoAutomatico)}</td>
          <td class="num">${(l.tarifaTotal || l.tarifaPlan) ? "Q " + Number(l.tarifaTotal || l.tarifaPlan).toFixed(2) : ""}</td>
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
        <span><strong>Categoría de Cliente:</strong> ${av(contrato.categoriaCliente)}</span>
        <span><strong>Gestión:</strong> ${av(contrato.tipoGestion)}</span>
        <span><strong>Tipo de Cliente:</strong> Existente</span>
      </div>

      <div class="anexo-seccion">Información General</div>
      <div class="anexo-campos">
        <div class="anexo-campo"><span class="lbl">Nombre Completo / Razón Social:</span><span class="val">${av(contrato.empresa)}</span></div>
        <div class="anexo-campo"><span class="lbl">Nombre Comercial:</span><span class="val"></span></div>
        <div class="anexo-campo-doble">
          <div class="anexo-campo"><span class="lbl">Nombre Representante Legal:</span><span class="val">${av(contrato.representanteLegal)}</span></div>
          <div class="anexo-campo"><span class="lbl">Cargo:</span><span class="val"></span></div>
        </div>
        <div class="anexo-campo-doble">
          <div class="anexo-campo"><span class="lbl">Salario:</span><span class="val"></span></div>
          <div class="anexo-campo"><span class="lbl">Antigüedad:</span><span class="val"></span></div>
        </div>
        <div class="anexo-campo-doble">
          <div class="anexo-campo"><span class="lbl">Documento de Identificación:</span><span class="val"></span></div>
          <div class="anexo-campo"><span class="lbl">NIT:</span><span class="val">${av(contrato.nit)}</span></div>
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
        <div class="anexo-campo"><span class="lbl">Plazo de Contrato:</span><span class="val">${av(contrato.plazoContrato)}</span></div>
        <div class="anexo-campo"><span class="lbl">Otros a:</span><span class="val"></span></div>
      </div>
      <div class="anexo-checks">${casilla(false, "Claro Cloud")}</div>
      <table class="anexo-tabla">
        <thead>
          <tr><th>Cantidad</th><th>Descripción</th><th>Total Mensual</th></tr>
        </thead>
        <tbody>
          <tr>
            <td class="centro">${av(contrato.cantidadLineas)}</td>
            <td>${av(contrato.planContratado)}</td>
            <td class="num">Q ${totalMensual.toFixed(2)}</td>
          </tr>
          <tr><td class="centro"></td><td></td><td class="num"></td></tr>
          <tr><td class="centro"></td><td></td><td class="num"></td></tr>
          <tr class="anexo-tabla-total"><td colspan="2">TOTAL</td><td class="num">Q ${totalMensual.toFixed(2)}</td></tr>
        </tbody>
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
          <tr class="anexo-tabla-total"><td colspan="2">TOTAL</td><td class="num">Q 0.00</td></tr>
        </tbody>
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
          <tr class="anexo-tabla-total"><td colspan="3">TOTAL</td><td class="num">Q 0.00</td><td colspan="4"></td></tr>
        </tbody>
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
          <tr class="anexo-tabla-total"><td colspan="4">TOTAL</td><td class="num">Q 0</td></tr>
        </tbody>
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
      <div class="anexo-campo"><span class="val">${av(contrato.observaciones)}</span></div>
      <div class="anexo-campo"><span class="val"></span></div>
      <div class="anexo-campo"><span class="val"></span></div>
      <div class="anexo-campo"><span class="val"></span></div>
      <div class="anexo-campo"><span class="val"></span></div>
      <div class="anexo-campo"><span class="val"></span></div>

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
        <span class="val">${av(contrato.fechaFirma)}</span>
      </div>
      <div class="anexo-campo-doble anexo-firma-fila">
        <div class="anexo-campo"><span class="lbl"><strong>Nombre de Ejecutivo:</strong></span><span class="val">${av(contrato.ejecutivoVentas)}</span></div>
        <div class="anexo-campo"><span class="lbl"><strong>Firma del Cliente:</strong></span><span class="val"></span></div>
      </div>

      <div class="salto-pagina anexo-lineas-pagina">
        <div class="anexo-campo"><strong>${av(contrato.empresa)}</strong></div>
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
          <tbody>
            ${filasLineas || '<tr><td colspan="24" class="centro">Sin líneas registradas para esta empresa.</td></tr>'}
            <tr class="anexo-tabla-total"><td colspan="23">SUB TOTAL</td><td class="num">Q ${sumaLineas.toFixed(2)}</td></tr>
            <tr class="anexo-tabla-total"><td colspan="23">NEGOCIACIÓN</td><td class="num"></td></tr>
            <tr class="anexo-tabla-total"><td colspan="23">TOTAL</td><td class="num">Q ${sumaLineas.toFixed(2)}</td></tr>
          </tbody>
        </table>
        <div class="anexo-aceptacion">
          <span class="anexo-firma-linea">Nombre Empresa / Nombre Titular — Firma</span>
          <span class="anexo-firma-linea">Gerencia Mercado Corporativo País</span>
        </div>
        <p class="anexo-nota-lineas">Firma</p>
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

function imprimirFormatoAdhesionMovilPorEmpresa(empresaTexto) {
  const empresaBuscada = (empresaTexto || "").trim().toLowerCase();
  if (!empresaBuscada) {
    alert("Escribe o selecciona la empresa que quieres imprimir.");
    return;
  }
  const contrato = contratosMovilesData.find((c) => (c.empresa || "").trim().toLowerCase() === empresaBuscada);
  if (!contrato) {
    alert("No se encontró un contrato móvil con ese nombre de empresa. Verifica que coincida con el registrado en Contratos Móviles.");
    return;
  }
  const lineas = lineasMovilesData.filter((l) => (l.empresa || "").trim().toLowerCase() === empresaBuscada);
  $("printArea").innerHTML = anexoServiciosMovilesHTML(contrato, lineas);
  window.print();
}

function imprimirFormatoAdhesionMovil() {
  imprimirFormatoAdhesionMovilPorEmpresa($("empresaImprimirLineas").value);
}

function imprimirLineaMovilDesdeModal() {
  imprimirFormatoAdhesionMovilPorEmpresa($("lmEmpresa").value);
}

/* ---------- Hoja de Responsabilidad por Línea y Equipo Telefónico (uso interno) ----------
   A diferencia del Anexo de Servicios Móviles (que va hacia Claro/Tigo), este
   documento es interno: el Departamento de TI se lo entrega al empleado como
   acuse de recibo del celular corporativo. Mismo texto de condiciones y
   cláusula de responsabilidad que ya usa la app en el Acta de equipo de
   cómputo. */

function hojaResponsabilidadHTML(linea) {
  const fecha = formatearFecha(new Date().toISOString());
  const tieneAnterior = [
    linea.anteriorMarca, linea.anteriorModelo, linea.anteriorColor,
    linea.anteriorRam, linea.anteriorRom, linea.anteriorSerie, linea.anteriorImei,
  ].some((v) => (v || "").trim() !== "");

  return `
    <div class="hoja-resp">
      <div class="hoja-resp-header">DEPARTAMENTO DE TECNOLOGIA E INFORMACION</div>
      <div class="hoja-resp-titulo">HOJA DE RESPONSABILIDAD POR LÍNEA Y EQUIPO TELEFÓNICO</div>

      <table class="hoja-resp-memo">
        <tr><td class="lbl">Para:</td><td>${av(linea.empleadoNombre)}${linea.empleadoPuesto ? `<br>${esc(linea.empleadoPuesto)}` : ""}</td></tr>
        <tr><td class="lbl">Empresa:</td><td>${av(linea.empresa)}</td></tr>
        <tr><td class="lbl">De:</td><td>Departamento IT</td></tr>
        <tr><td class="lbl">Fecha:</td><td>${fecha}</td></tr>
        <tr><td class="lbl">Motivo:</td><td>Asignación de equipo ${av(linea.numero)} ${av(linea.operador)}</td></tr>
      </table>

      <p>Por el presente medio se hace la entrega del teléfono celular corporativo de la empresa <strong>${av(linea.operador)}</strong>.</p>

      <div class="anexo-seccion">Datos del Equipo</div>
      <table class="anexo-tabla">
        <thead><tr><th>NUMERO</th><th>MARCA</th><th>MODELO</th><th>COLOR</th><th>RAM</th><th>ROM</th><th>SERIE</th><th>IMEI</th></tr></thead>
        <tbody>
          <tr>
            <td class="centro">${av(linea.numero)}</td>
            <td>${av(linea.marca)}</td>
            <td>${av(linea.modelo)}</td>
            <td class="centro">${av(linea.color)}</td>
            <td class="centro">${av(linea.ram)}</td>
            <td class="centro">${av(linea.rom)}</td>
            <td class="centro">${av(linea.serie)}</td>
            <td class="centro">${av(linea.imei)}</td>
          </tr>
        </tbody>
      </table>

      <div class="anexo-seccion">Plan Asignado</div>
      <table class="anexo-tabla">
        <thead><tr><th>MINUTOS</th><th>SMS</th><th>DATOS</th><th>TOTAL</th></tr></thead>
        <tbody>
          <tr>
            <td class="centro">ILIMITADOS</td>
            <td class="centro">ILIMITADOS</td>
            <td class="centro">${av(linea.plan)}</td>
            <td class="num">${(linea.tarifaTotal || linea.tarifaPlan) ? "Q " + Number(linea.tarifaTotal || linea.tarifaPlan).toFixed(2) : ""}</td>
          </tr>
        </tbody>
      </table>

      <p><strong>Condiciones de uso:</strong></p>
      <ol class="hoja-resp-condiciones">
        <li>El celular es propiedad de la corporación y debe ser entregado al momento de retirarse de la misma. La falta de entrega del celular se atenderá de acuerdo con las políticas y/o decisión de Gerencia General.</li>
        <li>El empleado que exceda el plan asignado (minutos, mensajes, internet) pagará la diferencia, la cual les será descontada en planilla mensualmente en un mínimo de un (1) pago hasta un máximo de cuatro (4) meses.</li>
        <li>Toda información almacenada (doctos, emails, fotos, etc.) en este celular corporativo es propiedad de la corporación. Por tanto, esta información puede ser requerida en cualquier momento por el personal de T.I.</li>
        <li>El colaborador es responsable de cualquier daño o robo que le ocurra al equipo, pagando la totalidad o el deducible que sea determinado por el proveedor de CLARO / TIGO y el departamento de contabilidad.</li>
        <li>Solicitamos mantener con clave, huella, patrón, PIN de acceso el dispositivo, para protección de la información almacenada en caso de robo o extravío.</li>
        <li>Es responsabilidad del empleado la información que comparta con terceros (personas ajenas de la corporación) sin previa autorización de su Gerente de unidad.</li>
      </ol>

      <div class="anexo-seccion">Observaciones</div>
      <p>${av(linea.observaciones)}</p>

      <div class="anexo-seccion">El usuario entrega el equipo anterior de la siguiente manera:</div>
      ${
        tieneAnterior
          ? `
      <table class="anexo-tabla">
        <tbody>
          <tr><td class="lbl">Marca:</td><td>${av(linea.anteriorMarca)}</td><td class="lbl">Modelo:</td><td>${av(linea.anteriorModelo)}</td></tr>
          <tr><td class="lbl">Color:</td><td>${av(linea.anteriorColor)}</td><td class="lbl">RAM:</td><td>${av(linea.anteriorRam)}</td></tr>
          <tr><td class="lbl">ROM:</td><td>${av(linea.anteriorRom)}</td><td class="lbl">Serie:</td><td>${av(linea.anteriorSerie)}</td></tr>
          <tr><td class="lbl">IMEI:</td><td colspan="3">${av(linea.anteriorImei)}</td></tr>
        </tbody>
      </table>`
          : `<table class="anexo-tabla"><tbody>
          <tr><td class="lbl">Marca:</td><td></td><td class="lbl">Modelo:</td><td></td></tr>
          <tr><td class="lbl">Color:</td><td></td><td class="lbl">RAM:</td><td></td></tr>
          <tr><td class="lbl">ROM:</td><td></td><td class="lbl">Serie:</td><td></td></tr>
          <tr><td class="lbl">IMEI:</td><td colspan="3"></td></tr>
        </tbody></table>`
      }

      <p class="clausula">
        La entidad hace entrega al trabajador de bienes del inventario, propiedad de la empresa que aparece detallada
        en este documento, el cual le es confiado para que sea utilizado exclusivamente para la ejecución de su
        trabajo en calidad de depósito, estando obligado por ende a rendir cuentas de su uso, así como a devolverlo
        en cualquier momento a su requerimiento, aceptando el trabajador que la inobservancia a lo antes estipulado,
        constituirá falta, sujeta a la aplicación de medidas disciplinarias, sin perjuicio de las demás
        responsabilidades, civiles, penales y de cualquier otra índole, en las que pueda incurrir el trabajador por
        incumplimiento de lo antes estipulado.
      </p>

      <div class="hoja-resp-firmas">
        <div class="anexo-campo"><span class="lbl">Nombre completo:</span><span class="val">${av(linea.empleadoNombre)}</span></div>
        <div class="anexo-campo"><span class="lbl">DPI / Pasaporte:</span><span class="val">${av(linea.dpiPasaporte)}</span></div>
        <div class="firma-linea">Firma</div>
      </div>
    </div>
  `;
}

function imprimirHojaResponsabilidadDesdeModal() {
  const linea = {};
  LINEA_MOVIL_FIELD_IDS.forEach((idCampo) => (linea[LINEA_MOVIL_CAMPO_POR_ID[idCampo]] = $(idCampo).value.trim()));
  $("printArea").innerHTML = hojaResponsabilidadHTML(linea);
  window.print();
}

function imprimirHojaResponsabilidadPorNumero(numeroTexto) {
  const numeroBuscado = (numeroTexto || "").trim().toLowerCase();
  if (!numeroBuscado) {
    alert("Escribe o selecciona el número de línea que quieres imprimir.");
    return;
  }
  const linea = lineasMovilesData.find((l) => (l.numero || "").trim().toLowerCase() === numeroBuscado);
  if (!linea) {
    alert("No se encontró ninguna línea con ese número. Verifica que coincida con el registrado en Formato de Adhesión Móvil.");
    return;
  }
  $("printArea").innerHTML = hojaResponsabilidadHTML(linea);
  window.print();
}

function imprimirAnexoMovilDesdeReportes() {
  imprimirFormatoAdhesionMovilPorEmpresa($("empresaImprimirAnexoMovil").value);
}

function imprimirHojaResponsabilidadDesdeReportes() {
  imprimirHojaResponsabilidadPorNumero($("numeroImprimirHojaResponsabilidad").value);
}

function imprimirAnexoOficinaDesdeReportes() {
  imprimirAnexoOficinaPorEmpresa($("empresaImprimirAnexoOficina").value);
}

/* ---------- Anexo de Servicios Multimedia (impresión, mismo formato de Claro) ----------
   Igual que el Anexo de Servicios Móviles: cada seccion, casilla y columna del
   PDF original de Claro se imprime siempre, tenga o no dato capturado en el
   sistema. Solo se llenan dinamicamente los campos que sí tenemos guardados. */

function anexoServiciosMultimediaHTML(contrato, servicios) {
  const sumaMensual = servicios.reduce((s, r) => s + (Number(r.cuotaMensual) || 0), 0);
  const sumaInstalacion = servicios.reduce((s, r) => s + (Number(r.instalacion) || 0), 0);

  const filasServicios = servicios
    .map(
      (s) => `
        <tr>
          <td class="centro">${av(s.cantidad)}</td>
          <td>${av(s.tipoServicio)}</td>
          <td class="num">${s.instalacion ? "Q " + Number(s.instalacion).toFixed(2) : ""}</td>
          <td class="num">${s.cuotaMensual ? "Q " + Number(s.cuotaMensual).toFixed(2) : ""}</td>
        </tr>`
    )
    .join("");
  const filasVacias = Math.max(0, 4 - servicios.length);
  const filasServiciosCompletas =
    filasServicios + `<tr><td class="centro"></td><td></td><td class="num"></td><td class="num"></td></tr>`.repeat(filasVacias);

  return `
    <div class="anexo-oficina">
      <div class="anexo-movil-header">
        <div class="anexo-movil-logo">${typeof LOGO_CLARO_B64 !== "undefined" ? `<img src="${LOGO_CLARO_B64}" alt="Claro">` : "Claro"}</div>
        <div class="anexo-movil-titulo">Anexo de Servicios Multimedia</div>
        <div class="anexo-movil-version">V 5.3</div>
      </div>

      <div class="anexo-cabecera">
        <span><strong>Categoría de Cliente:</strong> ${av(contrato.categoriaCliente)}</span>
        <span><strong>Gestión:</strong> ${av(contrato.tipoGestion)}</span>
        <span><strong>Tipo de Cliente:</strong> Existente</span>
      </div>

      <div class="anexo-seccion">Información General</div>
      <div class="anexo-campos">
        <div class="anexo-campo"><span class="lbl">Nombre Completo/Razón Social:</span><span class="val">${av(contrato.empresa)}</span></div>
        <div class="anexo-campo-doble">
          <div class="anexo-campo"><span class="lbl">Nombre Comercial:</span><span class="val">${av(contrato.nombreComercial)}</span></div>
          <div class="anexo-campo"><span class="lbl">NIT:</span><span class="val">${av(contrato.nit)}</span></div>
        </div>
        <div class="anexo-campo"><span class="lbl">Dirección:</span><span class="val">${av(contrato.direccion)}</span></div>
        <div class="anexo-campo-doble">
          <div class="anexo-campo"><span class="lbl">Departamento / Ciudad:</span><span class="val">${av(contrato.departamentoCiudad)}</span></div>
          <div class="anexo-campo"><span class="lbl">Nombre Representante Legal:</span><span class="val">${av(contrato.representanteLegal)}</span></div>
        </div>
        <div class="anexo-campo-doble">
          <div class="anexo-campo"><span class="lbl">Doc. de Identificación:</span><span class="val">${av(contrato.docIdentificacion)}</span></div>
          <div class="anexo-campo"><span class="lbl">Antigüedad:</span><span class="val">${av(contrato.antiguedad)}</span></div>
        </div>
        <div class="anexo-campo"><span class="lbl">Salario:</span><span class="val">${av(contrato.salario)}</span></div>
      </div>

      <div class="anexo-seccion">Datos de Facturación</div>
      <div class="anexo-campos">
        <div class="anexo-campo-doble">
          <div class="anexo-campo"><span class="lbl">Nombre del Contacto:</span><span class="val">${av(contrato.contactoNombre)}</span></div>
          <div class="anexo-campo"><span class="lbl">Teléfono:</span><span class="val">${av(contrato.contactoTelefono)}</span></div>
        </div>
        ${campoCorreo("Correo Electrónico:", contrato.contactoCorreo)}
      </div>

      <div class="anexo-seccion">Datos de servicio Multimedia</div>
      <div class="anexo-campos">
        <div class="anexo-campo-doble">
          <div class="anexo-campo"><span class="lbl">Plazo de Contrato:</span><span class="val">${av(contrato.plazoContrato)}</span></div>
          <div class="anexo-campo"><span class="lbl">No. de Teléfono:</span><span class="val">${av(contrato.telefono)}</span></div>
        </div>
        <div class="anexo-campo"><span class="lbl">Dirección de Instalación 1:</span><span class="val">${av(contrato.instalacion1)}</span></div>
        <div class="anexo-campo"><span class="lbl">Dirección de Instalación 2:</span><span class="val">${av(contrato.instalacion2)}</span></div>
        <div class="anexo-campo"><span class="lbl">Dirección de Instalación 3:</span><span class="val">${av(contrato.instalacion3)}</span></div>
        <div class="anexo-campo"><span class="lbl">Dirección de Instalación 4:</span><span class="val">${av(contrato.instalacion4)}</span></div>
        <div class="anexo-campo"><span class="lbl">Dirección de Instalación 5:</span><span class="val">${av(contrato.instalacion5)}</span></div>
      </div>

      <div class="anexo-seccion">Tarifas/Cuotas Mensuales Servicios Multimedia Pyme</div>
      <div class="anexo-campos">
        <div class="anexo-campo-doble">
          <div class="anexo-campo"><span class="lbl">Paquete a Contratar:</span><span class="val">${av(contrato.paqueteContratar)}</span></div>
          <div class="anexo-checks">
            ${casilla(contrato.tipoRed === "COBRE", "COBRE")} ${casilla(contrato.tipoRed === "HFC", "HFC")} ${casilla(contrato.tipoRed === "GPON", "GPON")}
          </div>
        </div>
        <div class="anexo-campo-doble">
          <div class="anexo-campo"><span class="lbl">Cantidad:</span><span class="val">${av(contrato.lineaFijaCantidad)}</span></div>
          <div class="anexo-campo"><span class="lbl">Sub Total:</span><span class="val">${contrato.subTotal ? "Q " + Number(contrato.subTotal).toFixed(2) : ""}</span></div>
        </div>
        <div class="anexo-campo-doble">
          <div class="anexo-campo"><span class="lbl">Línea Fija Pyme:</span><span class="val">${av(contrato.lineaFijaDescripcion)}</span></div>
          <div class="anexo-campo"><span class="lbl">Instalación:</span><span class="val">${contrato.instalacionCosto ? "Q " + Number(contrato.instalacionCosto).toFixed(2) : ""}</span></div>
        </div>
        <div class="anexo-campo-doble">
          <div class="anexo-campo"><span class="lbl">Internet Pyme:</span><span class="val">${av(contrato.internetPyme)}</span></div>
          <div class="anexo-campo"><span class="lbl">Renta Total:</span><span class="val">${contrato.rentaTotal ? "Q " + Number(contrato.rentaTotal).toFixed(2) : ""}</span></div>
        </div>
        <div class="anexo-campo-doble">
          <div class="anexo-campo"><span class="lbl">TV Pyme:</span><span class="val">${av(contrato.tvPyme)}</span></div>
          <div class="anexo-checks">
            ${casilla(contrato.activarClaroDrive === "Sí", "Activar Claro Drive 100Gb")}
            ${casilla(contrato.activarPagolo === "Sí", "Activar Pagolo")}
          </div>
        </div>
        <div class="anexo-campo"><span class="lbl">Servicio Adicional:</span><span class="val">${av(contrato.servicioAdicional)}</span></div>
        <div class="anexo-campo-doble">
          <div class="anexo-campo"><span class="lbl">Televisores adicionales sin costo:</span><span class="val">${av(contrato.televisoresAdicionales)}</span></div>
          <div class="anexo-campo"><span class="lbl">Email IPTV:</span><span class="val">${av(contrato.emailIptv)}</span></div>
        </div>
        <p class="anexo-condiciones-texto" style="font-size:0.6rem;">
          Claro Video incluido al contratar servicio de TV.<br>*Aparato telefónico e instalación incluida.
        </p>
      </div>

      <div class="anexo-tabla-envoltura">
        <div class="anexo-seccion">Servicios Adicionales</div>
        <table class="anexo-tabla">
          <thead>
            <tr><th>Cantidad</th><th>Telefonía Fija Adicional HFC / Internet / Equipo adicional TV / Paquete Premium de TV</th><th>Instalación</th><th>Cuota Mensual</th></tr>
          </thead>
          <tbody>
            ${filasServiciosCompletas}
            <tr class="anexo-tabla-total"><td colspan="2"></td><td class="num">Total Instalación Q ${sumaInstalacion.toFixed(2)}</td><td class="num">Total Mensual Q ${sumaMensual.toFixed(2)}</td></tr>
          </tbody>
        </table>
        <div class="anexo-checks">
          ${casilla(contrato.ipPublica === "Sí", "IP Pública")}
          ${casilla(contrato.dtaAdicional === "Sí", "DTA adicional")}
          ${casilla(contrato.dcxAdicional === "Sí", "DCX adicional")}
          ${casilla(contrato.equipoDthAdicional === "Sí", "Equipo DTH adicional")}
        </div>
      </div>

      <div class="anexo-tabla-envoltura">
        <div class="anexo-seccion">Financiamientos</div>
        <div class="anexo-checks">${casilla(contrato.aplicaFinanciamiento === "Sí", "Aplica Financiamiento")}</div>
        <table class="anexo-tabla">
          <thead>
            <tr><th>Cant.</th><th>Tipo de Equipo a Financiar</th><th>Modelo</th><th>Cuota Mensual</th><th>Cantidad de Cuotas</th><th>Primer Pago</th><th>Monto total Mensual Financiamiento</th></tr>
          </thead>
          <tbody>
            <tr><td class="centro"></td><td></td><td></td><td class="num">Q 0</td><td class="centro"></td><td class="num">Q 0</td><td class="num">Q 0.00</td></tr>
            <tr><td class="centro"></td><td></td><td></td><td class="num">Q 0</td><td class="centro"></td><td class="num">Q 0</td><td class="num">Q 0.00</td></tr>
            <tr><td class="centro"></td><td></td><td></td><td class="num">Q 0</td><td class="centro"></td><td class="num">Q 0</td><td class="num">Q 0.00</td></tr>
            <tr><td class="centro"></td><td></td><td></td><td class="num">Q 0</td><td class="centro"></td><td class="num">Q 0</td><td class="num">Q 0.00</td></tr>
            <tr class="anexo-tabla-total"><td colspan="6">TOTAL</td><td class="num">Q 0.00</td></tr>
          </tbody>
        </table>
      </div>

      <div class="salto-pagina"></div>

      <div class="anexo-seccion">Observaciones</div>
      <div class="anexo-campo"><span class="val">${av(contrato.observaciones)}</span></div>

      <div class="anexo-condiciones-titulo">Condiciones del Servicio</div>
      <p class="anexo-condiciones-texto">
        <strong>CONDICIONES ESPECIFICAS DEL SERVICIO:</strong> Los servicios de telefonía fija, Internet y televisión,
        se le prestarán a EL CLIENTE con las facilidades técnicas y de instalación con que cuente Telgua para la
        prestación de los servicios. Si TELGUA no cuenta con las facilidades técnicas y de instalación para la
        efectiva prestación de cualesquiera de los servicios aquí contratados por EL CLIENTE, deberá notificarle al
        mismo por cualquier medio que considere adecuado, teniendo por efecto que el contrato se tendrá por resuelto,
        sin responsabilidad alguna de TELGUA. Para poder aplicar las tarifas preferenciales del paquete deberán ser
        instalados todos los servicios que los conforman, de lo contrario aquel o aquellos servicios que
        individualmente sean instalados se cobrarán a EL CLIENTE con la tarifa normal que TELGUA tenga vigente para el
        público en general, aplicándose todas las condiciones, disposiciones y políticas comerciales vigentes del
        servicio del que se trate.
      </p>

      <div class="anexo-condiciones-titulo">Condiciones del Servicio de Telefonía Fija</div>
      <p class="anexo-condiciones-texto">
        <strong>TELEFONIA INTERNACIONAL:</strong> EL CLIENTE cuenta con una tarifa preferencial por minuto, fijada a
        discreción de TELGUA en llamadas con destino a Estados Unidos. Algunos destinos internacionales tienen
        recargos adicionales a las tarifas normales vigentes. Dichos recargos son establecidos por el operador del
        país destino y son ajenos a TELGUA.
      </p>
      <p class="anexo-condiciones-texto">
        <strong>LLAMADAS ILIMITADAS:</strong> El plan de llamadas ilimitadas incluye para EL CLIENTE el derecho de
        llamar a números de la red móvil o fija de Claro o bien de redes de otros operadores de manera ilimitada,
        siempre y cuando la utilización que se haga de este servicio se haga en el ámbito domiciliar y/o personal del
        cliente, conforme a la política de uso razonable incluida en la página Web de Claro. En caso TELGUA detecte
        por cualquier medio que el cliente ha dado un uso comercial al plan contratado, es decir tenga patrones de
        conducta fuera del uso normal, no razonable o no permitido según la política de uso razonable TELGUA podrá
        excluir al cliente del mismo y cobrar las llamadas realizadas según la tarifa normal vigente, lo cual acepta
        expresamente EL CLIENTE. Si EL CLIENTE adquiere el plan de llamadas ilimitadas los minutos ilimitados no
        aplican hacia líneas fijas destinadas a accesos empresariales, tales como números de cuatro dígitos o números
        PBX, entre otros.
      </p>

      <div class="anexo-condiciones-titulo">Condiciones del Servicio de Televisión</div>
      <p class="anexo-condiciones-texto">
        <strong>DE LA SEÑAL DE TELEVISIÓN Y PROGRAMACIÓN:</strong> EL CLIENTE, acepta expresamente: a) que TELGUA no
        se hace responsable por cualquier interrupción en el servicio de transmisión de la señal de servicio
        contratado que no obedezca a grave negligencia suya; b) que TELGUA podrá suspender los servicios prestados
        sin responsabilidad de su parte en caso de mantenimiento, caso fortuito o fuerza mayor; c) que TELGUA pueda
        discrecionalmente aplicar, variar y/o modificar los contenidos de la programación del servicio contratado,
        incluyendo adición o supresión de canales y/o programas, sin previo aviso, ni posterior notificación ni
        incurrir en responsabilidad alguna por dichos cambios; d) que el uso del control de mando del Set Top Box y
        funciones de la guía interactiva son de su exclusiva responsabilidad; e) que la calidad de la señal dependerá
        de que la instalación llene los requisitos mínimos establecidos y no se exceda el número de televisores
        autorizados.
      </p>

      <div class="anexo-condiciones-titulo">Condiciones del Servicio de INTERNET</div>
      <p class="anexo-condiciones-texto">
        <strong>INTERNET</strong>: Para la prestación del servicio de Internet Residencial, EL CLIENTE, deberá contar
        con equipo de cómputo (computadora de escritorio o portátil), tierra física en el tomacorriente, UPS y
        regulador de voltaje.
      </p>

      <div class="anexo-condiciones-titulo">Servicios Adicionales</div>
      <p class="anexo-condiciones-texto">
        <strong>CLARO CLOUD:</strong> EL CLIENTE, acepta que al incluir el servicio Cloud en el Paquete Pyme, éste se
        preste durante el plazo del plan que ha contratado, no pudiendo darle de baja al servicio Cloud hasta la
        finalización del plazo del plan contratado. En caso desee dar la baja del servicio antes del plazo
        correspondiente al plan que ha contratado EL CLIENTE acepta expresamente el pago de las penalizaciones
        conforme a la cláusula indemnizatoria de los términos y condiciones generales.
      </p>

      <div class="anexo-condiciones-titulo">Cancelación de Servicios Fijos</div>
      <p class="anexo-condiciones-texto">
        En caso que EL CLIENTE decida dar por terminado anticipadamente el plazo del servicio contratado en este
        anexo, se compromete a pagar a TELGUA en concepto de daños y perjuicios, el cincuenta por ciento (50%) de la
        tarifa convenida conforme al plan contratado durante los meses que falten para cumplir con el plazo acordado,
        debiendo devolver el equipo con el que se prestó el servicio, ya sea Set Top Box o DVR HD en buenas
        condiciones de funcionamiento y en caso éste se hubiese extraviado o tuviera daños, deberá pagar el valor del
        mismo al precio que TELGUA tenga vigente al público en general en la fecha de terminación.
      </p>

      <div class="anexo-condiciones-titulo">Aceptación</div>
      <p class="anexo-condiciones-texto">
        <strong>ACEPTACION:</strong> EL CLIENTE, al firmar este anexo acepta expresamente: a) Ser de los datos de
        identificación consignados en este anexo; b) que TELGUA pueda corroborar la veracidad de toda la información
        proporcionada por su persona, por cualquier medio legal, siendo responsable de lo relativo al delito de
        perjurio en caso se llegara a constar que la información relacionada es falsa parcial o totalmente; c) que el
        presente ANEXO DE SERVICIO incorpora los TERMINOS Y CONDICIONES GENERALES DE CONTRATACION DE TELGUA ("TCG
        CLIENTES"), los cuales he recibido de parte de TELGUA en este acto y que constituyen los aplicables de manera
        general a la prestación de servicios de telecomunicaciones brindados por TELGUA; y d) haber leído el presente
        anexo del servicio y bien impuesto de su contenido, objeto, validez y efectos legales, lo acepta, ratifica y
        firma.
      </p>

      <div class="anexo-campo anexo-firma-fila">
        <span class="lbl"><strong>Lugar y Fecha:</strong></span>
        <span class="val">Guatemala</span>
        <span class="val">${av(contrato.fechaFirma)}</span>
      </div>
      <div class="anexo-campo-doble anexo-firma-fila">
        <div class="anexo-campo"><span class="lbl"><strong>Nombre de Ejecutivo:</strong></span><span class="val">${av(contrato.ejecutivoVentas)}</span></div>
        <div class="anexo-campo"><span class="lbl"><strong>Firma del Cliente:</strong></span><span class="val"></span></div>
      </div>
      <div class="anexo-campo"><span class="lbl"><strong>Código Maestro:</strong></span><span class="val">${av(contrato.codigoMaestro)}</span></div>

      <div class="anexo-campo-doble" style="margin-top:18px;">
        <div class="anexo-campo"><span class="lbl">Control Interno No. de Onbase:</span><span class="val"></span></div>
        <div class="anexo-campo" style="justify-content:flex-end;"><span class="val" style="border:none;flex:0 0 auto;white-space:nowrap;">V 5.3</span></div>
      </div>
    </div>
  `;
}

function imprimirContratoOficina() {
  const data = {};
  CONTRATO_OFICINA_FIELD_IDS.forEach((idCampo) => (data[CONTRATO_OFICINA_CAMPO_POR_ID[idCampo]] = $(idCampo).value.trim()));
  const empresa = (data.empresa || "").trim().toLowerCase();
  const servicios = serviciosOficinaData.filter((s) => (s.empresa || "").trim().toLowerCase() === empresa);
  $("printArea").innerHTML = anexoServiciosMultimediaHTML(data, servicios);
  window.print();
}

function imprimirAnexoOficinaPorEmpresa(empresaTexto) {
  const empresaBuscada = (empresaTexto || "").trim().toLowerCase();
  if (!empresaBuscada) {
    alert("Escribe o selecciona la empresa que quieres imprimir.");
    return;
  }
  const contrato = contratosOficinaData.find((c) => (c.empresa || "").trim().toLowerCase() === empresaBuscada);
  if (!contrato) {
    alert("No se encontró un contrato de oficina con ese nombre de empresa. Verifica que coincida con el registrado en Contratos de Oficina.");
    return;
  }
  const servicios = serviciosOficinaData.filter((s) => (s.empresa || "").trim().toLowerCase() === empresaBuscada);
  $("printArea").innerHTML = anexoServiciosMultimediaHTML(contrato, servicios);
  window.print();
}

function imprimirAnexoOficina() {
  imprimirAnexoOficinaPorEmpresa($("empresaImprimirServicios").value);
}

function imprimirServicioOficinaDesdeModal() {
  imprimirAnexoOficinaPorEmpresa($("soEmpresa").value);
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
  vistaContratosOficina.render();
  vistaServiciosOficina.render();
  vistaDocumentosAnexoMoviles.render();
  vistaDocumentosAnexoOficina.render();
  vistaTicketsGarantia.render();
  vistaMantenimientoEquipos.render();
  vistaEquiposTIv2.render();
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
  else if (nombre === "contratosOficina") vistaContratosOficina.render();
  else if (nombre === "serviciosOficina") vistaServiciosOficina.render();
  else if (nombre === "documentosAnexoMoviles") vistaDocumentosAnexoMoviles.render();
  else if (nombre === "documentosAnexoOficina") vistaDocumentosAnexoOficina.render();
  else if (nombre === "ticketsGarantia") vistaTicketsGarantia.render();
  else if (nombre === "mantenimientoEquipos") vistaMantenimientoEquipos.render();
  else if (nombre === "equiposTIv2") vistaEquiposTIv2.render();
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
    let v = String(e[campo] || "").trim() || "Sin dato";
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
      const v = String(p[campo] || "").trim() || "Sin dato";
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
        <td>${esc(descripcionMonitorEquipo(e))}</td>
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
    [descripcionMonitorEquipo(r.equipo), r.equipo.nombreRed, r.equipo.nombreEmpleado, r.equipo.empresa].join(" ").toLowerCase().includes(t),
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

function equipoAsignadoAMonitor(serial) {
  const s = (serial || "").trim();
  if (!s) return null;
  return equipos.find((e) => (e.monitor || "").trim() === s) || null;
}

const vistaCatalogoMonitores = crearVistaLista({
  prefix: "catalogoMonitores",
  columnas: 5,
  obtenerFilas: obtenerCatalogoMonitores,
  filtrar: (r, t) => [r.monitor.serial, r.monitor.modelo, r.monitor.descripcion, r.monitor.contrato].join(" ").toLowerCase().includes(t),
  alClicFila: (r) => {
    const equipo = equipoAsignadoAMonitor(r.monitor.serial);
    if (equipo) {
      abrirModal(equipo);
    } else {
      alert(`El monitor ${r.monitor.serial} (${r.monitor.descripcion || r.monitor.modelo}) aún no está asignado a ningún equipo.\n\nPara asignarlo, edita el equipo correspondiente y selecciónalo en el campo "Monitor".`);
    }
  },
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

function formatearFechaHora(valor) {
  if (!valor) return "";
  return String(valor);
}

function formatearMonitorTIv2(hw) {
  const monitores = Array.isArray(hw.monitores) ? hw.monitores.filter((m) => m && m.activo !== false) : [];
  if (!monitores.length) return "";
  return monitores.map((m) => [m.fabricante, m.modelo].filter((v) => v && v !== "N/A").join(" ")).join(", ");
}

function obtenerEquiposTIv2() {
  return equiposTIv2Data.map((e) => {
    const hw = e.hardware || {};
    const cpu = hw.procesador || {};
    const ram = hw.memoria || {};
    const so = hw.sistemaOperativo || {};
    return {
      dato: e,
      celdas: `
        <td>${esc(e.computadora || e.equipoId)}</td>
        <td>${esc(e.usuario)}</td>
        <td>${esc(cpu.nombre)}</td>
        <td>${esc(ram.total)}</td>
        <td>${esc(so.nombre)}</td>
        <td>${esc(formatearMonitorTIv2(hw))}</td>
        <td>${esc(hw.ipPrincipal)}</td>
        <td>${esc(hw.serialNumber)}</td>
        <td>${esc(formatearFechaHora(e.timestamp))}</td>
      `,
    };
  });
}

const vistaEquiposTIv2 = crearVistaLista({
  prefix: "equiposTIv2",
  columnas: 9,
  obtenerFilas: obtenerEquiposTIv2,
  filtrar: (r, t) => {
    const hw = r.dato.hardware || {};
    const so = hw.sistemaOperativo || {};
    const texto = [r.dato.computadora, r.dato.equipoId, r.dato.usuario, hw.ipPrincipal, so.nombre, formatearMonitorTIv2(hw)]
      .join(" ")
      .toLowerCase();
    return t.split(/\s+/).filter(Boolean).every((palabra) => texto.includes(palabra));
  },
});

function obtenerTicketsGarantia() {
  return ticketsGarantiaData.map((t) => ({
    ticket: t,
    celdas: `
      <td>${esc(t.proveedor)}</td>
      <td>${esc(t.equipoRef)}</td>
      <td>${esc(t.numeroTicket)}</td>
      <td>${esc(formatearFechaSimple(t.fechaReporte))}</td>
      <td><span class="badge">${esc(t.estado)}</span></td>
      <td>${esc(t.descripcionFalla)}</td>
    `,
  }));
}

const vistaTicketsGarantia = crearVistaLista({
  prefix: "ticketsGarantia",
  columnas: 6,
  obtenerFilas: obtenerTicketsGarantia,
  filtrar: (r, t) => {
    const texto = [r.ticket.proveedor, r.ticket.equipoRef, r.ticket.numeroTicket, r.ticket.estado, r.ticket.descripcionFalla]
      .join(" ")
      .toLowerCase();
    return t.split(/\s+/).filter(Boolean).every((palabra) => texto.includes(palabra));
  },
  alClicFila: (r) => abrirModalTicketGarantia(r.ticket),
});

function obtenerMantenimientoEquipos() {
  return mantenimientoEquiposData.map((m) => ({
    registro: m,
    celdas: `
      <td>${esc(m.equipoRef)}</td>
      <td>${esc(formatearFechaSimple(m.fechaIngreso))}</td>
      <td>${esc(m.problema)}</td>
      <td>${esc(m.solucion)}</td>
      <td>${esc(m.tecnico)}</td>
      <td>${esc(m.observaciones)}</td>
    `,
  }));
}

const vistaMantenimientoEquipos = crearVistaLista({
  prefix: "mantenimientoEquipos",
  columnas: 6,
  obtenerFilas: obtenerMantenimientoEquipos,
  filtrar: (r, t) => {
    const texto = [r.registro.equipoRef, r.registro.problema, r.registro.solucion, r.registro.tecnico]
      .join(" ")
      .toLowerCase();
    return t.split(/\s+/).filter(Boolean).every((palabra) => texto.includes(palabra));
  },
  alClicFila: (r) => abrirModalMantenimientoEquipos(r.registro),
});

function generarReporteMantenimiento() {
  const porTecnico = {};
  mantenimientoEquiposData.forEach((registro) => {
    const tecnico = registro.tecnico || "Sin técnico";
    if (!porTecnico[tecnico]) porTecnico[tecnico] = 0;
    porTecnico[tecnico]++;
  });
  return Object.keys(porTecnico).sort().map((tecnico) => ({
    tecnico,
    cantidad: porTecnico[tecnico],
  }));
}

function mostrarReporteMantenimiento() {
  const reporteData = generarReporteMantenimiento();
  const container = $("reporteMantenimientoContainer");
  const tablaBody = $("tablaReporteMantenimiento");
  const chartContainer = $("chartMantenimiento");

  tablaBody.innerHTML = reporteData.map((r) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${esc(r.tecnico)}</td>
      <td style="padding: 8px; text-align: center; border-bottom: 1px solid #eee; font-weight: bold;">${r.cantidad}</td>
    </tr>
  `).join('');

  if (reporteData.length === 0) {
    tablaBody.innerHTML = '<tr><td colspan="2" style="padding: 20px; text-align: center; color: #999;">No hay registros de mantenimiento</td></tr>';
  }

  const maxVal = Math.max(...reporteData.map((r) => r.cantidad), 1);
  const scale = 200 / maxVal;

  chartContainer.innerHTML = `
    <div style="display: flex; gap: 15px; align-items: flex-end; justify-content: center; height: 250px; border-left: 2px solid #ddd; padding-left: 10px;">
      ${reporteData.map((r) => `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
          <div style="width: 40px; height: ${r.cantidad * scale}px; background-color: #FF9800; border-radius: 2px 2px 0 0; min-height: 2px;" title="${r.tecnico}: ${r.cantidad}"></div>
          <small style="font-size: 10px; color: #666; text-align: center; width: 70px; word-wrap: break-word;">${esc(r.tecnico)}</small>
        </div>
      `).join('')}
    </div>
  `;

  container.style.display = 'block';
}

function descargarReporteMantenimientoPDF() {
  const element = $("reporteMantenimientoContent");
  const opt = {
    margin: 10,
    filename: 'reporte-mantenimiento-' + new Date().toISOString().split('T')[0] + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' },
  };
  html2pdf().set(opt).from(element).save();
}

function generarReporteGarantias() {
  const datos = {};
  ticketsGarantiaData.forEach((ticket) => {
    const fecha = new Date(ticket.fechaReporte);
    const mesAnio = fecha.getFullYear() + '-' + String(fecha.getMonth() + 1).padStart(2, '0');
    if (!datos[mesAnio]) datos[mesAnio] = { GBM: 0, Canella: 0 };
    if (ticket.proveedor === 'GBM') datos[mesAnio].GBM++;
    else if (ticket.proveedor === 'Canella') datos[mesAnio].Canella++;
  });
  return Object.keys(datos).sort().map((mes) => ({
    mes,
    GBM: datos[mes].GBM,
    Canella: datos[mes].Canella,
    total: datos[mes].GBM + datos[mes].Canella,
  }));
}

function mostrarReporteGarantias() {
  console.log("=== Mostrar Reporte Garantías ===");
  const reporteData = generarReporteGarantias();
  console.log("Datos del reporte:", reporteData);
  const container = $("reporteGarantiaContainer");
  const tablaBody = $("tablaReporteGarantia");
  const chartContainer = $("chartGarantias");
  console.log("Contenedores encontrados:", { container, tablaBody, chartContainer });

  tablaBody.innerHTML = reporteData.map((r) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${r.mes}</td>
      <td style="padding: 8px; text-align: center; border-bottom: 1px solid #eee;">${r.GBM}</td>
      <td style="padding: 8px; text-align: center; border-bottom: 1px solid #eee;">${r.Canella}</td>
      <td style="padding: 8px; text-align: center; border-bottom: 1px solid #eee; font-weight: bold;">${r.total}</td>
    </tr>
  `).join('');

  if (reporteData.length === 0) {
    tablaBody.innerHTML = '<tr><td colspan="4" style="padding: 20px; text-align: center; color: #999;">No hay datos de tickets de garantía</td></tr>';
  }

  const maxVal = Math.max(...reporteData.flatMap((r) => [r.GBM, r.Canella]), 1);
  const scale = 200 / maxVal;

  chartContainer.innerHTML = `
    <div style="display: flex; gap: 20px; align-items: flex-end; justify-content: center; height: 250px; border-left: 2px solid #ddd; padding-left: 10px;">
      ${reporteData.map((r) => `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
          <div style="display: flex; gap: 5px; align-items: flex-end;">
            <div style="width: 25px; height: ${r.GBM * scale}px; background-color: #4CAF50; border-radius: 2px 2px 0 0; min-height: 2px;" title="GBM: ${r.GBM}"></div>
            <div style="width: 25px; height: ${r.Canella * scale}px; background-color: #2196F3; border-radius: 2px 2px 0 0; min-height: 2px;" title="Canella: ${r.Canella}"></div>
          </div>
          <small style="font-size: 11px; color: #666; text-align: center; width: 60px;">${r.mes}</small>
        </div>
      `).join('')}
    </div>
    <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px; font-size: 12px;">
      <div style="display: flex; align-items: center; gap: 5px;">
        <div style="width: 15px; height: 15px; background-color: #4CAF50;"></div>
        <span>GBM</span>
      </div>
      <div style="display: flex; align-items: center; gap: 5px;">
        <div style="width: 15px; height: 15px; background-color: #2196F3;"></div>
        <span>Canella</span>
      </div>
    </div>
  `;

  container.style.display = 'block';
}

function descargarReporteGarantiaPDF() {
  const element = $("reporteGarantiaContent");
  const opt = {
    margin: 10,
    filename: 'reporte-garantia-' + new Date().toISOString().split('T')[0] + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' },
  };
  html2pdf().set(opt).from(element).save();
}

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
      <td>${(l.tarifaTotal || l.tarifaPlan) ? "Q " + Number(l.tarifaTotal || l.tarifaPlan).toFixed(2) : ""}</td>
      <td>${esc(l.nombreUsuario)}</td>
      <td>${esc(l.empresa)}</td>
      <td>${esc(l.departamentoUsuario)}</td>
    `,
  }));
}

const vistaLineasMoviles = crearVistaLista({
  prefix: "lineasMoviles",
  columnas: 7,
  obtenerFilas: obtenerLineasMoviles,
  filtrar: (r, t) => {
    const texto = [
      r.linea.numero, r.linea.modelo, r.linea.empresa, r.linea.plan, r.linea.imei, r.linea.iccidEsn,
      r.linea.nombreUsuario, r.linea.cargo, r.linea.departamentoUsuario, r.linea.numeroMadre, r.linea.codSapUsuario,
    ]
      .join(" ")
      .toLowerCase();
    return t.split(/\s+/).filter(Boolean).every((palabra) => texto.includes(palabra));
  },
  alClicFila: (r) => abrirModalLineaMovil(r.linea),
});

function obtenerContratosOficina() {
  return contratosOficinaData.map((c) => ({
    contrato: c,
    celdas: `
      <td>${esc(c.empresa)}</td>
      <td>${esc(c.nit)}</td>
      <td>${esc(c.tipoGestion)}</td>
      <td>${esc(c.paqueteContratar)}</td>
      <td>${esc(c.plazoContrato)}</td>
      <td>${esc(c.telefono)}</td>
      <td>${c.rentaTotal ? "Q " + Number(c.rentaTotal).toFixed(2) : ""}</td>
      <td>${esc(c.fechaFirma)}</td>
    `,
  }));
}

const vistaContratosOficina = crearVistaLista({
  prefix: "contratosOficina",
  columnas: 8,
  obtenerFilas: obtenerContratosOficina,
  filtrar: (r, t) => {
    const texto = [r.contrato.empresa, r.contrato.nombreComercial, r.contrato.nit, r.contrato.paqueteContratar, r.contrato.telefono, r.contrato.representanteLegal]
      .join(" ")
      .toLowerCase();
    return t.split(/\s+/).filter(Boolean).every((palabra) => texto.includes(palabra));
  },
  alClicFila: (r) => abrirModalContratoOficina(r.contrato),
});

function obtenerServiciosOficina() {
  return serviciosOficinaData.map((s) => ({
    servicio: s,
    celdas: `
      <td>${esc(s.tipoServicio)}</td>
      <td>${esc(s.cantidad)}</td>
      <td>${s.instalacion ? "Q " + Number(s.instalacion).toFixed(2) : ""}</td>
      <td>${s.cuotaMensual ? "Q " + Number(s.cuotaMensual).toFixed(2) : ""}</td>
      <td>${esc(s.empresa)}</td>
    `,
  }));
}

const vistaServiciosOficina = crearVistaLista({
  prefix: "serviciosOficina",
  columnas: 5,
  obtenerFilas: obtenerServiciosOficina,
  filtrar: (r, t) => {
    const texto = [r.servicio.tipoServicio, r.servicio.empresa].join(" ").toLowerCase();
    return t.split(/\s+/).filter(Boolean).every((palabra) => texto.includes(palabra));
  },
  alClicFila: (r) => abrirModalServicioOficina(r.servicio),
});

const ETIQUETA_TIPO_DOCUMENTO_ANEXO_MOVIL = {
  anexoMovil: "Anexo de Servicios Móviles",
  hojaResponsabilidad: "Hoja de Responsabilidad",
};

function obtenerDocumentosAnexoMoviles() {
  return documentosAnexoMovilesData.map((d) => ({
    documento: d,
    celdas: `
      <td>${esc(ETIQUETA_TIPO_DOCUMENTO_ANEXO_MOVIL[d.tipo] || d.tipo)}</td>
      <td>${esc(d.referencia)}</td>
      <td>${esc(d.nombreArchivo)}</td>
      <td>${esc(formatearFecha(d.fechaSubida))}</td>
      <td>${esc(d.subidoPor)}</td>
      <td class="doc-acciones">
        <a href="${esc(d.url)}" target="_blank" rel="noopener" class="btn btn-outline">👁️ Ver</a>
        <button type="button" class="btn btn-danger btn-eliminar-documento-anexo-movil" data-id="${esc(d.id)}">Eliminar</button>
      </td>
    `,
  }));
}

const vistaDocumentosAnexoMoviles = crearVistaLista({
  prefix: "documentosAnexoMoviles",
  columnas: 6,
  obtenerFilas: obtenerDocumentosAnexoMoviles,
  filtrar: (r, t) => {
    const texto = [r.documento.referencia, r.documento.nombreArchivo, ETIQUETA_TIPO_DOCUMENTO_ANEXO_MOVIL[r.documento.tipo]]
      .join(" ")
      .toLowerCase();
    return t.split(/\s+/).filter(Boolean).every((palabra) => texto.includes(palabra));
  },
});

function obtenerDocumentosAnexoOficina() {
  return documentosAnexoOficinaData.map((d) => ({
    documento: d,
    celdas: `
      <td>${esc(d.referencia)}</td>
      <td>${esc(d.nombreArchivo)}</td>
      <td>${esc(formatearFecha(d.fechaSubida))}</td>
      <td>${esc(d.subidoPor)}</td>
      <td class="doc-acciones">
        <a href="${esc(d.url)}" target="_blank" rel="noopener" class="btn btn-outline">👁️ Ver</a>
        <button type="button" class="btn btn-danger btn-eliminar-documento-anexo-oficina" data-id="${esc(d.id)}">Eliminar</button>
      </td>
    `,
  }));
}

const vistaDocumentosAnexoOficina = crearVistaLista({
  prefix: "documentosAnexoOficina",
  columnas: 5,
  obtenerFilas: obtenerDocumentosAnexoOficina,
  filtrar: (r, t) => [r.documento.referencia, r.documento.nombreArchivo].join(" ").toLowerCase().includes(t),
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
inicializarAutocompleteMonitor();
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

$("btnNuevoTicketGarantia").addEventListener("click", () => abrirModalTicketGarantia(null));
$("btnCerrarModalTicketGarantia").addEventListener("click", cerrarModalTicketGarantia);
$("btnCancelarTicketGarantia").addEventListener("click", cerrarModalTicketGarantia);
$("btnEliminarModalTicketGarantia").addEventListener("click", eliminarTicketGarantiaActual);
$("tgProveedor").addEventListener("change", actualizarCampoEquipoTicketGarantia);
$("formTicketGarantia").addEventListener("submit", onSubmitTicketGarantia);
$("btnVerEstadisticasGarantia").addEventListener("click", mostrarReporteGarantias);
$("btnDescargarReportePDF").addEventListener("click", descargarReporteGarantiaPDF);
$("btnCerrarReporte").addEventListener("click", () => {
  $("reporteGarantiaContainer").style.display = "none";
});

$("btnNuevoMantenimientoEquipo").addEventListener("click", () => abrirModalMantenimientoEquipos(null));
$("btnCerrarModalMantenimientoEquipos").addEventListener("click", cerrarModalMantenimientoEquipos);
$("btnCancelarMantenimientoEquipos").addEventListener("click", cerrarModalMantenimientoEquipos);
$("btnEliminarModalMantenimientoEquipos").addEventListener("click", eliminarRegistroMantenimientoActual);
$("meEquipo").addEventListener("change", actualizarUsuarioEquipoMantenimiento);
$("formMantenimientoEquipos").addEventListener("submit", onSubmitMantenimientoEquipos);
$("btnVerReporteMantenimiento").addEventListener("click", mostrarReporteMantenimiento);
$("btnDescargarReporteMantenimientoPDF").addEventListener("click", descargarReporteMantenimientoPDF);
$("btnCerrarReporteMantenimiento").addEventListener("click", () => {
  $("reporteMantenimientoContainer").style.display = "none";
});

$("btnNuevoContratoMovil").addEventListener("click", () => abrirModalContratoMovil(null));
$("btnImprimirContratoMovil").addEventListener("click", imprimirContratoMovil);
$("btnImprimirLineasMoviles").addEventListener("click", imprimirFormatoAdhesionMovil);
$("btnImprimirLineaMovil").addEventListener("click", imprimirLineaMovilDesdeModal);
$("btnImprimirHojaResponsabilidad").addEventListener("click", imprimirHojaResponsabilidadDesdeModal);
$("btnImprimirAnexoMovilDesdeReportes").addEventListener("click", imprimirAnexoMovilDesdeReportes);
$("btnImprimirHojaResponsabilidadDesdeReportes").addEventListener("click", imprimirHojaResponsabilidadDesdeReportes);
$("btnCerrarModalContratoMovil").addEventListener("click", cerrarModalContratoMovil);
$("btnCancelarContratoMovil").addEventListener("click", cerrarModalContratoMovil);
$("btnEliminarModalContratoMovil").addEventListener("click", eliminarContratoMovilActual);
$("formContratoMovil").addEventListener("submit", onSubmitContratoMovil);

$("btnNuevaLineaMovil").addEventListener("click", () => abrirModalLineaMovil(null));
$("btnCerrarModalLineaMovil").addEventListener("click", cerrarModalLineaMovil);
$("btnCancelarLineaMovil").addEventListener("click", cerrarModalLineaMovil);
$("btnEliminarModalLineaMovil").addEventListener("click", eliminarLineaMovilActual);
$("formLineaMovil").addEventListener("submit", onSubmitLineaMovil);

$("btnNuevoContratoOficina").addEventListener("click", () => abrirModalContratoOficina(null));
$("btnImprimirContratoOficina").addEventListener("click", imprimirContratoOficina);
$("btnImprimirServiciosOficina").addEventListener("click", imprimirAnexoOficina);
$("btnImprimirAnexoOficinaDesdeReportes").addEventListener("click", imprimirAnexoOficinaDesdeReportes);
$("btnImprimirServicioOficina").addEventListener("click", imprimirServicioOficinaDesdeModal);
$("btnCerrarModalContratoOficina").addEventListener("click", cerrarModalContratoOficina);
$("btnCancelarContratoOficina").addEventListener("click", cerrarModalContratoOficina);
$("btnEliminarModalContratoOficina").addEventListener("click", eliminarContratoOficinaActual);
$("formContratoOficina").addEventListener("submit", onSubmitContratoOficina);

$("btnNuevoServicioOficina").addEventListener("click", () => abrirModalServicioOficina(null));
$("btnCerrarModalServicioOficina").addEventListener("click", cerrarModalServicioOficina);
$("btnCancelarServicioOficina").addEventListener("click", cerrarModalServicioOficina);
$("btnEliminarModalServicioOficina").addEventListener("click", eliminarServicioOficinaActual);
$("formServicioOficina").addEventListener("submit", onSubmitServicioOficina);

$("btnSubirDocumentoAnexoMovil").addEventListener("click", abrirModalDocumentoAnexoMovil);
$("btnCerrarModalDocumentoAnexoMovil").addEventListener("click", cerrarModalDocumentoAnexoMovil);
$("btnCancelarDocumentoAnexoMovil").addEventListener("click", cerrarModalDocumentoAnexoMovil);
$("damTipo").addEventListener("change", actualizarCampoReferenciaDocumentoAnexoMovil);
$("formDocumentoAnexoMovil").addEventListener("submit", onSubmitDocumentoAnexoMovil);
$("tbody_documentosAnexoMoviles").addEventListener("click", (ev) => {
  const btn = ev.target.closest(".btn-eliminar-documento-anexo-movil");
  if (btn) eliminarDocumentoAnexoMovil(btn.dataset.id, btn);
});

$("btnSubirDocumentoAnexoOficina").addEventListener("click", abrirModalDocumentoAnexoOficina);
$("btnCerrarModalDocumentoAnexoOficina").addEventListener("click", cerrarModalDocumentoAnexoOficina);
$("btnCancelarDocumentoAnexoOficina").addEventListener("click", cerrarModalDocumentoAnexoOficina);
$("formDocumentoAnexoOficina").addEventListener("submit", onSubmitDocumentoAnexoOficina);
$("tbody_documentosAnexoOficina").addEventListener("click", (ev) => {
  const btn = ev.target.closest(".btn-eliminar-documento-anexo-oficina");
  if (btn) eliminarDocumentoAnexoOficina(btn.dataset.id, btn);
});

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
cargarContratosOficina();
cargarServiciosOficina();
cargarDocumentosAnexoMoviles();
cargarDocumentosAnexoOficina();
cargarTicketsGarantia();
cargarMantenimientoEquipos();
poblarFiltrosYDatalists();
render();
renderTablero();
