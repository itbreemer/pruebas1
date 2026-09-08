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

// Sincroniza las lecturas de contador de impresoras (para pedir cartuchos/
// tóner/tambor a tiempo) entre computadoras, igual que impresoras-sync.js.
//
// Requiere la misma regla de seguridad que las demás colecciones, agregada
// a "contadoresImpresoras":
//
//   match /contadoresImpresoras/{registroId} {
//     allow read, write: if request.auth != null;
//   }

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const CONTADORES_IMPRESORAS_COL = "contadoresImpresoras";

async function migrarSiHaceFalta(registrosLocales) {
  const snap = await getDocs(collection(db, CONTADORES_IMPRESORAS_COL));
  if (!snap.empty) return false;
  const lote = (registrosLocales || []).filter((r) => r && r.id);
  if (!lote.length) return false;
  for (let i = 0; i < lote.length; i += 400) {
    const batch = writeBatch(db);
    lote.slice(i, i + 400).forEach((r) => batch.set(doc(db, CONTADORES_IMPRESORAS_COL, String(r.id)), r));
    await batch.commit();
  }
  return true;
}

function iniciar(obtenerRegistrosLocales, onCambioRemoto) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    try {
      await migrarSiHaceFalta(obtenerRegistrosLocales());
    } catch (err) {
      console.warn("No se pudo migrar el contador de impresoras a Firestore:", err);
    }
    onSnapshot(
      collection(db, CONTADORES_IMPRESORAS_COL),
      (snapshot) => {
        if (snapshot.empty) return;
        const lista = [];
        snapshot.forEach((d) => lista.push(d.data()));
        onCambioRemoto(lista);
      },
      (err) => {
        console.warn("Sincronización del contador de impresoras no disponible; se sigue trabajando con los datos locales:", err);
      }
    );
  });
}

function guardarContadorImpresora(registro) {
  if (!registro || !registro.id) return Promise.resolve();
  return setDoc(doc(db, CONTADORES_IMPRESORAS_COL, String(registro.id)), registro).catch((err) => {
    console.warn("No se pudo sincronizar esta lectura de contador en línea (se guardó localmente):", err);
  });
}

function eliminarContadorImpresora(id) {
  if (!id) return Promise.resolve();
  return deleteDoc(doc(db, CONTADORES_IMPRESORAS_COL, String(id))).catch((err) => {
    console.warn("No se pudo eliminar esta lectura de contador en línea (se eliminó localmente):", err);
  });
}

window.FirestoreSyncContadoresImpresoras = { guardarContadorImpresora, eliminarContadorImpresora };

iniciar(
  () => (typeof window.obtenerContadoresImpresorasActuales === "function" ? window.obtenerContadoresImpresorasActuales() : []),
  (registrosRemotos) => {
    if (typeof window.establecerContadoresImpresorasDesdeSync === "function") {
      window.establecerContadoresImpresorasDesdeSync(registrosRemotos);
    }
  }
);
