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

// Sincroniza los tickets de garantía (reportes a GBM por equipos Lenovo y a
// Canella por impresoras Canon) entre computadoras, igual que
// contratos-moviles-sync.js.
//
// Requiere la misma regla de seguridad que las demás colecciones, agregada
// a "ticketsGarantia":
//
//   match /ticketsGarantia/{ticketId} {
//     allow read, write: if request.auth != null;
//   }

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const TICKETS_GARANTIA_COL = "ticketsGarantia";

async function migrarSiHaceFalta(ticketsLocales) {
  const snap = await getDocs(collection(db, TICKETS_GARANTIA_COL));
  if (!snap.empty) return false;
  const lote = (ticketsLocales || []).filter((t) => t && t.id);
  if (!lote.length) return false;
  for (let i = 0; i < lote.length; i += 400) {
    const batch = writeBatch(db);
    lote.slice(i, i + 400).forEach((t) => batch.set(doc(db, TICKETS_GARANTIA_COL, String(t.id)), t));
    await batch.commit();
  }
  return true;
}

function iniciar(obtenerTicketsLocales, onCambioRemoto) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    try {
      await migrarSiHaceFalta(obtenerTicketsLocales());
    } catch (err) {
      console.warn("No se pudo migrar los tickets de garantía a Firestore:", err);
    }
    onSnapshot(
      collection(db, TICKETS_GARANTIA_COL),
      (snapshot) => {
        if (snapshot.empty) return;
        const lista = [];
        snapshot.forEach((d) => lista.push(d.data()));
        onCambioRemoto(lista);
      },
      (err) => {
        console.warn("Sincronización de tickets de garantía no disponible; se sigue trabajando con los datos locales:", err);
      }
    );
  });
}

function guardarTicketGarantia(ticket) {
  if (!ticket || !ticket.id) return Promise.resolve();
  return setDoc(doc(db, TICKETS_GARANTIA_COL, String(ticket.id)), ticket).catch((err) => {
    console.warn("No se pudo sincronizar este ticket de garantía en línea (se guardó localmente):", err);
  });
}

function eliminarTicketGarantia(id) {
  if (!id) return Promise.resolve();
  return deleteDoc(doc(db, TICKETS_GARANTIA_COL, String(id))).catch((err) => {
    console.warn("No se pudo eliminar este ticket de garantía en línea (se eliminó localmente):", err);
  });
}

window.FirestoreSyncTicketsGarantia = { guardarTicketGarantia, eliminarTicketGarantia };

iniciar(
  () => (typeof window.obtenerTicketsGarantiaActuales === "function" ? window.obtenerTicketsGarantiaActuales() : []),
  (ticketsRemotos) => {
    if (typeof window.establecerTicketsGarantiaDesdeSync === "function") {
      window.establecerTicketsGarantiaDesdeSync(ticketsRemotos);
    }
  }
);
