import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Actualiza la ruta para que apunte a la carpeta correcta
const ruta = path.join(__dirname, '..', 'data', 'productos.json');
console.log(`Ruta de prueba: ${ruta}`);

fs.readFile(ruta, 'utf-8')
  .then(data => {
    console.log('Archivo leído correctamente');
    console.log(data);
  })
  .catch(error => {
    console.error('Error al leer el archivo:', error);
  });
