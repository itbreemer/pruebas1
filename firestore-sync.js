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
  enableIndexedDbPersistence,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Sincroniza los equipos entre todas las computadoras usando Firestore, para
// que lo que se captura en una máquina aparezca automáticamente en las demás
// (en vez de quedar solo en el localStorage de esa computadora).
//
// Requisito único de configuración (una sola vez, en Firebase Console del
// proyecto "inventario-ti-riol"): crear la base de datos Firestore y agregar
// esta regla de seguridad:
//
//   rules_version = '2';
//   service cloud.firestore {
//     match /databases/{database}/documents {
//       match /equipos/{equipoId} {
//         allow read, write: if request.auth != null;
//       }
//     }
//   }
//
// Mientras eso no esté configurado, esta sincronización falla en silencio y
// el programa sigue funcionando solo con el localStorage de cada computadora,
// igual que antes.

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const EQUIPOS_COL = "equipos";

enableIndexedDbPersistence(db).catch(() => {
  // Falla si hay varias pestañas abiertas a la vez o el navegador no lo
  // soporta; no es crítico, la sincronización en línea sigue funcionando.
});

async function migrarSiHaceFalta(equiposLocales) {
  const snap = await getDocs(collection(db, EQUIPOS_COL));
  if (!snap.empty) return false;
  const lote = (equiposLocales || []).filter((e) => e && e.id);
  if (!lote.length) return false;
  for (let i = 0; i < lote.length; i += 400) {
    const batch = writeBatch(db);
    lote.slice(i, i + 400).forEach((e) => batch.set(doc(db, EQUIPOS_COL, String(e.id)), e));
    await batch.commit();
  }
  return true;
}

function iniciar(obtenerEquiposLocales, onCambioRemoto) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    try {
      await migrarSiHaceFalta(obtenerEquiposLocales());
    } catch (err) {
      console.warn("No se pudo migrar el inventario a Firestore (¿ya existe la base de datos y las reglas?):", err);
    }
    onSnapshot(
      collection(db, EQUIPOS_COL),
      (snapshot) => {
        if (snapshot.empty) return;
        const lista = [];
        snapshot.forEach((d) => lista.push(d.data()));
        onCambioRemoto(lista);
      },
      (err) => {
        console.warn("Sincronización en línea no disponible; se sigue trabajando con los datos locales:", err);
      }
    );
  });
}

function guardarEquipo(equipo) {
  if (!equipo || !equipo.id) return Promise.resolve();
  return setDoc(doc(db, EQUIPOS_COL, String(equipo.id)), equipo).catch((err) => {
    console.warn("No se pudo sincronizar este equipo en línea (se guardó localmente):", err);
  });
}

function eliminarEquipo(id) {
  if (!id) return Promise.resolve();
  return deleteDoc(doc(db, EQUIPOS_COL, String(id))).catch((err) => {
    console.warn("No se pudo eliminar este equipo en línea (se eliminó localmente):", err);
  });
}

window.FirestoreSync = { guardarEquipo, eliminarEquipo };

iniciar(
  () => (typeof window.obtenerEquiposActuales === "function" ? window.obtenerEquiposActuales() : []),
  (equiposRemotos) => {
    if (typeof window.establecerEquiposDesdeSync === "function") {
      window.establecerEquiposDesdeSync(equiposRemotos);
    }
  }
);
