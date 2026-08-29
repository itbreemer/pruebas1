# Alertas de vencimiento de contratos (correo automático, gratis)

Envía un correo cuando un contrato (campo "Contratos" de un equipo, formato
`NUMERO (vence DD/MM/AAAA)`) está por vencer dentro de los próximos 30 días.
Corre en **Google Apps Script**, que es gratis y no requiere subir el
proyecto de Firebase al plan de pago (Blaze).

Archivo del script: `alertas-contratos.gs` (en este mismo repo, para tener
una copia versionada — el que de verdad se ejecuta es el que pegues en
Apps Script).

## 1. Generar la cuenta de servicio de Firebase (una sola vez)

1. Entra a la [Consola de Firebase](https://console.firebase.google.com/) →
   proyecto `inventario-ti-riol`.
2. Ícono de engrane (⚙️) junto a "Descripción general del proyecto" →
   **Configuración del proyecto**.
3. Pestaña **Cuentas de servicio**.
4. Botón **Generar nueva clave privada** → confirma. Se descarga un archivo
   `.json` — guárdalo, lo vas a necesitar en el paso 3. **No lo compartas ni
   lo subas a GitHub**, es una credencial sensible.

Esto NO cuesta nada — es solo una llave de acceso, no activa facturación.

## 2. Crear el proyecto de Apps Script

1. Ve a [script.google.com](https://script.google.com) con tu cuenta de
   Google (ai.admin@breemer.com.gt o la que prefieras usar).
2. **Nuevo proyecto**. Ponle un nombre, ej. "Alertas Contratos TI".
3. Borra el contenido de `Código.gs` que trae por defecto, y pega ahí todo
   el contenido del archivo `alertas-contratos.gs` de este repo.

## 3. Agregar la biblioteca para leer Firestore

Apps Script no tiene soporte nativo para Firestore, así que usamos la
biblioteca gratuita de la comunidad "FirestoreGoogleAppsScript":

1. En el editor de Apps Script, panel izquierdo → **Bibliotecas** (ícono
   de +).
2. Pega este ID de script:
   `1VUSl4b1r1eoNcRWotZM3e87ygkxvXltOgyDZhixqncz9lQ3MjfT1iKFw`
3. **Buscar** → selecciona la versión más reciente → **Añadir**.
4. Deja el nombre identificador como `FirestoreApp` (así lo referencia el
   script).

## 4. Guardar la credencial de la cuenta de servicio

1. En el editor, panel izquierdo → **Configuración del proyecto** (ícono de
   engrane).
2. Baja hasta **Propiedades del script** → **Agregar propiedad de script**.
3. Nombre de la propiedad: `FIRESTORE_KEY`
4. Valor: abre el archivo `.json` que descargaste en el paso 1 con un
   editor de texto, copia **todo** su contenido, y pégalo aquí tal cual
   (es un JSON de una sola línea o varias, no importa).
5. Guarda.

## 5. Probar que funciona

1. Vuelve a la pestaña del editor (ícono `< >`).
2. Arriba, selecciona la función `revisarContratos` en el menú desplegable
   de funciones (junto al botón ▷ Ejecutar).
3. Dale clic a **Ejecutar**. La primera vez te va a pedir autorizar
   permisos (acceso a Firestore vía la biblioteca, y a Gmail para enviar el
   correo) — acepta.
4. Si hay algún contrato venciendo dentro de 30 días, te debe llegar un
   correo a `ai.admin@breemer.com.gt` (o al correo que hayas puesto en la
   constante `CORREO_DESTINO` del script). Si no hay ninguno próximo a
   vencer en este momento, no llega nada — es el comportamiento esperado.

Si da error, cópiame el mensaje exacto y lo resolvemos — puede que la
librería externa use un nombre de propiedad ligeramente distinto según la
versión (`doc.obj` vs `doc.fields`), fácil de ajustar.

## 6. Programar que corra solo (trigger)

1. Panel izquierdo → **Disparadores** (ícono de reloj).
2. **Agregar disparador**.
3. Función a ejecutar: `revisarContratos`.
4. Origen del evento: **Basado en tiempo**.
5. Tipo de disparador basado en tiempo: **Temporizador semanal** (o diario,
   como prefieras — semanal es suficiente para un aviso de 30 días).
6. Elige el día y la franja horaria (ej. lunes, 7am–8am).
7. Guardar.

Desde ahí corre solo, sin que nadie tenga que abrir el sistema ni el
navegador — completamente gratis.

## Notas

- Solo cubre contratos de **equipos** (el campo "Contratos" con formato
  `NUMERO (vence DD/MM/AAAA)`), igual que el panel "Contratos Lenovo" del
  Tablero. Los contratos de monitores (`monitores.js`) no están incluidos;
  si los quieres agregar después, se puede leer ese archivo público del
  repo con `UrlFetchApp` y sumarlo al mismo correo.
- Para cambiar los 30 días de anticipación, edita la constante
  `DIAS_ANTICIPACION` al inicio del script (en Apps Script, no aquí en el
  repo, ya que Apps Script no se sincroniza solo con GitHub).
- Si mueves este script a otra cuenta de Google más adelante, solo repite
  los pasos 2–6 con la misma llave de cuenta de servicio.
