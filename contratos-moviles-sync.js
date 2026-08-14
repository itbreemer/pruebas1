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

// Sincroniza el catálogo de contratos móviles entre computadoras, igual que
// impresoras-sync.js / codigos-impresion-sync.js.
//
// Requiere la misma regla de seguridad que las demás colecciones, agregada
// a "contratosMoviles":
//
//   match /contratosMoviles/{contratoId} {
//     allow read, write: if request.auth != null;
//   }

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const CONTRATOS_MOVILES_COL = "contratosMoviles";

async function migrarSiHaceFalta(contratosLocales) {
  const snap = await getDocs(collection(db, CONTRATOS_MOVILES_COL));
  if (!snap.empty) return false;
  const lote = (contratosLocales || []).filter((c) => c && c.id);
  if (!lote.length) return false;
  for (let i = 0; i < lote.length; i += 400) {
    const batch = writeBatch(db);
    lote.slice(i, i + 400).forEach((c) => batch.set(doc(db, CONTRATOS_MOVILES_COL, String(c.id)), c));
    await batch.commit();
  }
  return true;
}

function iniciar(obtenerContratosLocales, onCambioRemoto) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    try {
      await migrarSiHaceFalta(obtenerContratosLocales());
    } catch (err) {
      console.warn("No se pudo migrar el catálogo de contratos móviles a Firestore:", err);
    }
    onSnapshot(
      collection(db, CONTRATOS_MOVILES_COL),
      (snapshot) => {
        if (snapshot.empty) return;
        const lista = [];
        snapshot.forEach((d) => lista.push(d.data()));
        onCambioRemoto(lista);
      },
      (err) => {
        console.warn("Sincronización de contratos móviles no disponible; se sigue trabajando con los datos locales:", err);
      }
    );
  });
}

function guardarContratoMovil(contrato) {
  if (!contrato || !contrato.id) return Promise.resolve();
  return setDoc(doc(db, CONTRATOS_MOVILES_COL, String(contrato.id)), contrato).catch((err) => {
    console.warn("No se pudo sincronizar este contrato móvil en línea (se guardó localmente):", err);
  });
}

function eliminarContratoMovil(id) {
  if (!id) return Promise.resolve();
  return deleteDoc(doc(db, CONTRATOS_MOVILES_COL, String(id))).catch((err) => {
    console.warn("No se pudo eliminar este contrato móvil en línea (se eliminó localmente):", err);
  });
}

window.FirestoreSyncContratosMoviles = { guardarContratoMovil, eliminarContratoMovil };

iniciar(
  () => (typeof window.obtenerContratosMovilesActuales === "function" ? window.obtenerContratosMovilesActuales() : []),
  (contratosRemotos) => {
    if (typeof window.establecerContratosMovilesDesdeSync === "function") {
      window.establecerContratosMovilesDesdeSync(contratosRemotos);
    }
  }
);
