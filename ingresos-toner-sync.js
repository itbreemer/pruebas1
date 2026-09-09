import { getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  writeBatch,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Sincroniza el historial de Ingresos de Tóner (entregas de Canella) entre
// computadoras, mismo patrón que salidas-toner-sync.js. A diferencia de
// Salidas, un Ingreso nunca se elimina (solo se edita), así que este módulo
// no expone ninguna función de borrado.
//
// Requiere la misma regla de seguridad que las demás colecciones, agregada
// a "ingresosToner":
//
//   match /ingresosToner/{ingresoId} {
//     allow read, write: if request.auth != null;
//   }

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const INGRESOS_TONER_COL = "ingresosToner";

async function migrarSiHaceFalta(ingresosLocales) {
  const snap = await getDocs(collection(db, INGRESOS_TONER_COL));
  if (!snap.empty) return false;
  const lote = (ingresosLocales || []).filter((r) => r && r.id);
  if (!lote.length) return false;
  for (let i = 0; i < lote.length; i += 400) {
    const batch = writeBatch(db);
    lote.slice(i, i + 400).forEach((r) => batch.set(doc(db, INGRESOS_TONER_COL, String(r.id)), r));
    await batch.commit();
  }
  return true;
}

function iniciar(obtenerIngresosLocales, onCambioRemoto) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    try {
      await migrarSiHaceFalta(obtenerIngresosLocales());
    } catch (err) {
      console.warn("No se pudo migrar los Ingresos de Tóner a Firestore:", err);
    }
    onSnapshot(
      collection(db, INGRESOS_TONER_COL),
      (snapshot) => {
        if (snapshot.empty) return;
        const lista = [];
        snapshot.forEach((d) => lista.push(d.data()));
        onCambioRemoto(lista);
      },
      (err) => {
        console.warn("Sincronización de Ingresos de Tóner no disponible; se sigue trabajando con los datos locales:", err);
      }
    );
  });
}

function guardarIngresoToner(registro) {
  if (!registro || !registro.id) return Promise.resolve();
  return setDoc(doc(db, INGRESOS_TONER_COL, String(registro.id)), registro).catch((err) => {
    console.warn("No se pudo sincronizar este Ingreso de Tóner en línea (se guardó localmente):", err);
  });
}

window.FirestoreSyncIngresosToner = { guardarIngresoToner };

iniciar(
  () => (typeof window.obtenerIngresosTonerActuales === "function" ? window.obtenerIngresosTonerActuales() : []),
  (ingresosRemotos) => {
    if (typeof window.establecerIngresosTonerDesdeSync === "function") {
      window.establecerIngresosTonerDesdeSync(ingresosRemotos);
    }
  }
);
