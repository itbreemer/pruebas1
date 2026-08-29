/**
 * Alertas de vencimiento de contratos - Sistema de Inventario TI
 *
 * Corre en Google Apps Script (gratis, sin necesidad del plan Blaze de
 * Firebase). Lee la colección "equipos" de Firestore usando una cuenta de
 * servicio, calcula qué contratos vencen dentro de los próximos N días, y
 * envía un correo con el resumen. Pensado para dispararse solo, con un
 * trigger de tiempo (ver ALERTAS-CONTRATOS-SETUP.md para la configuración
 * paso a paso).
 */

const DIAS_ANTICIPACION = 30;
const PROJECT_ID = "inventario-ti-riol";
const CORREO_DESTINO = "ai.admin@breemer.com.gt"; // cambia esto si el correo debe ser otro

function obtenerFirestore_() {
  const key = JSON.parse(PropertiesService.getScriptProperties().getProperty("FIRESTORE_KEY"));
  return FirestoreApp.getFirestore(key.client_email, key.private_key, PROJECT_ID);
}

function soloNumeroContrato_(valor) {
  if (!valor) return "";
  return String(valor).trim().split(/\s*\(/)[0].trim();
}

function extraerFechaVenceContrato_(valor) {
  const m = /\(vence\s*([^)]+)\)/i.exec(String(valor || ""));
  return m ? m[1].trim() : "";
}

function parsearFecha_(fechaStr) {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/.exec(String(fechaStr || "").trim());
  if (!m) return null;
  return new Date(parseInt(m[3], 10), parseInt(m[2], 10) - 1, parseInt(m[1], 10));
}

function revisarContratos() {
  const firestore = obtenerFirestore_();
  const docs = firestore.getDocuments("equipos");

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const limite = new Date(hoy.getTime() + DIAS_ANTICIPACION * 24 * 60 * 60 * 1000);

  const porContrato = {};
  docs.forEach(function (doc) {
    const e = doc.obj || doc.fields || doc;
    const contratoTexto = e.contratos;
    if (!contratoTexto) return;
    const numero = soloNumeroContrato_(contratoTexto);
    const fechaTexto = extraerFechaVenceContrato_(contratoTexto);
    const fecha = parsearFecha_(fechaTexto);
    if (!fecha) return;
    if (fecha < hoy || fecha > limite) return;
    if (!porContrato[numero]) porContrato[numero] = { fecha: fecha, fechaTexto: fechaTexto, equipos: [] };
    porContrato[numero].equipos.push(e.nombreRed || e.numeroSerial || "(sin nombre)");
  });

  const contratos = Object.keys(porContrato)
    .map(function (n) {
      return Object.assign({ numero: n }, porContrato[n]);
    })
    .sort(function (a, b) {
      return a.fecha - b.fecha;
    });

  if (!contratos.length) return; // nada que avisar esta vez

  let cuerpo = "Contratos que vencen en los próximos " + DIAS_ANTICIPACION + " días:\n\n";
  contratos.forEach(function (c) {
    cuerpo += "Contrato " + c.numero + " — vence " + c.fechaTexto + " (" + c.equipos.length + " equipos)\n";
    cuerpo += "  " + c.equipos.join(", ") + "\n\n";
  });

  MailApp.sendEmail(CORREO_DESTINO, "⚠️ Contratos próximos a vencer - Inventario TI", cuerpo);
}
