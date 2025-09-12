export const ordenar = (array, clave, descendente = false) => {
  return array.sort((a, b) => {
    const valA = a[clave];
    const valB = b[clave];

    if (typeof valA === "string") {
      return descendente ? valB.localeCompare(valA) : valA.localeCompare(valB);
    }

    return descendente ? (valB - valA) : (valA - valB);
  });
};