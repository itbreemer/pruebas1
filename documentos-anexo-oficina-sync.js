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

// Guarda la ficha de los PDF ya firmados del Anexo de Servicios Multimedia
// (Contratos de Oficina): el archivo en sí vive en Google Drive (compartido
// con enlace); aquí solo se guarda en Firestore el enlace, la empresa, la
// fecha y quién lo agregó. Ver documentos-anexo-moviles-sync.js para la
// explicación completa del enfoque (por qué Google Drive y no Firebase
// Storage, y cómo migrar después a GLPI Cloud).
//
// Requiere la regla de Firestore para "documentosAnexoOficina":
//
//   match /documentosAnexoOficina/{docId} {
//     allow read, write: if request.auth != null;
//   }

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const COL = "documentosAnexoOficina";

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
        console.warn("Sincronización de documentos de Anexo Oficina no disponible:", err);
      }
    );
  });
}

async function guardarDocumento({ id, referencia, nombreArchivo, url, subidoPor }) {
  const metadata = {
    id,
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

window.DocumentosAnexoOficinaSync = { guardarDocumento, eliminarDocumento };

iniciar((remotos) => {
  if (typeof window.establecerDocumentosAnexoOficinaDesdeSync === "function") {
    window.establecerDocumentosAnexoOficinaDesdeSync(remotos);
  }
});
