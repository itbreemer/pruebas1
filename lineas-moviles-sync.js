import { getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  writeBatch,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Sincroniza el control de líneas móviles entre computadoras, igual que
// contratos-moviles-sync.js.
//
// Requiere la misma regla de seguridad que las demás colecciones, agregada
// a "lineasMoviles":
//
//   match /lineasMoviles/{lineaId} {
//     allow read, write: if request.auth != null;
//   }

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const LINEAS_MOVILES_COL = "lineasMoviles";

async function migrarSiHaceFalta(lineasLocales) {
  const snap = await getDocs(collection(db, LINEAS_MOVILES_COL));
  if (!snap.empty) return false;
  const lote = (lineasLocales || []).filter((l) => l && l.id);
  if (!lote.length) return false;
  for (let i = 0; i < lote.length; i += 400) {
    const batch = writeBatch(db);
    lote.slice(i, i + 400).forEach((l) => batch.set(doc(db, LINEAS_MOVILES_COL, String(l.id)), l));
    await batch.commit();
  }
  return true;
}

function iniciar(obtenerLineasLocales, onCambioRemoto) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    try {
      await migrarSiHaceFalta(obtenerLineasLocales());
    } catch (err) {
      console.warn("No se pudo migrar el control de líneas móviles a Firestore:", err);
    }
    onSnapshot(
      collection(db, LINEAS_MOVILES_COL),
      (snapshot) => {
        if (snapshot.empty) return;
        const lista = [];
        snapshot.forEach((d) => lista.push(d.data()));
        onCambioRemoto(lista);
      },
      (err) => {
        console.warn("Sincronización de líneas móviles no disponible; se sigue trabajando con los datos locales:", err);
      }
    );
  });
}

function guardarLineaMovil(linea) {
  if (!linea || !linea.id) return Promise.resolve();
  return setDoc(doc(db, LINEAS_MOVILES_COL, String(linea.id)), linea).catch((err) => {
    console.warn("No se pudo sincronizar esta línea móvil en línea (se guardó localmente):", err);
  });
}

function eliminarLineaMovil(id) {
  if (!id) return Promise.resolve();
  return deleteDoc(doc(db, LINEAS_MOVILES_COL, String(id))).catch((err) => {
    console.warn("No se pudo eliminar esta línea móvil en línea (se eliminó localmente):", err);
  });
}

window.FirestoreSyncLineasMoviles = { guardarLineaMovil, eliminarLineaMovil };

iniciar(
  () => (typeof window.obtenerLineasMovilesActuales === "function" ? window.obtenerLineasMovilesActuales() : []),
  (lineasRemotas) => {
    if (typeof window.establecerLineasMovilesDesdeSync === "function") {
      window.establecerLineasMovilesDesdeSync(lineasRemotas);
    }
  }
);
