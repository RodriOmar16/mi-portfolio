const modal = document.getElementById("modal-espera");

window.mostrarCarga = (estado) => {
  if (estado) {
    // Mostrar modal
    modal.classList.add("show");
    modal.style.display = "block";
    document.body.classList.add("modal-open");

    // Crear fondo gris
    const fondoGris = document.createElement("div");
    fondoGris.className = "modal-backdrop show";
    fondoGris.id = "modal-backdrop";
    document.body.appendChild(fondoGris);
  } else {
    // Ocultar modal
    modal.classList.remove("show");
    modal.style.display = "none";
    document.body.classList.remove("modal-open");

    // Eliminar fondoGris
    const fondoGris = document.getElementById("modal-backdrop");
    if (fondoGris) fondoGris.remove();
  }
};
