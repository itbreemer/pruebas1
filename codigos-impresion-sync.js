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

// Sincroniza el catálogo de códigos de usuario (ID + clave de impresión,
// escaneo y copia) entre computadoras, igual que impresoras-sync.js.
//
// Requiere la misma regla de seguridad que "equipos" e "impresoras", agregada
// a la colección "codigosImpresion":
//
//   match /codigosImpresion/{codigoId} {
//     allow read, write: if request.auth != null;
//   }

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const CODIGOS_COL = "codigosImpresion";

async function migrarSiHaceFalta(codigosLocales) {
  const snap = await getDocs(collection(db, CODIGOS_COL));
  if (!snap.empty) return false;
  const lote = (codigosLocales || []).filter((c) => c && c.id);
  if (!lote.length) return false;
  for (let i = 0; i < lote.length; i += 400) {
    const batch = writeBatch(db);
    lote.slice(i, i + 400).forEach((c) => batch.set(doc(db, CODIGOS_COL, String(c.id)), c));
    await batch.commit();
  }
  return true;
}

function iniciar(obtenerCodigosLocales, onCambioRemoto) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    try {
      await migrarSiHaceFalta(obtenerCodigosLocales());
    } catch (err) {
      console.warn("No se pudo migrar el catálogo de códigos a Firestore:", err);
    }
    onSnapshot(
      collection(db, CODIGOS_COL),
      (snapshot) => {
        if (snapshot.empty) return;
        const lista = [];
        snapshot.forEach((d) => lista.push(d.data()));
        onCambioRemoto(lista);
      },
      (err) => {
        console.warn("Sincronización de códigos no disponible; se sigue trabajando con los datos locales:", err);
      }
    );
  });
}

function guardarCodigo(codigo) {
  if (!codigo || !codigo.id) return Promise.resolve();
  return setDoc(doc(db, CODIGOS_COL, String(codigo.id)), codigo).catch((err) => {
    console.warn("No se pudo sincronizar este código en línea (se guardó localmente):", err);
  });
}

function eliminarCodigo(id) {
  if (!id) return Promise.resolve();
  return deleteDoc(doc(db, CODIGOS_COL, String(id))).catch((err) => {
    console.warn("No se pudo eliminar este código en línea (se eliminó localmente):", err);
  });
}

window.FirestoreSyncCodigos = { guardarCodigo, eliminarCodigo };

iniciar(
  () => (typeof window.obtenerCodigosActuales === "function" ? window.obtenerCodigosActuales() : []),
  (codigosRemotos) => {
    if (typeof window.establecerCodigosDesdeSync === "function") {
      window.establecerCodigosDesdeSync(codigosRemotos);
    }
  }
);
