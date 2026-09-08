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

// Sincroniza el historial de Salidas de Tóner (vales entregados al
// bodeguero) entre computadoras, igual que contadores-impresoras-sync.js.
//
// Requiere la misma regla de seguridad que las demás colecciones, agregada
// a "salidasToner":
//
//   match /salidasToner/{salidaId} {
//     allow read, write: if request.auth != null;
//   }

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const SALIDAS_TONER_COL = "salidasToner";

async function migrarSiHaceFalta(salidasLocales) {
  const snap = await getDocs(collection(db, SALIDAS_TONER_COL));
  if (!snap.empty) return false;
  const lote = (salidasLocales || []).filter((s) => s && s.id);
  if (!lote.length) return false;
  for (let i = 0; i < lote.length; i += 400) {
    const batch = writeBatch(db);
    lote.slice(i, i + 400).forEach((s) => batch.set(doc(db, SALIDAS_TONER_COL, String(s.id)), s));
    await batch.commit();
  }
  return true;
}

function iniciar(obtenerSalidasLocales, onCambioRemoto) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    try {
      await migrarSiHaceFalta(obtenerSalidasLocales());
    } catch (err) {
      console.warn("No se pudo migrar las Salidas de Tóner a Firestore:", err);
    }
    onSnapshot(
      collection(db, SALIDAS_TONER_COL),
      (snapshot) => {
        if (snapshot.empty) return;
        const lista = [];
        snapshot.forEach((d) => lista.push(d.data()));
        onCambioRemoto(lista);
      },
      (err) => {
        console.warn("Sincronización de Salidas de Tóner no disponible; se sigue trabajando con los datos locales:", err);
      }
    );
  });
}

function guardarSalidaToner(registro) {
  if (!registro || !registro.id) return Promise.resolve();
  return setDoc(doc(db, SALIDAS_TONER_COL, String(registro.id)), registro).catch((err) => {
    console.warn("No se pudo sincronizar esta Salida de Tóner en línea (se guardó localmente):", err);
  });
}

function eliminarSalidaToner(id) {
  if (!id) return Promise.resolve();
  return deleteDoc(doc(db, SALIDAS_TONER_COL, String(id))).catch((err) => {
    console.warn("No se pudo eliminar esta Salida de Tóner en línea (se eliminó localmente):", err);
  });
}

window.FirestoreSyncSalidasToner = { guardarSalidaToner, eliminarSalidaToner };

iniciar(
  () => (typeof window.obtenerSalidasTonerActuales === "function" ? window.obtenerSalidasTonerActuales() : []),
  (salidasRemotas) => {
    if (typeof window.establecerSalidasTonerDesdeSync === "function") {
      window.establecerSalidasTonerDesdeSync(salidasRemotas);
    }
  }
);
