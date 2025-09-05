const modal = document.getElementById("modal-espera");

window.mostrarCarga = (estado, ves) => {
  console.log("mostrarCarga:", estado, ves);

  if (estado) {
    // Mostrar modal
    modal.classList.add("show");
    modal.style.display = "block";
    document.body.classList.add("modal-open");

    // Crear backdrop
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop show";
    backdrop.id = "modal-backdrop";
    document.body.appendChild(backdrop);
  } else {
    // Ocultar modal
    modal.classList.remove("show");
    modal.style.display = "none";
    document.body.classList.remove("modal-open");

    // Eliminar backdrop
    const backdrop = document.getElementById("modal-backdrop");
    if (backdrop) backdrop.remove();
  }
};


