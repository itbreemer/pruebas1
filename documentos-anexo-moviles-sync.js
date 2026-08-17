import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// Guarda la ficha de los PDF ya firmados del Anexo de Servicios Móviles y de
// la Hoja de Responsabilidad por Línea y Equipo Telefónico: el archivo en sí
// vive en Google Drive (compartido con enlace); aquí solo se guarda en
// Firestore el enlace, el tipo, la empresa o número de línea, la fecha y
// quién lo agregó, para que cualquier computadora lo vea después.
//
// No se usa Firebase Storage porque exige pasar el proyecto al plan de
// pago (Blaze). Cuando se migre a GLPI Cloud, solo hay que actualizar el
// campo "url" de cada ficha para que apunte al archivo ya migrado ahí; el
// resto de la ficha no cambia.
//
// Requiere la regla de Firestore para "documentosAnexoMoviles" (igual a
// las demás colecciones):
//
//   match /documentosAnexoMoviles/{docId} {
//     allow read, write: if request.auth != null;
//   }

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const COL = "documentosAnexoMoviles";

function iniciar(onCambioRemoto) {
  onAuthStateChanged(auth, (user) => {
    if (!user) return;
    onSnapshot(
      collection(db, COL),
      (snapshot) => {
        const lista = [];
        snapshot.forEach((d) => lista.push(d.data()));
        onCambioRemoto(lista);
      },
      (err) => {
        console.warn("Sincronización de documentos de Anexo Móvil no disponible:", err);
      }
    );
  });
}

async function guardarDocumento({ id, tipo, referencia, nombreArchivo, url, subidoPor }) {
  const metadata = {
    id,
    tipo,
    referencia,
    nombreArchivo,
    url,
    fechaSubida: new Date().toISOString(),
    subidoPor: subidoPor || "",
  };
  await setDoc(doc(db, COL, id), metadata);
  return metadata;
}

async function eliminarDocumento(documento) {
  if (!documento || !documento.id) return;
  await deleteDoc(doc(db, COL, documento.id));
}

window.DocumentosAnexoMovilesSync = { guardarDocumento, eliminarDocumento };

iniciar((remotos) => {
  if (typeof window.establecerDocumentosAnexoMovilesDesdeSync === "function") {
    window.establecerDocumentosAnexoMovilesDesdeSync(remotos);
  }
});
