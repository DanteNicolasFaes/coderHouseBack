// utilidades/contadorIds.js

import fs from 'fs';

const ruta = './data/contadorIds.json';

const leerContadorIds = () => {
  if (!fs.existsSync(ruta)) {
    fs.writeFileSync(ruta, JSON.stringify({ idProducto: 0, idCarrito: 0 }, null, 2));
  }
  const datos = fs.readFileSync(ruta);
  return JSON.parse(datos);
};

const escribirContadorIds = (contador) => {
  fs.writeFileSync(ruta, JSON.stringify(contador, null, 2));
};

export const obtenerSiguienteIdProducto = () => {
  const contador = leerContadorIds();
  contador.idProducto += 1;
  escribirContadorIds(contador);
  return contador.idProducto;
};

export const obtenerSiguienteIdCarrito = () => {
  const contador = leerContadorIds();
  contador.idCarrito += 1;
  escribirContadorIds(contador);
  return contador.idCarrito;
};
