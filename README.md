# Rendición de Fondos

App web instalable para cargar rendiciones de fondos: el trabajador elige su nombre, la transferencia pendiente y escanea el QR del CAE de cada factura. Controla que un mismo CAE no se cargue dos veces (ni por la misma persona ni por otra), genera el PDF y permite enviarlo por mail.

- `index.html`: la app completa.
- `config.js`: datos de conexión a Firebase (`apiKey` y `projectId`).
- `firestore.rules`: reglas de la base de datos (pegar en Firebase > Firestore > Reglas).
- `manifest.webmanifest`, `sw.js` e íconos: permiten instalarla en el celular.

Para cambiar trabajadores, empresas, centros de costos o transferencias, editar las listas `WORKERS` y `TRANSFERS` al comienzo del script de `index.html`.

## Escanear comprobante (v5)
- La foto se lee primero como QR de ARCA; si no hay QR, se leen los datos con OCR (Tesseract.js) y el trabajador los confirma.
- No se puede repetir el mismo CUIT + punto de venta + número (colección `cmp` en Firestore). Hay que publicar la regla nueva de `firestore.rules`.
