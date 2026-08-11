import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBondrL7b5C-WI6hbQTtCxob8Dn0mpwBrs",
  authDomain: "inventario-ti-riol.firebaseapp.com",
  projectId: "inventario-ti-riol",
  storageBucket: "inventario-ti-riol.firebasestorage.app",
  messagingSenderId: "728474379617",
  appId: "1:728474379617:web:4a9714a2677ecc3875d120",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const $ = (id) => document.getElementById(id);

const TIPOS_SERVIDOR = [
  "VMware", "Xen", "Hyper-V", "PRD-VIRTUAL", "DESA-VIRTUAL",
  "Rack Mount Chassis", "Main System Chassis",
];
const MARCA_CRONOGRAMA = "no aparece en el cronograma de migracion AD";
const ALIAS_TIPO_EQUIPO = { Laptop: "Notebook" };

function esServidor(e) {
  return TIPOS_SERVIDOR.includes((e.tipoEquipo || "").trim());
}
function esEnRevision(e) {
  return (e.comentarios || "").includes(MARCA_CRONOGRAMA);
}
function nonEmpty(v) {
  return !!(v && String(v).trim());
}

function contarPor(equipos, campo, { agruparTipoEquipo } = {}) {
  const conteo = {};
  equipos.forEach((e) => {
    let v = (e[campo] || "").trim() || "Sin dato";
    if (agruparTipoEquipo) v = ALIAS_TIPO_EQUIPO[v] || v;
    conteo[v] = (conteo[v] || 0) + 1;
  });
  return Object.entries(conteo).sort((a, b) => b[1] - a[1]);
}

function renderBarras(id, filas, total, topN) {
  const contenedor = $(id);
  contenedor.innerHTML = "";
  const mostrar = topN ? filas.slice(0, topN) : filas;
  const max = mostrar.length ? mostrar[0][1] : 1;
  mostrar.forEach(([nombre, valor], i) => {
    const pct = Math.max(4, Math.round((valor / max) * 100));
    const fila = document.createElement("div");
    fila.className = "fila" + (i === 0 ? " destacada" : "");
    fila.innerHTML = `
      <span class="rotulo-fila" title="${esc(nombre)}">${esc(nombre)}</span>
      <span class="pista"><span class="barra" style="width:${pct}%"></span></span>
      <span class="valor">${valor}</span>
    `;
    contenedor.appendChild(fila);
  });
  return { categorias: filas.length, top: mostrar[0] ? mostrar[0][0] : "—" };
}

function esc(s) {
  return String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderTodo(equipos) {
  const equiposUsuario = equipos.filter((e) => !esServidor(e));
  const validados = equiposUsuario.filter((e) => !esEnRevision(e));
  const propios = equiposUsuario.filter((e) => !nonEmpty(e.contratos));
  const propiosEnRevision = propios.filter(esEnRevision).length;
  const equiposPropios = propios.length - propiosEnRevision;
  const lenovo = validados.filter((e) => (e.fabricante || "").trim().toUpperCase() === "LENOVO").length;
  const empresas = new Set(validados.map((e) => (e.empresa || "").trim()).filter(Boolean)).size;
  const servidores = equipos.filter(esServidor).length;

  $("stats").innerHTML = `
    <div class="stat"><div class="numero">${validados.length}</div><div class="etiqueta">Equipos totales</div></div>
    <div class="stat"><div class="numero">${lenovo}</div><div class="etiqueta">Equipos Lenovo</div></div>
    <div class="stat"><div class="numero">${equiposPropios}</div><div class="etiqueta">Equipos propios</div></div>
    <div class="stat"><div class="numero">${empresas}</div><div class="etiqueta">Empresas</div></div>
    <div class="stat"><div class="numero">${servidores}</div><div class="etiqueta">Servidores</div></div>
    <div class="stat ambar"><div class="numero">${propiosEnRevision}</div><div class="etiqueta">En revisión</div></div>
  `;

  const rStatus = renderBarras("c-status", contarPor(validados, "status"), validados.length, 8);
  const rEmpresa = renderBarras("c-empresa", contarPor(validados, "empresa"), validados.length, 8);
  const rTipo = renderBarras("c-tipo", contarPor(validados, "tipoEquipo", { agruparTipoEquipo: true }), validados.length, 8);
  const rFabricante = renderBarras("c-fabricante", contarPor(validados, "fabricante"), validados.length, 8);

  $("meta-status").textContent = `${rStatus.categorias} categorías · top: ${rStatus.top}`;
  $("meta-empresa").textContent = `${rEmpresa.categorias} empresas · top: ${rEmpresa.top}`;
  $("meta-tipo").textContent = `${rTipo.categorias} tipos · top: ${rTipo.top}`;
  $("meta-fabricante").textContent = `${rFabricante.categorias} marcas · top: ${rFabricante.top}`;

  $("subtotal-status").textContent = `${validados.length} en total`;
  $("subtotal-empresa").textContent = `${validados.length} en total`;
  $("subtotal-tipo").textContent = `${validados.length} en total`;
  $("subtotal-fabricante").textContent = `${validados.length} en total`;

  $("fecha-corte").textContent = `${validados.length} equipos validados · actualizado ${new Date().toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" })}`;
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    $("estadoCarga").textContent = "Inicia sesión en la ventana principal del sistema y vuelve a abrir este dashboard.";
    $("estadoCarga").style.display = "";
    $("envoltorio").style.display = "none";
    return;
  }
  $("estadoCarga").style.display = "none";
  $("envoltorio").style.display = "";
  onSnapshot(
    collection(db, "equipos"),
    (snapshot) => {
      const equipos = [];
      snapshot.forEach((d) => equipos.push(d.data()));
      renderTodo(equipos);
    },
    () => {
      $("estadoCarga").textContent = "No se pudo conectar a los datos en vivo. Verifica tu conexión e intenta de nuevo.";
      $("estadoCarga").style.display = "";
      $("envoltorio").style.display = "none";
    }
  );
});
