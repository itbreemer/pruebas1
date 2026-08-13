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

// Sincroniza el catálogo de impresoras entre computadoras, igual que
// firestore-sync.js lo hace para los equipos. La primera vez que corre
// (colección "impresoras" vacía) sube lo que este navegador tenga sembrado
// desde el catálogo estático (impresoras.js), y de ahí en adelante todo pasa
// por Firestore.
//
// Requiere la misma regla de seguridad que "equipos", agregada a la colección
// "impresoras":
//
//   match /impresoras/{impresoraId} {
//     allow read, write: if request.auth != null;
//   }

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const IMPRESORAS_COL = "impresoras";

async function migrarSiHaceFalta(impresorasLocales) {
  const snap = await getDocs(collection(db, IMPRESORAS_COL));
  if (!snap.empty) return false;
  const lote = (impresorasLocales || []).filter((p) => p && p.id);
  if (!lote.length) return false;
  for (let i = 0; i < lote.length; i += 400) {
    const batch = writeBatch(db);
    lote.slice(i, i + 400).forEach((p) => batch.set(doc(db, IMPRESORAS_COL, String(p.id)), p));
    await batch.commit();
  }
  return true;
}

function iniciar(obtenerImpresorasLocales, onCambioRemoto) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    try {
      await migrarSiHaceFalta(obtenerImpresorasLocales());
    } catch (err) {
      console.warn("No se pudo migrar el catálogo de impresoras a Firestore:", err);
    }
    onSnapshot(
      collection(db, IMPRESORAS_COL),
      (snapshot) => {
        if (snapshot.empty) return;
        const lista = [];
        snapshot.forEach((d) => lista.push(d.data()));
        onCambioRemoto(lista);
      },
      (err) => {
        console.warn("Sincronización de impresoras no disponible; se sigue trabajando con los datos locales:", err);
      }
    );
  });
}

function guardarImpresora(impresora) {
  if (!impresora || !impresora.id) return Promise.resolve();
  return setDoc(doc(db, IMPRESORAS_COL, String(impresora.id)), impresora).catch((err) => {
    console.warn("No se pudo sincronizar esta impresora en línea (se guardó localmente):", err);
  });
}

function eliminarImpresora(id) {
  if (!id) return Promise.resolve();
  return deleteDoc(doc(db, IMPRESORAS_COL, String(id))).catch((err) => {
    console.warn("No se pudo eliminar esta impresora en línea (se eliminó localmente):", err);
  });
}

window.FirestoreSyncImpresoras = { guardarImpresora, eliminarImpresora };

iniciar(
  () => (typeof window.obtenerImpresorasActuales === "function" ? window.obtenerImpresorasActuales() : []),
  (impresorasRemotas) => {
    if (typeof window.establecerImpresorasDesdeSync === "function") {
      window.establecerImpresorasDesdeSync(impresorasRemotas);
    }
  }
);
