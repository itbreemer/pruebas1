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
const soloNumeroContrato = (valor) => (!valor ? valor : String(valor).trim().split(/\s*\(/)[0].trim());

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

/* ---------- Paleta contrastada (misma logica que el tablero principal) ---------- */
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
function generarPaleta(hex, n) {
  const { h, s, l } = rgbAHsl(hexARgb(hex).r, hexARgb(hex).g, hexARgb(hex).b);
  const colores = [];
  for (let i = 0; i < n; i++) {
    colores.push(hslAHex(h + i * 18, Math.max(42, s - i * 5), Math.min(80, l + i * 11)));
  }
  return colores;
}

document.addEventListener("click", (ev) => {
  const fila = ev.target.closest(".leyenda-item-clickable");
  if (!fila) return;
  if (fila.dataset.tipo) irOpener("irACatalogoImpresorasFiltrado", "tipo", fila.dataset.tipo);
  else if (fila.dataset.contrato) irOpener("irAContratosPorNumero", fila.dataset.contrato);
});

function pintarImpresoras(catalogo) {
  const datos = [
    ["B/N", catalogo.filter((p) => (p.tipo || "").trim() === "B/N").length],
    ["Colores", catalogo.filter((p) => (p.tipo || "").trim() === "Colores").length],
    ["Plotter", catalogo.filter((p) => (p.tipo || "").trim() === "Plotter").length],
  ].filter(([, n]) => n > 0);
  const total = datos.reduce((s, [, n]) => s + n, 0);
  const paleta = generarPaleta("#6d3fa0", datos.length);

  let acc = 0;
  const paradas = datos.map(([, valor], i) => {
    const desde = (acc / total) * 100;
    acc += valor;
    const hasta = (acc / total) * 100;
    return `${paleta[i]} ${desde}% ${hasta}%`;
  });
  $("impresoras-donut").style.background = `conic-gradient(${paradas.join(", ")})`;
  animarNumero($("impresoras-total"), total);

  $("impresoras-leyenda").innerHTML = datos
    .map(
      ([nombre, valor], i) => `
    <div class="leyenda-item leyenda-item-clickable" data-tipo="${esc(nombre)}">
      <span class="punto" style="background:${paleta[i]}"></span>${esc(nombre)}<strong>${valor}</strong>
    </div>`
    )
    .join("");
}

function pintarContratos(equiposValidados) {
  const porContrato = {};
  equiposValidados
    .filter((e) => (e.fabricante || "").trim().toUpperCase() === "LENOVO" && nonEmpty(e.contratos))
    .forEach((e) => {
      const numero = soloNumeroContrato(e.contratos) || "Sin número";
      porContrato[numero] = (porContrato[numero] || 0) + 1;
    });
  const datos = Object.entries(porContrato).sort((a, b) => b[1] - a[1]);
  const total = datos.reduce((s, [, n]) => s + n, 0);
  const paleta = generarPaleta("#b03a2e", datos.length);

  let acc = 0;
  const paradas = datos.map(([, valor], i) => {
    const desde = total > 0 ? (acc / total) * 100 : 0;
    acc += valor;
    const hasta = total > 0 ? (acc / total) * 100 : 0;
    return `${paleta[i]} ${desde}% ${hasta}%`;
  });
  $("contratos-donut").style.background = datos.length ? `conic-gradient(${paradas.join(", ")})` : "";
  animarNumero($("contratos-total"), total);

  $("contratos-leyenda").innerHTML = datos
    .map(
      ([numero, valor], i) => `
    <div class="leyenda-item leyenda-item-clickable" data-contrato="${esc(numero)}">
      <span class="punto" style="background:${paleta[i]}"></span>${esc(numero)}<strong>${valor}</strong>
    </div>`
    )
    .join("");
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

  // Bloque 3: Equipos RIOLSA propios (validados, sin contrato) — mutuamente excluyente con el bloque 2,
  // de forma que Bloque 2 + Bloque 3 = "Equipos propios" del Tablero
  const riolsaPropios = validados.filter((e) => !nonEmpty(e.contratos) && esRiolsa(e));
  pintarBloque("riolsa", riolsaPropios.filter(esPC).length, riolsaPropios.filter(esLaptop).length);

  pintarContratos(validados);

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
  $("envoltorio").classList.add("cargado");
  const catalogoEstatico = typeof CATALOGO_IMPRESORAS !== "undefined" && Array.isArray(CATALOGO_IMPRESORAS) ? CATALOGO_IMPRESORAS : [];
  pintarImpresoras(catalogoEstatico);
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
  onSnapshot(collection(db, "impresoras"), (snapshot) => {
    if (snapshot.empty) return;
    const lista = [];
    snapshot.forEach((d) => lista.push(d.data()));
    pintarImpresoras(lista);
  });
});
