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
const TIPOS_PC = ["Desktop", "Mini PC"];
const TIPOS_LAPTOP = ["Notebook", "Laptop"];

const esServidor = (e) => TIPOS_SERVIDOR.includes((e.tipoEquipo || "").trim());
const esEnRevision = (e) => (e.comentarios || "").includes(MARCA_CRONOGRAMA);
const nonEmpty = (v) => !!(v && String(v).trim());
const esPC = (e) => TIPOS_PC.includes((e.tipoEquipo || "").trim());
const esLaptop = (e) => TIPOS_LAPTOP.includes((e.tipoEquipo || "").trim());
const esRiolsa = (e) => (e.empresa || "").trim().toUpperCase() === "RIOL S.A.";

function pintarBloque(prefijo, pc, laptop) {
  const total = pc + laptop;
  $(`${prefijo}-total`).textContent = total;
  $(`${prefijo}-pc-valor`).textContent = pc;
  $(`${prefijo}-lap-valor`).textContent = laptop;
  const max = Math.max(pc, laptop, 1);
  $(`${prefijo}-pc-barra`).style.width = `${Math.max(4, Math.round((pc / max) * 100))}%`;
  $(`${prefijo}-lap-barra`).style.width = `${Math.max(4, Math.round((laptop / max) * 100))}%`;
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
