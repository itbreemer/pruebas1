import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBondrL7b5C-WI6hbQTtCxob8Dn0mpwBrs",
  authDomain: "inventario-ti-riol.firebaseapp.com",
  projectId: "inventario-ti-riol",
  storageBucket: "inventario-ti-riol.firebasestorage.app",
  messagingSenderId: "728474379617",
  appId: "1:728474379617:web:4a9714a2677ecc3875d120",
};

// Ajusta estos correos para que coincidan exactamente con los que crees en
// Firebase → Authentication → Users. La clave es el correo (en minúsculas),
// el valor es el nombre que se muestra/imprime como Técnico de Soporte.
const TECNICOS_POR_CORREO = {
  "victor@inventario-ti.local": "Victor Morales",
  "eder@inventario-ti.local": "Eder Rosales",
  "gustavo@inventario-ti.local": "Gustavo Garcia",
  "estefani@inventario-ti.local": "Estefani Flores",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const $ = (id) => document.getElementById(id);

function nombreTecnicoDeCorreo(correo) {
  const c = (correo || "").trim().toLowerCase();
  return TECNICOS_POR_CORREO[c] || correo;
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    const nombre = nombreTecnicoDeCorreo(user.email);
    if (typeof window.establecerTecnicoActual === "function") {
      window.establecerTecnicoActual(nombre);
    }
    $("usuarioSesion").textContent = `👤 ${nombre}`;
    $("loginOverlay").style.display = "none";
    $("appShell").style.display = "";
  } else {
    if (typeof window.establecerTecnicoActual === "function") {
      window.establecerTecnicoActual("");
    }
    $("formLogin").reset();
    $("loginOverlay").style.display = "flex";
    $("appShell").style.display = "none";
  }
});

$("formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();
  const correo = $("loginCorreo").value.trim();
  const password = $("loginPassword").value;
  const errorEl = $("loginError");
  errorEl.style.display = "none";
  $("btnLogin").disabled = true;
  try {
    await signInWithEmailAndPassword(auth, correo, password);
  } catch (err) {
    errorEl.textContent = "Correo o contraseña incorrectos.";
    errorEl.style.display = "";
  } finally {
    $("btnLogin").disabled = false;
  }
});

$("btnCerrarSesion").addEventListener("click", () => {
  signOut(auth);
});
