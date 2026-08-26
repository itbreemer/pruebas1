import { getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Muestra en la app los datos técnicos que el Agente de Inventario TI
// (agent-inventario.ps1, vía GPO/Task Scheduler en cada equipo Windows)
// recolecta y guarda solo, sin intervención manual. Es de solo lectura: la
// app nunca escribe en esta colección, solo el agente.
//
// Regla de seguridad en Firestore (proyecto "inventario-ti-riol"):
//
//   match /equiposTI_v2/{equipoId} {
//     allow read: if request.auth != null;
//     allow write: if true;
//   }

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const EQUIPOS_TI_V2_COL = "equiposTI_v2";

onAuthStateChanged(auth, (user) => {
  if (!user) return;
  onSnapshot(
    collection(db, EQUIPOS_TI_V2_COL),
    (snapshot) => {
      const lista = [];
      snapshot.forEach((d) => lista.push(d.data()));
      if (typeof window.establecerEquiposTIv2DesdeSync === "function") {
        window.establecerEquiposTIv2DesdeSync(lista);
      }
    },
    (err) => {
      console.warn("No se pudo leer el inventario automático (equiposTI_v2):", err);
    }
  );
});
