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

// Sincroniza los servicios adicionales de oficina entre computadoras, igual
// que lineas-moviles-sync.js.
//
// Requiere la misma regla de seguridad que las demás colecciones, agregada
// a "serviciosOficina":
//
//   match /serviciosOficina/{servicioId} {
//     allow read, write: if request.auth != null;
//   }

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const SERVICIOS_OFICINA_COL = "serviciosOficina";

async function migrarSiHaceFalta(serviciosLocales) {
  const snap = await getDocs(collection(db, SERVICIOS_OFICINA_COL));
  if (!snap.empty) return false;
  const lote = (serviciosLocales || []).filter((s) => s && s.id);
  if (!lote.length) return false;
  for (let i = 0; i < lote.length; i += 400) {
    const batch = writeBatch(db);
    lote.slice(i, i + 400).forEach((s) => batch.set(doc(db, SERVICIOS_OFICINA_COL, String(s.id)), s));
    await batch.commit();
  }
  return true;
}

function iniciar(obtenerServiciosLocales, onCambioRemoto) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    try {
      await migrarSiHaceFalta(obtenerServiciosLocales());
    } catch (err) {
      console.warn("No se pudo migrar los servicios adicionales de oficina a Firestore:", err);
    }
    onSnapshot(
      collection(db, SERVICIOS_OFICINA_COL),
      (snapshot) => {
        if (snapshot.empty) return;
        const lista = [];
        snapshot.forEach((d) => lista.push(d.data()));
        onCambioRemoto(lista);
      },
      (err) => {
        console.warn("Sincronización de servicios adicionales de oficina no disponible; se sigue trabajando con los datos locales:", err);
      }
    );
  });
}

function guardarServicioOficina(servicio) {
  if (!servicio || !servicio.id) return Promise.resolve();
  return setDoc(doc(db, SERVICIOS_OFICINA_COL, String(servicio.id)), servicio).catch((err) => {
    console.warn("No se pudo sincronizar este servicio de oficina en línea (se guardó localmente):", err);
  });
}

function eliminarServicioOficina(id) {
  if (!id) return Promise.resolve();
  return deleteDoc(doc(db, SERVICIOS_OFICINA_COL, String(id))).catch((err) => {
    console.warn("No se pudo eliminar este servicio de oficina en línea (se eliminó localmente):", err);
  });
}

window.FirestoreSyncServiciosOficina = { guardarServicioOficina, eliminarServicioOficina };

iniciar(
  () => (typeof window.obtenerServiciosOficinaActuales === "function" ? window.obtenerServiciosOficinaActuales() : []),
  (serviciosRemotos) => {
    if (typeof window.establecerServiciosOficinaDesdeSync === "function") {
      window.establecerServiciosOficinaDesdeSync(serviciosRemotos);
    }
  }
);
