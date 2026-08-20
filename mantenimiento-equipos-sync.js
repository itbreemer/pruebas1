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
import { getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// Sincroniza el historial de mantenimiento y reparaciones de equipos entre computadoras.
// Requiere la misma regla de seguridad que las demás colecciones, agregada
// a "mantenimientoEquipos":
//
//   match /mantenimientoEquipos/{registroId} {
//     allow read, write: if request.auth != null;
//   }

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const MANTENIMIENTO_EQUIPOS_COL = "mantenimientoEquipos";

async function migrarSiHaceFalta(registrosLocales) {
  const snap = await getDocs(collection(db, MANTENIMIENTO_EQUIPOS_COL));
  if (!snap.empty) return false;
  const lote = (registrosLocales || []).filter((r) => r && r.id);
  if (!lote.length) return false;
  for (let i = 0; i < lote.length; i += 400) {
    const batch = writeBatch(db);
    lote.slice(i, i + 400).forEach((r) => batch.set(doc(db, MANTENIMIENTO_EQUIPOS_COL, String(r.id)), r));
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
      console.warn("No se pudo migrar el historial de mantenimiento a Firestore:", err);
    }
    onSnapshot(
      collection(db, MANTENIMIENTO_EQUIPOS_COL),
      (snapshot) => {
        if (snapshot.empty) return;
        const lista = [];
        snapshot.forEach((d) => lista.push(d.data()));
        onCambioRemoto(lista);
      },
      (err) => {
        console.warn("Sincronización de mantenimiento de equipos no disponible; se sigue trabajando con los datos locales:", err);
      }
    );
  });
}

function guardarRegistroMantenimiento(registro) {
  if (!registro || !registro.id) return Promise.resolve();
  return setDoc(doc(db, MANTENIMIENTO_EQUIPOS_COL, String(registro.id)), registro).catch((err) => {
    console.warn("No se pudo sincronizar este registro de mantenimiento en línea (se guardó localmente):", err);
  });
}

function eliminarRegistroMantenimiento(id) {
  if (!id) return Promise.resolve();
  return deleteDoc(doc(db, MANTENIMIENTO_EQUIPOS_COL, String(id))).catch((err) => {
    console.warn("No se pudo eliminar este registro de mantenimiento en línea (se eliminó localmente):", err);
  });
}

window.FirestoreSyncMantenimientoEquipos = { guardarRegistroMantenimiento, eliminarRegistroMantenimiento };

iniciar(
  () => (typeof window.obtenerRegistrosMantenimientoActuales === "function" ? window.obtenerRegistrosMantenimientoActuales() : []),
  (registrosRemotos) => {
    if (typeof window.establecerRegistrosMantenimientoDesdeSync === "function") {
      window.establecerRegistrosMantenimientoDesdeSync(registrosRemotos);
    }
  }
);
