import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// Guarda los PDF ya firmados del Anexo de Servicios Multimedia (Contratos de
// Oficina): el archivo va a Firebase Storage y su ficha (empresa, nombre de
// archivo, fecha, quién lo subió) a Firestore, para que cualquier
// computadora pueda verlo y descargarlo después. Ver documentos-anexo-
// moviles-sync.js para la explicación completa del enfoque.
//
// Requiere, además de la regla de Firestore para "documentosAnexoOficina":
//
//   match /documentosAnexoOficina/{docId} {
//     allow read, write: if request.auth != null;
//   }
//
// una regla de Storage (Firebase Console → Storage → Rules):
//
//   rules_version = '2';
//   service firebase.storage {
//     match /b/{bucket}/o {
//       match /documentosAnexoOficina/{allPaths=**} {
//         allow read, write: if request.auth != null;
//       }
//     }
//   }

const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const COL = "documentosAnexoOficina";
const CARPETA = "documentosAnexoOficina";

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

async function subirDocumento({ id, referencia, archivo, subidoPor }) {
  const storagePath = `${CARPETA}/${id}-${archivo.name}`;
  const refArchivo = ref(storage, storagePath);
  await uploadBytes(refArchivo, archivo);
  const url = await getDownloadURL(refArchivo);
  const metadata = {
    id,
    referencia,
    nombreArchivo: archivo.name,
    storagePath,
    url,
    fechaSubida: new Date().toISOString(),
    subidoPor: subidoPor || "",
  };
  await setDoc(doc(db, COL, id), metadata);
  return metadata;
}

async function eliminarDocumento(documento) {
  if (!documento || !documento.id) return;
  if (documento.storagePath) {
    try {
      await deleteObject(ref(storage, documento.storagePath));
    } catch (err) {
      console.warn("No se pudo eliminar el archivo en Storage (puede que ya no exista):", err);
    }
  }
  await deleteDoc(doc(db, COL, documento.id));
}

window.DocumentosAnexoOficinaSync = { subirDocumento, eliminarDocumento };

iniciar((remotos) => {
  if (typeof window.establecerDocumentosAnexoOficinaDesdeSync === "function") {
    window.establecerDocumentosAnexoOficinaDesdeSync(remotos);
  }
});
