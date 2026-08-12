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
const TIPOS_PC = ["Desktop", "Mini PC", "Mini Tower", "Low Profile Desktop"];
const TIPOS_LAPTOP = ["Notebook", "Laptop"];

const esServidor = (e) => TIPOS_SERVIDOR.includes((e.tipoEquipo || "").trim());
const esEnRevision = (e) => (e.comentarios || "").includes(MARCA_CRONOGRAMA);
const nonEmpty = (v) => !!(v && String(v).trim());
const esPC = (e) => TIPOS_PC.includes((e.tipoEquipo || "").trim());
const esLaptop = (e) => TIPOS_LAPTOP.includes((e.tipoEquipo || "").trim());
const esRiolsa = (e) => (e.empresa || "").trim().toUpperCase() === "RIOL S.A.";

function animarNumero(el, valorFinal) {
  const yaPintado = el.dataset.valor !== undefined;
  const inicio = yaPintado ? Number(el.dataset.valor) : 0;
  if (yaPintado && inicio === valorFinal) return;
  el.dataset.valor = valorFinal;
  const duracion = 500;
  const t0 = performance.now();
  function paso(ahora) {
    const p = Math.min(1, (ahora - t0) / duracion);
    const suavizado = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(inicio + (valorFinal - inicio) * suavizado);
    if (p < 1) requestAnimationFrame(paso);
  }
  requestAnimationFrame(paso);
}

function pintarBloque(prefijo, pc, laptop) {
  const total = pc + laptop;
  animarNumero($(`${prefijo}-total`), total);
  $(`${prefijo}-pc-valor`).textContent = pc;
  $(`${prefijo}-lap-valor`).textContent = laptop;
  const pct = total > 0 ? Math.round((pc / total) * 100) : 50;
  $(`${prefijo}-donut`).style.setProperty("--pct", `${pct}%`);
}

function irOpener(nombreFuncion, ...args) {
  if (window.opener && !window.opener.closed && typeof window.opener[nombreFuncion] === "function") {
    window.opener[nombreFuncion](...args);
    window.opener.focus();
  } else {
    window.open("index.html", "_blank");
  }
}

$("bloque-lenovo").addEventListener("click", () => irOpener("irAEquiposLenovo"));
$("bloque-propios").addEventListener("click", () => irOpener("irAEquiposPropios"));
$("bloque-riolsa").addEventListener("click", () => irOpener("irAEquiposRiolsaTodos"));
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function topUbicaciones(lista, max = 4) {
  const conteo = new Map();
  lista.forEach((p) => {
    const u = (p.ubicacion || "").trim() || "Sin ubicación";
    conteo.set(u, (conteo.get(u) || 0) + 1);
  });
  return [...conteo.entries()].sort((a, b) => b[1] - a[1]).slice(0, max);
}

function construirDetalle(idContenedor, lista, tipoValor) {
  const top = topUbicaciones(lista);
  const filasHtml = top
    .map(([u, n]) => `<div class="detalle-fila"><span>${esc(u)}</span><strong>${n}</strong></div>`)
    .join("");
  $(idContenedor).innerHTML = `${filasHtml}<button type="button" class="detalle-link" data-tipo="${esc(tipoValor)}">Ver catálogo completo →</button>`;
}

document.querySelectorAll(".impresora-card .cabecera-imp").forEach((cabecera) => {
  cabecera.addEventListener("click", () => {
    cabecera.closest(".impresora-card").classList.toggle("abierta");
  });
});

document.addEventListener("click", (ev) => {
  const link = ev.target.closest(".detalle-link");
  if (link) {
    ev.stopPropagation();
    irOpener("irACatalogoImpresorasFiltrado", "tipo", link.dataset.tipo);
  }
});

function pintarImpresoras() {
  const catalogo = typeof CATALOGO_IMPRESORAS !== "undefined" && Array.isArray(CATALOGO_IMPRESORAS) ? CATALOGO_IMPRESORAS : [];
  const listaBn = catalogo.filter((p) => (p.tipo || "").trim() === "B/N");
  const listaColor = catalogo.filter((p) => (p.tipo || "").trim() === "Colores");
  const listaPlotter = catalogo.filter((p) => (p.tipo || "").trim() === "Plotter");
  const total = listaBn.length + listaColor.length + listaPlotter.length;
  const pct = (n) => (total > 0 ? Math.round((n / total) * 100) : 0);

  animarNumero($("impresoras-bn-total"), listaBn.length);
  animarNumero($("impresoras-color-total"), listaColor.length);
  animarNumero($("impresoras-plotter-total"), listaPlotter.length);
  $("impresoras-bn-pct").textContent = `${pct(listaBn.length)}%`;
  $("impresoras-color-pct").textContent = `${pct(listaColor.length)}%`;
  $("impresoras-plotter-pct").textContent = `${pct(listaPlotter.length)}%`;
  $("impresoras-bn-barra").style.width = `${pct(listaBn.length)}%`;
  $("impresoras-color-barra").style.width = `${pct(listaColor.length)}%`;
  $("impresoras-plotter-barra").style.width = `${pct(listaPlotter.length)}%`;

  construirDetalle("detalle-impresoras-bn", listaBn, "B/N");
  construirDetalle("detalle-impresoras-color", listaColor, "Colores");
  construirDetalle("detalle-impresoras-plotter", listaPlotter, "Plotter");
}

function renderTodo(equipos) {
  const noServidor = equipos.filter((e) => !esServidor(e));
  const validados = noServidor.filter((e) => !esEnRevision(e));

  // Bloque 1: Equipos Lenovo (PC + Laptop), validados
  const lenovo = validados.filter((e) => (e.fabricante || "").trim().toUpperCase() === "LENOVO");
  pintarBloque("lenovo", lenovo.filter(esPC).length, lenovo.filter(esLaptop).length);

  // Bloque 2: Equipos propios, sin RIOLSA (validados, sin contrato)
  const propiosSinRiolsa = validados.filter((e) => !nonEmpty(e.contratos) && !esRiolsa(e));
  pintarBloque("propios", propiosSinRiolsa.filter(esPC).length, propiosSinRiolsa.filter(esLaptop).length);

  // Bloque 3: Equipos RIOLSA, todos (validados + en revision), sin servidor
  const riolsa = noServidor.filter(esRiolsa);
  pintarBloque("riolsa", riolsa.filter(esPC).length, riolsa.filter(esLaptop).length);

  $("fecha-corte").textContent = `Actualizado ${new Date().toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" })}`;
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
  pintarImpresoras();
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
